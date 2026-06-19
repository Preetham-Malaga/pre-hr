interface Props {
  totalEmployees: number;
  totalSalaryStructures: number;
  totalPayrollRuns: number;
  totalPayslips: number;
}

export default function PayrollDashboardCards({
  totalEmployees,
  totalSalaryStructures,
  totalPayrollRuns,
  totalPayslips,
}: Props) {
  const cards = [
    {
      title: "Employees",
      value: totalEmployees,
    },
    {
      title: "Salary Structures",
      value: totalSalaryStructures,
    },
    {
      title: "Payroll Runs",
      value: totalPayrollRuns,
    },
    {
      title: "Payslips",
      value: totalPayslips,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white dark:bg-slate-800 border rounded-xl p-5 shadow-sm"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {card.title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}