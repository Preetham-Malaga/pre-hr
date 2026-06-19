import { useState } from "react";

import {
  useCandidates,
  useCreateCandidate,
  useDeleteCandidate,
} from "../hooks/useCandidates";

import type {
  Candidate,
  CandidateFormData,
} from "../types/candidate";

import CandidateForm from "../components/candidates/CandidateForm";
import CandidatePipeline from "../components/candidates/CandidatePipeline";
import CandidateDetailsDrawer from "../components/candidates/CandidateDetailsDrawer";
import CandidateStatusBadge from "../components/candidates/CandidateStatusBadge";

export default function CandidatesPage() {
 const {
  data,
  isLoading,
} = useCandidates({
  search: "",
  status: "",
  job_id: "",
  page: 1,
  pageSize: 10,
});

const candidates: Candidate[] =
  data?.data ?? [];
   useCandidates({
  search: "",
  status: "",
  job_id: "",
  page: 1,
  pageSize: 10,
})

  const createCandidate =
    useCreateCandidate();

  const deleteCandidate =
    useDeleteCandidate();

  const [search, setSearch] = useState("");

  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const filteredCandidates =
    candidates.filter((candidate) => {
      const fullName =
        `${candidate.first_name} ${candidate.last_name}`.toLowerCase();

      return fullName.includes(
        search.toLowerCase()
      );
    });

  const handleCreate = (
    data: CandidateFormData
  ) => {
    createCandidate.mutate(data);
  };

  const openDetails = (
    candidate: Candidate
  ) => {
    setSelectedCandidate(candidate);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Candidates
        </h1>
      </div>

      {/* Add Candidate */}

      <div className="bg-white dark:bg-slate-900 rounded-xl border p-6">
        <h2 className="font-semibold mb-4">
          Add Candidate
        </h2>

        <CandidateForm
          onSubmit={handleCreate}
          loading={createCandidate.isPending}
        />
      </div>

      {/* Search */}

      <div className="bg-white dark:bg-slate-900 rounded-xl border p-4">
        <input
          type="text"
          placeholder="Search Candidate..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Pipeline */}

      <div className="bg-white dark:bg-slate-900 rounded-xl border p-6">
        <h2 className="font-semibold mb-4">
          Candidate Pipeline
        </h2>

        <CandidatePipeline
          candidates={filteredCandidates}
        />
      </div>

      {/* Table */}

      <div className="bg-white dark:bg-slate-900 rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">
                Name
              </th>

              <th className="text-left p-3">
                Email
              </th>

              <th className="text-left p-3">
                Status
              </th>

              <th className="text-left p-3">
                Experience
              </th>

              <th className="text-left p-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredCandidates.length ===
              0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center"
                >
                  No Candidates Found
                </td>
              </tr>
            ) : (
              filteredCandidates.map(
                (candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-b"
                  >
                    <td className="p-3">
                      {candidate.first_name}{" "}
                      {candidate.last_name}
                    </td>

                    <td className="p-3">
                      {candidate.email}
                    </td>

                    <td className="p-3">
                      <CandidateStatusBadge
                        status={
                          candidate.status
                        }
                      />
                    </td>

                    <td className="p-3">
                      {
                        candidate.experience_years
                      }{" "}
                      Years
                    </td>

                    <td className="p-3 space-x-2">
                      <button
                        onClick={() =>
                          openDetails(
                            candidate
                          )
                        }
                        className="px-3 py-1 rounded bg-blue-600 text-white"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          deleteCandidate.mutate(
                            candidate.id
                          )
                        }
                        className="px-3 py-1 rounded bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      <CandidateDetailsDrawer
        candidate={selectedCandidate}
        open={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
      />
    </div>
  );
}