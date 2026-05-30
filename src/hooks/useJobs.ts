import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { supabase } from "../lib/supabase";

import type {
  Job,
  JobFormData,
} from "../types/job";

const TABLE = "jobs";

export function useJobs(
  search: string = ""
) {
  return useQuery({
    queryKey: ["jobs", search],

    queryFn: async () => {
      let query = supabase
        .from(TABLE)
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (search) {
        query = query.ilike(
          "job_title",
          `%${search}%`
        );
      }

      const {
        data,
        error,
      } = await query;

      if (error)
        throw error;

      return data;
    },
  });
}

export function useAddJob() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      values: JobFormData
    ) => {
      const {
        data,
        error,
      } = await supabase
        .from(TABLE)
        .insert(values)
        .select()
        .single();

      if (error)
        throw error;

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
}

export function useUpdateJob() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<Job>;
    }) => {
      const {
        data,
        error,
      } = await supabase
        .from(TABLE)
        .update(values)
        .eq("id", id)
        .select()
        .single();

      if (error)
        throw error;

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
}

export function useDeleteJob() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string
    ) => {
      const {
        error,
      } = await supabase
        .from(TABLE)
        .delete()
        .eq("id", id);

      if (error)
        throw error;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
}