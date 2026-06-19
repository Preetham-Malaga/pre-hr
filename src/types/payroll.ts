export interface SalaryStructure {
  id: string;
  employee_id: string;

  basic_salary: number;
  hra: number;
  allowances: number;
  deductions: number;

  created_at: string;
}

export interface PayrollRun {
  id: string;

  payroll_month: string;

  status:
    | "Draft"
    | "Processed"
    | "Completed";

  created_at: string;
}

export interface Payslip {
  id: string;

  payroll_run_id: string;

  employee_id: number;

  gross_salary: number;

  deductions: number;

  net_salary: number;

  created_at: string;
}

export interface SalaryStructureFormData {
  employee_id: string;

  basic_salary: number;

  hra: number;

  allowances: number;

  deductions: number;
}