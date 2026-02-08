import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MaintenanceGraph } from '../graph/maintenance.graph';
import { VectorSearchService } from '../../document/services/vector-search.service';
import { EmbeddingService } from '../../document/services/embedding.service';
import type { StructuredAiResponse } from '../../chat/dto/chat.dto';

interface ChatResult {
  text: string;
  structured: StructuredAiResponse;
}

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);
  private maintenanceGraph: MaintenanceGraph;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private vectorSearch: VectorSearchService,
    private embeddingService: EmbeddingService,
  ) {
    this.initializeGraph();
  }

  private initializeGraph() {
    const llmProvider =
      this.configService.get<string>('LLM_PROVIDER') || 'groq';
    let apiKey: string;
    if (llmProvider === 'groq') {
      const groqKey = this.configService.get<string>('GROQ_API_KEY');
      if (!groqKey) {
        throw new Error('GROQ_API_KEY is not configured');
      }
      apiKey = groqKey;
      this.logger.log('Using Groq LLM provider');
    } else {
      const geminiKey = this.configService.get<string>('GEMINI_API_KEY');
      if (!geminiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
      }
      apiKey = geminiKey;
      this.logger.log('Using Gemini LLM provider');
    }

    this.maintenanceGraph = new MaintenanceGraph(
      this.prisma,
      apiKey,
      this.vectorSearch,
      this.embeddingService,
      llmProvider as 'gemini' | 'groq',
    );
    this.logger.log('AI Agent initialized with Maintenance Graph + RAG');
  }

  /**
   * Execute the multi-step maintenance analysis workflow
   */
  async chat(
    message: string,
    conversationHistory: any[] = [],
  ): Promise<ChatResult> {
    try {
      this.logger.log(
        `Processing chat message: ${message.substring(0, 50)}...`,
      );

      // Execute the graph
      const result = await this.maintenanceGraph.execute({
        user_input: message,
        conversation_history: conversationHistory,
      });

      // Extract results
      const aiText = result.response || 'No response generated';
      const structuredFromResult: Partial<StructuredAiResponse> =
        result.structured_response || {};

      const structured: StructuredAiResponse = {
        summary: structuredFromResult.summary ?? aiText.substring(0, 200),
        machineAnalysis: structuredFromResult.machineAnalysis ?? [],
        overallRisk: structuredFromResult.overallRisk ?? 'MODERATE',
        criticalAlerts: structuredFromResult.criticalAlerts ?? [],
        recommendations: structuredFromResult.recommendations ?? [],
      };

      this.logger.log('Chat processing completed successfully');

      return {
        text: aiText,
        structured,
      };
    } catch (error) {
      this.logger.error('Error in chat:', error);
      throw new Error('Failed to process chat message. Please try again.');
    }
  }

  /**
   * Get graph structure for debugging/monitoring
   */
  getGraphInfo() {
    return this.maintenanceGraph.getGraphStructure();
  }
}
