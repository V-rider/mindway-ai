import { getDbInstance, handleDbError } from '@/lib/supabase/client';
import { ObjectId } from 'mongodb';
import type { LearningMaterialDocument } from '@/models/mongo/learning_material';
import type { StudentProgressDocument } from '@/models/mongo/student_progress';
// Import UserDocument and ClassDocument if needed for populating details
import type { UserDocument } from '@/models/mongo/user';
import type { ClassDocument } from '@/models/mongo/class';

const MATERIALS_COLLECTION = 'learningMaterials';
const PROGRESS_COLLECTION = 'studentProgress';
const USERS_COLLECTION = 'users';
const CLASSES_COLLECTION = 'classes';

export const materialApi = {
  async getMaterials(): Promise<any[]> { // Specify type
    try {
      const db = await getDbInstance();
      return await db.collection<LearningMaterialDocument>(MATERIALS_COLLECTION)
        .aggregate([
          {
            $lookup: { from: CLASSES_COLLECTION, localField: 'class_id', foreignField: '_id', as: 'class_info' },
          },
          { $unwind: { path: '$class_info', preserveNullAndEmptyArrays: true } },
          {
            $lookup: { from: USERS_COLLECTION, localField: 'created_by', foreignField: '_id', as: 'creator_info' },
          },
          { $unwind: { path: '$creator_info', preserveNullAndEmptyArrays: true } },
          { $sort: { created_at: -1 } },
          {
            $project: {
              _id: 1, title: 1, description: 1, content: 1, type: 1, class_id_original: '$class_id', created_by_original: '$created_by', created_at: 1, updated_at: 1,
              class: { _id: '$class_info._id', name: '$class_info.name' },
              creator: { _id: '$creator_info._id', full_name: '$creator_info.full_name', email: '$creator_info.email', avatar_url: '$creator_info.avatar_url' }
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getMaterials');
      return [];
    }
  },

  async getMaterialById(id: string): Promise<any | null> { // Specify type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return null;
      const results = await db.collection<LearningMaterialDocument>(MATERIALS_COLLECTION)
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: { from: CLASSES_COLLECTION, localField: 'class_id', foreignField: '_id', as: 'class_info' },
          },
          { $unwind: { path: '$class_info', preserveNullAndEmptyArrays: true } },
          {
            $lookup: { from: USERS_COLLECTION, localField: 'created_by', foreignField: '_id', as: 'creator_info' },
          },
          { $unwind: { path: '$creator_info', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1, title: 1, description: 1, content: 1, type: 1, class_id_original: '$class_id', created_by_original: '$created_by', created_at: 1, updated_at: 1,
              class: { _id: '$class_info._id', name: '$class_info.name' },
              creator: { _id: '$creator_info._id', full_name: '$creator_info.full_name', email: '$creator_info.email', avatar_url: '$creator_info.avatar_url' }
            }
          }
        ])
        .toArray();
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      handleDbError(error, 'getMaterialById');
      return null;
    }
  },

  async createMaterial(materialData: Omit<LearningMaterialDocument, '_id' | 'created_at' | 'updated_at' | 'class_id' | 'created_by'> & {class_id:string, created_by:string}): Promise<LearningMaterialDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(materialData.class_id) || !ObjectId.isValid(materialData.created_by)) {
        throw new Error("Invalid class_id or created_by");
      }
      const now = new Date();
      const newMaterial: LearningMaterialDocument = {
        ...materialData,
        class_id: new ObjectId(materialData.class_id),
        created_by: new ObjectId(materialData.created_by),
        created_at: now,
        updated_at: now,
      };
      const result = await db.collection<LearningMaterialDocument>(MATERIALS_COLLECTION).insertOne(newMaterial);
      if (!result.insertedId) throw new Error('Material creation failed');
      return { ...newMaterial, _id: result.insertedId };
    } catch (error) {
      handleDbError(error, 'createMaterial');
      return null;
    }
  },

  async updateMaterial(id: string, materialData: Partial<Omit<LearningMaterialDocument, '_id' | 'created_at' | 'updated_at'>>): Promise<LearningMaterialDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return null;
      const updatePayload: any = { ...materialData };
      if (updatePayload.class_id && ObjectId.isValid(updatePayload.class_id)) {
        updatePayload.class_id = new ObjectId(updatePayload.class_id);
      } else if (updatePayload.class_id) delete updatePayload.class_id;

      if (updatePayload.created_by && ObjectId.isValid(updatePayload.created_by)) {
        updatePayload.created_by = new ObjectId(updatePayload.created_by);
      } else if (updatePayload.created_by) delete updatePayload.created_by;


      const result = await db.collection<LearningMaterialDocument>(MATERIALS_COLLECTION)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { ...updatePayload, updated_at: new Date() } },
          { returnDocument: 'after' }
        );
      return result;
    } catch (error) {
      handleDbError(error, 'updateMaterial');
      return null;
    }
  },

  async deleteMaterial(id: string): Promise<boolean> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return false;
      // Consider deleting related student progress
      const result = await db.collection<LearningMaterialDocument>(MATERIALS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        await db.collection<StudentProgressDocument>(PROGRESS_COLLECTION).deleteMany({material_id: new ObjectId(id)});
        return true;
      }
      return false;
    } catch (error) {
      handleDbError(error, 'deleteMaterial');
      return false;
    }
  },

  async getMaterialsByClass(classId: string): Promise<any[]> { // Specify type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(classId)) return [];
      return await db.collection<LearningMaterialDocument>(MATERIALS_COLLECTION)
        .aggregate([
          { $match: { class_id: new ObjectId(classId) } },
          {
            $lookup: { from: USERS_COLLECTION, localField: 'created_by', foreignField: '_id', as: 'creator_info' },
          },
          { $unwind: { path: '$creator_info', preserveNullAndEmptyArrays: true } },
          { $sort: { created_at: -1 } },
          {
            $project: {
               _id: 1, title: 1, description: 1, content: 1, type: 1, class_id:1, created_by_original: '$created_by', created_at: 1, updated_at: 1,
              creator: { _id: '$creator_info._id', full_name: '$creator_info.full_name', email: '$creator_info.email', avatar_url: '$creator_info.avatar_url' }
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getMaterialsByClass');
      return [];
    }
  },

  async getMaterialsByType(type: LearningMaterialDocument['type']): Promise<any[]> { // Specify type
    try {
      const db = await getDbInstance();
      return await db.collection<LearningMaterialDocument>(MATERIALS_COLLECTION)
        .aggregate([
          { $match: { type: type } },
          {
            $lookup: { from: CLASSES_COLLECTION, localField: 'class_id', foreignField: '_id', as: 'class_info' },
          },
          { $unwind: { path: '$class_info', preserveNullAndEmptyArrays: true } },
          {
            $lookup: { from: USERS_COLLECTION, localField: 'created_by', foreignField: '_id', as: 'creator_info' },
          },
          { $unwind: { path: '$creator_info', preserveNullAndEmptyArrays: true } },
          { $sort: { created_at: -1 } },
          {
            $project: {
              _id: 1, title: 1, description: 1, content: 1, type: 1, class_id_original: '$class_id', created_by_original: '$created_by', created_at: 1, updated_at: 1,
              class: { _id: '$class_info._id', name: '$class_info.name' },
              creator: { _id: '$creator_info._id', full_name: '$creator_info.full_name', email: '$creator_info.email', avatar_url: '$creator_info.avatar_url' }
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getMaterialsByType');
      return [];
    }
  },

  async updateStudentProgress(studentId: string, materialId: string, progress: Partial<Omit<StudentProgressDocument, '_id' | 'student_id' | 'material_id' | 'created_at' | 'updated_at'>>): Promise<StudentProgressDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(studentId) || !ObjectId.isValid(materialId)) return null;

      const studentOId = new ObjectId(studentId);
      const materialOId = new ObjectId(materialId);
      const now = new Date();

      const result = await db.collection<StudentProgressDocument>(PROGRESS_COLLECTION)
        .findOneAndUpdate(
          { student_id: studentOId, material_id: materialOId },
          {
            $set: { ...progress, updated_at: now },
            $setOnInsert: { student_id: studentOId, material_id: materialOId, created_at: now }
          },
          { upsert: true, returnDocument: 'after' }
        );
      return result;
    } catch (error) {
      handleDbError(error, 'updateStudentProgress');
      return null;
    }
  },

  async getStudentProgress(studentId: string, materialId: string): Promise<StudentProgressDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(studentId) || !ObjectId.isValid(materialId)) return null;
      return await db.collection<StudentProgressDocument>(PROGRESS_COLLECTION)
        .findOne({
          student_id: new ObjectId(studentId),
          material_id: new ObjectId(materialId)
        });
    } catch (error) {
      handleDbError(error, 'getStudentProgress'); // PGRST116 equivalent is just null from findOne
      return null;
    }
  },

  async getAllStudentProgress(studentId: string): Promise<any[]> { // Specify type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(studentId)) return [];
      return await db.collection<StudentProgressDocument>(PROGRESS_COLLECTION)
        .aggregate([
          { $match: { student_id: new ObjectId(studentId) } },
          {
            $lookup: { from: MATERIALS_COLLECTION, localField: 'material_id', foreignField: '_id', as: 'material_info' },
          },
          { $unwind: { path: '$material_info', preserveNullAndEmptyArrays: true } },
          { $sort: { created_at: -1 } },
          {
            $project: {
              _id: 1, student_id:1, material_id_original: '$material_id', status:1, score:1, completed_at:1, created_at: 1, updated_at: 1,
              material: { _id: '$material_info._id', title: '$material_info.title', type: '$material_info.type' }
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getAllStudentProgress');
      return [];
    }
  },

  async getMaterialProgress(materialId: string): Promise<any[]> { // Specify type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(materialId)) return [];
      return await db.collection<StudentProgressDocument>(PROGRESS_COLLECTION)
        .aggregate([
          { $match: { material_id: new ObjectId(materialId) } },
          {
            $lookup: { from: USERS_COLLECTION, localField: 'student_id', foreignField: '_id', as: 'student_info' },
          },
          { $unwind: { path: '$student_info', preserveNullAndEmptyArrays: true } },
          { $sort: { created_at: -1 } },
          {
            $project: {
              _id: 1, student_id_original: '$student_id', material_id:1, status:1, score:1, completed_at:1, created_at: 1, updated_at: 1,
              student: { _id: '$student_info._id', full_name: '$student_info.full_name', email: '$student_info.email', avatar_url: '$student_info.avatar_url' }
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getMaterialProgress');
      return [];
    }
  }
};
