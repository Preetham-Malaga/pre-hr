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
}
export const empFullName = (
  employee: Employee
) =>
  `${employee.first_name} ${employee.last_name}`;