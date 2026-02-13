import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { scoreService } from '../services/scoreService';
import type { ScoreApiResponse, CreateScoreData, UpdateScoreData, ScoreFilters, PaginatedScoresResponse, BulkScoreCreateData } from '../types';

const QUERY_KEYS = {
  scores: ['scores'] as const,
  score: (id: number) => [...QUERY_KEYS.scores, id] as const,
  scoresByGrade: (gradeId: number) => [...QUERY_KEYS.scores, 'by-grade', gradeId] as const,
};

export function useScores(filters?: ScoreFilters, options?: UseQueryOptions<PaginatedScoresResponse>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.scores, filters],
    queryFn: () => scoreService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useScore(id: number, options?: UseQueryOptions<ScoreApiResponse>) {
  return useQuery({
    queryKey: QUERY_KEYS.score(id),
    queryFn: () => scoreService.getById(id),
    enabled: id > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
}

export function useScoreByGrade(gradeId: number, options?: UseQueryOptions<ScoreApiResponse>) {
  return useQuery({
    queryKey: QUERY_KEYS.scoresByGrade(gradeId),
    queryFn: () => scoreService.getByGrade(gradeId),
    enabled: gradeId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useCreateScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScoreData) => scoreService.create(data),
    onMutate: () => toast.loading('Creating score...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Score created successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scores });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to create score', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useUpdateScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScoreData }) => 
      scoreService.update(id, data),
    onMutate: () => toast.loading('Updating score...'),
    onSuccess: (_, variables) => {
      toast.dismiss();
      toast.success('Score updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.score(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scores });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to update score', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useDeleteScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => scoreService.delete(id),
    onMutate: () => toast.loading('Deleting score...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Score deleted successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scores });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to delete score', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useBulkScoreEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkScoreCreateData) => scoreService.bulkEntry(data),
    onMutate: () => toast.loading('Saving scores...'),
    onSuccess: (result) => {
      toast.dismiss();
      toast.success(`Saved ${result.total} scores (${result.created_count} new, ${result.updated_count} updated)`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scores });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to save scores', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}
