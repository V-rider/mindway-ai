import { fetchApi } from './client';
import type { DocumentDocument } from '@/models/mongo/document';
import type { DocumentAnalysisDocument } from '@/models/mongo/document_analysis';
import type { DocumentAnnotationDocument } from '@/models/mongo/document_annotation';
import type { DocumentHighlightDocument } from '@/models/mongo/document_highlight';
// Import UserDocument and ClassDocument if needed for populating details
import type { UserDocument } from '@/models/mongo/user';
import type { ClassDocument } from '@/models/mongo/class';


const DOCUMENTS_COLLECTION = 'documents';
const DOC_ANALYSIS_COLLECTION = 'documentAnalysis';
const DOC_ANNOTATIONS_COLLECTION = 'documentAnnotations';
const DOC_HIGHLIGHTS_COLLECTION = 'documentHighlights';
const USERS_COLLECTION = 'users';
const CLASSES_COLLECTION = 'classes';

export const documentApi = {
  async getDocuments(): Promise<DocumentDocument[]> {
    const response = await fetchApi<DocumentDocument[]>('/documents');
    return response.data || [];
  },

  async getDocumentById(id: string): Promise<DocumentDocument | null> {
    const response = await fetchApi<DocumentDocument>(`/documents/${id}`);
    return response.data || null;
  },

  async createDocument(documentData: Omit<DocumentDocument, '_id' | 'created_at' | 'updated_at'>): Promise<DocumentDocument | null> {
    const response = await fetchApi<DocumentDocument>('/documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    });
    return response.data || null;
  },

  async updateDocument(id: string, documentData: Partial<DocumentDocument>): Promise<DocumentDocument | null> {
    const response = await fetchApi<DocumentDocument>(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    });
    return response.data || null;
  },

  async deleteDocument(id: string): Promise<boolean> {
    const response = await fetchApi<{ success: boolean }>(`/documents/${id}`, {
      method: 'DELETE',
    });
    return response.data?.success || false;
  },

  async getDocumentsByClass(classId: string): Promise<DocumentDocument[]> {
    const response = await fetchApi<DocumentDocument[]>(`/documents/class/${classId}`);
    return response.data || [];
  },

  async getDocumentsByUser(userId: string): Promise<DocumentDocument[]> {
    const response = await fetchApi<DocumentDocument[]>(`/documents/user/${userId}`);
    return response.data || [];
  },

  // Document Analysis
  async getDocumentAnalysis(documentId: string): Promise<DocumentAnalysisDocument[]> {
    const response = await fetchApi<DocumentAnalysisDocument[]>(`/documents/${documentId}/analysis`);
    return response.data || [];
  },

  async createDocumentAnalysis(analysisData: Omit<DocumentAnalysisDocument, '_id' | 'created_at' | 'updated_at'>): Promise<DocumentAnalysisDocument | null> {
    const response = await fetchApi<DocumentAnalysisDocument>(`/documents/${analysisData.document_id}/analysis`, {
      method: 'POST',
      body: JSON.stringify(analysisData),
    });
    return response.data || null;
  },

  // Document Annotations
  async getDocumentAnnotations(documentId: string): Promise<DocumentAnnotationDocument[]> {
    const response = await fetchApi<DocumentAnnotationDocument[]>(`/documents/${documentId}/annotations`);
    return response.data || [];
  },

  async createAnnotation(annotationData: Omit<DocumentAnnotationDocument, '_id' | 'created_at' | 'updated_at'>): Promise<DocumentAnnotationDocument | null> {
    const response = await fetchApi<DocumentAnnotationDocument>(`/documents/${annotationData.document_id}/annotations`, {
      method: 'POST',
      body: JSON.stringify(annotationData),
    });
    return response.data || null;
  },

  async updateAnnotation(id: string, annotationData: Partial<DocumentAnnotationDocument>): Promise<DocumentAnnotationDocument | null> {
    const response = await fetchApi<DocumentAnnotationDocument>(`/documents/annotations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(annotationData),
    });
    return response.data || null;
  },

  async deleteAnnotation(id: string): Promise<boolean> {
    const response = await fetchApi<{ success: boolean }>(`/documents/annotations/${id}`, {
      method: 'DELETE',
    });
    return response.data?.success || false;
  },

  // Document Highlights
  async getDocumentHighlights(documentId: string): Promise<DocumentHighlightDocument[]> {
    const response = await fetchApi<DocumentHighlightDocument[]>(`/documents/${documentId}/highlights`);
    return response.data || [];
  },

  async createHighlight(highlightData: Omit<DocumentHighlightDocument, '_id' | 'created_at' | 'updated_at'>): Promise<DocumentHighlightDocument | null> {
    const response = await fetchApi<DocumentHighlightDocument>(`/documents/${highlightData.document_id}/highlights`, {
      method: 'POST',
      body: JSON.stringify(highlightData),
    });
    return response.data || null;
  },

  async deleteHighlight(id: string): Promise<boolean> {
    const response = await fetchApi<{ success: boolean }>(`/documents/highlights/${id}`, {
      method: 'DELETE',
    });
    return response.data?.success || false;
  },
};