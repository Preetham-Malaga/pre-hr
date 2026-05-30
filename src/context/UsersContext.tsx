import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Employee } from '../types';

interface UsersContextType {
  users: Employee[];
  loading: boolean;
  addUser: (u: Omit<Employee, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  updateUser: (u: Employee) => Promise<{ error: string | null }>;
  deleteUser: (id: string) => Promise<{ error: string | null }>;
  refresh: () => Promise<void>;
}

const UsersContext = createContext<UsersContextType | null>(null);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users,   setUsers]   = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('employees').select('*').order('created_at', { ascending: false });
    if (!error && data) setUsers(data as Employee[]);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addUser = async (u: Omit<Employee, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('employees').insert([u]).select().single();
    if (!error && data) setUsers(prev => [data as Employee, ...prev]);
    return { error: error?.message ?? null };
  };

  const updateUser = async (u: Employee) => {
    const { id, created_at, ...rest } = u;
    const { data, error } = await supabase.from('employees').update(rest).eq('id', id).select().single();
    if (!error && data) setUsers(prev => prev.map(x => x.id === id ? data as Employee : x));
    return { error: error?.message ?? null };
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (!error) setUsers(prev => prev.filter(x => x.id !== id));
    return { error: error?.message ?? null };
  };

  return (
    <UsersContext.Provider value={{ users, loading, addUser, updateUser, deleteUser, refresh }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error('useUsers must be used within UsersProvider');
  return ctx;
}