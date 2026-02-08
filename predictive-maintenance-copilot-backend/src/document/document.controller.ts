import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { DocumentService } from './document.service';
import {
  UploadDocumentDto,
  SearchDocumentDto,
  QueryDocumentsDto,
  DocumentResponseDto,
  SearchResponseDto,
  ListDocumentsResponseDto,
} from './dto/document.dto';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * Upload a new PDF document (Admin only)
   * POST /documents/upload
   */
  @Post('upload')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: any, // Multer file object
    @Body() dto: UploadDocumentDto,
    @GetUser('id') userId: string,
  ): Promise<DocumentResponseDto> {
    return this.documentService.uploadDocument(file, dto, userId);
  }

  /**
   * Search documents using semantic search
   * POST /documents/search
   */
  @Post('search')
  @HttpCode(HttpStatus.OK)
  async searchDocuments(
    @Body() dto: SearchDocumentDto,
  ): Promise<SearchResponseDto> {
    return this.documentService.searchDocuments(dto);
  }

  /**
   * List all documents with filters
   * GET /documents
   */
  @Get()
  async listDocuments(
    @Query() dto: QueryDocumentsDto,
  ): Promise<ListDocumentsResponseDto> {
    return this.documentService.listDocuments(dto);
  }

  /**
   * Delete document (Admin only)
   * DELETE /documents/:id
   */
  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async deleteDocument(@Param('id') id: string): Promise<{
    message: string;
    deletedDocument: {
      id: string;
      filename: string;
      originalName: string;
    };
  }> {
    return this.documentService.deleteDocument(id);
  }
}
