import { useState } from "react";

export default function InterviewsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Interview Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage candidate interviews and schedules
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Schedule Interview
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border">
          <p className="text-sm text-slate-500">Scheduled</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border">
          <p className="text-sm text-slate-500">Completed</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border">
          <p className="text-sm text-slate-500">Rescheduled</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border">
          <p className="text-sm text-slate-500">Cancelled</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border">
        <input
          type="text"
          placeholder="Search interviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 dark:bg-slate-900"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="text-left p-4">Candidate</th>
              <th className="text-left p-4">Round</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Interviewer</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td
                colSpan={6}
                className="text-center p-8 text-slate-500"
              >
                No interviews found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}