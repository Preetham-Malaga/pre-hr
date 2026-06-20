interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionCard({
  title,
  children,
}: SectionCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 border-b pb-3">
        {title}
      </h2>

      {children}
    </div>
  );
}