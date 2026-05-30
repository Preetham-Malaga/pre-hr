// src/types/role.ts

export interface Role {
  id: string
  role_name: string
  description: string | null
  created_at: string
}

export interface Permission {
  id: string
  module: string
  action: string
}

export interface RolePermission {
  id: string
  role_id: string
  permission_id: string
}

export interface RoleInsert {
  role_name: string
  description?: string
}