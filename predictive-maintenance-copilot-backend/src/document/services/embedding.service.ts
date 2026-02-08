import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('API_KEY is not configured');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model =
      this.configService.get<string>('GEMINI_EMBEDDING_MODEL') ||
      'text-embedding-004';

    this.logger.log(`Initialized embedding service with model: ${this.model}`);
  }

  /**
   * Generate embedding for a single text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const embeddingModel = this.genAI.getGenerativeModel({
        model: this.model,
      });

      const result = await embeddingModel.embedContent(text);
      const embedding = result.embedding.values;

      this.logger.debug(
        `Generated embedding with ${embedding.length} dimensions`,
      );
      return embedding;
    } catch (error) {
      this.logger.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   * Processes in batches to avoid rate limits
   */
  async generateEmbeddingsBatch(
    texts: string[],
    batchSize: number = 100,
  ): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      this.logger.log(
        `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)} (${batch.length} items)`,
      );

      const batchEmbeddings = await Promise.all(
        batch.map((text) => this.generateEmbedding(text)),
      );

      embeddings.push(...batchEmbeddings);

      // Small delay to avoid rate limiting
      if (i + batchSize < texts.length) {
        await this.delay(100);
      }
    }

    this.logger.log(`Generated ${embeddings.length} embeddings`);
    return embeddings;
  }

  /**
   * Generate embedding for a query (same as text embedding)
   */
  async generateQueryEmbedding(query: string): Promise<number[]> {
    return this.generateEmbedding(query);
  }

  /**
   * Utility: delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  calculateSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
