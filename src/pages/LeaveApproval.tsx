import {
  useLeaveApply,
  useApproveLeave,
  useRejectLeave,
} from "../hooks/useLeaveApply";

export default function LeaveApproval() {
  const { data, isLoading } =
    useLeaveApply();

  const approveMutation =
    useApproveLeave();

  const rejectMutation =
    useRejectLeave();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Leave Approval
      </h1>

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

              <th className="p-3">
                Action
              </th>
            </tr>
          </thead>

          <tbody>

            {data?.map((item: any) => (
              <tr
                key={item.id}
                className="border-t"
              >

                <td className="p-3">
                  {item.employee_name}
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

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() =>
                      approveMutation.mutate(
                        item.id
                      )
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      rejectMutation.mutate(
                        item.id
                      )
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}