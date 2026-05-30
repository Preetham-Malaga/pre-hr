// src/types/leave.ts

export interface LeaveType {
  id: string
  leave_name: string
  leave_days: number
  created_at: string
}

export interface LeaveRequest {
  id: string
  employee_id: string
  leave_type_id: string | null
  from_date: string
  to_date: string
  reason: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  employees?: { first_name: string; last_name: string; employee_id: string }
  leave_types?: { leave_name: string }
}

export interface LeaveRequestInsert {
  employee_id: string
  leave_type_id: string
  from_date: string
  to_date: string
  reason?: string
}