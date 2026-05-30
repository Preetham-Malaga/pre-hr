// src/hooks/useDesignations.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Designation, DesignationInsert, DesignationUpdate } from '../types/designation'
import toast from 'react-hot-toast'

const QUERY_KEY = ['designations']

export function useDesignations() {
  return useQuery<Designation[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designations')
        .select('*, departments(department_name)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useCreateDesignation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: DesignationInsert) => {
      const { data, error } = await supabase.from('designations').insert(payload).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEY }); toast.success('Designation created') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateDesignation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: DesignationUpdate) => {
      const { data, error } = await supabase.from('designations').update(payload).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEY }); toast.success('Designation updated') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteDesignation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('designations').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEY }); toast.success('Designation deleted') },
    onError: (e: Error) => toast.error(e.message),
  })
}