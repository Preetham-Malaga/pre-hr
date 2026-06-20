import { useState } from "react";
import SectionCard from "./SectionCard";

export default function DocumentUpload() {
  const documents = [
    "Resume",
    "Aadhaar Card",
    "PAN Card",
    "Offer Letter",
    "Education Certificates",
    "Experience Letter",
    "Bank Passbook",
    "Passport",
  ];

  const [files, setFiles] = useState<Record<string, File | null>>({});

  const handleFileChange = (
    documentType: string,
    file: File | null
  ) => {
    setFiles((prev) => ({
      ...prev,
      [documentType]: file,
    }));
  };

  return (
    <SectionCard title="Documents">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {documents.map((doc) => (
          <div
            key={doc}
            className="border border-slate-200 rounded-xl p-4 bg-white"
          >
            <label className="block text-sm font-semibold mb-3">
              {doc}
            </label>

            <input
              type="file"
              className="w-full text-sm"
              onChange={(e) =>
                handleFileChange(
                  doc,
                  e.target.files?.[0] || null
                )
              }
            />

            {files[doc] && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-green-600 truncate">
                  {files[doc]?.name}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      URL.createObjectURL(files[doc]!),
                      "_blank"
                    )
                  }
                  className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded-lg"
                >
                  View File
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}