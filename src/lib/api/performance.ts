
import { getCurrentSupabaseClient } from '../supabase/dynamic-client';
import type { Database } from '@/types/database';
import { ClassPerformance } from '@/types';

export const performanceApi = {
  // Get class performance data by calculating averages from scores
  async getClassPerformances(): Promise<ClassPerformance[]> {
    const supabase = getCurrentSupabaseClient();
    
    try {
      // Get classes with their teacher info
      const { data: classes, error: classError } = await supabase
        .from('class')
        .select(`
          class_id,
          class_name,
          teacher_id,
          academic_year
        `);

      if (classError) throw classError;
      if (!classes) return [];

      const classPerformances: ClassPerformance[] = [];

      for (const classData of classes) {
        // Get students in this class
        const { data: students, error: studentsError } = await supabase
          .from('students')
          .select('SID')
          .eq('class_id', classData.class_id);

        if (studentsError) throw studentsError;

        // Get papers for this class
        const { data: papers, error: papersError } = await supabase
          .from('paper')
          .select('paper_id, total_score')
          .eq('class_id', classData.class_id);

        if (papersError) throw papersError;

        if (!papers || papers.length === 0 || !students || students.length === 0) {
          // If no papers or students, create empty performance data
          classPerformances.push({
            id: classData.class_id.toString(),
            name: classData.class_name,
            grade: this.extractGradeFromClassName(classData.class_name),
            averageScore: 0,
            topicMastery: [],
            errorPatterns: []
          });
          continue;
        }

        // Calculate average scores for this class
        let totalScore = 0;
        let totalPossibleScore = 0;
        let scoreCount = 0;

        for (const paper of papers) {
          // Get questions for this paper
          const { data: questions, error: questionsError } = await supabase
            .from('question')
            .select('question_id, question_max_score, category_id')
            .eq('paper_id', paper.paper_id);

          if (questionsError) continue;
          if (!questions) continue;

          // Get scores for students in this class for these questions
          for (const student of students) {
            for (const question of questions) {
              const { data: scores, error: scoresError } = await supabase
                .from('score')
                .select('question_score')
                .eq('student_id', student.SID)
                .eq('question_id', question.question_id);

              if (scoresError) continue;
              if (!scores || scores.length === 0) continue;

              totalScore += scores[0].question_score;
              totalPossibleScore += question.question_max_score;
              scoreCount++;
            }
          }
        }

        const averageScore = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;

        // Get topic mastery (simplified - using question categories)
        const topicMastery = await this.getTopicMasteryForClass(classData.class_id);
        
        // Get error patterns for this class
        const errorPatterns = await this.getErrorPatternsForClass(classData.class_id);

        classPerformances.push({
          id: classData.class_id.toString(),
          name: classData.class_name,
          grade: this.extractGradeFromClassName(classData.class_name),
          averageScore: Math.round(averageScore),
          topicMastery,
          errorPatterns
        });
      }

      return classPerformances;
    } catch (error) {
      console.error('Error fetching class performances:', error);
      return [];
    }
  },

  // Extract grade from class name (e.g., "6A" -> "6")
  extractGradeFromClassName(className: string): string {
    const match = className.match(/^(\d+)/);
    return match ? match[1] : "1";
  },

  // Get topic mastery for a class
  async getTopicMasteryForClass(classId: number) {
    const supabase = getCurrentSupabaseClient();
    
    try {
      // Get question categories and their performance
      const { data: categories, error: categoriesError } = await supabase
        .from('question_categories')
        .select(`
          question_category_id,
          question_category_description
        `);

      if (categoriesError || !categories) return [];

      const topicMastery = [];

      for (const category of categories) {
        // Get questions in this category for papers in this class
        const { data: questions, error: questionsError } = await supabase
          .from('question')
          .select(`
            question_id,
            question_max_score,
            paper_id,
            paper!inner(class_id)
          `)
          .eq('category_id', category.question_category_id)
          .eq('paper.class_id', classId);

        if (questionsError || !questions || questions.length === 0) continue;

        // Calculate average performance for this topic
        let totalScore = 0;
        let totalPossible = 0;

        for (const question of questions) {
          const { data: scores, error: scoresError } = await supabase
            .from('score')
            .select('question_score')
            .eq('question_id', question.question_id);

          if (scoresError || !scores) continue;

          for (const score of scores) {
            totalScore += score.question_score;
            totalPossible += question.question_max_score;
          }
        }

        const mastery = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

        topicMastery.push({
          topic: category.question_category_description,
          mastery
        });
      }

      return topicMastery;
    } catch (error) {
      console.error('Error fetching topic mastery:', error);
      return [];
    }
  },

  // Get error patterns for a class
  async getErrorPatternsForClass(classId: number) {
    const supabase = getCurrentSupabaseClient();
    
    try {
      // Get error patterns by joining scores, score_error, and error_type
      const { data: errorData, error: errorError } = await supabase
        .from('score_error')
        .select(`
          error_id,
          error_type!inner(error_description),
          score!inner(
            student_id,
            question_id,
            question!inner(
              paper_id,
              paper!inner(class_id)
            )
          )
        `)
        .eq('score.question.paper.class_id', classId);

      if (errorError || !errorData) return [];

      // Count error occurrences
      const errorCounts: { [key: string]: number } = {};
      let totalErrors = 0;

      for (const error of errorData) {
        const errorDesc = error.error_type.error_description;
        errorCounts[errorDesc] = (errorCounts[errorDesc] || 0) + 1;
        totalErrors++;
      }

      // Convert to error patterns with percentages
      const errorPatterns = Object.entries(errorCounts)
        .map(([pattern, count]) => ({
          pattern,
          percentage: Math.round((count / totalErrors) * 100)
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5); // Top 5 error patterns

      return errorPatterns;
    } catch (error) {
      console.error('Error fetching error patterns:', error);
      return [];
    }
  }
};
