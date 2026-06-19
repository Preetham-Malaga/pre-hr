import type { CandidateStatus } from "../../types/candidate";
interface Props {
  status: CandidateStatus;
}

const COLORS: Record<CandidateStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  screening: "bg-yellow-100 text-yellow-700",
  interview: "bg-purple-100 text-purple-700",
  offer: "bg-orange-100 text-orange-700",
  hired: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-700",
};

export default function CandidateStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${COLORS[status]}`}
    >
      {status}
    </span>
  );
}