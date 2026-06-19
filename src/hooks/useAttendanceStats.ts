import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useAttendanceStats() {
  return useQuery({
    queryKey: [
      "attendance-stats",
    ],

    staleTime:
      1000 * 60 * 5,

    queryFn: async () => {
      const {
        data,
        error,
      } = await supabase
        .from(
          "attendance"
        )
        .select(
          "status"
        );

      if (error)
        throw error;

      const present =
        data?.filter(
          (
            x
          ) =>
            x.status ===
            "Present"
        ).length || 0;

      const absent =
        data?.filter(
          (
            x
          ) =>
            x.status ===
            "Absent"
        ).length || 0;

      const leave =
        data?.filter(
          (
            x
          ) =>
            x.status ===
            "Leave"
        ).length || 0;

      const halfDay =
        data?.filter(
          (
            x
          ) =>
            x.status ===
            "Half Day"
        ).length || 0;

      return {
        present,
        absent,
        leave,
        halfDay,
      };
    },
  });
}