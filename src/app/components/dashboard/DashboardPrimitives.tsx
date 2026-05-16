import { Search } from "lucide-react";

import { EMPTY_FILTER_VALUE } from "../../dataService";

export function SectionCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
      <div className="flex flex-col gap-4 border-b border-slate-200/70 px-6 py-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{value}</div>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{hint}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
      {children}
    </label>
  );
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <FilterField label={label}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-900"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === EMPTY_FILTER_VALUE ? "همه" : option}
          </option>
        ))}
      </select>
    </FilterField>
  );
}

export function RangeFilterField({
  label,
  range,
  onChange,
}: {
  label: string;
  range: { min: number; max: number };
  onChange: (next: { min: number; max: number }) => void;
}) {
  return (
    <FilterField label={`${label}: ${range.min} تا ${range.max}`}>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex gap-3">
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={range.min}
            onChange={(event) =>
              onChange({
                min: Math.min(Number(event.target.value), range.max),
                max: range.max,
              })
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={range.max}
            onChange={(event) =>
              onChange({
                min: range.min,
                max: Math.max(Number(event.target.value), range.min),
              })
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
      </div>
    </FilterField>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-6 text-center dark:border-slate-700 dark:bg-slate-950/40">
      <div className="mb-4 rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-900">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
