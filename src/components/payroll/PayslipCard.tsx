interface Props {
  employeeId: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
}

export default function PayslipCard({
  employeeId,
  grossSalary,
  deductions,
  netSalary,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-800 border rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4">
        Payslip
      </h3>

      <div className="space-y-2">
        <p>
          <strong>Employee:</strong>{" "}
          {employeeId}
        </p>

        <p>
          <strong>Gross Salary:</strong> ₹
          {grossSalary}
        </p>

        <p>
          <strong>Deductions:</strong> ₹
          {deductions}
        </p>

        <p className="text-green-600 font-semibold">
          <strong>Net Salary:</strong> ₹
          {netSalary}
        </p>
      </div>
    </div>
  );
}