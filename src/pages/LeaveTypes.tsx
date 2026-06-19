import { useState } from "react";
import {
  useLeaveTypes,
  useCreateLeaveType,
  useUpdateLeaveType,
  useDeleteLeaveType,
  type LeaveType,
  type LeaveTypeInsert,
} from "../hooks/useLeaveTypes";

const emptyForm: LeaveTypeInsert = {
  leave_name: "",
  leave_code: "",
  leave_days: 0,
  carry_forward: false,
  status: "active",
};

export default function LeaveTypes() {
  const { data: leaveTypes = [], isLoading } = useLeaveTypes();

  const createMutation = useCreateLeaveType();
  const updateMutation = useUpdateLeaveType();
  const deleteMutation = useDeleteLeaveType();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<LeaveType | null>(null);
  const [form, setForm] = useState<LeaveTypeInsert>(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (leave: LeaveType) => {
    setEditing(leave);

    setForm({
      leave_name: leave.leave_name,
      leave_code: leave.leave_code,
      leave_days: leave.leave_days,
      carry_forward: leave.carry_forward,
      status: leave.status,
    });

    setShowModal(true);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        ...form,
      });
    } else {
      await createMutation.mutateAsync(form);
    }

    setShowModal(false);
  };

  const handleDelete = async (
    id: string
  ) => {
    if (
      !window.confirm(
        "Delete this leave type?"
      )
    )
      return;

    await deleteMutation.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Leave Types
          </h1>
          <p className="text-sm text-gray-500">
            {leaveTypes.length} Leave Types
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Leave Type
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">
                Leave Name
              </th>
              <th className="px-4 py-3 text-left">
                Code
              </th>
              <th className="px-4 py-3 text-left">
                Days
              </th>
              <th className="px-4 py-3 text-left">
                Carry Forward
              </th>
              <th className="px-4 py-3 text-left">
                Status
              </th>
              <th className="px-4 py-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {leaveTypes.map((leave) => (
              <tr
                key={leave.id}
                className="border-t"
              >
                <td className="px-4 py-3">
                  {leave.leave_name}
                </td>

                <td className="px-4 py-3">
                  {leave.leave_code}
                </td>

                <td className="px-4 py-3">
                  {leave.leave_days}
                </td>

                <td className="px-4 py-3">
                  {leave.carry_forward
                    ? "Yes"
                    : "No"}
                </td>

                <td className="px-4 py-3">
                  {leave.status}
                </td>

                <td className="px-4 py-3 space-x-3">
                  <button
                    onClick={() =>
                      openEdit(leave)
                    }
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        leave.id
                      )
                    }
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editing
                ? "Edit Leave Type"
                : "Add Leave Type"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                placeholder="Leave Name"
                value={form.leave_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    leave_name:
                      e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                placeholder="Leave Code"
                value={form.leave_code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    leave_code:
                      e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="number"
                placeholder="Days Allowed"
                value={form.leave_days}
                onChange={(e) =>
                  setForm({
                    ...form,
                    leave_days:
                      Number(
                        e.target.value
                      ),
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <select
                value={String(
                  form.carry_forward
                )}
                onChange={(e) =>
                  setForm({
                    ...form,
                    carry_forward:
                      e.target.value ===
                      "true",
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="true">
                  Yes
                </option>
                <option value="false">
                  No
                </option>
              </select>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status:
                      e.target.value as
                        | "active"
                        | "inactive",
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="active">
                  Active
                </option>
                <option value="inactive">
                  Inactive
                </option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {editing
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}