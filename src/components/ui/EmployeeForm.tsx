import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import type { Employee, Status } from "../../types";

const STATUSES: Status[] = [
  "Active",
  "Inactive",
  "On Leave",
];

interface EmployeeFormProps {
  initial?: Partial<Employee>;
  nextEmployeeId?: string;
  onSubmit: (
    data: Omit<Employee, "id" | "created_at">
  ) => void | Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  saving?: boolean;
}

export function EmployeeForm({
  initial = {},
  nextEmployeeId,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  saving = false,
}: EmployeeFormProps) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);

  const [form, setForm] = useState({
    employee_id: initial.employee_id ?? nextEmployeeId ?? "",
    first_name: initial.first_name ?? "",
    last_name: initial.last_name ?? "",
    email: initial.email ?? "",
    phone: initial.phone ?? "",
    department: initial.department ?? "",
    designation: initial.designation ?? "",
    joining_date:
      initial.joining_date ??
      new Date().toISOString().split("T")[0],
    status: (initial.status ?? "Active") as Status,
  });

  useEffect(() => {
    loadDepartments();
    loadDesignations();
  }, []);

  const loadDepartments = async () => {
    const { data } = await supabase
      .from("departments")
      .select("*")
      .eq("status", "active");

    if (data) {
      setDepartments(data);
    }
  };

  const loadDesignations = async () => {
    const { data } = await supabase
      .from("designations")
      .select("*")
      .eq("status", "active");

    if (data) {
      setDesignations(data);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    await onSubmit(form as any);
  };

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label>Employee ID</label>
          <input
            className="input"
            value={form.employee_id}
            readOnly
          />
        </div>

        <div>
          <label>Joining Date</label>
          <input
            type="date"
            className="input"
            value={form.joining_date}
            onChange={(e) =>
              updateField(
                "joining_date",
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label>First Name</label>
          <input
            className="input"
            value={form.first_name}
            onChange={(e) =>
              updateField(
                "first_name",
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            className="input"
            value={form.last_name}
            onChange={(e) =>
              updateField(
                "last_name",
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) =>
              updateField(
                "email",
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            className="input"
            value={form.phone}
            onChange={(e) =>
              updateField(
                "phone",
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label>Department</label>
          <select
            className="input"
            value={form.department}
            onChange={(e) =>
              updateField(
                "department",
                e.target.value
              )
            }
          >
            <option value="">
              Select Department
            </option>

            {departments.map((dept) => (
              <option
                key={dept.id}
                value={dept.department_name}
              >
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Designation</label>
          <select
            className="input"
            value={form.designation}
            onChange={(e) =>
              updateField(
                "designation",
                e.target.value
              )
            }
          >
            <option value="">
              Select Designation
            </option>

            {designations.map((des) => (
              <option
                key={des.id}
                value={des.designation_name}
              >
                {des.designation_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Status</label>
          <select
            className="input"
            value={form.status}
            onChange={(e) =>
              updateField(
                "status",
                e.target.value
              )
            }
          >
            {STATUSES.map((s) => (
              <option
                key={s}
                value={s}
              >
                {s}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
        >
          {saving ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
