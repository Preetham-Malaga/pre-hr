import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useLeaveCalendar() {
  return useQuery({
    queryKey: ["leave_calendar"],
    staleTime: 1000 * 60 * 5,

    queryFn: async () => {
      const { data: leaves, error: leaveError } =
        await supabase
          .from("leave_apply")
          .select("*")
          .eq("status", "Approved");

      if (leaveError) throw leaveError;

      const { data: holidays, error: holidayError } =
        await supabase
          .from("holidays")
          .select("*");

      if (holidayError) throw holidayError;

      return {
        leaves: leaves || [],
        holidays: holidays || [],
      };
    },
  });
}