export interface Employee {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  gender: string | null
  date_of_birth: string | null
  marital_status: string | null
  email: string
  phone: string | null
  address: string | null
  department_id: string | null
  designation_id: string | null
  reporting_manager: string | null
  joining_date: string | null
  employment_status: 'active' | 'inactive' | 'on_leave'
  created_at: string
  departments?: { department_name: string }
  designations?: { designation_name: string }
  manager?: { first_name: string; last_name: string }
}

export interface EmployeeUpdate {
  first_name?: string
  last_name?: string
  gender?: string
  date_of_birth?: string
  marital_status?: string
  phone?: string
  address?: string
  department_id?: string | null
  designation_id?: string | null
  reporting_manager?: string | null
  joining_date?: string
  employment_status?: 'active' | 'inactive' | 'on_leave'
}