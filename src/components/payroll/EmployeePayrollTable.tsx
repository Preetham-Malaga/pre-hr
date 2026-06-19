interface SalaryStructure {
  id: string;
  employee_id: number;
  basic_salary: number;
  hra: number;
  allowances: number;
  deductions: number;
}

interface Props {
  data: SalaryStructure[];
  onDelete: (id: string) => void;
}

export default function EmployeePayrollTable({
  data,
  onDelete,
}: Props) {
  const calculateGross = (item: SalaryStructure) => {
    return (
      Number(item.basic_salary) +
      Number(item.hra) +
      Number(item.allowances)
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Employee ID</th>
            <th className="p-3 text-left">Basic</th>
            <th className="p-3 text-left">HRA</th>
            <th className="p-3 text-left">Allowances</th>
            <th className="p-3 text-left">Deductions</th>
            <th className="p-3 text-left">Gross Salary</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="text-center p-6"
              >
                No Payroll Records Found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">
                  {item.employee_id}
                </td>

                <td className="p-3">
                  ₹{item.basic_salary}
                </td>

                <td className="p-3">
                  ₹{item.hra}
                </td>

                <td className="p-3">
                  ₹{item.allowances}
                </td>

                <td className="p-3">
                  ₹{item.deductions}
                </td>

                <td className="p-3 font-semibold">
                  ₹{calculateGross(item)}
                </td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      onDelete(item.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}