import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  useHolidays,
  useAddHoliday,
  useUpdateHoliday,
  useDeleteHoliday,
} from "../hooks/useHolidays";

import type {
  Holiday,
  HolidayFormData,
} from "../types/holiday";

const PAGE_SIZE = 10;

const initialForm: HolidayFormData = {
  holiday_name: "",
  holiday_date: "",
  holiday_type: "Public Holiday",
  description: "",
};

export default function Holidays() {
  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [open, setOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<Holiday | null>(
      null
    );

  const [form, setForm] =
    useState(initialForm);

  const {
    data,
    isLoading,
    error,
  } = useHolidays(search);

  const addHoliday =
    useAddHoliday();

  const updateHoliday =
    useUpdateHoliday();

  const deleteHoliday =
    useDeleteHoliday();

  const holidays =
    data ?? [];

  const totalPages =
    Math.ceil(
      holidays.length /
        PAGE_SIZE
    ) || 1;

  const paginated =
    useMemo(() => {
      const start =
        (page - 1) *
        PAGE_SIZE;

      return holidays.slice(
        start,
        start + PAGE_SIZE
      );
    }, [holidays, page]);

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
          await updateHoliday.mutateAsync(
            {
              id: editing.id,
              values: form,
            }
          );

          toast.success(
            "Holiday updated"
          );
        } else {
          await addHoliday.mutateAsync(
            form
          );

          toast.success(
            "Holiday created"
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
          "Delete holiday?"
        )
      )
        return;

      try {
        await deleteHoliday.mutateAsync(
          id
        );

        toast.success(
          "Holiday deleted"
        );
      } catch (err: any) {
        toast.error(
          err.message
        );
      }
    };

  if (isLoading) {
    return (
      <div className="p-6">
        Loading holidays...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load
        holidays
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Holiday Management
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
          Add Holiday
        </button>
      </div>

      <input
        placeholder="Search Holiday..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="w-full md:w-80 border rounded-lg px-3 py-2"
      />

      {holidays.length ===
      0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-10 text-center">
          No Holidays Found
        </div>
      ) : (
        <div className="overflow-auto bg-white dark:bg-slate-800 rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">
                  Name
                </th>

                <th className="p-3 text-left">
                  Date
                </th>

                <th className="p-3 text-left">
                  Type
                </th>

                <th className="p-3 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.map(
                (
                  holiday
                ) => (
                  <tr
                    key={
                      holiday.id
                    }
                    className="border-b"
                  >
                    <td className="p-3">
                      {
                        holiday.holiday_name
                      }
                    </td>

                    <td className="p-3">
                      {
                        holiday.holiday_date
                      }
                    </td>

                    <td className="p-3">
                      {
                        holiday.holiday_type
                      }
                    </td>

                    <td className="p-3 space-x-3">
                      <button
                        onClick={() => {
                          setEditing(
                            holiday
                          );

                          setForm(
                            {
                              holiday_name:
                                holiday.holiday_name,
                              holiday_date:
                                holiday.holiday_date,
                              holiday_type:
                                holiday.holiday_type,
                              description:
                                holiday.description ??
                                "",
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
                            holiday.id
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

      <div className="flex justify-end gap-2">
        <button
          disabled={
            page === 1
          }
          onClick={() =>
            setPage(
              (
                p
              ) =>
                p - 1
            )
          }
        >
          Prev
        </button>

        <span>
          {page} /{" "}
          {
            totalPages
          }
        </span>

        <button
          disabled={
            page ===
            totalPages
          }
          onClick={() =>
            setPage(
              (
                p
              ) =>
                p + 1
            )
          }
        >
          Next
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={
              handleSubmit
            }
            className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-lg space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editing
                ? "Edit Holiday"
                : "Add Holiday"}
            </h2>

            <input
              placeholder="Holiday Name"
              value={
                form.holiday_name
              }
              onChange={(
                e
              ) =>
                setForm(
                  {
                    ...form,
                    holiday_name:
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
              type="date"
              value={
                form.holiday_date
              }
              onChange={(
                e
              ) =>
                setForm(
                  {
                    ...form,
                    holiday_date:
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
              placeholder="Holiday Type"
              value={
                form.holiday_type
              }
              onChange={(
                e
              ) =>
                setForm(
                  {
                    ...form,
                    holiday_type:
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