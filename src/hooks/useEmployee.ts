// src/hooks/useEmployee.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Employee, EmployeeUpdate } from '../types/employee'
import toast from 'react-hot-toast'

export function useEmployee(id: string) {
  return useQuery<Employee>({
    queryKey: ['employee', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`*, departments(department_name), designations(designation_name), manager:reporting_manager(first_name, last_name)`)
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, employee_id, first_name, last_name, email, employment_status, departments(department_name)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useUpdateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: EmployeeUpdate & { id: string }) => {
      const { data, error } = await supabase.from('employees').update(payload).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['employee', vars.id] })
      qc.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Employee updated')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useEmployeeDocuments(employeeId: string) {
  return useQuery({
    queryKey: ['employee-docs', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('employee-documents').list(employeeId)
      if (error) throw error
      return data
    },
    enabled: !!employeeId,
  })
}

export function useUploadDocument(employeeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const path = `${employeeId}/${Date.now()}_${file.name}`
      const { error } = await supabase.storage.from('employee-documents').upload(path, file)
      if (error) throw error
      return path
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['employee-docs', employeeId] }); toast.success('Document uploaded') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteDocument(employeeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (path: string) => {
      const { error } = await supabase.storage.from('employee-documents').remove([path])
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['employee-docs', employeeId] }); toast.success('Document deleted') },
    onError: (e: Error) => toast.error(e.message),
  })
}