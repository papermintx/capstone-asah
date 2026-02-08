import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SearchResultDto } from '../dto/document.dto';

@Injectable()
export class VectorSearchService {
  private readonly logger = new Logger(VectorSearchService.name);
  private readonly topK: number;
  private readonly similarityThreshold: number;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.topK = this.configService.get<number>('RAG_TOP_K') || 5;
    this.similarityThreshold =
      this.configService.get<number>('RAG_SIMILARITY_THRESHOLD') || 0.7;
  }

  /**
   * Search for similar document chunks using vector similarity
   * Uses pgvector's cosine distance operator (<=>)
   */
  async searchSimilarChunks(
    queryEmbedding: number[],
    options?: {
      limit?: number;
      threshold?: number;
      documentType?: string;
      language?: string;
    },
  ): Promise<SearchResultDto[]> {
    const limit = options?.limit || this.topK;
    const threshold = options?.threshold || this.similarityThreshold;

    try {
      // Convert embedding array to pgvector format string
      const embeddingString = `[${queryEmbedding.join(',')}]`;

      // Build WHERE clause for filters
      const whereConditions: string[] = [];
      const params: any[] = [embeddingString, limit];
      let paramIndex = 3;

      if (options?.documentType) {
        whereConditions.push(`d.type::text = $${paramIndex}`);
        params.push(options.documentType);
        paramIndex++;
      }

      if (options?.language) {
        whereConditions.push(`d.language::text = $${paramIndex}`);
        params.push(options.language);
        paramIndex++;
      }

      const whereClause =
        whereConditions.length > 0
          ? `AND ${whereConditions.join(' AND ')}`
          : '';

      // Raw SQL query using pgvector
      const query = `
        SELECT 
          dc.id,
          dc.content,
          dc.page_number as "pageNumber",
          dc.metadata,
          d.id as "documentId",
          d.original_name as "documentName",
          d.type as "documentType",
          d.language,
          1 - (dc.embedding <=> $1::vector) as similarity
        FROM document_chunks dc
        JOIN documents d ON dc.document_id = d.id
        WHERE dc.embedding IS NOT NULL
        ${whereClause}
        ORDER BY dc.embedding <=> $1::vector
        LIMIT $2
      `;

      this.logger.debug(`Executing vector search with limit ${limit}`);
      const results = await this.prisma.$queryRawUnsafe<any[]>(
        query,
        ...params,
      );

      // Filter by similarity threshold
      const filteredResults = results.filter((r) => r.similarity >= threshold);

      this.logger.log(
        `Found ${filteredResults.length}/${results.length} chunks above threshold ${threshold}`,
      );

      return filteredResults.map((r) => ({
        content: r.content,
        source: r.documentName,
        pageNumber: r.pageNumber,
        similarity: r.similarity,
        documentId: r.documentId,
        documentType: r.documentType,
        metadata: r.metadata,
      }));
    } catch (error) {
      this.logger.error('Error searching similar chunks:', error);
      throw new Error(`Vector search failed: ${error.message}`);
    }
  }

  /**
   * Search with automatic query embedding
   * This is a convenience method that combines embedding + search
   */
  async search(
    query: string,
    queryEmbedding: number[],
    options?: {
      limit?: number;
      threshold?: number;
      documentType?: string;
      language?: string;
    },
  ): Promise<{
    results: SearchResultDto[];
    query: string;
    totalResults: number;
  }> {
    const results = await this.searchSimilarChunks(queryEmbedding, options);

    return {
      results,
      query,
      totalResults: results.length,
    };
  }

  /**
   * Get chunks for a specific document
   */
  async getDocumentChunks(documentId: string): Promise<
    Array<{
      content: string;
      pageNumber: number | null;
      chunkIndex: number;
    }>
  > {
    const chunks = await this.prisma.documentChunk.findMany({
      where: { documentId },
      orderBy: { chunkIndex: 'asc' },
      select: {
        content: true,
        pageNumber: true,
        chunkIndex: true,
      },
    });

    return chunks;
  }
}
