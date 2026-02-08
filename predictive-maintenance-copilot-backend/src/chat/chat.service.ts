import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AiAgentService } from '../ai/services/agent.service';
import {
  SendMessageDto,
  ChatResponse,
  QueryChatMessagesDto,
  GetChatMessagesResponse,
} from './dto/chat.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private aiAgent: AiAgentService,
  ) {}

  async sendMessage(
    userId: string,
    dto: SendMessageDto,
  ): Promise<ChatResponse> {
    this.logger.log(
      `User ${userId} sending message: ${dto.message.substring(0, 50)}...`,
    );

    try {
      // Save user message to database
      await this.prisma.chatMessage.create({
        data: {
          userId,
          role: 'user',
          content: dto.message,
        },
      });

      // 🆕 Fetch recent conversation history (last 10 messages)
      const recentMessages = await this.prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10, // Last 10 messages for context
        select: {
          role: true,
          content: true,
          createdAt: true,
        },
      });

      // Reverse to chronological order (oldest first)
      const conversationHistory = recentMessages.reverse().map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      this.logger.log(
        `Loaded ${conversationHistory.length} messages for conversation context`,
      );

      // Get AI response with conversation history
      const aiResponseData = await this.aiAgent.chat(
        dto.message,
        conversationHistory,
      );

      // Save AI response to database
      await this.prisma.chatMessage.create({
        data: {
          userId,
          role: 'assistant',
          content: aiResponseData.text,
        },
      });

      this.logger.log('Chat response generated and saved successfully');

      return {
        text: aiResponseData.text,
        timestamp: new Date(),
        structuredData: aiResponseData.structured,
      };
    } catch (error) {
      this.logger.error('Error in chat:', error);
      return {
        text: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        timestamp: new Date(),
        structuredData: {
          summary: 'Error occurred',
          overallRisk: 'MODERATE',
          criticalAlerts: [],
          recommendations: [],
        },
      };
    }
  }

  async getChatMessages(
    userId: string,
    query: QueryChatMessagesDto,
  ): Promise<GetChatMessagesResponse> {
    const { limit = 50, offset = 0 } = query;

    const [messages, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where: { userId },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      }),
      this.prisma.chatMessage.count({ where: { userId } }),
    ]);

    this.logger.log(
      `Retrieved ${messages.length} chat messages for user ${userId}`,
    );

    return {
      data: messages.reverse().map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        createdAt: msg.createdAt,
      })),
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }
}
