import { useState } from "react";
import {
  useLeaveBalances,
  useCreateLeaveBalance,
} from "../hooks/useLeaveBalances";
import { useEmployees } from "../hooks/useEmployee";
import { useLeaveTypes } from "../hooks/useLeaveTypes";

export default function LeaveBalances() {
  const { data, isLoading } = useLeaveBalances();
  const createMutation = useCreateLeaveBalance();
  const { data: employees } = useEmployees();
  const { data: leaveTypes } = useLeaveTypes();

  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    leave_type: "",
    allocated_days: 12,
    used_days: 0,
    remaining_days: 12,
    year: 2026,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(formData);

    setFormData({
      employee_id: "",
      employee_name: "",
      leave_type: "",
      allocated_days: 12,
      used_days: 0,
      remaining_days: 12,
      year: 2026,
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Leave Balances
      </h1>

      {/* Form */}

      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4"
        >
          <select
  className="border p-2 rounded"
  value={formData.employee_id}
  onChange={(e) => {
    const selectedEmployee =
      employees?.find(
        (emp: any) =>
          emp.employee_id === e.target.value
      );

    setFormData({
      ...formData,
      employee_id: e.target.value,
      employee_name: selectedEmployee
        ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
        : "",
    });
  }}
>
  <option value="">
    Select Employee
  </option>

  {employees?.map((emp: any) => (
    <option
      key={emp.id}
      value={emp.employee_id}
    >
      {emp.employee_id} - {emp.first_name}
    </option>
  ))}
</select>

          <select
  className="border p-2 rounded"
  value={formData.leave_type}
  onChange={(e) =>
    setFormData({
      ...formData,
      leave_type: e.target.value,
    })
  }
>
  <option value="">
    Select Leave Type
  </option>

  {leaveTypes?.map((leave: any) => (
    <option
      key={leave.id}
      value={leave.leave_name}
    >
      {leave.leave_name}
    </option>
  ))}
</select>

          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Allocated Days"
            value={formData.allocated_days}
            onChange={(e) =>
              setFormData({
                ...formData,
                allocated_days: Number(e.target.value),
              })
            }
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white rounded p-2"
          >
            Save
          </button>
        </form>
      </div>

      {/* Table */}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Employee ID</th>
              <th className="p-3 text-left">Employee Name</th>
              <th className="p-3 text-left">Leave Type</th>
              <th className="p-3 text-left">Allocated</th>
              <th className="p-3 text-left">Used</th>
              <th className="p-3 text-left">Remaining</th>
            </tr>
          </thead>

          <tbody>
            {data?.length ? (
              data.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.employee_id}</td>
                  <td className="p-3">{item.employee_name}</td>
                  <td className="p-3">{item.leave_type}</td>
                  <td className="p-3">{item.allocated_days}</td>
                  <td className="p-3">{item.used_days}</td>
                  <td className="p-3">{item.remaining_days}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-6"
                >
                  No Leave Balances Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}