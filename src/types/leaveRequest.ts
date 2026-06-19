export interface LeaveRequest {
  id: string;
  employee_id: number;
  leave_type_id: string;
  from_date: string;
  to_date: string;
  total_days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  applied_at: string;
}

export interface LeaveRequestInsert {
  employee_id: number;
  leave_type_id: string;
  from_date: string;
  to_date: string;
  total_days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
}

export interface LeaveRequestUpdate extends LeaveRequestInsert {
  id: string;
}