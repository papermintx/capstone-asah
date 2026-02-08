import { Logger } from '@nestjs/common';
import type { MaintenanceGraphState } from '../state';
import { VectorSearchService } from '../../../document/services/vector-search.service';
import { EmbeddingService } from '../../../document/services/embedding.service';

/**
 * Retrieve Knowledge Node
 * Retrieves relevant SOP/manual content from RAG system based on failure type or user query
 */
export class RetrieveKnowledgeNode {
  private readonly logger = new Logger(RetrieveKnowledgeNode.name);

  constructor(
    private vectorSearch: VectorSearchService,
    private embeddingService: EmbeddingService,
  ) {}

  async execute(
    state: MaintenanceGraphState,
  ): Promise<Partial<MaintenanceGraphState>> {
    this.logger.log('Executing retrieve knowledge node...');

    try {
      // Determine search query based on context
      const searchQuery = this.buildSearchQuery(state);

      if (!searchQuery) {
        this.logger.log('No search query needed, skipping knowledge retrieval');
        return {};
      }

      this.logger.log(`Searching knowledge base with query: "${searchQuery}"`);

      // Generate embedding for the query
      const queryEmbedding =
        await this.embeddingService.generateQueryEmbedding(searchQuery);

      // Search for relevant document chunks
      // Use fewer chunks for documentation queries (faster)
      const limit = state.query_type === 'documentation' ? 3 : 5;
      const threshold = state.query_type === 'documentation' ? 0.6 : 0.7; // Lower threshold for doc queries
      const searchResults = await this.vectorSearch.searchSimilarChunks(
        queryEmbedding,
        {
          limit, // Top 3-5 most relevant chunks
          threshold, // Minimum similarity score
          documentType: 'sop', // Prioritize SOP documents
        },
      );

      if (searchResults.length === 0) {
        this.logger.log('No relevant knowledge found');
        return {
          knowledge_context: [],
        };
      }

      this.logger.log(
        `Found ${searchResults.length} relevant knowledge chunks`,
      );

      // Format knowledge context for AI
      const knowledgeContext = searchResults.map((result) => ({
        content: result.content,
        source: result.source,
        pageNumber: result.pageNumber,
        similarity: result.similarity,
        documentType: result.documentType,
      }));

      // Extract repair steps if available
      const repairSteps = this.extractRepairSteps(searchResults);

      return {
        knowledge_context: knowledgeContext,
        repair_steps: repairSteps.length > 0 ? repairSteps : undefined,
      };
    } catch (error) {
      this.logger.error('Error retrieving knowledge:', error);
      return {
        error: `Failed to retrieve knowledge: ${error.message}`,
      };
    }
  }

  /**
   * Build search query based on state context
   */
  private buildSearchQuery(state: MaintenanceGraphState): string | null {
    // Priority 0: Documentation queries (SOP/procedure requests)
    if (state.query_type === 'documentation') {
      let query = state.user_input || '';

      // Add machine type filter if specified
      if (state.documentation_filters?.machineType) {
        query += ` tipe ${state.documentation_filters.machineType}`;
      }

      this.logger.log(`Documentation query: "${query}"`);
      return query;
    }

    // Priority 1: If there's a predicted failure, search for repair procedures
    if (state.failure_type) {
      const failureTypeMap: Record<string, string> = {
        'Tool Wear Failure': 'prosedur perbaikan tool wear failure TWF',
        'Heat Dissipation Failure':
          'prosedur perbaikan heat dissipation failure HDF overheat',
        'Power Failure': 'prosedur perbaikan power failure PWF',
        'Overstrain Failure': 'prosedur perbaikan overstrain failure OSF',
        'Random Failures': 'prosedur perbaikan random failures RNF',
      };

      const query = failureTypeMap[state.failure_type];
      if (query) {
        return query;
      }
    }

    // Priority 2: Check if user query contains repair/maintenance keywords
    const userInput = state.user_input?.toLowerCase() || '';
    const repairKeywords = [
      'perbaikan',
      'repair',
      'fix',
      'maintenance',
      'perawatan',
      'troubleshoot',
      'solve',
      'mengatasi',
      'cara',
      'langkah',
      'prosedur',
      'sop',
    ];

    const hasRepairIntent = repairKeywords.some((keyword) =>
      userInput.includes(keyword),
    );

    if (hasRepairIntent) {
      // Use user input as search query
      return state.user_input || null;
    }

    // Priority 3: If there's anomaly detected, search for general troubleshooting
    if (state.anomaly_detected) {
      return 'troubleshooting anomali mesin prosedur pemeriksaan';
    }

    // No knowledge retrieval needed
    return null;
  }

  /**
   * Extract repair steps from retrieved content
   * Looks for numbered lists or step-by-step instructions
   */
  private extractRepairSteps(
    searchResults: Array<{ content: string }>,
  ): string[] {
    const steps: string[] = [];

    for (const result of searchResults) {
      const content = result.content;

      // Look for patterns like "STEP 1:", "1.", "1)", etc.
      const stepPatterns = [
        /STEP \d+:([^\n]+)/gi,
        /\d+\.\s+([^\n]+)/g,
        /\d+\)\s+([^\n]+)/g,
        /[✓✗□]\s+([^\n]+)/g,
      ];

      for (const pattern of stepPatterns) {
        const matches = content.matchAll(pattern);
        for (const match of matches) {
          const step = match[1]?.trim();
          if (step && step.length > 10 && step.length < 200) {
            steps.push(step);
          }
        }
      }
    }

    // Remove duplicates and limit to top 10 steps
    return [...new Set(steps)].slice(0, 10);
  }
}
