import { useLeaveRequests } from "../hooks/useLeaveRequests";

export default function LeaveRequests() {
  const { data, isLoading, error } = useLeaveRequests();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading leave requests
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Leave Requests
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                Employee ID
              </th>
              <th className="p-3 text-left">
                Leave Type
              </th>
              <th className="p-3 text-left">
                From Date
              </th>
              <th className="p-3 text-left">
                To Date
              </th>
              <th className="p-3 text-left">
                Days
              </th>
              <th className="p-3 text-left">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {data?.length ? (
              data.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-t"
                >
                  <td className="p-3">
                    {item.employee_id}
                  </td>

                  <td className="p-3">
                    {item.leave_type_id}
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
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500"
                >
                  No Leave Requests Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}