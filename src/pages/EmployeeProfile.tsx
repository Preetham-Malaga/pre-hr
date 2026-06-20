import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEmployee, useUpdateEmployee, useEmployeeDocuments, useUploadDocument, useDeleteDocument, useEmployees } from '../hooks/useEmployee'
import { useDepartments } from '../hooks/useDepartments'
import { useDesignations } from '../hooks/useDesignations'
import { supabase } from '../lib/supabase'
import type { EmployeeUpdate } from '../types/employee'

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: employee, isLoading, isError } = useEmployee(id!)
  const { data: docs = [] } = useEmployeeDocuments(id!)
  const { data: departments = [] } = useDepartments()
  const { data: designations = [] } = useDesignations()
  const { data: allEmployees } = useEmployees()
const employeeList = allEmployees ?? []
  const updateMutation = useUpdateEmployee()
  const uploadMutation = useUploadDocument(id!)
  const deleteMutation = useDeleteDocument(id!)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<EmployeeUpdate>({})
  const [deleteDocTarget, setDeleteDocTarget] = useState<string | null>(null)

  function startEdit() {
    if (!employee) return
    setForm({
      first_name: employee.first_name,
      last_name: employee.last_name,
      gender: employee.gender ?? '',
      date_of_birth: employee.date_of_birth ?? '',
      marital_status: employee.marital_status ?? '',
      phone: employee.phone ?? '',
      address: employee.address ?? '',
      department_id: employee.department_id,
      designation_id: employee.designation_id,
      reporting_manager: employee.reporting_manager,
      joining_date: employee.joining_date ?? '',
      employment_status: employee.employment_status,
    })
    setEditing(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    await updateMutation.mutateAsync({ id: id!, ...form })
    setEditing(false)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadMutation.mutateAsync(file)
    e.target.value = ''
  }

  async function handleDownload(path: string) {
    const { data } = await supabase.storage.from('employee-documents').createSignedUrl(path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  async function handleDeleteDoc() {
    if (!deleteDocTarget) return
    await deleteMutation.mutateAsync(deleteDocTarget)
    setDeleteDocTarget(null)
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
  if (isError || !employee) return <div className="p-8 text-center text-red-500">Employee not found.</div>

  const field = (label: string, value: string | null | undefined) => (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{value || '—'}</p>
    </div>
  )

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm">← Back</button>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex-1">
          {employee.first_name} {employee.last_name}
        </h1>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          employee.employment_status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
          : employee.employment_status === 'on_leave' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
        }`}>{employee.employment_status.replace('_',' ')}</span>
        {!editing && (
          <button onClick={startEdit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Edit Profile</button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {[['First Name','first_name'],['Last Name','last_name'],['Phone','phone'],['Address','address']].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                  <input value={(form as any)[key] ?? ''} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                <select value={form.gender ?? ''} onChange={e => setForm(f => ({...f, gender: e.target.value}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                <input type="date" value={form.date_of_birth ?? ''} onChange={e => setForm(f => ({...f, date_of_birth: e.target.value}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marital Status</label>
                <select value={form.marital_status ?? ''} onChange={e => setForm(f => ({...f, marital_status: e.target.value}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select</option>
                  <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employment */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Employment Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <select value={form.department_id ?? ''} onChange={e => setForm(f => ({...f, department_id: e.target.value || null}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">— Select —</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Designation</label>
                <select value={form.designation_id ?? ''} onChange={e => setForm(f => ({...f, designation_id: e.target.value || null}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">— Select —</option>
                  {designations.map(d => <option key={d.id} value={d.id}>{d.designation_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reporting Manager</label>
                <select value={form.reporting_manager ?? ''} onChange={e => setForm(f => ({...f, reporting_manager: e.target.value || null}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">— Select —</option>
                  {employeeList.filter((e: any) => e.id !== id)
                  .map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Joining Date</label>
                <input type="date" value={form.joining_date ?? ''} onChange={e => setForm(f => ({...f, joining_date: e.target.value}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employment Status</label>
                <select value={form.employment_status} onChange={e => setForm(f => ({...f, employment_status: e.target.value as any}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
            <button type="submit" disabled={updateMutation.isPending} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
     ) : (
  <div className="space-y-6">

    {/* Personal Information */}
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Personal Information
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {field("First Name", employee.first_name)}
        {field("Middle Name", employee.middle_name)}
        {field("Last Name", employee.last_name)}
        {field("Gender", employee.gender)}
        {field("Date of Birth", employee.date_of_birth)}
        {field("Marital Status", employee.marital_status)}
        {field("Blood Group", employee.blood_group)}
        {field("Nationality", employee.nationality)}
      </div>
    </div>

    {/* Contact Information */}
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Contact Information
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {field("Official Email", employee.email)}
        {field("Personal Email", employee.personal_email)}
        {field("Official Phone", employee.phone)}
        {field("Personal Phone", employee.personal_phone)}
        {field("Address", employee.address)}
      </div>
    </div>

    {/* Employment Information */}
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Employment Information
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {field("Employee ID", employee.employee_id)}

        {field(
          "Department",
          employee.departments?.department_name
        )}

        {field(
          "Designation",
          employee.designations?.designation_name
        )}

        {field(
          "Reporting Manager",
          employee.manager
            ? `${employee.manager.first_name} ${employee.manager.last_name}`
            : null
        )}

        {field(
          "Joining Date",
          employee.joining_date
        )}

        {field(
          "Confirmation Date",
          employee.confirmation_date
        )}

        {field(
          "Employment Type",
          employee.employment_type
        )}

        {field(
          "Work Location",
          employee.work_location
        )}

        {field(
          "Employee Status",
          employee.employee_status
        )}

        {field(
          "System Status",
          employee.employment_status
        )}
      </div>
    </div>

  </div>
)
}

      {/* Documents */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Documents</h2>
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition">
            {uploadMutation.isPending ? 'Uploading...' : '+ Upload'}
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploadMutation.isPending} />
          </label>
        </div>
        {docs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No documents uploaded yet</p>
        ) : (
          <div className="space-y-2">
            {docs.map(doc => (
              <div key={doc.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">{doc.name}</span>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleDownload(`${id}/${doc.name}`)} className="text-blue-600 hover:underline text-xs">Download</button>
                  <button onClick={() => setDeleteDocTarget(`${id}/${doc.name}`)} className="text-red-500 hover:underline text-xs">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteDocTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Document</h2>
            <p className="text-sm text-gray-500 mb-6">This will permanently delete the document.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteDocTarget(null)} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">Cancel</button>
              <button onClick={handleDeleteDoc} disabled={deleteMutation.isPending} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
