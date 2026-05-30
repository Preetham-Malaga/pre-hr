// src/types/designation.ts

export interface Designation {
  id: string
  designation_name: string
  designation_code: string
  department_id: string | null
  description: string | null
  status: 'active' | 'inactive'
  created_at: string
  departments?: { department_name: string }
}

export interface DesignationInsert {
  designation_name: string
  designation_code: string
  department_id?: string | null
  description?: string
  status?: 'active' | 'inactive'
}

export interface DesignationUpdate extends Partial<DesignationInsert> {
  id: string
}