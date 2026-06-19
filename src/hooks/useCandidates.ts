import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type {
  Candidate,
  CandidateFormData,
  CandidateFilters
} from '../types/candidate';
import { toast } from 'react-hot-toast';

// ─── Query Keys ──────────────────────────────────────────────
export const candidateKeys = {
  all:    ['candidates'] as const,
  lists:  () => [...candidateKeys.all, 'list'] as const,
  list:   (filters: CandidateFilters) => [...candidateKeys.lists(), filters] as const,
  detail: (id: string) => [...candidateKeys.all, 'detail', id] as const,
  stats:  () => [...candidateKeys.all, 'stats'] as const,
};

// ─── Fetch List ───────────────────────────────────────────────
async function fetchCandidates(filters: CandidateFilters) {
  const { search, status, job_id, page, pageSize } = filters;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('candidates')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search.trim()) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,current_company.ilike.%${search}%`
    );
  }
  if (status) query = query.eq('status', status);
  if (job_id) query = query.eq('job_id', job_id);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data as Candidate[], count: count ?? 0 };
}

// ─── Fetch Single ─────────────────────────────────────────────
async function fetchCandidate(id: string) {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Candidate;
}

// ─── Stats ────────────────────────────────────────────────────
async function fetchCandidateStats() {
  const { data, error } = await supabase
    .from('candidates')
    .select('status');
  if (error) throw error;
  const counts: Record<string, number> = {};
  (data ?? []).forEach(({ status }) => {
    counts[status] = (counts[status] ?? 0) + 1;
  });
  return counts;
}

// ─── Create ───────────────────────────────────────────────────
async function createCandidate(payload: CandidateFormData) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('candidates')
    .insert({
      ...payload,
      job_id: payload.job_id || null,
      expected_salary: payload.expected_salary ? Number(payload.expected_salary) : null,
      created_by: user?.id,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Candidate;
}

// ─── Update ───────────────────────────────────────────────────
async function updateCandidate(id: string, payload: Partial<CandidateFormData>) {
  const { data, error } = await supabase
    .from('candidates')
    .update({
      ...payload,
      job_id: payload.job_id || null,
      expected_salary: payload.expected_salary ? Number(payload.expected_salary) : null,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Candidate;
}

// ─── Delete ───────────────────────────────────────────────────
async function deleteCandidate(id: string) {
  const { error } = await supabase.from('candidates').delete().eq('id', id);
  if (error) throw error;
}

// ─── Update Status ────────────────────────────────────────────
async function updateCandidateStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('candidates')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Candidate;
}

// ─── Upload Resume ────────────────────────────────────────────
async function uploadResume(candidateId: string, file: File) {
  const ext = file.name.split('.').pop();
  const path = `resumes/${candidateId}/${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from('employee-documents')
    .upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('employee-documents')
    .getPublicUrl(path);

  const { error: updateError } = await supabase
    .from('candidates')
    .update({ resume_url: publicUrl, resume_file_name: file.name })
    .eq('id', candidateId);
  if (updateError) throw updateError;
  return publicUrl;
}

// ─── Hooks ────────────────────────────────────────────────────
export function useCandidates(filters: CandidateFilters) {
  return useQuery({
    queryKey: candidateKeys.list(filters),
    queryFn: () => fetchCandidates(filters),
    placeholderData: keepPreviousData,
  });
}

export function useCandidate(id: string) {
  return useQuery({
    queryKey: candidateKeys.detail(id),
    queryFn: () => fetchCandidate(id),
    enabled: !!id,
  });
}

export function useCandidateStats() {
  return useQuery({
    queryKey: candidateKeys.stats(),
    queryFn: fetchCandidateStats,
  });
}

export function useCreateCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCandidate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: candidateKeys.all });
      toast.success('Candidate added successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CandidateFormData> }) =>
      updateCandidate(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: candidateKeys.all });
      toast.success('Candidate updated successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCandidate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: candidateKeys.all });
      toast.success('Candidate deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCandidateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateCandidateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: candidateKeys.all });
      toast.success('Status updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUploadResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ candidateId, file }: { candidateId: string; file: File }) =>
      uploadResume(candidateId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: candidateKeys.all });
      toast.success('Resume uploaded');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}