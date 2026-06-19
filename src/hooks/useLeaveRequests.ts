import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useLeaveRequests() {
  return useQuery({
    queryKey: ["leave_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*");

      if (error) throw error;

      return data;
    },
  });
}