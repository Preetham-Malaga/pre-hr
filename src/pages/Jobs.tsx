import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  useJobs,
  useAddJob,
  useUpdateJob,
  useDeleteJob,
} from "../hooks/useJobs";

import type {
  Job,
  JobFormData,
} from "../types/job";

const PAGE_SIZE = 10;

const initialForm: JobFormData = {
  job_title: "",
  department: "",
  location: "",
  employment_type: "Full Time",
  open_positions: 1,
  experience_required: "",
  salary_range: "",
  status: "Open",
  description: "",
};

export default function Jobs() {
  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [open, setOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<Job | null>(null);

  const [form, setForm] =
    useState(initialForm);

  const {
    data,
    isLoading,
    error,
  } = useJobs(search);

  const addJob = useAddJob();
  const updateJob =
    useUpdateJob();
  const deleteJob =
    useDeleteJob();

  const jobs = data ?? [];

  const totalPages =
    Math.ceil(
      jobs.length /
        PAGE_SIZE
    ) || 1;

  const paginated =
    useMemo(() => {
      const start =
        (page - 1) *
        PAGE_SIZE;

      return jobs.slice(
        start,
        start + PAGE_SIZE
      );
    }, [jobs, page]);

  const resetForm = () => {
    setEditing(null);
    setForm(initialForm);
  };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        if (editing) {
          await updateJob.mutateAsync(
            {
              id: editing.id,
              values: form,
            }
          );

          toast.success(
            "Job Updated"
          );
        } else {
          await addJob.mutateAsync(
            form
          );

          toast.success(
            "Job Created"
          );
        }

        resetForm();
        setOpen(false);
      } catch (err: any) {
        toast.error(
          err.message
        );
      }
    };

  const handleDelete =
    async (
      id: string
    ) => {
      if (
        !window.confirm(
          "Delete Job?"
        )
      )
        return;

      try {
        await deleteJob.mutateAsync(
          id
        );

        toast.success(
          "Job Deleted"
        );
      } catch (err: any) {
        toast.error(
          err.message
        );
      }
    };

  if (isLoading)
    return (
      <div className="p-6">
        Loading Jobs...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-red-500">
        Failed to load jobs
      </div>
    );

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Recruitment
        </h1>

        <button
          onClick={() =>
            setOpen(true)
          }
          className="px-4 py-2 rounded-lg text-white"
          style={{
            background:
              "var(--color-primary)",
          }}
        >
          Add Job
        </button>
      </div>

      <input
        placeholder="Search Job..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="w-full md:w-80 border rounded-lg px-3 py-2"
      />

      {jobs.length ===
      0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-10 text-center">
          No Jobs Found
        </div>
      ) : (
        <div className="overflow-auto bg-white dark:bg-slate-800 rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">
                  Job Title
                </th>

                <th className="p-3 text-left">
                  Department
                </th>

                <th className="p-3 text-left">
                  Positions
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

                <th className="p-3 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.map(
                (job) => (
                  <tr
                    key={
                      job.id
                    }
                    className="border-b"
                  >
                    <td className="p-3">
                      {
                        job.job_title
                      }
                    </td>

                    <td className="p-3">
                      {
                        job.department
                      }
                    </td>

                    <td className="p-3">
                      {
                        job.open_positions
                      }
                    </td>

                    <td className="p-3">
                      {
                        job.status
                      }
                    </td>

                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => {
                          setEditing(
                            job
                          );

                          setForm(
                            {
                              ...job,
                            }
                          );

                          setOpen(
                            true
                          );
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="text-red-500"
                        onClick={() =>
                          handleDelete(
                            job.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={
              handleSubmit
            }
            className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-xl space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editing
                ? "Edit Job"
                : "Add Job"}
            </h2>

            <input
              placeholder="Job Title"
              value={
                form.job_title
              }
              onChange={(
                e
              ) =>
                setForm(
                  {
                    ...form,
                    job_title:
                      e
                        .target
                        .value,
                  }
                )
              }
              className="w-full border rounded-lg px-3 py-2"
              required
            />

            <input
              placeholder="Department"
              value={
                form.department
              }
              onChange={(
                e
              ) =>
                setForm(
                  {
                    ...form,
                    department:
                      e
                        .target
                        .value,
                  }
                )
              }
              className="w-full border rounded-lg px-3 py-2"
              required
            />

            <input
              placeholder="Location"
              value={
                form.location
              }
              onChange={(
                e
              ) =>
                setForm(
                  {
                    ...form,
                    location:
                      e
                        .target
                        .value,
                  }
                )
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            <textarea
              placeholder="Description"
              value={
                form.description
              }
              onChange={(
                e
              ) =>
                setForm(
                  {
                    ...form,
                    description:
                      e
                        .target
                        .value,
                  }
                )
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setOpen(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-white"
                style={{
                  background:
                    "var(--color-primary)",
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}