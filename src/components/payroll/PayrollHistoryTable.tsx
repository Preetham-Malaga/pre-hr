interface PayrollRun {
  id: string;
  payroll_month: string;
  status: string;
  created_at: string;
}

interface Props {
  data: PayrollRun[];
}

export default function PayrollHistoryTable({
  data,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-800 border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
              Payroll Month
            </th>

            <th className="p-3 text-left">
              Status
            </th>

            <th className="p-3 text-left">
              Created At
            </th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="text-center p-6"
              >
                No Payroll History Found
              </td>
            </tr>
          ) : (
            data.map((run) => (
              <tr
                key={run.id}
                className="border-b"
              >
                <td className="p-3">
                  {run.payroll_month}
                </td>

                <td className="p-3">
                  {run.status}
                </td>

                <td className="p-3">
                  {new Date(
                    run.created_at
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}