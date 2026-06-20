import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import PersonalInformation from "../components/employee/PersonalInformation";
import ContactInformation from "../components/employee/ContactInformation";
import EmploymentInformation from "../components/employee/EmploymentInformation";
import DocumentUpload from "../components/employee/DocumentUpload";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState("");
  const [nextEmployeeId, setNextEmployeeId] = useState("EMP-001");

  const [form, setForm] = useState({
    employee_id: nextEmployeeId,
    first_name: "",
    middle_name: "",
    last_name: "",

    email: "",
    personal_email: "",

    phone: "",
    personal_phone: "",

    gender: "",
    date_of_birth: "",
    marital_status: "",

    blood_group: "",
    nationality: "",

    address: "",

    joining_date: "",
    department: "",
    designation: "",

    employment_type: "",
    work_location: "",
    work_type: "",

    confirmation_date: "",

    employee_status: "Active",
  });
  const loadNextEmployeeId = async () => {
  const { data } = await supabase
    .from("employees")
    .select("employee_id")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (data?.employee_id) {
    const lastNumber = parseInt(
      data.employee_id.replace("EMP-", "")
    );

    setNextEmployeeId(
      `EMP-${String(lastNumber + 1).padStart(3, "0")}`
    );
  } else {
    setNextEmployeeId("EMP-001");
  }
};

useEffect(() => {
  loadNextEmployeeId();
}, []);

  const handleSave = async () => {
  try {
    if (!form.first_name) {
      alert("First Name is required");
      return;
    }

    if (!form.last_name) {
      alert("Last Name is required");
      return;
    }

    if (!form.email) {
      alert("Official Email is required");
      return;
    }

    if (!form.phone) {
      alert("Official Phone is required");
      return;
    }

    if (!form.department) {
      alert("Department is required");
      return;
    }

    if (!form.designation) {
      alert("Designation is required");
      return;
    }

    const { data, error } = await supabase
      .from("employees")
      .insert([
        {
          

          first_name: form.first_name,
          middle_name: form.middle_name,
          last_name: form.last_name,

          email: form.email,
          personal_email: form.personal_email || null,

          phone: form.phone,
          personal_phone: form.personal_phone || null,

          gender: form.gender || null,
          date_of_birth: form.date_of_birth || null,
          marital_status: form.marital_status || null,

          blood_group: form.blood_group || null,
          nationality: form.nationality || null,

          address: form.address || null,

          joining_date: form.joining_date || null,

          department: form.department,
          designation: form.designation,

          employment_type: form.employment_type || null,
          work_location: form.work_location || null,
          work_type: form.work_type || null,

          confirmation_date: form.confirmation_date || null,

          employee_status: form.employee_status,

          employment_status: "active",
          status: "Active",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    console.log("Employee Saved:", data);

    window.location.href = "/employees";

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};

  return (
    <div className="p-6 w-full space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            Add Employee
          </h2>

          <p className="text-slate-500 mt-2">
            Create employee profile
          </p>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#eaedfe] flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Employee Profile Photo
              </h3>

              <p className="text-slate-500 text-sm">
                Upload employee profile picture
              </p>
            </div>
          </div>

          <label className="px-4 py-2 bg-[#363b6c] text-white rounded-xl cursor-pointer">
            Upload Photo

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setProfileImage(
                    URL.createObjectURL(file)
                  );
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Sections */}
      <PersonalInformation
        form={form}
        setForm={setForm}
      />

      <ContactInformation
        form={form}
        setForm={setForm}
      />

      <EmploymentInformation
        form={form}
        setForm={setForm}
      />

      <DocumentUpload />

      {/* Footer */}
      <div className="flex justify-end gap-3 pb-10">
        <button
          onClick={() => navigate("/employees")}
          className="px-6 py-3 rounded-xl border border-slate-300 bg-white"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-[#363b6c] text-white"
        >
          Save Employee
        </button>
      </div>
    </div>
  );
};