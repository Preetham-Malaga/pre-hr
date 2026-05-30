export interface Attendance {
  id: string;
  employee_id: number;

  attendance_date: string;

  check_in: string | null;
  check_out: string | null;

  total_hours: number | null;

  status:
    | "Present"
    | "Absent"
    | "Half Day"
    | "Leave";

  remarks: string | null;

  created_at: string;
}

export interface AttendanceFormData {
  employee_id: number;

  attendance_date: string;

  check_in: string;

  check_out: string;

  status:
    | "Present"
    | "Absent"
    | "Half Day"
    | "Leave";

  remarks?: string;
}