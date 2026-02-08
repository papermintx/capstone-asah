import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { PdfProcessorService } from './services/pdf-processor.service';
import { EmbeddingService } from './services/embedding.service';
import { VectorSearchService } from './services/vector-search.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    PdfProcessorService,
    EmbeddingService,
    VectorSearchService,
  ],
  exports: [DocumentService, EmbeddingService, VectorSearchService],
})
export class DocumentModule {}
