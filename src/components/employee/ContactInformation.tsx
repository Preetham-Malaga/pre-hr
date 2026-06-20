import SectionCard from "./SectionCard";

export default function ContactInformation({
  form,
  setForm,
}: any) {
  return (
    <SectionCard title="Contact Information">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div>
          <label className="block mb-2 text-sm font-medium">
            Official Email *
          </label>
          <input
            className="input"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Personal Email
          </label>
          <input
            className="input"
            value={form.personal_email}
            onChange={(e) =>
              setForm({
                ...form,
                personal_email: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Official Phone *
          </label>
          <input
            className="input"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Personal Phone
          </label>
          <input
            className="input"
            value={form.personal_phone}
            onChange={(e) =>
              setForm({
                ...form,
                personal_phone: e.target.value,
              })
            }
          />
        </div>

      </div>

      <div className="mt-5">
        <label className="block mb-2 text-sm font-medium">
          Address
        </label>

        <textarea
          className="input w-full min-h-[120px]"
          value={form.address}
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value,
            })
          }
        />
      </div>
    </SectionCard>
  );
}