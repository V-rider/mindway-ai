import { getDbInstance, handleDbError } from '@/lib/supabase/client'; // Check path
import { ObjectId, BSON } from 'mongodb';
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
  async getDocuments(): Promise<any[]> { // Specify return type
    try {
      const db = await getDbInstance();
      return await db.collection<DocumentDocument>(DOCUMENTS_COLLECTION)
        .aggregate([
          {
            $lookup: {
              from: USERS_COLLECTION,
              localField: 'uploaded_by',
              foreignField: '_id',
              as: 'uploaded_by_user', // Renamed to avoid conflict if original field name was 'user'
            },
          },
          { $unwind: { path: '$uploaded_by_user', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: CLASSES_COLLECTION,
              localField: 'class_id',
              foreignField: '_id',
              as: 'class_info', // Renamed
            },
          },
          { $unwind: { path: '$class_info', preserveNullAndEmptyArrays: true } },
          { $sort: { created_at: -1 } },
          {
            $project: {
              _id: 1, title: 1, description: 1, file_url: 1, file_type: 1, file_size: 1,
              uploaded_by_id: '$uploaded_by', // keep original id field if needed
              class_id: '$class_id', // keep original id field
              created_at: 1, updated_at: 1,
              uploaded_by: { _id: '$uploaded_by_user._id', full_name: '$uploaded_by_user.full_name', email: '$uploaded_by_user.email', avatar_url: '$uploaded_by_user.avatar_url' },
              class: { _id: '$class_info._id', name: '$class_info.name' }
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getDocuments');
      return [];
    }
  },

  async getDocumentById(id: string): Promise<any | null> { // Specify return type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return null;
      const results = await db.collection<DocumentDocument>(DOCUMENTS_COLLECTION)
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: { from: USERS_COLLECTION, localField: 'uploaded_by', foreignField: '_id', as: 'uploaded_by_user'},
          },
          { $unwind: { path: '$uploaded_by_user', preserveNullAndEmptyArrays: true } },
          {
            $lookup: { from: CLASSES_COLLECTION, localField: 'class_id', foreignField: '_id', as: 'class_info' },
          },
          { $unwind: { path: '$class_info', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1, title: 1, description: 1, file_url: 1, file_type: 1, file_size: 1,
              uploaded_by_id: '$uploaded_by', class_id: '$class_id',
              created_at: 1, updated_at: 1,
              uploaded_by: { _id: '$uploaded_by_user._id', full_name: '$uploaded_by_user.full_name', email: '$uploaded_by_user.email', avatar_url: '$uploaded_by_user.avatar_url' },
              class: { _id: '$class_info._id', name: '$class_info.name' }
            }
          }
        ])
        .toArray();
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      handleDbError(error, 'getDocumentById');
      return null;
    }
  },

  async createDocument(documentData: Omit<DocumentDocument, '_id' | 'created_at' | 'updated_at' | 'uploaded_by' | 'class_id'> & {uploaded_by: string, class_id: string}): Promise<DocumentDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(documentData.uploaded_by) || !ObjectId.isValid(documentData.class_id)) {
        throw new Error("Invalid uploaded_by or class_id");
      }
      const now = new Date();
      const newDocument: DocumentDocument = {
        ...documentData,
        uploaded_by: new ObjectId(documentData.uploaded_by),
        class_id: new ObjectId(documentData.class_id),
        created_at: now,
        updated_at: now,
      };
      const result = await db.collection<DocumentDocument>(DOCUMENTS_COLLECTION).insertOne(newDocument);
      if (!result.insertedId) throw new Error('Document creation failed');
      return { ...newDocument, _id: result.insertedId };
    } catch (error) {
      handleDbError(error, 'createDocument');
      return null;
    }
  },

  async updateDocument(id: string, documentData: Partial<Omit<DocumentDocument, '_id' | 'created_at' | 'updated_at'>>): Promise<DocumentDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return null;

      const updatePayload: any = { ...documentData };
      if (documentData.uploaded_by && ObjectId.isValid(documentData.uploaded_by as string)) {
        updatePayload.uploaded_by = new ObjectId(documentData.uploaded_by as string);
      } else if (documentData.uploaded_by) {
         delete updatePayload.uploaded_by; // or throw
      }
      if (documentData.class_id && ObjectId.isValid(documentData.class_id as string)) {
        updatePayload.class_id = new ObjectId(documentData.class_id as string);
      } else if (documentData.class_id) {
        delete updatePayload.class_id; // or throw
      }

      const result = await db.collection<DocumentDocument>(DOCUMENTS_COLLECTION)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { ...updatePayload, updated_at: new Date() } },
          { returnDocument: 'after' }
        );
      return result;
    } catch (error) {
      handleDbError(error, 'updateDocument');
      return null;
    }
  },

  async deleteDocument(id: string): Promise<boolean> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return false;
      // Consider deleting related analysis, annotations, highlights
      const result = await db.collection<DocumentDocument>(DOCUMENTS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        const docId = new ObjectId(id);
        await db.collection<DocumentAnalysisDocument>(DOC_ANALYSIS_COLLECTION).deleteMany({ document_id: docId });
        await db.collection<DocumentAnnotationDocument>(DOC_ANNOTATIONS_COLLECTION).deleteMany({ document_id: docId });
        await db.collection<DocumentHighlightDocument>(DOC_HIGHLIGHTS_COLLECTION).deleteMany({ document_id: docId });
        return true;
      }
      return false;
    } catch (error) {
      handleDbError(error, 'deleteDocument');
      return false;
    }
  },

  async getDocumentsByClass(classId: string): Promise<any[]> { // Specify type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(classId)) return [];
      return await db.collection<DocumentDocument>(DOCUMENTS_COLLECTION)
        .aggregate([
          { $match: { class_id: new ObjectId(classId) } },
          {
            $lookup: { from: USERS_COLLECTION, localField: 'uploaded_by', foreignField: '_id', as: 'uploaded_by_user'},
          },
          { $unwind: { path: '$uploaded_by_user', preserveNullAndEmptyArrays: true } },
          { $sort: { created_at: -1 } },
          {
            $project: {
              _id: 1, title: 1, description: 1, file_url: 1, file_type: 1, file_size: 1,
              uploaded_by_id: '$uploaded_by', class_id: 1,
              created_at: 1, updated_at: 1,
              uploaded_by: { _id: '$uploaded_by_user._id', full_name: '$uploaded_by_user.full_name', email: '$uploaded_by_user.email', avatar_url: '$uploaded_by_user.avatar_url' }
              // No class projection needed as we are filtering by class_id
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getDocumentsByClass');
      return [];
    }
  },

  async getDocumentsByUser(userId: string): Promise<any[]> { // Specify type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(userId)) return [];
      return await db.collection<DocumentDocument>(DOCUMENTS_COLLECTION)
        .aggregate([
          { $match: { uploaded_by: new ObjectId(userId) } },
          {
            $lookup: { from: CLASSES_COLLECTION, localField: 'class_id', foreignField: '_id', as: 'class_info' },
          },
          { $unwind: { path: '$class_info', preserveNullAndEmptyArrays: true } },
          { $sort: { created_at: -1 } },
          {
            $project: {
               _id: 1, title: 1, description: 1, file_url: 1, file_type: 1, file_size: 1,
              uploaded_by: 1, class_id_original: '$class_id',
              created_at: 1, updated_at: 1,
              class: { _id: '$class_info._id', name: '$class_info.name' }
              // No user projection needed
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getDocumentsByUser');
      return [];
    }
  },

  // Document Analysis
  async getDocumentAnalysis(documentId: string): Promise<DocumentAnalysisDocument[]> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(documentId)) return [];
      return await db.collection<DocumentAnalysisDocument>(DOC_ANALYSIS_COLLECTION)
        .find({ document_id: new ObjectId(documentId) })
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      handleDbError(error, 'getDocumentAnalysis');
      return [];
    }
  },

  async createDocumentAnalysis(analysisData: Omit<DocumentAnalysisDocument, '_id' | 'created_at' | 'updated_at' | 'document_id'> & {document_id: string}): Promise<DocumentAnalysisDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(analysisData.document_id)) throw new Error("Invalid document_id");
      const now = new Date();
      const newAnalysis: DocumentAnalysisDocument = {
        ...analysisData,
        document_id: new ObjectId(analysisData.document_id),
        // Ensure content is in BSON.Document format if needed, or handle plain JSON
        content: analysisData.content as BSON.Document,
        created_at: now,
        updated_at: now,
      };
      const result = await db.collection<DocumentAnalysisDocument>(DOC_ANALYSIS_COLLECTION).insertOne(newAnalysis);
      if (!result.insertedId) throw new Error('Document analysis creation failed');
      return { ...newAnalysis, _id: result.insertedId };
    } catch (error) {
      handleDbError(error, 'createDocumentAnalysis');
      return null;
    }
  },

  // Document Annotations
  async getDocumentAnnotations(documentId: string): Promise<any[]> { // Specify type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(documentId)) return [];
      return await db.collection<DocumentAnnotationDocument>(DOC_ANNOTATIONS_COLLECTION)
        .aggregate([
          { $match: { document_id: new ObjectId(documentId) } },
          {
            $lookup: { from: USERS_COLLECTION, localField: 'user_id', foreignField: '_id', as: 'user_info' },
          },
          { $unwind: { path: '$user_info', preserveNullAndEmptyArrays: true } },
          { $sort: { created_at: -1 } },
          {
            $project: {
              _id: 1, document_id: 1, user_id_original: '$user_id', content: 1, page_number: 1, position_x: 1, position_y: 1, created_at: 1, updated_at: 1,
              user: { _id: '$user_info._id', full_name: '$user_info.full_name', email: '$user_info.email', avatar_url: '$user_info.avatar_url' }
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getDocumentAnnotations');
      return [];
    }
  },

  async createAnnotation(annotationData: Omit<DocumentAnnotationDocument, '_id' | 'created_at' | 'updated_at' | 'user_id' | 'document_id'> & {user_id: string, document_id: string}): Promise<DocumentAnnotationDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(annotationData.user_id) || !ObjectId.isValid(annotationData.document_id)) {
        throw new Error("Invalid user_id or document_id");
      }
      const now = new Date();
      const newAnnotation: DocumentAnnotationDocument = {
        ...annotationData,
        user_id: new ObjectId(annotationData.user_id),
        document_id: new ObjectId(annotationData.document_id),
        created_at: now,
        updated_at: now,
      };
      const result = await db.collection<DocumentAnnotationDocument>(DOC_ANNOTATIONS_COLLECTION).insertOne(newAnnotation);
      if (!result.insertedId) throw new Error('Annotation creation failed');
      return { ...newAnnotation, _id: result.insertedId };
    } catch (error) {
      handleDbError(error, 'createAnnotation');
      return null;
    }
  },

  async updateAnnotation(id: string, annotationData: Partial<Omit<DocumentAnnotationDocument, '_id' | 'created_at' | 'updated_at'>>): Promise<DocumentAnnotationDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return null;
      const updatePayload: any = {...annotationData};
      // Convert string IDs to ObjectIds if they are part of the update
      if (updatePayload.user_id && ObjectId.isValid(updatePayload.user_id as string)) {
        updatePayload.user_id = new ObjectId(updatePayload.user_id as string);
      } else if (updatePayload.user_id) delete updatePayload.user_id;

      if (updatePayload.document_id && ObjectId.isValid(updatePayload.document_id as string)) {
        updatePayload.document_id = new ObjectId(updatePayload.document_id as string);
      } else if (updatePayload.document_id) delete updatePayload.document_id;


      const result = await db.collection<DocumentAnnotationDocument>(DOC_ANNOTATIONS_COLLECTION)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { ...updatePayload, updated_at: new Date() } },
          { returnDocument: 'after' }
        );
      return result;
    } catch (error) {
      handleDbError(error, 'updateAnnotation');
      return null;
    }
  },

  async deleteAnnotation(id: string): Promise<boolean> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return false;
      const result = await db.collection<DocumentAnnotationDocument>(DOC_ANNOTATIONS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      handleDbError(error, 'deleteAnnotation');
      return false;
    }
  },

  // Document Highlights
  async getDocumentHighlights(documentId: string): Promise<any[]> { // Specify type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(documentId)) return [];
      return await db.collection<DocumentHighlightDocument>(DOC_HIGHLIGHTS_COLLECTION)
        .aggregate([
          { $match: { document_id: new ObjectId(documentId) } },
          {
            $lookup: { from: USERS_COLLECTION, localField: 'user_id', foreignField: '_id', as: 'user_info' },
          },
          { $unwind: { path: '$user_info', preserveNullAndEmptyArrays: true } },
          { $sort: { created_at: -1 } },
          {
            $project: {
               _id: 1, document_id: 1, user_id_original: '$user_id', content: 1, page_number: 1, start_position:1, end_position:1, created_at: 1,
              user: { _id: '$user_info._id', full_name: '$user_info.full_name', email: '$user_info.email', avatar_url: '$user_info.avatar_url' }
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getDocumentHighlights');
      return [];
    }
  },

  async createHighlight(highlightData: Omit<DocumentHighlightDocument, '_id' | 'created_at'| 'user_id' | 'document_id'> & {user_id: string, document_id: string}): Promise<DocumentHighlightDocument | null> {
    try {
      const db = await getDbInstance();
       if (!ObjectId.isValid(highlightData.user_id) || !ObjectId.isValid(highlightData.document_id)) {
        throw new Error("Invalid user_id or document_id");
      }
      const newHighlight: DocumentHighlightDocument = {
        ...highlightData,
        user_id: new ObjectId(highlightData.user_id),
        document_id: new ObjectId(highlightData.document_id),
        created_at: new Date(),
      };
      const result = await db.collection<DocumentHighlightDocument>(DOC_HIGHLIGHTS_COLLECTION).insertOne(newHighlight);
      if (!result.insertedId) throw new Error('Highlight creation failed');
      return { ...newHighlight, _id: result.insertedId };
    } catch (error) {
      handleDbError(error, 'createHighlight');
      return null;
    }
  },

  async deleteHighlight(id: string): Promise<boolean> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return false;
      const result = await db.collection<DocumentHighlightDocument>(DOC_HIGHLIGHTS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      handleDbError(error, 'deleteHighlight');
      return false;
    }
  }
};