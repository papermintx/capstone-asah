import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { SupabaseService } from '../auth/supabase.service';
import { PdfProcessorService } from './services/pdf-processor.service';
import { EmbeddingService } from './services/embedding.service';
import { VectorSearchService } from './services/vector-search.service';
import {
  UploadDocumentDto,
  SearchDocumentDto,
  QueryDocumentsDto,
  DocumentResponseDto,
  SearchResponseDto,
  ListDocumentsResponseDto,
} from './dto/document.dto';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  private readonly storageBucket: string;

  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
    private pdfProcessor: PdfProcessorService,
    private embeddingService: EmbeddingService,
    private vectorSearch: VectorSearchService,
    private configService: ConfigService,
  ) {
    this.storageBucket =
      this.configService.get<string>('SUPABASE_STORAGE_BUCKET') ||
      'maintenance-documents';
  }

  /**
   * Upload and process a PDF document
   */
  async uploadDocument(
    file: any, // Multer file object
    dto: UploadDocumentDto,
    userId: string,
  ): Promise<DocumentResponseDto> {
    this.logger.log(
      `Uploading document: ${file.originalname} (${file.size} bytes)`,
    );

    try {
      // 1. Generate unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // 2. Upload to Supabase Storage
      const { error: uploadError } = await this.supabase
        .getAdminClient()
        .storage.from(this.storageBucket)
        .upload(filename, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      this.logger.log(`File uploaded to storage: ${filename}`);

      // 3. Process PDF
      const chunkSize = this.configService.get<number>('RAG_CHUNK_SIZE') || 500;
      const chunkOverlap =
        this.configService.get<number>('RAG_CHUNK_OVERLAP') || 50;

      const { chunks, pageCount } = await this.pdfProcessor.processPdf(
        file.buffer,
        chunkSize,
        chunkOverlap,
      );

      this.logger.log(
        `PDF processed: ${chunks.length} chunks, ${pageCount} pages`,
      );

      // 4. Generate embeddings for all chunks
      const chunkTexts = chunks.map((c) => c.content);
      const embeddings =
        await this.embeddingService.generateEmbeddingsBatch(chunkTexts);

      this.logger.log(`Generated ${embeddings.length} embeddings`);

      // 5. Save to database using transaction (document + chunks with embeddings)
      const document = await this.prisma.$transaction(async (tx) => {
        // Create document first (without chunks)
        const doc = await tx.document.create({
          data: {
            filename,
            originalName: file.originalname,
            type: dto.type,
            language: dto.language || 'id',
            uploadedBy: userId,
            fileSize: file.size,
            pageCount,
            metadata: dto.metadata || {},
          },
        });

        // Insert chunks with embeddings using raw SQL
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const embeddingString = `[${embeddings[i].join(',')}]`;

          await tx.$executeRawUnsafe(
            `
            INSERT INTO document_chunks (
              document_id, 
              content, 
              page_number, 
              chunk_index, 
              embedding, 
              metadata, 
              created_at
            ) VALUES (
              $1::uuid, 
              $2, 
              $3, 
              $4, 
              $5::vector, 
              $6::jsonb, 
              NOW()
            )
            `,
            doc.id,
            chunk.content,
            chunk.pageNumber,
            chunk.chunkIndex,
            embeddingString,
            JSON.stringify(chunk.metadata || {}),
          );
        }

        // Get chunk count
        const chunkCount = await tx.documentChunk.count({
          where: { documentId: doc.id },
        });

        return { ...doc, _count: { chunks: chunkCount } };
      });

      this.logger.log(`Document saved to database: ${document.id}`);

      return {
        id: document.id,
        filename: document.filename,
        originalName: document.originalName,
        type: document.type,
        language: document.language,
        fileSize: document.fileSize,
        pageCount: document.pageCount,
        chunksCount: document._count.chunks,
        metadata: document.metadata,
        uploadedBy: document.uploadedBy,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      };
    } catch (error) {
      this.logger.error('Error uploading document:', error);
      throw error;
    }
  }

  /**
   * Search documents using semantic search
   */
  async searchDocuments(dto: SearchDocumentDto): Promise<SearchResponseDto> {
    this.logger.log(`Searching documents with query: "${dto.query}"`);

    try {
      // 1. Generate query embedding
      const queryEmbedding = await this.embeddingService.generateQueryEmbedding(
        dto.query,
      );

      // 2. Search similar chunks
      const searchResult = await this.vectorSearch.search(
        dto.query,
        queryEmbedding,
        {
          limit: dto.limit,
          threshold: dto.threshold,
          documentType: dto.documentType,
          language: dto.language,
        },
      );

      return searchResult;
    } catch (error) {
      this.logger.error('Error searching documents:', error);
      throw error;
    }
  }

  /**
   * List all documents with filters
   */
  async listDocuments(
    dto: QueryDocumentsDto,
  ): Promise<ListDocumentsResponseDto> {
    const where: any = {};
    if (dto.type) where.type = dto.type;
    if (dto.language) where.language = dto.language;

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        take: dto.limit,
        skip: dto.offset,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { chunks: true },
          },
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    // Generate preview URLs for all documents
    const documentsWithPreview: DocumentResponseDto[] = await Promise.all(
      documents.map(async (doc) => {
        const { data } = await this.supabase
          .getClient()
          .storage.from(this.storageBucket)
          .createSignedUrl(doc.filename, 3600);

        return {
          id: doc.id,
          filename: doc.filename,
          originalName: doc.originalName,
          type: doc.type,
          language: doc.language,
          fileSize: doc.fileSize,
          pageCount: doc.pageCount,
          chunksCount: doc._count.chunks,
          metadata: doc.metadata,
          uploadedBy: doc.uploadedBy,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          previewUrl: data?.signedUrl,
        };
      }),
    );

    return {
      data: documentsWithPreview,
      meta: {
        total,
        limit: dto.limit || 20,
        offset: dto.offset || 0,
        hasMore: (dto.offset || 0) + (dto.limit || 20) < total,
      },
    };
  }

  /**
   * Delete document (Admin only)
   */
  async deleteDocument(id: string): Promise<{
    message: string;
    deletedDocument: {
      id: string;
      filename: string;
      originalName: string;
    };
  }> {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Delete from storage
    const { error: deleteError } = await this.supabase
      .getAdminClient()
      .storage.from(this.storageBucket)
      .remove([document.filename]);

    if (deleteError) {
      this.logger.warn(
        `Failed to delete file from storage: ${deleteError.message}`,
      );
    }

    // Delete from database (cascades to chunks)
    await this.prisma.document.delete({
      where: { id },
    });

    this.logger.log(`Document deleted: ${id}`);

    return {
      message: 'Document deleted successfully',
      deletedDocument: {
        id: document.id,
        filename: document.filename,
        originalName: document.originalName,
      },
    };
  }
}
