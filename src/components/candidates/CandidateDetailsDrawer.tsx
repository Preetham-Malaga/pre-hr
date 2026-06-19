import type { Candidate } from "../../types/candidate";

interface Props {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
}

export default function CandidateDetailsDrawer({
  candidate,
  open,
  onClose,
}: Props) {
  if (!open || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            Candidate Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">
              Name
            </label>

            <p>
              {candidate.first_name} {candidate.last_name}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Email
            </label>

            <p>{candidate.email}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Phone
            </label>

            <p>{candidate.phone || "-"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Status
            </label>

            <p>{candidate.status}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Current Company
            </label>

            <p>{candidate.current_company || "-"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Designation
            </label>

            <p>
              {candidate.current_designation || "-"}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Experience
            </label>

            <p>
              {candidate.experience_years} Years
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Notes
            </label>

            <p>{candidate.notes || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}