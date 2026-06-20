export type Status =
  | "Active"
  | "Inactive"
  | "On Leave";

export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joining_date: string;
  status: Status;
  created_at: string;
  middle_name?: string

personal_email?: string

personal_phone?: string

gender?: string

blood_group?: string

nationality?: string

marital_status?: string

date_of_birth?: string

address?: string

confirmation_date?: string

employment_type?: string

work_location?: string

employee_status?: string
}
export const empFullName = (
  employee: Employee
) =>
  `${employee.first_name} ${employee.last_name}`;