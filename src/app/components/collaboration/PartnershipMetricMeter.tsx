import { PARTNERSHIP_METRIC_MAX } from "../../data/partnershipModels";

export function PartnershipMetricMeter({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const width = `${Math.round((value / PARTNERSHIP_METRIC_MAX) * 100)}%`;

  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)_38px] items-center gap-3 sm:grid-cols-[110px_minmax(0,1fr)_44px]">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
        <div className="h-full rounded-full" style={{ width, backgroundColor: color }} />
      </div>
      <span className="text-left text-xs font-medium text-slate-500 dark:text-slate-400">
        {value}/{PARTNERSHIP_METRIC_MAX}
      </span>
    </div>
  );
}
