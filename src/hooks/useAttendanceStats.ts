import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useAttendanceStats() {
  return useQuery({
    queryKey: ["attendance-stats"],

    queryFn: async () => {
      const { data, error } =
        await supabase
          .from("attendance")
          .select("*");

      if (error) throw error;

      const totalRecords =
        data.length;

      const present =
        data.filter(
          (x) =>
            x.status ===
            "Present"
        ).length;

      const absent =
        data.filter(
          (x) =>
            x.status ===
            "Absent"
        ).length;

      const leave =
        data.filter(
          (x) =>
            x.status ===
            "Leave"
        ).length;

      const halfDay =
        data.filter(
          (x) =>
            x.status ===
            "Half Day"
        ).length;

      return {
        totalRecords,
        present,
        absent,
        leave,
        halfDay,
      };
    },
  });
}