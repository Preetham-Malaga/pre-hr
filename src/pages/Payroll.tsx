import { useState } from "react";

import { useEmployees } from "../hooks/useEmployee";
import {
  usePayroll,
  useCreatePayroll,
} from "../hooks/usePayroll";

export default function Payroll() {
  const { data: employees = [] } =
    useEmployees();

  const { data: payrolls = [] } =
    usePayroll();

  const createPayroll =
    useCreatePayroll();

  const [form, setForm] =
    useState({
      employee_id: "",
      employee_name: "",
      payroll_month: "",
      basic_salary: "",
      allowances: "",
      deductions: "",
      status: "Pending",
    });

  const netSalary =
    Number(
      form.basic_salary || 0
    ) +
    Number(
      form.allowances || 0
    ) -
    Number(
      form.deductions || 0
    );

  const handleSave =
    async () => {
      if (
        !form.employee_id ||
        !form.payroll_month
      ) {
        alert(
          "Please fill required fields"
        );

        return;
      }

      try {
        await createPayroll.mutateAsync(
          {
            ...form,

            basic_salary:
              Number(
                form.basic_salary
              ),

            allowances:
              Number(
                form.allowances
              ),

            deductions:
              Number(
                form.deductions
              ),

            net_salary:
              netSalary,
          }
        );

        alert(
          "Payroll Created"
        );

        setForm({
          employee_id: "",
          employee_name: "",
          payroll_month: "",
          basic_salary: "",
          allowances: "",
          deductions: "",
          status:
            "Pending",
        });
      } catch (error) {
        console.error(
          error
        );
      }
    };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Payroll
      </h1>

      {/* Form */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <select
            value={
              form.employee_id
            }
            onChange={(e) => {
              const emp =
                employees.find(
                  (
                    x: any
                  ) =>
                    x.employee_id ===
                    e.target.value
                );

              setForm({
                ...form,
                employee_id:
                  e.target
                    .value,
                employee_name:
                  emp
                    ? `${emp.first_name} ${emp.last_name}`
                    : "",
              });
            }}
            className="border rounded-lg p-2"
          >
            <option value="">
              Select Employee
            </option>

            {employees.map(
              (
                emp: any
              ) => (
                <option
                  key={
                    emp.employee_id
                  }
                  value={
                    emp.employee_id
                  }
                >
                  {
                    emp.employee_id
                  }
                  {" - "}
                  {
                    emp.first_name
                  }
                </option>
              )
            )}
          </select>

          <input
            type="month"
            value={
              form.payroll_month
            }
            onChange={(e) =>
              setForm({
                ...form,
                payroll_month:
                  e.target
                    .value,
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Basic Salary"
            value={
              form.basic_salary
            }
            onChange={(e) =>
              setForm({
                ...form,
                basic_salary:
                  e.target
                    .value,
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Allowances"
            value={
              form.allowances
            }
            onChange={(e) =>
              setForm({
                ...form,
                allowances:
                  e.target
                    .value,
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Deductions"
            value={
              form.deductions
            }
            onChange={(e) =>
              setForm({
                ...form,
                deductions:
                  e.target
                    .value,
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            type="text"
            value={
              netSalary
            }
            readOnly
            className="border rounded-lg p-2 bg-gray-100"
          />

        </div>

        <button
          onClick={
            handleSave
          }
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Save Payroll
        </button>

      </div>

      {/* Grid */}

      <div className="bg-white rounded-xl shadow p-6">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-3">
                Employee
              </th>

              <th className="text-left p-3">
                Month
              </th>

              <th className="text-left p-3">
                Basic
              </th>

              <th className="text-left p-3">
                Allowance
              </th>

              <th className="text-left p-3">
                Deduction
              </th>

              <th className="text-left p-3">
                Net Salary
              </th>

              <th className="text-left p-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {payrolls.length ===
            0 ? (
              <tr>

                <td
                  colSpan={7}
                  className="text-center p-6"
                >
                  No Payroll Records
                </td>

              </tr>
            ) : (
              payrolls.map(
                (
                  row: any
                ) => (
                  <tr
                    key={
                      row.id
                    }
                    className="border-b"
                  >
                    <td className="p-3">
                      {
                        row.employee_name
                      }
                    </td>

                    <td className="p-3">
                      {
                        row.payroll_month
                      }
                    </td>

                    <td className="p-3">
                      {
                        row.basic_salary
                      }
                    </td>

                    <td className="p-3">
                      {
                        row.allowances
                      }
                    </td>

                    <td className="p-3">
                      {
                        row.deductions
                      }
                    </td>

                    <td className="p-3">
                      {
                        row.net_salary
                      }
                    </td>

                    <td className="p-3">
                      {
                        row.status
                      }
                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}