import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export interface LeaveType {
  id: string;
  leave_name: string;
  leave_code: string;
 leave_days: number;
  carry_forward: boolean;
  status: "active" | "inactive";
  created_at: string;
}

export interface LeaveTypeInsert {
  leave_name: string;
  leave_code: string;
  days_allowed: number;
  carry_forward: boolean;
  status: "active" | "inactive";
}

export interface LeaveTypeUpdate extends LeaveTypeInsert {
  id: string;
}

const QUERY_KEY = ["leave_types"];

export function useLeaveTypes() {
  return useQuery<LeaveType[]>({
    queryKey: QUERY_KEY,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leave_types")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      return data;
    },
  });
}

export function useCreateLeaveType() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LeaveTypeInsert) => {
      const { data, error } = await supabase
        .from("leave_types")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Leave Type created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLeaveType() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: LeaveTypeUpdate) => {
      const { data, error } = await supabase
        .from("leave_types")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Leave Type updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteLeaveType() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("leave_types")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Leave Type deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}