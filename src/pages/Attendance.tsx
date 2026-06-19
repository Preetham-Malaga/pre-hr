import { useState } from "react";

import {
  CalendarCheck,
  Clock,
  Users,
  XCircle,
} from "lucide-react";

import { Header } from "../components/layout/Header";

import { useAttendance } from "../hooks/useAttendance";
import { useAttendanceStats } from "../hooks/useAttendanceStats";
import { useEmployees } from "../hooks/useEmployee";

export default function AttendancePage() {
  const { data: attendance = [] } =
    useAttendance();

  const { data: stats } =
    useAttendanceStats();

  const { data: employees = [] } =
    useEmployees();

  const [form, setForm] =
    useState({
      employee_id: "",
      attendance_date: "",
      check_in: "",
      check_out: "",
      status: "Present",
    });

  return (
    <>
      <Header
        title="Attendance"
        subtitle="Manage employee attendance"
      />

      <div className="p-6 space-y-6">

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="card p-5">
            <div className="flex gap-3 items-center">
              <CalendarCheck
                className="text-green-500"
              />

              <div>
                <p className="text-sm">
                  Present
                </p>

                <h3 className="text-2xl font-bold">
                  {stats?.present || 0}
                </h3>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex gap-3 items-center">
              <Clock
                className="text-yellow-500"
              />

              <div>
                <p className="text-sm">
                  Half Day
                </p>

                <h3 className="text-2xl font-bold">
                  {stats?.halfDay || 0}
                </h3>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex gap-3 items-center">
              <Users
                className="text-blue-500"
              />

              <div>
                <p className="text-sm">
                  Leave
                </p>

                <h3 className="text-2xl font-bold">
                  {stats?.leave || 0}
                </h3>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex gap-3 items-center">
              <XCircle
                className="text-red-500"
              />

              <div>
                <p className="text-sm">
                  Absent
                </p>

                <h3 className="text-2xl font-bold">
                  {stats?.absent || 0}
                </h3>
              </div>
            </div>
          </div>

        </div>

        {/* Form */}

        <div className="card p-6">

          <h2 className="text-lg font-semibold mb-4">
            Add Attendance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            <select
              value={form.employee_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  employee_id:
                    e.target.value,
                })
              }
              className="border rounded-lg p-2"
            >
              <option value="">
                Select Employee
              </option>

              {employees.map(
                (emp: any) => (
                  <option
                    key={
                      emp.employee_id
                    }
                    value={
                      emp.employee_id
                    }
                  >
                    {emp.employee_id}
                    {" - "}
                    {
                      emp.first_name
                    }
                  </option>
                )
              )}
            </select>

            <input
              type="date"
              value={
                form.attendance_date
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  attendance_date:
                    e.target.value,
                })
              }
              className="border rounded-lg p-2"
            />

            <input
              type="datetime-local"
              value={form.check_in}
              onChange={(e) =>
                setForm({
                  ...form,
                  check_in:
                    e.target.value,
                })
              }
              className="border rounded-lg p-2"
            />

            <input
              type="datetime-local"
              value={form.check_out}
              onChange={(e) =>
                setForm({
                  ...form,
                  check_out:
                    e.target.value,
                })
              }
              className="border rounded-lg p-2"
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status:
                    e.target.value,
                })
              }
              className="border rounded-lg p-2"
            >
              <option>
                Present
              </option>

              <option>
                Absent
              </option>

              <option>
                Leave
              </option>

              <option>
                Half Day
              </option>
            </select>

          </div>

        </div>

        {/* Records */}

        <div className="card p-6">

          <h2 className="text-lg font-semibold mb-4">
            Attendance Records
          </h2>

          <div className="overflow-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">
                    Employee
                  </th>

                  <th className="text-left py-3">
                    Date
                  </th>

                  <th className="text-left py-3">
                    Check In
                  </th>

                  <th className="text-left py-3">
                    Check Out
                  </th>

                  <th className="text-left py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>

                {attendance.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8"
                    >
                      No Attendance
                      Records
                    </td>
                  </tr>
                ) : (
                  attendance.map(
                    (
                      item: any
                    ) => (
                      <tr
                        key={
                          item.id
                        }
                        className="border-b"
                      >
                        <td className="py-3">
                          {
                            item.employee_id
                          }
                        </td>

                        <td className="py-3">
                          {
                            item.attendance_date
                          }
                        </td>

                        <td className="py-3">
                          {
                            item.check_in
                          }
                        </td>

                        <td className="py-3">
                          {
                            item.check_out
                          }
                        </td>

                        <td className="py-3">
                          {
                            item.status
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

      </div>
    </>
  );
}