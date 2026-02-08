-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create document_type enum
CREATE TYPE document_type AS ENUM ('sop', 'manual', 'datasheet', 'safety', 'maintenance_record');

-- Create documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    type document_type NOT NULL,
    language TEXT NOT NULL DEFAULT 'id',
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_size INTEGER NOT NULL,
    page_count INTEGER,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for documents
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_created_at ON documents(created_at);

-- Create document_chunks table
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    page_number INTEGER,
    chunk_index INTEGER NOT NULL,
    embedding vector(768),
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for document_chunks
CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_document_chunks_document_id_chunk_index ON document_chunks(document_id, chunk_index);

-- Create vector similarity search index (IVFFlat for better performance)
-- This index speeds up similarity searches significantly
CREATE INDEX idx_document_chunks_embedding ON document_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Note: For production with large datasets, consider using HNSW index instead:
-- CREATE INDEX idx_document_chunks_embedding ON document_chunks 
-- USING hnsw (embedding vector_cosine_ops);
