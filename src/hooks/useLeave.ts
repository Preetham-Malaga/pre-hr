// src/hooks/useLeave.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { LeaveRequest, LeaveRequestInsert, LeaveType } from '../types/leave'
import toast from 'react-hot-toast'

export function useLeaveTypes() {
  return useQuery<LeaveType[]>({
    queryKey: ['leave-types'],
    queryFn: async () => {
      const { data, error } = await supabase.from('leave_types').select('*').order('leave_name')
      if (error) throw error
      return data
    },
  })
}

export function useLeaveRequests() {
  return useQuery<LeaveRequest[]>({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*, employees(first_name, last_name, employee_id), leave_types(leave_name)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useApplyLeave() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: LeaveRequestInsert) => {
      const { data, error } = await supabase.from('leave_requests').insert(payload).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-requests'] }); toast.success('Leave applied successfully') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateLeaveStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const { data, error } = await supabase.from('leave_requests').update({ status }).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['leave-requests'] })
      toast.success(`Leave ${vars.status}`)
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useCancelLeave() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('leave_requests').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-requests'] }); toast.success('Leave cancelled') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateLeaveRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<LeaveRequestInsert> & { id: string }) => {
      const { data, error } = await supabase.from('leave_requests').update(payload).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-requests'] }); toast.success('Leave updated') },
    onError: (e: Error) => toast.error(e.message),
  })
}