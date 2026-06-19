import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { supabase } from "../lib/supabase";

const QUERY_KEY = ["payslips"];

export function usePayslips() {
  return useQuery({
    queryKey: QUERY_KEY,

    staleTime: 1000 * 60 * 5,

    queryFn: async () => {
      const { data, error } =
        await supabase
          .from("payslips")
          .select("*")
          .order("generated_date", {
            ascending: false,
          });

      if (error) throw error;

      return data || [];
    },
  });
}

export function useGeneratePayslip() {
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
        .from("payslips")
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