import type {
  Candidate,
  CandidateStatus,
} from "../../types/candidate";

interface Props {
  candidates: Candidate[];
}

const STAGES: CandidateStatus[] = [
  "new",
  "screening",
  "interview",
  "offer",
  "hired",
];

export default function CandidatePipeline({
  candidates,
}: Props) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {STAGES.map((status) => {
        const items = candidates.filter(
          (candidate) =>
            candidate.status === status
        );

        return (
          <div
            key={status}
            className="bg-white dark:bg-slate-900 border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium capitalize">
                {status}
              </h3>

              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {items.length}
              </span>
            </div>

            <div className="space-y-2">
              {items.map((candidate) => (
                <div
                  key={candidate.id}
                  className="border rounded-lg p-3"
                >
                  <p className="font-medium text-sm">
                    {candidate.first_name}{" "}
                    {candidate.last_name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {candidate.current_designation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}