import SectionCard from "./SectionCard";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function EmploymentInformation({
  form,
  setForm,
}: any) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);

  useEffect(() => {
    loadDepartments();
    loadDesignations();
  }, []);

  const loadDepartments = async () => {
    const { data } = await supabase
      .from("departments")
      .select("*");

    setDepartments(data || []);
  };

  const loadDesignations = async () => {
    const { data } = await supabase
      .from("designations")
      .select("*");

    setDesignations(data || []);
  };

  return (
    <SectionCard title="Employment Information">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div>
          <label className="block mb-2 text-sm font-medium">
            Employee ID
          </label>
      <input
  className="input"
 value={form.employee_id}
  readOnly
/>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">
            Joining Date
          </label>
          <input
            type="date"
            className="input"
            value={form.joining_date}
            onChange={(e) =>
              setForm({
                ...form,
                joining_date: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Department
          </label>

          <select
            className="input"
            value={form.department}
            onChange={(e) =>
              setForm({
                ...form,
                department: e.target.value,
              })
            }
          >
            <option value="">
              Select Department
            </option>

            {departments.map((dept) => (
              <option
                key={dept.id}
                value={dept.department_name}
              >
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Designation
          </label>

          <select
            className="input"
            value={form.designation}
            onChange={(e) =>
              setForm({
                ...form,
                designation: e.target.value,
              })
            }
          >
            <option value="">
              Select Designation
            </option>

            {designations.map((des) => (
              <option
                key={des.id}
                value={des.designation_name}
              >
                {des.designation_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Employment Type
          </label>

          <select
            className="input"
            value={form.employment_type}
            onChange={(e) =>
              setForm({
                ...form,
                employment_type: e.target.value,
              })
            }
          >
            <option value="">Select</option>
            <option>Permanent</option>
            <option>Contract</option>
            <option>Intern</option>
            <option>Consultant</option>
            <option>Part Time</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Work Location
          </label>

          <input
            className="input"
            value={form.work_location}
            onChange={(e) =>
              setForm({
                ...form,
                work_location: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Work Type
          </label>

          <select
            className="input"
            value={form.work_type || ""}
            onChange={(e) =>
              setForm({
                ...form,
                work_type: e.target.value,
              })
            }
          >
            <option value="">Select</option>
            <option>Onsite</option>
            <option>Remote</option>
            <option>Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">
            Confirmation Date
          </label>

          <input
            type="date"
            className="input"
            value={form.confirmation_date}
            onChange={(e) =>
              setForm({
                ...form,
                confirmation_date: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Employee Status
          </label>

          <select
            className="input"
            value={form.employee_status}
            onChange={(e) =>
              setForm({
                ...form,
                employee_status: e.target.value,
              })
            }
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Notice Period</option>
            <option>Resigned</option>
            <option>Terminated</option>
          </select>
        </div>

      </div>
    </SectionCard>
  );
}