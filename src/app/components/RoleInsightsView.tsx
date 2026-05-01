import type {
  PrimaryRoleInsight,
  SecondaryRoleInsight,
} from "../dataService";
import { LAYER_DISPLAY_LABELS } from "../dataService";

interface Props {
  primaryInsights: PrimaryRoleInsight[];
  secondaryInsights: SecondaryRoleInsight[];
}

function ChipGroup({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <span className="text-xs text-slate-500 dark:text-slate-400">ثبت نشده</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          {LAYER_DISPLAY_LABELS[item] ?? item}
        </span>
      ))}
    </div>
  );
}

function SecondaryOrientationBadge({ value }: { value: SecondaryRoleInsight["orientation"] }) {
  const styles =
    value === "partnership-heavy"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
      : value === "competition-heavy"
        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
        : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";

  const label =
    value === "partnership-heavy"
      ? "Partnership-heavy"
      : value === "competition-heavy"
        ? "Competition-heavy"
        : "Hybrid";

  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>{label}</span>;
}

export function RoleInsightsView({ primaryInsights, secondaryInsights }: Props) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Primary Role Insights</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            جمع‌بندی مدیریتی از نقش‌های اصلی و الگوهای غالب همکاری، رقابت و تبادل.
          </p>
        </div>

        <div className="space-y-4">
          {primaryInsights.map((item) => (
            <article key={item.role} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{item.role}</h4>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.brandCount} برند</div>
                </div>
                <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Co-Op {item.averageCoOpAvg} / Comp {item.averageCompAvg}
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Common Exchange Types</div>
                  <ChipGroup items={item.commonExchangeTypes} />
                </div>
                <div>
                  <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Common Strengths</div>
                  <ChipGroup items={item.commonStrengths} />
                </div>
                <div>
                  <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Common Weaknesses</div>
                  <ChipGroup items={item.commonWeaknesses} />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200">
                {item.recommendedMove}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Secondary Role Insights</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            تفکیک نقش‌های ثانویه چندمقداری و شناسایی هلدینگ‌های غالب و جهت‌گیری هر نقش.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr className="text-right text-xs text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Count</th>
                <th className="px-4 py-3 font-medium">Dominant Holdings</th>
                <th className="px-4 py-3 font-medium">Orientation</th>
              </tr>
            </thead>
            <tbody>
              {secondaryInsights.map((item) => (
                <tr key={item.role} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{item.role}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {item.brandCount}
                    <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Co-Op {item.averageCoOpAvg} / Comp {item.averageCompAvg}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ChipGroup items={item.dominantHoldings} />
                  </td>
                  <td className="px-4 py-3">
                    <SecondaryOrientationBadge value={item.orientation} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
