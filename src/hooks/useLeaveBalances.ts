import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const QUERY_KEY = ["leave_balances"];

export function useLeaveBalances() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leave_balances")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data || [];
    },
  });
}

export function useCreateLeaveBalance() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase
        .from("leave_balances")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      toast.success("Leave Balance Added");
    },

    onError: (e: Error) => {
      console.error(e);
      toast.error(e.message);
    },
  });
}