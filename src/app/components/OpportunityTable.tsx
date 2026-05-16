import { useMemo } from "react";
import { AlertTriangle, ArrowUpRight, RefreshCcw, Zap } from "lucide-react";

import { CompanyData } from "../dataService";

interface Props {
  data: CompanyData[];
}

interface OpportunityCategoryCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  items: CompanyData[];
}

function OpportunityCategoryCard({
  title,
  icon: Icon,
  colorClass,
  items,
}: OpportunityCategoryCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={`flex items-center gap-2 border-b border-slate-100 p-4 font-bold dark:border-slate-800 ${colorClass}`}>
        <Icon className="h-5 w-5" />
        {title}
      </div>
      <div className="p-0">
        {items.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">موردی یافت نشد</div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <li key={item.id} className="p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="mb-1 flex items-start justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{item.brand}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    استراتژیک: {item.strategicImportance}
                  </span>
                </div>
                <div className="mb-2 truncate text-sm text-slate-500 dark:text-slate-400">{item.category}</div>
                <div className="rounded border border-slate-100 bg-slate-50 p-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                  <span className="font-medium">اقدام: </span>
                  {item.suggestedMove || "بررسی مدل همکاری"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function OpportunityTable({ data }: Props) {
  const topPartners = useMemo(
    () =>
      data
        .filter((item) => item.cooperationScore >= 6 && item.competitionScore < 5)
        .sort((a, b) => b.strategicImportance - a.strategicImportance)
        .slice(0, 5),
    [data],
  );
  const highRisk = useMemo(
    () =>
      data
        .filter((item) => item.cooperationScore < 5 && item.competitionScore >= 6)
        .sort((a, b) => b.strategicImportance - a.strategicImportance)
        .slice(0, 5),
    [data],
  );
  const coopetitors = useMemo(
    () =>
      data
        .filter(
          (item) =>
            item.cooperationScore >= 5 &&
            item.competitionScore >= 5 &&
            item.relationshipType.includes("Coopetitor"),
        )
        .sort((a, b) => b.strategicImportance - a.strategicImportance)
        .slice(0, 5),
    [data],
  );
  const quickWins = useMemo(
    () =>
      data
        .filter(
          (item) =>
            item.relationshipType === "Opportunity" ||
            (item.strategicImportance >= 4 && item.cooperationScore < 4 && item.competitionScore < 4),
        )
        .sort((a, b) => b.strategicImportance - a.strategicImportance)
        .slice(0, 5),
    [data],
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <OpportunityCategoryCard
        title="شرکای کلیدی (Top Partners)"
        icon={ArrowUpRight}
        colorClass="text-emerald-600 dark:text-emerald-400"
        items={topPartners}
      />
      <OpportunityCategoryCard
        title="رقبای پرخطر (High-Risk)"
        icon={AlertTriangle}
        colorClass="text-rose-600 dark:text-rose-400"
        items={highRisk}
      />
      <OpportunityCategoryCard
        title="شریک-رقیب (Coopetitors)"
        icon={RefreshCcw}
        colorClass="text-amber-600 dark:text-amber-400"
        items={coopetitors}
      />
      <OpportunityCategoryCard
        title="بردهای سریع (Quick Wins)"
        icon={Zap}
        colorClass="text-purple-600 dark:text-purple-400"
        items={quickWins}
      />
    </div>
  );
}
