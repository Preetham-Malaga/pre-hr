import { CalendarCheck, Clock, Users, XCircle } from "lucide-react";
import { Header } from "../components/layout/Header";

export default function AttendancePage() {
  return (
    <>
      <Header
        title="Attendance"
        subtitle="Manage employee attendance records"
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <CalendarCheck className="text-green-500" size={24} />
              <div>
                <p className="text-sm text-slate-500">Present</p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-500" size={24} />
              <div>
                <p className="text-sm text-slate-500">Late</p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3">
              <Users className="text-blue-500" size={24} />
              <div>
                <p className="text-sm text-slate-500">On Leave</p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-500" size={24} />
              <div>
                <p className="text-sm text-slate-500">Absent</p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">
            Attendance Records
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Employee</th>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Check In</th>
                  <th className="text-left py-3">Check Out</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-slate-500"
                  >
                    No attendance records found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}