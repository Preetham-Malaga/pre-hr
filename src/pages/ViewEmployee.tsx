import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import PersonalInformation from "../components/employee/PersonalInformation";
import ContactInformation from "../components/employee/ContactInformation";
import EmploymentInformation from "../components/employee/EmploymentInformation";
import DocumentUpload from "../components/employee/DocumentUpload";

export default function ViewEmployee() {
    const { id } = useParams();

    const [employee, setEmployee] = useState<any>(null);
    const [form, setForm] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEmployee();
    }, []);

    const loadEmployee = async () => {
        const { data, error } = await supabase
            .from("employees")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error(error);
        } else {
            setEmployee(data);
            setForm(data);
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <div className="p-6">
                Loading Employee...
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="p-6">
                Employee Not Found
            </div>
        );
    }

    return (
  <div className="p-6 space-y-6">

    <PersonalInformation
      form={form}
      setForm={() => {}}
    />

    <ContactInformation
      form={form}
      setForm={() => {}}
    />

    <EmploymentInformation
      form={form}
      setForm={() => {}}
    />

    <DocumentUpload
      employeeId={employee.id}
    />

  </div>
);
}