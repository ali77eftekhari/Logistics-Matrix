import { useMemo, useState } from "react";

import {
  formatValueChainLayer,
  getCanonicalValueChainLayers,
  sortByCanonicalLayerOrder,
  type NormalizedEntity,
} from "../dataService";

interface Props {
  entities: NormalizedEntity[];
}

function ToneChips({
  items,
  tone,
  canonicalOrder = false,
}: {
  items: string[];
  tone: "emerald" | "rose" | "amber" | "slate";
  canonicalOrder?: boolean;
}) {
  const visibleItems = canonicalOrder ? sortByCanonicalLayerOrder(items) : items;
  const classes =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
      : tone === "rose"
        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
        : tone === "amber"
          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  if (items.length === 0) {
    return <span className="text-xs text-slate-500 dark:text-slate-400">ثبت نشده</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {visibleItems.map((item) => (
        <span key={item} className={`rounded-full px-3 py-1 text-xs font-medium ${classes}`}>
          {formatValueChainLayer(item)}
        </span>
      ))}
    </div>
  );
}

function MiniHeatmap({ entity }: { entity: NormalizedEntity }) {
  const visible = getCanonicalValueChainLayers()
    .filter((layer) => entity.layerStates[layer])
    .slice(0, 8);

  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
      {visible.map((layer) => {
        const state = entity.layerStates[layer];
        const classes = state?.present
          ? state.weak
            ? "bg-amber-100 border-amber-300 dark:bg-amber-950/40 dark:border-amber-900"
            : "bg-emerald-100 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900"
          : "bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700";

        return <div key={layer} title={formatValueChainLayer(layer)} className={`h-9 rounded-xl border ${classes}`} />;
      })}
    </div>
  );
}

export function CompanyProfileView({ entities }: Props) {
  const [query, setQuery] = useState("");

  const visibleEntities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return entities
      .filter((entity) =>
        !normalizedQuery
          ? true
          : [entity.brandName, entity.parentFirm, entity.industry].join(" ").toLowerCase().includes(normalizedQuery),
      )
      .sort((a, b) => b.strategicRelevanceScore - a.strategicRelevanceScore)
      .slice(0, 12);
  }, [entities, query]);

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Company Strength & Weakness Profile</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              مرور سریع جایگاه شرکت‌ها در زنجیره ارزش به‌همراه تفسیر استراتژیک پیشنهادی.
            </p>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جست‌وجوی شرکت"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm lg:max-w-xs dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {visibleEntities.map((entity) => (
          <article key={entity.id} className="rounded-[24px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{entity.brandName}</h4>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {entity.parentFirm} • {entity.industry}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Strategic: {entity.strategicRelevanceScore}
              </div>
            </div>

            <div className="mt-4">
              <MiniHeatmap entity={entity} />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Strengths</div>
                <div className="mt-2">
                  <ToneChips items={entity.strengthLayers} tone="emerald" canonicalOrder />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Weaknesses</div>
                <div className="mt-2">
                  <ToneChips items={entity.weaknessLayers} tone="rose" canonicalOrder />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Primary / Secondary Role</div>
                <div className="mt-2 text-sm text-slate-900 dark:text-slate-100">{entity.primaryRole}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{entity.secondaryRole || "بدون نقش ثانویه"}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Exchange Type</div>
                <div className="mt-2">
                  <ToneChips items={entity.exchangeTypes} tone="slate" />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Actual Partnerships</div>
                <div className="mt-2">
                  <ToneChips items={entity.actualPartnerships} tone="slate" />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Potential Partnerships</div>
                <div className="mt-2">
                  <ToneChips items={entity.potentialPartnerships} tone="amber" />
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
              {entity.recommendedMove}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
