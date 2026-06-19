import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const QUERY_KEY = ["leave_apply"];

export function useLeaveApply() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leave_apply")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateLeaveApply() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase
        .from("leave_apply")
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

      toast.success("Leave Applied Successfully");
    },

    onError: (e: Error) => {
      console.error(e);
      toast.error(e.message);
    },
  });
}
export function useApproveLeave() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Get Leave Request
      const { data: leaveData, error: leaveError } =
        await supabase
          .from("leave_apply")
          .select("*")
          .eq("id", id)
          .single();

      if (leaveError) throw leaveError;

      // Update Leave Status
      const { error: statusError } =
        await supabase
          .from("leave_apply")
          .update({
            status: "Approved",
          })
          .eq("id", id);

      if (statusError) throw statusError;

      // Get Leave Balance
      const { data: balanceData, error: balanceError } =
        await supabase
          .from("leave_balances")
          .select("*")
          .eq(
            "employee_id",
            leaveData.employee_id
          )
          .eq(
            "leave_type",
            leaveData.leave_type
          )
          .single();

      if (!balanceError && balanceData) {
        const newUsed =
          Number(balanceData.used_days) +
          Number(leaveData.total_days);

        const newRemaining =
          Number(balanceData.allocated_days) -
          newUsed;

        await supabase
          .from("leave_balances")
          .update({
            used_days: newUsed,
            remaining_days: newRemaining,
          })
          .eq("id", balanceData.id);
      }

      return leaveData;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["leave_apply"],
      });

      qc.invalidateQueries({
        queryKey: ["leave_balances"],
      });

      toast.success("Leave Approved");
    },

    onError: (e: Error) => {
      toast.error(e.message);
    },
  });
}

export function useRejectLeave() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data, error } =
        await supabase
          .from("leave_apply")
          .update({
            status: "Rejected",
          })
          .eq("id", id)
          .select()
          .single();

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["leave_apply"],
      });

      toast.success("Leave Rejected");
    },

    onError: (e: Error) => {
      toast.error(e.message);
    },
  });
}