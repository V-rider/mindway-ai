import { getDbInstance, handleDbError } from '@/lib/supabase/client';
import { ObjectId } from 'mongodb';
import type { ClassDocument } from '@/models/mongo/class';
import type { ClassEnrollmentDocument } from '@/models/mongo/class_enrollment';
import type { UserDocument } from '@/models/mongo/user';
import type { LearningMaterialDocument } from '@/models/mongo/learning_material';

const CLASSES_COLLECTION = 'classes';
const ENROLLMENTS_COLLECTION = 'classEnrollments';
const USERS_COLLECTION = 'users';
const MATERIALS_COLLECTION = 'learningMaterials';

export const classApi = {
  async getClasses(): Promise<any[]> { // Define specific type
    try {
      const db = await getDbInstance();
      return await db.collection<ClassDocument>(CLASSES_COLLECTION)
        .aggregate([
          {
            $lookup: {
              from: USERS_COLLECTION,
              localField: 'teacher_id',
              foreignField: '_id',
              as: 'teacher',
            },
          },
          { $unwind: { path: '$teacher', preserveNullAndEmptyArrays: true } }, // Use preserveNullAndEmptyArrays if teacher might not exist
          { $sort: { created_at: -1 } },
          {
            $project: { // Project to match Supabase output structure if needed
              _id: 1, name: 1, description: 1, teacher_id: 1, created_at: 1, updated_at: 1,
              teacher: { _id: '$teacher._id', full_name: '$teacher.full_name', email: '$teacher.email', avatar_url: '$teacher.avatar_url' }
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getClasses');
      return [];
    }
  },

  async getClassById(id: string): Promise<any | null> { // Define specific type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return null;
      const classes = await db.collection<ClassDocument>(CLASSES_COLLECTION)
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: {
              from: USERS_COLLECTION,
              localField: 'teacher_id',
              foreignField: '_id',
              as: 'teacher',
            },
          },
          { $unwind: { path: '$teacher', preserveNullAndEmptyArrays: true } },
           {
            $project: {
              _id: 1, name: 1, description: 1, teacher_id: 1, created_at: 1, updated_at: 1,
              teacher: { _id: '$teacher._id', full_name: '$teacher.full_name', email: '$teacher.email', avatar_url: '$teacher.avatar_url' }
            }
          }
        ])
        .toArray();
      return classes.length > 0 ? classes[0] : null;
    } catch (error) {
      handleDbError(error, 'getClassById');
      return null;
    }
  },

  async createClass(classData: Omit<ClassDocument, '_id' | 'created_at' | 'updated_at' | 'student_ids' | 'teacher_id'> & {teacher_id: string}): Promise<ClassDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(classData.teacher_id)) throw new Error("Invalid teacher_id");
      const now = new Date();
      const newClass: ClassDocument = {
        ...classData,
        teacher_id: new ObjectId(classData.teacher_id),
        student_ids: [], // Initialize with empty array
        created_at: now,
        updated_at: now,
      };
      const result = await db.collection<ClassDocument>(CLASSES_COLLECTION).insertOne(newClass);
      if (!result.insertedId) throw new Error('Class creation failed');
      return { ...newClass, _id: result.insertedId };
    } catch (error) {
      handleDbError(error, 'createClass');
      return null;
    }
  },

  async updateClass(id: string, classData: Partial<Omit<ClassDocument, '_id' | 'created_at' | 'updated_at' | 'student_ids' | 'teacher_id'>> & {teacher_id?: string}): Promise<ClassDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return null;

      const updatePayload: any = { ...classData };
      if (classData.teacher_id && ObjectId.isValid(classData.teacher_id)) {
        updatePayload.teacher_id = new ObjectId(classData.teacher_id);
      } else if (classData.teacher_id) { // if teacher_id is present but invalid
        delete updatePayload.teacher_id; // or throw error
      }

      const result = await db.collection<ClassDocument>(CLASSES_COLLECTION)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { ...updatePayload, updated_at: new Date() } },
          { returnDocument: 'after' }
        );
      return result;
    } catch (error) {
      handleDbError(error, 'updateClass');
      return null;
    }
  },

  async deleteClass(id: string): Promise<boolean> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return false;
      // Consider deleting related enrollments and materials or handling it at application level
      const result = await db.collection<ClassDocument>(CLASSES_COLLECTION).deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        // Also delete enrollments for this class
        await db.collection<ClassEnrollmentDocument>(ENROLLMENTS_COLLECTION).deleteMany({ class_id: new ObjectId(id) });
        return true;
      }
      return false;
    } catch (error) {
      handleDbError(error, 'deleteClass');
      return false;
    }
  },

  async getClassesByTeacher(teacherId: string): Promise<any[]> { // Define specific type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(teacherId)) return [];
      return await db.collection<ClassDocument>(CLASSES_COLLECTION)
        .aggregate([
          { $match: { teacher_id: new ObjectId(teacherId) } },
          {
            $lookup: { // Self-lookup to structure teacher info as in getClasses
              from: USERS_COLLECTION,
              localField: 'teacher_id',
              foreignField: '_id',
              as: 'teacher',
            },
          },
          { $unwind: { path: '$teacher', preserveNullAndEmptyArrays: true } },
          { $sort: { created_at: -1 } },
          {
            $project: {
              _id: 1, name: 1, description: 1, teacher_id: 1, created_at: 1, updated_at: 1,
              teacher: { _id: '$teacher._id', full_name: '$teacher.full_name', email: '$teacher.email', avatar_url: '$teacher.avatar_url' }
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getClassesByTeacher');
      return [];
    }
  },

  // If ClassDocument.student_ids is used:
  async getStudentClasses(studentId: string): Promise<any[]> { // Define specific type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(studentId)) return [];
      // Find classes where student_ids array contains the studentId
      // This replaces querying the class_enrollments table directly for this purpose
      const studentOId = new ObjectId(studentId);
      const classes = await db.collection<ClassDocument>(CLASSES_COLLECTION)
        .aggregate([
            { $match: { student_ids: studentOId } },
            {
                $lookup: {
                    from: USERS_COLLECTION,
                    localField: 'teacher_id',
                    foreignField: '_id',
                    as: 'teacher'
                }
            },
            { $unwind: { path: '$teacher', preserveNullAndEmptyArrays: true } },
            // We need to sort by enrollment date, which is not on the class document.
            // This might require keeping ClassEnrollment collection or adding enrollment_date to student_ids array objects.
            // For now, sorting by class creation.
            { $sort: { created_at: -1 } },
            {
                 $project: {
                    // Supabase returned { class: { ... } }, we'll return the class directly
                    _id: 1, name: 1, description: 1, teacher_id: 1, created_at: 1, updated_at: 1, student_ids:1,
                    teacher: { _id: '$teacher._id', full_name: '$teacher.full_name', email: '$teacher.email', avatar_url: '$teacher.avatar_url' }
                 }
            }
        ])
        .toArray();
      return classes;
    } catch (error) {
      handleDbError(error, 'getStudentClasses');
      return [];
    }
  },

  // Enroll student: adds student_id to class.student_ids and creates/updates enrollment document
  async enrollStudent(classId: string, studentId: string): Promise<ClassEnrollmentDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(classId) || !ObjectId.isValid(studentId)) return null;

      const classOId = new ObjectId(classId);
      const studentOId = new ObjectId(studentId);

      // Add student to class's student_ids array
      await db.collection<ClassDocument>(CLASSES_COLLECTION).updateOne(
        { _id: classOId },
        { $addToSet: { student_ids: studentOId } } // $addToSet prevents duplicates
      );

      // Create enrollment document
      const newEnrollment: ClassEnrollmentDocument = {
        class_id: classOId,
        student_id: studentOId,
        enrolled_at: new Date(),
      };
      const result = await db.collection<ClassEnrollmentDocument>(ENROLLMENTS_COLLECTION).insertOne(newEnrollment);
      if (!result.insertedId) throw new Error('Enrollment failed');
      return { ...newEnrollment, _id: result.insertedId };
    } catch (error) {
      handleDbError(error, 'enrollStudent');
      return null;
    }
  },

  // Remove student: removes student_id from class.student_ids and deletes enrollment document
  async removeStudent(classId: string, studentId: string): Promise<boolean> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(classId) || !ObjectId.isValid(studentId)) return false;

      const classOId = new ObjectId(classId);
      const studentOId = new ObjectId(studentId);

      // Remove student from class's student_ids array
      await db.collection<ClassDocument>(CLASSES_COLLECTION).updateOne(
        { _id: classOId },
        { $pull: { student_ids: studentOId } }
      );

      // Delete enrollment document
      const result = await db.collection<ClassEnrollmentDocument>(ENROLLMENTS_COLLECTION).deleteOne({
        class_id: classOId,
        student_id: studentOId,
      });
      return result.deletedCount === 1;
    } catch (error) {
      handleDbError(error, 'removeStudent');
      return false;
    }
  },

  // Get class students by looking up users in class.student_ids
  async getClassStudents(classId: string): Promise<UserDocument[]> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(classId)) return [];

      const classDoc = await db.collection<ClassDocument>(CLASSES_COLLECTION).findOne({ _id: new ObjectId(classId) });
      if (!classDoc || !classDoc.student_ids || classDoc.student_ids.length === 0) return [];

      const students = await db.collection<UserDocument>(USERS_COLLECTION)
        .find({ _id: { $in: classDoc.student_ids } })
        .project({ full_name: 1, email: 1, avatar_url: 1, _id: 1 }) // project needed fields
        .toArray();
      return students;
    } catch (error) {
      handleDbError(error, 'getClassStudents');
      return [];
    }
  },

  async getClassMaterials(classId: string): Promise<LearningMaterialDocument[]> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(classId)) return [];
      return await db.collection<LearningMaterialDocument>(MATERIALS_COLLECTION)
        .find({ class_id: new ObjectId(classId) })
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      handleDbError(error, 'getClassMaterials');
      return [];
    }
  }
};
