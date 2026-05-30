export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  totalDesignations: number;

  activeEmployees: number;

  present: number;
  absent: number;
  leave: number;
  halfDay: number;
}