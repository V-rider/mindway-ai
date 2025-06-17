import { documentApi } from '../api/documents';

type AnalysisType = 'summary' | 'key_points' | 'difficulty' | 'topics';

interface AnalysisResult {
  summary?: string;
  key_points?: string[];
  difficulty?: {
    level: number;
    explanation: string;
  };
  topics?: {
    name: string;
    confidence: number;
  }[];
}

export const aiAnalysisService = {
  // Analyze document content
  async analyzeDocument(documentId: string, content: string): Promise<AnalysisResult> {
    try {
      // Call OpenAI API for analysis
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }

      const analysis = await response.json();

      // Store analysis results in database
      await Promise.all([
        documentApi.createDocumentAnalysis({
          document_id: documentId,
          analysis_type: 'summary',
          content: { summary: analysis.summary },
        }),
        documentApi.createDocumentAnalysis({
          document_id: documentId,
          analysis_type: 'key_points',
          content: { key_points: analysis.key_points },
        }),
        documentApi.createDocumentAnalysis({
          document_id: documentId,
          analysis_type: 'difficulty',
          content: analysis.difficulty,
        }),
        documentApi.createDocumentAnalysis({
          document_id: documentId,
          analysis_type: 'topics',
          content: { topics: analysis.topics },
        }),
      ]);

      return analysis;
    } catch (error) {
      console.error(`Error analyzing document ${documentId}:`, error);
      throw error;
    }
  },

  // Get document analysis
  async getDocumentAnalysis(documentId: string): Promise<AnalysisResult> {
    try {
      const analysis = await documentApi.getDocumentAnalysis(documentId);
      
      return {
        summary: analysis.find(a => a.analysis_type === 'summary')?.content.summary,
        key_points: analysis.find(a => a.analysis_type === 'key_points')?.content.key_points,
        difficulty: analysis.find(a => a.analysis_type === 'difficulty')?.content,
        topics: analysis.find(a => a.analysis_type === 'topics')?.content.topics,
      };
    } catch (error) {
      console.error('Error getting document analysis:', error);
      throw error;
    }
  },

  // Generate study questions
  async generateStudyQuestions(documentId: string, content: string): Promise<string[]> {
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate study questions');
      }

      const { questions } = await response.json();
      return questions;
    } catch (error) {
      console.error('Error generating study questions:', error);
      throw error;
    }
  },

  // Generate practice problems
  async generatePracticeProblems(documentId: string, content: string): Promise<{
    problem: string;
    solution: string;
    difficulty: number;
  }[]> {
    try {
      const response = await fetch('/api/generate-problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate practice problems');
      }

      const { problems } = await response.json();
      return problems;
    } catch (error) {
      console.error('Error generating practice problems:', error);
      throw error;
    }
  },

  // Generate concept explanations
  async generateConceptExplanations(documentId: string, content: string): Promise<{
    concept: string;
    explanation: string;
    examples: string[];
  }[]> {
    try {
      const response = await fetch('/api/generate-explanations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate concept explanations');
      }

      const { explanations } = await response.json();
      return explanations;
    } catch (error) {
      console.error('Error generating concept explanations:', error);
      throw error;
    }
  }
};
