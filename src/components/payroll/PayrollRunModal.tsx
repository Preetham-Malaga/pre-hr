import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onRun: (month: string) => void;
  loading?: boolean;
}

export default function PayrollRunModal({
  open,
  onClose,
  onRun,
  loading = false,
}: Props) {
  const [month, setMonth] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Run Payroll
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">
              Payroll Month
            </label>

            <input
              type="month"
              value={month}
              onChange={(e) =>
                setMonth(e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="border px-4 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              disabled={!month || loading}
              onClick={() => onRun(month)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {loading
                ? "Processing..."
                : "Run Payroll"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}