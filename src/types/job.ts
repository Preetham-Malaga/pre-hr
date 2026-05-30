export interface Job {
  id: string;

  job_title: string;

  department: string;

  location: string;

  employment_type: string;

  open_positions: number;

  experience_required: string;

  salary_range: string;

  status:
    | "Open"
    | "Closed"
    | "On Hold";

  description: string;

  created_at: string;
}

export interface JobFormData {
  job_title: string;

  department: string;

  location: string;

  employment_type: string;

  open_positions: number;

  experience_required: string;

  salary_range: string;

  status:
    | "Open"
    | "Closed"
    | "On Hold";

  description: string;
}