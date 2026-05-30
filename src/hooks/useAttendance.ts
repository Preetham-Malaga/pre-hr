import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { supabase } from "../lib/supabase";

import type {
  Attendance,
  AttendanceFormData,
} from "../types/attendance";

const TABLE = "attendance";

export function useAttendance(
  search: string = ""
) {
  return useQuery({
    queryKey: ["attendance", search],

    queryFn: async () => {
      let query = supabase
        .from(TABLE)
        .select(
          `
          *,
          employees (
            first_name,
            last_name
          )
        `
        )
        .order(
          "attendance_date",
          {
            ascending: false,
          }
        );

      if (search) {
        query = query.ilike(
          "status",
          `%${search}%`
        );
      }

      const {
        data,
        error,
      } = await query;

      if (error) {
        throw error;
      }

      return data;
    },
  });
}

export function useAddAttendance() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      attendance: AttendanceFormData
    ) => {
      const {
        data,
        error,
      } = await supabase
        .from(TABLE)
        .insert([attendance])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });
    },
  });
}

export function useUpdateAttendance() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<Attendance>;
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

      if (error) {
        throw error;
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });
    },
  });
}

export function useDeleteAttendance() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string
    ) => {
      const { error } =
        await supabase
          .from(TABLE)
          .delete()
          .eq("id", id);

      if (error) {
        throw error;
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });
    },
  });
}

export function useAttendanceStats() {
  return useQuery({
    queryKey: [
      "attendance-stats",
    ],

    queryFn: async () => {
      const {
        data,
        error,
      } = await supabase
        .from(TABLE)
        .select("*");

      if (error) {
        throw error;
      }

      const total =
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

      return {
        total,
        present,
        absent,
        leave,
      };
    },
  });
}