import { useState } from "react";
import { useEmployees } from "../../hooks/useEmployee";

interface Props {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export default function SalaryStructureForm({
  onSubmit,
  loading,
}: Props) {
  const { data: employees = [] } = useEmployees();

  const [form, setForm] = useState({
    employee_id: "",
    basic_salary: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: Number(e.target.value),
    });
  };

  return (
    <form
      className="grid grid-cols-2 gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      {/* Employee Dropdown */}

      <select
        value={form.employee_id}
        onChange={(e) =>
          setForm({
            ...form,
            employee_id: e.target.value,
          })
        }
        className="border p-2 rounded"
        required
      >
        <option value="">
          Select Employee
        </option>

        {employees.map((emp) => (
          <option
            key={emp.id}
            value={emp.id}
          >
            {emp.employee_id} - {emp.first_name}{" "}
            {emp.last_name}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="basic_salary"
        placeholder="Basic Salary"
        value={form.basic_salary}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />

      <input
        type="number"
        name="hra"
        placeholder="HRA"
        value={form.hra}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />

      <input
        type="number"
        name="allowances"
        placeholder="Allowances"
        value={form.allowances}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />

      <input
        type="number"
        name="deductions"
        placeholder="Deductions"
        value={form.deductions}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded p-2"
      >
        Save Structure
      </button>
    </form>
  );
}