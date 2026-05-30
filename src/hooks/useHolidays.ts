import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { supabase } from "../lib/supabase";

import type {
  Holiday,
  HolidayFormData,
} from "../types/holiday";

const TABLE = "holidays";

export function useHolidays(
  search: string = ""
) {
  return useQuery({
    queryKey: ["holidays", search],

    queryFn: async () => {
      let query = supabase
        .from(TABLE)
        .select("*")
        .order(
          "holiday_date",
          {
            ascending: true,
          }
        );

      if (search) {
        query = query.ilike(
          "holiday_name",
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

export function useAddHoliday() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      values: HolidayFormData
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
        queryKey: ["holidays"],
      });
    },
  });
}

export function useUpdateHoliday() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<Holiday>;
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
        queryKey: ["holidays"],
      });
    },
  });
}

export function useDeleteHoliday() {
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
        queryKey: ["holidays"],
      });
    },
  });
}