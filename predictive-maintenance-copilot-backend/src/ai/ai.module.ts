import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../common/prisma/prisma.module';
import { DocumentModule } from '../document/document.module';
import { AiAgentService } from './services/agent.service';

@Module({
  imports: [ConfigModule, PrismaModule, DocumentModule],
  providers: [AiAgentService],
  exports: [AiAgentService],
})
export class AiModule {}
