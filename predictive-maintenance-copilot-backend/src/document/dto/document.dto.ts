import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// ==================== Upload Document ====================
export const UploadDocumentSchema = z.object({
  type: z.enum(['sop', 'manual', 'datasheet', 'safety', 'maintenance_record']),
  language: z.enum(['id', 'en']).default('id'),
  metadata: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        if (val.trim() === '') return undefined;
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    },
    z
      .object({
        author: z.string().optional(),
        version: z.string().optional(),
        machineType: z.enum(['L', 'M', 'H']).optional(),
        description: z.string().optional(),
      })
      .optional(),
  ),
});

export class UploadDocumentDto extends createZodDto(UploadDocumentSchema) {}

// ==================== Search Documents ====================
export const SearchDocumentSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty'),
  limit: z.number().int().min(1).max(20).default(5),
  threshold: z.number().min(0).max(1).default(0.7),
  documentType: z
    .enum(['sop', 'manual', 'datasheet', 'safety', 'maintenance_record'])
    .optional(),
  language: z.enum(['id', 'en']).optional(),
});

export class SearchDocumentDto extends createZodDto(SearchDocumentSchema) {}

// ==================== Query Documents ====================
export const QueryDocumentsSchema = z.object({
  type: z
    .enum(['sop', 'manual', 'datasheet', 'safety', 'maintenance_record'])
    .optional(),
  language: z.enum(['id', 'en']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export class QueryDocumentsDto extends createZodDto(QueryDocumentsSchema) {}

// ==================== Response DTOs ====================
export interface DocumentResponseDto {
  id: string;
  filename: string;
  originalName: string;
  type: string;
  language: string;
  fileSize: number;
  pageCount: number | null;
  chunksCount: number;
  metadata: any;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
  previewUrl?: string; // Signed URL for viewing PDF in browser
}

export interface SearchResultDto {
  content: string;
  source: string;
  pageNumber: number | null;
  similarity: number;
  documentId: string;
  documentType: string;
  metadata: any;
}

export interface SearchResponseDto {
  results: SearchResultDto[];
  query: string;
  totalResults: number;
}

export interface ListDocumentsResponseDto {
  data: DocumentResponseDto[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
