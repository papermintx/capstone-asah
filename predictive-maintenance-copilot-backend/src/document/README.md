# 📚 Document Module - RAG System

## Overview

The Document module implements a **RAG (Retrieval Augmented Generation)** system for the Predictive Maintenance Copilot. It allows admins to upload PDF documents (SOPs, manuals, datasheets) which are then processed, embedded, and stored in a vector database for semantic search.

## Features

- ✅ **PDF Upload & Processing** (Admin only)
- ✅ **Semantic Chunking** with overlap
- ✅ **Vector Embeddings** using Google Gemini
- ✅ **Similarity Search** with pgvector
- ✅ **Document Management** (CRUD operations)
- ✅ **Multi-language Support** (Indonesian & English)
- ✅ **Source Citations** with page numbers

## Architecture

```
PDF Upload → Text Extraction → Chunking → Embedding → Vector DB
                                                          ↓
User Query → Query Embedding → Similarity Search → Top-K Results
```

## API Endpoints

### 1. Upload Document (Admin Only)
```http
POST /documents/upload
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

Body:
- file: PDF file (max 50MB)
- type: "sop" | "manual" | "datasheet" | "safety" | "maintenance_record"
- language: "id" | "en"
- metadata: { ... } (optional)
```

### 2. Search Documents
```http
POST /documents/search
Authorization: Bearer {token}
Content-Type: application/json

{
  "query": "cara mengatasi overheat",
  "limit": 5,
  "threshold": 0.7,
  "documentType": "sop" (optional),
  "language": "id" (optional)
}
```

### 3. List Documents
```http
GET /documents?type=sop&language=id&limit=20&offset=0
Authorization: Bearer {token}
```

### 4. Get Document by ID
```http
GET /documents/:id
Authorization: Bearer {token}
```

### 5. Delete Document (Admin Only)
```http
DELETE /documents/:id
Authorization: Bearer {admin_token}
```

## Services

### PdfProcessorService
- Extracts text from PDF files
- Performs semantic chunking (500 tokens per chunk, 50 token overlap)
- Tracks page numbers for citations

### EmbeddingService
- Generates embeddings using Google Gemini `text-embedding-004`
- Batch processing for efficiency
- 768-dimensional vectors

### VectorSearchService
- Performs similarity search using pgvector
- Cosine similarity with configurable threshold
- Filters by document type and language

### DocumentService
- Orchestrates the entire upload → process → store pipeline
- Manages document lifecycle
- Handles Supabase Storage integration

## Configuration

Environment variables:

```env
# Storage
SUPABASE_STORAGE_BUCKET="maintenance-documents"

# Embeddings
GEMINI_EMBEDDING_MODEL="text-embedding-004"
EMBEDDING_DIMENSION=768

# RAG
RAG_TOP_K=5
RAG_SIMILARITY_THRESHOLD=0.7
RAG_CHUNK_SIZE=500
RAG_CHUNK_OVERLAP=50
```

## Database Schema

### documents
```sql
id              UUID PRIMARY KEY
filename        TEXT
original_name   TEXT
type            document_type ENUM
language        TEXT
uploaded_by     UUID (FK to users)
file_size       INTEGER
page_count      INTEGER
metadata        JSONB
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### document_chunks
```sql
id              UUID PRIMARY KEY
document_id     UUID (FK to documents)
content         TEXT
page_number     INTEGER
chunk_index     INTEGER
embedding       vector(768)
metadata        JSONB
created_at      TIMESTAMP
```

## Usage Example

### Upload SOP Document
```typescript
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('type', 'sop');
formData.append('language', 'id');
formData.append('metadata', JSON.stringify({
  description: 'SOP Perbaikan Heat Dissipation',
  version: '2.0'
}));

const response = await fetch('/documents/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  },
  body: formData
});
```

### Search for Repair Steps
```typescript
const searchResult = await fetch('/documents/search', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'langkah perbaikan overheat mesin',
    limit: 5,
    threshold: 0.7,
    documentType: 'sop'
  })
});

// Response:
{
  "results": [
    {
      "content": "Langkah perbaikan untuk Heat Dissipation Failure: 1. Matikan mesin...",
      "source": "SOP Perbaikan Mesin.pdf",
      "pageNumber": 12,
      "similarity": 0.89,
      "documentId": "uuid",
      "documentType": "sop"
    }
  ],
  "query": "langkah perbaikan overheat mesin",
  "totalResults": 3
}
```

## Integration with LangGraph

The Document module is designed to integrate with the AI workflow through a `retrieveKnowledge` node:

```typescript
// In LangGraph workflow
const knowledgeContext = await vectorSearchService.search(
  failureType,
  queryEmbedding,
  { documentType: 'sop', limit: 3 }
);

// Inject into AI prompt
const prompt = `
Based on the following SOP:
${knowledgeContext.results.map(r => r.content).join('\n\n')}

Provide repair steps for ${failureType}.
`;
```

## Performance Considerations

- **Chunking**: 500 tokens per chunk balances context vs. precision
- **Overlap**: 50 tokens ensures continuity across chunks
- **Indexing**: IVFFlat index for fast similarity search
- **Batch Processing**: Embeddings generated in batches of 100
- **Caching**: Consider caching frequently accessed chunks

## Security

- ✅ Admin-only upload (RBAC with `@Roles('admin')`)
- ✅ File type validation (PDF only)
- ✅ File size limit (50MB)
- ✅ Private storage bucket
- ✅ Authenticated access to all endpoints

## Future Enhancements

- [ ] Document versioning
- [ ] Approval workflow for uploads
- [ ] OCR support for scanned PDFs
- [ ] Multi-file upload
- [ ] Document expiration/archival
- [ ] Usage analytics

---

**Built with ❤️ for the best capstone project!** 🚀
