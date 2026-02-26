import api from '@/lib/api';
import type { 
  ScoreApiResponse, 
  CreateScoreData, 
  UpdateScoreData, 
  ScoreFilters,
  PaginatedScoresResponse,
  BulkScoreCreateData,
  BulkScoreCreateResponse
} from '../types';

const SCORE_API_UNAVAILABLE =
  'Score API endpoints are not implemented on backend. Use /exam/grades/ bulk_entry instead.';

export const scoreService = {
  async getAll(filters?: ScoreFilters): Promise<PaginatedScoresResponse> {
    void filters;
    throw new Error(SCORE_API_UNAVAILABLE);
  },

  async getById(id: number): Promise<ScoreApiResponse> {
    void id;
    throw new Error(SCORE_API_UNAVAILABLE);
  },

  async create(data: CreateScoreData): Promise<ScoreApiResponse> {
    void data;
    throw new Error(SCORE_API_UNAVAILABLE);
  },

  async update(id: number, data: UpdateScoreData): Promise<ScoreApiResponse> {
    void id;
    void data;
    throw new Error(SCORE_API_UNAVAILABLE);
  },

  async delete(id: number): Promise<void> {
    void id;
    throw new Error(SCORE_API_UNAVAILABLE);
  },

  async bulkEntry(data: BulkScoreCreateData): Promise<BulkScoreCreateResponse> {
    void data;
    throw new Error(SCORE_API_UNAVAILABLE);
  },

  async getByGrade(gradeId: number): Promise<ScoreApiResponse> {
    void gradeId;
    throw new Error(SCORE_API_UNAVAILABLE);
  },
};

export default scoreService;
