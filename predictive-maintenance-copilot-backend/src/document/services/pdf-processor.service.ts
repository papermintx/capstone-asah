import { Injectable, Logger } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import { encoding_for_model } from 'tiktoken';

export interface PdfChunk {
  content: string;
  pageNumber: number | null;
  chunkIndex: number;
  metadata?: {
    sectionTitle?: string;
  };
}

@Injectable()
export class PdfProcessorService {
  private readonly logger = new Logger(PdfProcessorService.name);
  private readonly encoding = encoding_for_model('gpt-3.5-turbo'); // For token counting

  /**
   * Extract text from PDF buffer
   */
  async extractText(buffer: Buffer): Promise<{
    text: string;
    pageCount: number;
  }> {
    try {
      const data = await pdfParse(buffer);
      this.logger.log(
        `Extracted ${data.text.length} characters from ${data.numpages} pages`,
      );

      return {
        text: data.text,
        pageCount: data.numpages,
      };
    } catch (error) {
      this.logger.error('Error extracting PDF text:', error);
      throw new Error(`Failed to extract PDF text: ${error.message}`);
    }
  }

  /**
   * Chunk text into smaller pieces for embedding
   * Uses semantic chunking based on paragraphs
   */
  chunkText(
    text: string,
    chunkSize: number = 500,
    overlap: number = 50,
  ): PdfChunk[] {
    const chunks: PdfChunk[] = [];

    // Split by double newlines (paragraphs)
    const paragraphs = text
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    let currentChunk = '';
    let currentTokens = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      const paragraphTokens = this.countTokens(paragraph);

      // If single paragraph exceeds chunk size, split it
      if (paragraphTokens > chunkSize) {
        // Save current chunk if exists
        if (currentChunk) {
          chunks.push({
            content: currentChunk.trim(),
            pageNumber: null, // Page number extraction requires more complex parsing
            chunkIndex: chunkIndex++,
          });
          currentChunk = '';
          currentTokens = 0;
        }

        // Split large paragraph by sentences
        const sentences = paragraph.split(/[.!?]+/).filter((s) => s.trim());
        for (const sentence of sentences) {
          const sentenceTokens = this.countTokens(sentence);

          if (currentTokens + sentenceTokens > chunkSize && currentChunk) {
            chunks.push({
              content: currentChunk.trim(),
              pageNumber: null,
              chunkIndex: chunkIndex++,
            });

            // Keep overlap
            const words = currentChunk.split(' ');
            const overlapWords = words.slice(-Math.floor(overlap / 5)); // Rough estimate
            currentChunk = overlapWords.join(' ') + ' ' + sentence;
            currentTokens = this.countTokens(currentChunk);
          } else {
            currentChunk += (currentChunk ? '. ' : '') + sentence;
            currentTokens += sentenceTokens;
          }
        }
      } else {
        // Check if adding paragraph exceeds chunk size
        if (currentTokens + paragraphTokens > chunkSize && currentChunk) {
          chunks.push({
            content: currentChunk.trim(),
            pageNumber: null,
            chunkIndex: chunkIndex++,
          });

          // Keep overlap
          const words = currentChunk.split(' ');
          const overlapWords = words.slice(-Math.floor(overlap / 5));
          currentChunk = overlapWords.join(' ') + '\n\n' + paragraph;
          currentTokens = this.countTokens(currentChunk);
        } else {
          currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
          currentTokens += paragraphTokens;
        }
      }
    }

    // Add remaining chunk
    if (currentChunk.trim()) {
      chunks.push({
        content: currentChunk.trim(),
        pageNumber: null,
        chunkIndex: chunkIndex++,
      });
    }

    this.logger.log(`Created ${chunks.length} chunks from text`);
    return chunks;
  }

  /**
   * Count tokens in text using tiktoken
   */
  private countTokens(text: string): number {
    try {
      const tokens = this.encoding.encode(text);
      return tokens.length;
    } catch {
      // Fallback: rough estimate (1 token ≈ 4 characters)
      return Math.ceil(text.length / 4);
    }
  }

  /**
   * Process PDF: extract text and chunk it
   */
  async processPdf(
    buffer: Buffer,
    chunkSize: number = 500,
    overlap: number = 50,
  ): Promise<{
    chunks: PdfChunk[];
    pageCount: number;
  }> {
    const { text, pageCount } = await this.extractText(buffer);
    const chunks = this.chunkText(text, chunkSize, overlap);

    return {
      chunks,
      pageCount,
    };
  }
}
