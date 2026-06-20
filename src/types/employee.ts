export interface Employee {
  id: string
  employee_id: string

  first_name: string
  middle_name?: string | null
  last_name: string

  gender: string | null
  date_of_birth: string | null
  marital_status: string | null

  blood_group?: string | null
  nationality?: string | null

  email: string
  personal_email?: string | null

  phone: string | null
  personal_phone?: string | null

  address: string | null

  department_id: string | null
  designation_id: string | null

  reporting_manager: string | null

  joining_date: string | null
  confirmation_date?: string | null

  employment_type?: string | null

  work_location?: string | null

  employee_status?: string | null

  employment_status:
    | "active"
    | "inactive"
    | "on_leave"

  created_at: string

  departments?: {
    department_name: string
  }

  designations?: {
    designation_name: string
  }

  manager?: {
    first_name: string
    last_name: string
  }
}

export interface EmployeeUpdate {
  first_name?: string
  middle_name?: string

  last_name?: string

  gender?: string
  date_of_birth?: string
  marital_status?: string

  blood_group?: string
  nationality?: string

  personal_email?: string
  personal_phone?: string

  phone?: string
  address?: string

  department_id?: string | null
  designation_id?: string | null

  reporting_manager?: string | null

  joining_date?: string
  confirmation_date?: string

  employment_type?: string

  work_location?: string

  employee_status?: string

  employment_status?:
    | "active"
    | "inactive"
    | "on_leave"
}