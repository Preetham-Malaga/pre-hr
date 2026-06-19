import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { supabase } from "../lib/supabase";

const QUERY_KEY = ["attendance"];

export function useAttendance() {
  return useQuery({
    queryKey: QUERY_KEY,
    staleTime: 1000 * 60 * 5,

    queryFn: async () => {
      const { data, error } =
        await supabase
          .from("attendance")
          .select("*")
          .order(
            "attendance_date",
            {
              ascending: false,
            }
          );

      if (error) throw error;

      return data || [];
    },
  });
}

export function useCreateAttendance() {
  const qc =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: any
    ) => {
      const {
        data,
        error,
      } = await supabase
        .from("attendance")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey:
          QUERY_KEY,
      });
    },
  });
}