// src/types/department.ts

export interface Department {
  id: string
  department_name: string
  department_code: string
  department_head: string | null
  description: string | null
  status: 'active' | 'inactive'
  created_at: string
}

export interface DepartmentInsert {
  department_name: string
  department_code: string
  department_head?: string
  description?: string
  status?: 'active' | 'inactive'
}

export interface DepartmentUpdate extends Partial<DepartmentInsert> {
  id: string
}