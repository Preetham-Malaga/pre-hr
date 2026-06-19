import { useState } from "react";
import { useEmployees } from "../hooks/useEmployee";
import { useLeaveTypes } from "../hooks/useLeaveTypes";
import {
  useLeaveApply,
  useCreateLeaveApply,
} from "../hooks/useLeaveApply";

export default function LeaveApply() {
  const { data: employees } = useEmployees();
  const { data: leaveTypes } = useLeaveTypes();

  const { data } = useLeaveApply();

  const createMutation =
    useCreateLeaveApply();

  const [formData, setFormData] =
    useState({
      employee_id: "",
      employee_name: "",
      leave_type: "",
      from_date: "",
      to_date: "",
      total_days: 0,
      reason: "",
      status: "Pending",
    });

  const calculateDays = (
    from: string,
    to: string
  ) => {
    if (!from || !to) return 0;

    const start = new Date(from);
    const end = new Date(to);

    const diff =
      end.getTime() -
      start.getTime();

    return (
      Math.floor(
        diff /
          (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    createMutation.mutate(formData);

    setFormData({
      employee_id: "",
      employee_name: "",
      leave_type: "",
      from_date: "",
      to_date: "",
      total_days: 0,
      reason: "",
      status: "Pending",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Leave Apply
      </h1>

      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4"
        >
          <select
            className="border p-2 rounded"
            value={formData.employee_id}
            onChange={(e) => {
              const emp =
                employees?.find(
                  (x: any) =>
                    x.employee_id ===
                    e.target.value
                );

              setFormData({
                ...formData,
                employee_id:
                  e.target.value,
                employee_name: emp
                  ? `${emp.first_name} ${emp.last_name}`
                  : "",
              });
            }}
          >
            <option value="">
              Select Employee
            </option>

            {employees?.map(
              (emp: any) => (
                <option
                  key={emp.id}
                  value={
                    emp.employee_id
                  }
                >
                  {emp.employee_id} -
                  {emp.first_name}
                </option>
              )
            )}
          </select>

          <select
            className="border p-2 rounded"
            value={
              formData.leave_type
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                leave_type:
                  e.target.value,
              })
            }
          >
            <option value="">
              Select Leave Type
            </option>

            {leaveTypes?.map(
              (leave: any) => (
                <option
                  key={leave.id}
                  value={
                    leave.leave_name
                  }
                >
                  {leave.leave_name}
                </option>
              )
            )}
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            value={
              formData.from_date
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                from_date:
                  e.target.value,
                total_days:
                  calculateDays(
                    e.target.value,
                    formData.to_date
                  ),
              })
            }
          />

          <input
            type="date"
            className="border p-2 rounded"
            value={
              formData.to_date
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                to_date:
                  e.target.value,
                total_days:
                  calculateDays(
                    formData.from_date,
                    e.target.value
                  ),
              })
            }
          />

          <input
            readOnly
            className="border p-2 rounded bg-gray-100"
            value={
              formData.total_days
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({
                ...formData,
                reason:
                  e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded"
          >
            Apply Leave
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">
                Employee
              </th>
              <th className="p-3">
                Leave Type
              </th>
              <th className="p-3">
                From
              </th>
              <th className="p-3">
                To
              </th>
              <th className="p-3">
                Days
              </th>
              <th className="p-3">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {data?.map(
              (item: any) => (
                <tr
                  key={item.id}
                  className="border-t"
                >
                  <td className="p-3">
                    {
                      item.employee_name
                    }
                  </td>
                  <td className="p-3">
                    {item.leave_type}
                  </td>
                  <td className="p-3">
                    {item.from_date}
                  </td>
                  <td className="p-3">
                    {item.to_date}
                  </td>
                  <td className="p-3">
                    {item.total_days}
                  </td>
                  <td className="p-3">
                    {item.status}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}