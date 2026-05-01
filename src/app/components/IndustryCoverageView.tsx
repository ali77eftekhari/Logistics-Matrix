import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { IndustryCoverageInsight } from "../dataService";

interface Props {
  insights: IndustryCoverageInsight[];
}

const STATUS_STYLES: Record<IndustryCoverageInsight["status"], { label: string; tone: string; fill: string }> = {
  current: {
    label: "همکاری فعلی",
    tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    fill: "#16a34a",
  },
  "potential-only": {
    label: "فقط بالقوه",
    tone: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    fill: "#d97706",
  },
  "no-presence": {
    label: "بدون حضور",
    tone: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    fill: "#94a3b8",
  },
};

const TooltipContent = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as IndustryCoverageInsight;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="font-semibold text-slate-900 dark:text-slate-100">{item.industry}</div>
      <div className="mt-2 text-slate-600 dark:text-slate-300">همکاری فعلی: {item.actualMatches}</div>
      <div className="text-slate-600 dark:text-slate-300">همکاری بالقوه: {item.potentialMatches}</div>
    </div>
  );
};

export function IndustryCoverageView({ insights }: Props) {
  const chartData = insights.slice(0, 10);
  const gapList = insights.filter((item) => item.status !== "current").slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Heatmap پوشش صنعت</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                رنگ هر صنعت بر اساس وضعیت همکاری فاخر با آن صنعت تعیین شده است.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {insights.map((item) => {
              const style = STATUS_STYLES[item.status];
              return (
                <div key={item.industry} className={`rounded-2xl border border-slate-200 p-4 dark:border-slate-800 ${style.tone}`}>
                  <div className="text-sm font-semibold">{item.industry}</div>
                  <div className="mt-2 text-xs">فعلی: {item.actualMatches}</div>
                  <div className="mt-1 text-xs">بالفعل/بالقوه: {item.potentialMatches}</div>
                  <div className="mt-3 text-[11px] font-medium">{style.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Gap List</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            صنایعی که هنوز همکاری فعلی در آن‌ها ضعیف است یا فقط در لایه بالقوه دیده می‌شوند.
          </p>
          <div className="mt-4 space-y-3">
            {gapList.map((item) => (
              <div key={item.industry} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-slate-900 dark:text-slate-100">{item.industry}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[item.status].tone}`}>
                    {STATUS_STYLES[item.status].label}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  برندهای پیشنهادی: {item.topPotentialBrands.join("، ") || "ثبت نشده"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Industry Bar Chart</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          مقایسه تعداد فرصت‌های فعلی و بالقوه برای صنایع با بیشترین سیگنال.
        </p>
        <div className="mt-4 h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 16, bottom: 10, left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="industry" width={110} tick={{ fontSize: 12 }} />
              <Tooltip content={<TooltipContent />} />
              <Bar dataKey="actualMatches" name="فعلی" radius={[0, 6, 6, 0]} fill="#16a34a" />
              <Bar dataKey="potentialMatches" name="بالقوه" radius={[0, 6, 6, 0]} fill="#d97706">
                {chartData.map((entry) => (
                  <Cell key={entry.industry} fill={STATUS_STYLES[entry.status].fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
