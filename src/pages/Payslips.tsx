import {
  usePayslips,
  useGeneratePayslip,
} from "../hooks/usePayslips";

import { usePayroll } from "../hooks/usePayroll";

export default function Payslips() {
  const { data: payrolls = [] } =
    usePayroll();

  const { data: payslips = [] } =
    usePayslips();

  const generatePayslip =
    useGeneratePayslip();

  const handleGenerate =
    async (
      payroll: any
    ) => {
      try {
        await generatePayslip.mutateAsync(
          {
            payroll_id:
              payroll.id,

            employee_id:
              payroll.employee_id,

            employee_name:
              payroll.employee_name,

            payroll_month:
              payroll.payroll_month,

            basic_salary:
              payroll.basic_salary,

            allowances:
              payroll.allowances,

            deductions:
              payroll.deductions,

            net_salary:
              payroll.net_salary,

            status:
              "Generated",
          }
        );

        alert(
          "Payslip Generated"
        );
      } catch (error) {
        console.error(
          error
        );
      }
    };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Payslips
      </h1>

      {/* Payroll Records */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-4">
          Generate Payslip
        </h2>

        <table className="w-full">

          <thead>
            <tr className="border-b">

              <th className="p-3 text-left">
                Employee
              </th>

              <th className="p-3 text-left">
                Month
              </th>

              <th className="p-3 text-left">
                Net Salary
              </th>

              <th className="p-3 text-left">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {payrolls.map(
              (
                payroll: any
              ) => (
                <tr
                  key={
                    payroll.id
                  }
                  className="border-b"
                >
                  <td className="p-3">
                    {
                      payroll.employee_name
                    }
                  </td>

                  <td className="p-3">
                    {
                      payroll.payroll_month
                    }
                  </td>

                  <td className="p-3">
                    {
                      payroll.net_salary
                    }
                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        handleGenerate(
                          payroll
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Generate
                    </button>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* Generated Payslips */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-4">
          Generated Payslips
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-3 text-left">
                Employee
              </th>

              <th className="p-3 text-left">
                Month
              </th>

              <th className="p-3 text-left">
                Net Salary
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {payslips.length ===
            0 ? (
              <tr>

                <td
                  colSpan={4}
                  className="text-center p-6"
                >
                  No Payslips Found
                </td>

              </tr>
            ) : (
              payslips.map(
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