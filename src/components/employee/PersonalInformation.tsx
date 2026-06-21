import SectionCard from "./SectionCard";

interface Props {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function PersonalInformation({
  form,
  setForm,
}: Props) {
  return (
    <SectionCard title="Personal Information">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div>
          <label className="block mb-2 text-sm font-medium">
            First Name *
          </label>
          <input
            className="input"
            value={form.first_name}
            onChange={(e) =>
              setForm({ ...form, first_name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Middle Name
          </label>
          <input
            className="input"
            value={form.middle_name}
            onChange={(e) =>
              setForm({ ...form, middle_name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Last Name *
          </label>
          <input
            className="input"
            value={form.last_name}
            onChange={(e) =>
              setForm({ ...form, last_name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Date Of Birth
          </label>
       <input
  type="date"
  max={new Date().toISOString().split("T")[0]}
  className="input border border-slate-300 rounded-xl px-3 py-2 w-full"
  value={form.date_of_birth}
  onChange={(e) =>
    setForm({
      ...form,
      date_of_birth: e.target.value,
    })
  }
/>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Gender
          </label>
          <select
            className="input"
            value={form.gender}
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value })
            }
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Marital Status
          </label>
          <select
            className="input"
            value={form.marital_status}
            onChange={(e) =>
              setForm({ ...form, marital_status: e.target.value })
            }
          >
            <option value="">Select</option>
            <option>Single</option>
            <option>Married</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Blood Group
          </label>
          <input
            className="input"
            value={form.blood_group}
            onChange={(e) =>
              setForm({ ...form, blood_group: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Nationality
          </label>
          <input
            className="input"
            value={form.nationality}
            onChange={(e) =>
              setForm({ ...form, nationality: e.target.value })
            }
          />
        </div>

      </div>
    </SectionCard>
  );
}