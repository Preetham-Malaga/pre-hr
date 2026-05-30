export type Role =
  | "Admin"
  | "HR"
  | "Manager"
  | "Employee";

export type Status =
  | "Active"
  | "Inactive"
  | "On Leave";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: Status;
  avatar: string;
  joinDate: string;
  phone: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

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