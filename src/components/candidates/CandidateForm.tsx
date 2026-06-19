import { useState } from "react";
import type { CandidateFormData } from "../../types/candidate";

interface Props {
  initialData?: Partial<CandidateFormData>;
  onSubmit: (data: CandidateFormData) => void;
  loading?: boolean;
}

export default function CandidateForm({
  initialData,
  onSubmit,
  loading = false,
}: Props) {
  const [form, setForm] = useState<CandidateFormData>({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    job_id: initialData?.job_id || "",
    status: initialData?.status || "new",
    source: initialData?.source || "",
    experience_years:
      initialData?.experience_years || 0,
    current_company:
      initialData?.current_company || "",
    current_designation:
      initialData?.current_designation || "",
    expected_salary:
      initialData?.expected_salary || "",
    notice_period_days:
      initialData?.notice_period_days || 0,
    linkedin_url:
      initialData?.linkedin_url || "",
    portfolio_url:
      initialData?.portfolio_url || "",
    notes: initialData?.notes || "",
    rating: initialData?.rating || null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="border rounded-lg p-2"
          required
        />

        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="border rounded-lg p-2"
          required
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded-lg p-2"
          required
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border rounded-lg p-2"
        />

        <input
          name="current_company"
          value={form.current_company}
          onChange={handleChange}
          placeholder="Current Company"
          className="border rounded-lg p-2"
        />

        <input
          name="current_designation"
          value={form.current_designation}
          onChange={handleChange}
          placeholder="Designation"
          className="border rounded-lg p-2"
        />

        <input
          type="number"
          name="experience_years"
          value={form.experience_years}
          onChange={handleChange}
          placeholder="Experience"
          className="border rounded-lg p-2"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border rounded-lg p-2"
        >
          <option value="new">New</option>
          <option value="screening">
            Screening
          </option>
          <option value="interview">
            Interview
          </option>
          <option value="offer">
            Offer
          </option>
          <option value="hired">
            Hired
          </option>
          <option value="rejected">
            Rejected
          </option>
          <option value="withdrawn">
            Withdrawn
          </option>
        </select>
      </div>

      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        rows={4}
        placeholder="Notes"
        className="border rounded-lg p-2 w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white"
      >
        {loading ? "Saving..." : "Save Candidate"}
      </button>
    </form>
  );
}