// src/hooks/useDepartments.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Department, DepartmentInsert, DepartmentUpdate } from '../types/department'
import toast from 'react-hot-toast'

const QUERY_KEY = ['departments']

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useCreateDepartment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: DepartmentInsert) => {
      const { data, error } = await supabase.from('departments').insert(payload).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Department created')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateDepartment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: DepartmentUpdate) => {
      const { data, error } = await supabase.from('departments').update(payload).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Department updated')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteDepartment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('departments').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Department deleted')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}