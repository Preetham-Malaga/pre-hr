import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, Filter, ChevronUp, ChevronDown, Loader2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { StatusBadge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Modal } from '../components/ui/Modal';
import { useUsers } from '../context/UsersContext';
import { useToast } from '../context/ToastContext';
import { empFullName, type Employee, type Status } from '../types';
import { useNavigate } from "react-router-dom";


type SortKey = 'first_name' | 'email' | 'department' | 'designation' | 'status' | 'joining_date';
const STATUSES: ('All' | Status)[] = ['All', 'Active', 'Inactive', 'On Leave'];
const PAGE_SIZE = 10;

export default function EmployeesPage() {
  const { users, loading, deleteUser } = useUsers();
  const toast = useToast();
  const navigate = useNavigate();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All');
  const [departmentFilter, setDepartmentFilter] = useState("All");
const [designationFilter, setDesignationFilter] = useState("All");
const [employmentTypeFilter, setEmploymentTypeFilter] = useState("All");
const [workTypeFilter, setWorkTypeFilter] = useState("All");
const [genderFilter, setGenderFilter] = useState("All");
const [maritalStatusFilter, setMaritalStatusFilter] = useState("All");
const [employeeStatusFilter, setEmployeeStatusFilter] = useState("All");
const [workLocationFilter, setWorkLocationFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>('first_name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteTarget = users.find(u => u.id === deleteId);

  const filtered = useMemo(() => users
    .filter(u => {
      const q = search.toLowerCase();
      const name = empFullName(u).toLowerCase();
      const matchSearch = !q || name.includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q) || u.employee_id?.toLowerCase().includes(q);
    return (
  matchSearch &&
  (statusFilter === "All" || u.status === statusFilter) &&
  (departmentFilter === "All" || u.department === departmentFilter) &&
  (designationFilter === "All" || u.designation === designationFilter) &&
  (employmentTypeFilter === "All" || u.employment_type === employmentTypeFilter) &&
  (workTypeFilter === "All" || u.work_type === workTypeFilter) &&
  (employeeStatusFilter === "All" ||
 u.employee_status === employeeStatusFilter) &&

(workLocationFilter === "All" ||
 u.work_location === workLocationFilter) &&

(genderFilter === "All" ||
 u.gender === genderFilter) &&

(maritalStatusFilter === "All" ||
 u.marital_status === maritalStatusFilter)
);
    })
    .sort((a, b) => {
      const av = (a[sortKey] ?? '').toString();
      const bv = (b[sortKey] ?? '').toString();
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }),
    [users, search, statusFilter, departmentFilter, designationFilter, employmentTypeFilter, workTypeFilter, sortKey, sortDir]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
      : <ChevronUp size={12} className="opacity-0 group-hover:opacity-30" />;

  const TH = ({ label, k }: { label: string; k: SortKey }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider cursor-pointer select-none group dark:hover:text-slate-200 hover:text-slate-700 transition-colors"
      onClick={() => handleSort(k)}>
      <span className="flex items-center gap-1">{label}<SortIcon k={k} /></span>
    </th>
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await deleteUser(deleteId);
    if (error) toast.error('Failed to delete', error);
    else toast.success('Employee deleted');
    setDeleteId(null);
  };

  return (
    <>
      <Header title="Employees" subtitle={`${filtered.length} of ${users.length} employees`} />
      <div className="p-4 sm:p-6 space-y-4 page-enter">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-3 gap-2 w-full sm:max-w-2g">
         <div className="relative w-70">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400" />
              <input className="input pl-8 py-2" placeholder="Search name, email, department, ID…"
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
          <button
  onClick={() => setShowAdvancedFilters(true)}
  className="px-4 py-2 border rounded-lg bg-white"
>
  Advanced Filters
</button>
          </div>
          <button className="btn-primary shrink-0 w-full sm:w-auto justify-center" onClick={() => navigate("/employees/new")}>
            <Plus size={15} />Add Employee
          </button>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin dark:text-slate-500 text-slate-400" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="dark:border-slate-700/50 border-slate-200 border-b dark:bg-slate-800/40 bg-slate-50/80">
                      <TH label="Employee" k="first_name" />
                      <TH label="Department" k="department" />
                      <TH label="Designation" k="designation" />
                      <TH label="Status" k="status" />
                      <TH label="Joined" k="joining_date" />
                      <th className="px-4 py-3 text-right text-xs font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="dark:divide-slate-700/30 divide-slate-100 divide-y">
                    {paginated.length === 0 ? (
                      <tr><td colSpan={6}>
                        <div className="flex flex-col items-center gap-3 py-16 text-center">
                          <div className="w-12 h-12 rounded-full dark:bg-slate-700/60 bg-slate-100 flex items-center justify-center">
                            <Users size={22} className="dark:text-slate-500 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-medium dark:text-slate-300 text-slate-600">
                              {search || statusFilter !== 'All' ? 'No employees match your search.' : 'No employees found.'}
                            </p>
                            {!search && statusFilter === 'All' && (
                              <p className="text-xs dark:text-slate-500 text-slate-400 mt-1">Add your first employee to get started.</p>
                            )}

                          </div>
                        </div>
                      </td></tr>
                    ) : paginated.map(emp => (
                      <tr key={emp.id} className="table-row-hover">
                        <td className="px-4 py-3">
                          <div className="min-w-0">
                            <p className="font-medium dark:text-slate-200 text-slate-800 truncate">
                              {emp.employee_id}
                            </p>
                            <p className="text-sm dark:text-slate-300 text-slate-700 truncate">
                              {empFullName(emp)}
                            </p>
                            <p className="text-xs dark:text-slate-500 text-slate-500 truncate">
                              {emp.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 dark:text-slate-400 text-slate-600 text-xs">{emp.department}</td>
                        <td className="px-4 py-3 dark:text-slate-400 text-slate-600 text-xs">{emp.designation}</td>
                        <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                        <td className="px-4 py-3 dark:text-slate-500 text-slate-500 text-xs font-mono">
                          {emp.joining_date ? new Date(emp.joining_date).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="p-1.5 rounded-lg hover:bg-blue-100"
                              onClick={() => navigate(`/employees/view/${emp.id}`)}
                              title="View"
                            >
                              👁️
                            </button>

                            <button
                              className="p-1.5 rounded-lg dark:hover:bg-slate-700/60 hover:bg-slate-100"
                              onClick={() => navigate(`/employees/edit/${emp.id}`)}
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              className="p-1.5 rounded-lg hover:bg-red-100"
                              onClick={() => setDeleteId(emp.id)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && filtered.length > PAGE_SIZE && (
                <div className="px-4 py-3 dark:border-slate-700/30 border-slate-100 border-t flex items-center justify-between">
                  <p className="text-xs dark:text-slate-500 text-slate-500">Page {page} of {totalPages} · {filtered.length} results</p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="p-1.5 rounded-lg dark:hover:bg-slate-700/60 hover:bg-slate-100 dark:text-slate-400 text-slate-600 disabled:opacity-30 transition-colors">
                      <ChevronLeft size={15} />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                      return (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? 'text-white' : 'dark:text-slate-400 text-slate-600 dark:hover:bg-slate-700/60 hover:bg-slate-100'}`}
                          style={p === page ? { backgroundColor: 'var(--color-primary)' } : {}}>
                          {p}
                        </button>
                      );
                    })}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="p-1.5 rounded-lg dark:hover:bg-slate-700/60 hover:bg-slate-100 dark:text-slate-400 text-slate-600 disabled:opacity-30 transition-colors">
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
              {!loading && filtered.length > 0 && filtered.length <= PAGE_SIZE && (
                <div className="px-4 py-3 dark:border-slate-700/30 border-slate-100 border-t text-xs dark:text-slate-500 text-slate-500">
                  Showing {filtered.length} employee{filtered.length !== 1 ? 's' : ''}
                </div>
              )}
            </>
          )}
        </div>
      </div>
<Modal
  open={showAdvancedFilters}
  onClose={() => setShowAdvancedFilters(false)}
  title="Advanced Filters"
  width="max-w-4xl"
>
  <div className="grid grid-cols-2 gap-4">

    <div>
      <label className="text-sm font-medium">
        Department
      </label>
      <select
        className="input w-full mt-1"
        value={departmentFilter}
        onChange={(e) =>
          setDepartmentFilter(e.target.value)
        }
      >
        <option value="All">All</option>
        {[...new Set(users.map(u => u.department))]
          .filter(Boolean)
          .map(dep => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
      </select>
    </div>

    <div>
      <label className="text-sm font-medium">
        Designation
      </label>
      <select
        className="input w-full mt-1"
        value={designationFilter}
        onChange={(e) =>
          setDesignationFilter(e.target.value)
        }
      >
        <option value="All">All</option>
        {[...new Set(users.map(u => u.designation))]
          .filter(Boolean)
          .map(des => (
            <option key={des} value={des}>
              {des}
            </option>
          ))}
      </select>
    </div>
    <div>
  <label className="text-sm font-medium">
    Employment Type
  </label>

  <select
    className="input w-full mt-1"
    value={employmentTypeFilter}
    onChange={(e) =>
      setEmploymentTypeFilter(e.target.value)
    }
  >
    <option value="All">All</option>
    <option value="Full Time">Full Time</option>
    <option value="Part Time">Part Time</option>
    <option value="Contract">Contract</option>
    <option value="Intern">Intern</option>
  </select>
</div>
<div>
  <label className="text-sm font-medium">
    Work Type
  </label>

  <select
    className="input w-full mt-1"
    value={workTypeFilter}
    onChange={(e) =>
      setWorkTypeFilter(e.target.value)
    }
  >
    <option value="All">All</option>
    <option value="Remote">Remote</option>
    <option value="Hybrid">Hybrid</option>
    <option value="Office">Office</option>
  </select>
</div>

<div>
  <label className="text-sm font-medium">
    Work Location
  </label>

  <select
    className="input w-full mt-1"
    value={workLocationFilter}
    onChange={(e) =>
      setWorkLocationFilter(e.target.value)
    }
  >
    <option value="All">All</option>

    {[...new Set(users.map(u => u.work_location))]
      .filter(Boolean)
      .map(location => (
        <option key={location} value={location}>
          {location}
        </option>
      ))}
  </select>
</div>
<div>
  <label className="text-sm font-medium">
    Gender
  </label>

  <select
    className="input w-full mt-1"
    value={genderFilter}
    onChange={(e) =>
      setGenderFilter(e.target.value)
    }
  >
    <option value="All">All</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
</div>
<div>
  <label className="text-sm font-medium">
    Marital Status
  </label>

  <select
    className="input w-full mt-1"
    value={maritalStatusFilter}
    onChange={(e) =>
      setMaritalStatusFilter(e.target.value)
    }
  >
    <option value="All">All</option>
    <option value="Single">Single</option>
    <option value="Married">Married</option>
    <option value="Divorced">Divorced</option>
    <option value="Widowed">Widowed</option>
  </select>
</div>
  </div>

  <div className="flex justify-end gap-3 mt-6">
    <button
      className="px-4 py-2 border rounded-lg"
      onClick={() => {
       setDepartmentFilter("All");
setDesignationFilter("All");
setEmploymentTypeFilter("All");
setWorkTypeFilter("All");
setWorkLocationFilter("All");
setGenderFilter("All");
setMaritalStatusFilter("All");
setEmployeeStatusFilter("All");
      }}
    >
      Clear
    </button>

    <button
      className="btn-primary"
      onClick={() =>
        setShowAdvancedFilters(false)
      }
    >
      Apply Filters
    </button>
  </div>
  
</Modal>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${
          deleteTarget ? empFullName(deleteTarget) : 'this employee'
        }? This action cannot be undone.`}
      />
    </>
  );
}