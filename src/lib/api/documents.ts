import { supabase } from '../supabase/client';
import type { Database } from '@/types/database';

type Document = Database['public']['Tables']['documents']['Row'];
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
type DocumentUpdate = Database['public']['Tables']['documents']['Update'];
type DocumentAnalysis = Database['public']['Tables']['document_analysis']['Row'];
type DocumentAnnotation = Database['public']['Tables']['document_annotations']['Row'];
type DocumentHighlight = Database['public']['Tables']['document_highlights']['Row'];

export const documentApi = {
  // Get all documents
  async getDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        uploaded_by:users (
          id,
          full_name,
          email,
          avatar_url
        ),
        class:classes (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get document by ID
  async getDocumentById(id: string) {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        uploaded_by:users (
          id,
          full_name,
          email,
          avatar_url
        ),
        class:classes (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new document
  async createDocument(documentData: DocumentInsert) {
    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update document
  async updateDocument(id: string, documentData: DocumentUpdate) {
    const { data, error } = await supabase
      .from('documents')
      .update(documentData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete document
  async deleteDocument(id: string) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get documents by class
  async getDocumentsByClass(classId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        uploaded_by:users (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get documents by user
  async getDocumentsByUser(userId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        class:classes (
          id,
          name
        )
      `)
      .eq('uploaded_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Document Analysis
  async getDocumentAnalysis(documentId: string) {
    const { data, error } = await supabase
      .from('document_analysis')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createDocumentAnalysis(analysisData: Omit<DocumentAnalysis, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('document_analysis')
      .insert(analysisData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Document Annotations
  async getDocumentAnnotations(documentId: string) {
    const { data, error } = await supabase
      .from('document_annotations')
      .select(`
        *,
        user:users (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createAnnotation(annotationData: Omit<DocumentAnnotation, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('document_annotations')
      .insert(annotationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAnnotation(id: string, annotationData: Partial<DocumentAnnotation>) {
    const { data, error } = await supabase
      .from('document_annotations')
      .update(annotationData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAnnotation(id: string) {
    const { error } = await supabase
      .from('document_annotations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Document Highlights
  async getDocumentHighlights(documentId: string) {
    const { data, error } = await supabase
      .from('document_highlights')
      .select(`
        *,
        user:users (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createHighlight(highlightData: Omit<DocumentHighlight, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('document_highlights')
      .insert(highlightData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteHighlight(id: string) {
    const { error } = await supabase
      .from('document_highlights')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 