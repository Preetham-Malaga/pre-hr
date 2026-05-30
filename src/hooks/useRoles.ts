// src/hooks/useRoles.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Role, Permission, RoleInsert } from '../types/role'
import toast from 'react-hot-toast'

export function useRoles() {
  return useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('roles').select('*').order('created_at')
      if (error) throw error
      return data
    },
  })
}

export function usePermissions() {
  return useQuery<Permission[]>({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('permissions').select('*').order('module')
      if (error) throw error
      return data
    },
  })
}

export function useRolePermissions(roleId: string) {
  return useQuery<string[]>({
    queryKey: ['role-permissions', roleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions').select('permission_id').eq('role_id', roleId)
      if (error) throw error
      return data.map(d => d.permission_id)
    },
    enabled: !!roleId,
  })
}

export function useCreateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: RoleInsert) => {
      const { data, error } = await supabase.from('roles').insert(payload).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['roles'] }); toast.success('Role created') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: RoleInsert & { id: string }) => {
      const { data, error } = await supabase.from('roles').update(payload).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['roles'] }); toast.success('Role updated') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('roles').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['roles'] }); toast.success('Role deleted') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useSaveRolePermissions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) => {
      await supabase.from('role_permissions').delete().eq('role_id', roleId)
      if (permissionIds.length > 0) {
        const inserts = permissionIds.map(pid => ({ role_id: roleId, permission_id: pid }))
        const { error } = await supabase.from('role_permissions').insert(inserts)
        if (error) throw error
      }
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['role-permissions', vars.roleId] })
      toast.success('Permissions saved')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}