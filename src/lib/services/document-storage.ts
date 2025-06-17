import { supabase } from '../supabase/client';
import { documentApi } from '../api/documents';

export const documentStorageService = {
  // Upload document to storage
  async uploadDocument(file: File, classId: string, userId: string) {
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${userId}/${classId}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Create document record
      const document = await documentApi.createDocument({
        title: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: userId,
        class_id: classId,
      });

      return document;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Delete document from storage
  async deleteDocument(documentId: string) {
    try {
      // Get document details
      const document = await documentApi.getDocumentById(documentId);
      if (!document) throw new Error('Document not found');

      // Extract file path from URL
      const filePath = document.file_url.split('/').pop();
      if (!filePath) throw new Error('Invalid file path');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete document record
      await documentApi.deleteDocument(documentId);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Get document download URL
  async getDocumentDownloadUrl(documentId: string) {
    try {
      const document = await documentApi.getDocumentById(documentId);
      if (!document) throw new Error('Document not found');

      // Create a signed URL for download
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_url, 60); // URL valid for 60 seconds

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  },

  // Get document preview URL
  async getDocumentPreviewUrl(documentId: string) {
    try {
      const document = await documentApi.getDocumentById(documentId);
      if (!document) throw new Error('Document not found');

      // For PDFs and images, we can use the public URL
      if (document.file_type.startsWith('image/') || document.file_type === 'application/pdf') {
        return document.file_url;
      }

      // For other file types, we might need to generate a preview
      // This could involve converting the file to PDF or using a preview service
      throw new Error('Preview not available for this file type');
    } catch (error) {
      console.error('Error getting preview URL:', error);
      throw error;
    }
  },

  // Get document thumbnail URL
  async getDocumentThumbnailUrl(documentId: string) {
    try {
      const document = await documentApi.getDocumentById(documentId);
      if (!document) throw new Error('Document not found');

      // For images, we can use the file URL
      if (document.file_type.startsWith('image/')) {
        return document.file_url;
      }

      // For PDFs, we might need to generate a thumbnail
      if (document.file_type === 'application/pdf') {
        // This could involve using a PDF thumbnail generation service
        throw new Error('Thumbnail generation not implemented');
      }

      // For other file types, return a default icon
      return '/icons/document.png';
    } catch (error) {
      console.error('Error getting thumbnail URL:', error);
      throw error;
    }
  }
}; 