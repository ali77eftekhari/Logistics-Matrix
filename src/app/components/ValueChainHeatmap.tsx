import { useMemo, useState } from "react";
import { AlertTriangle, Building2, Search, X } from "lucide-react";
import { clsx } from "clsx";

import { LAYER_DISPLAY_LABELS, NormalizedEntity } from "../dataService";

interface Props {
  entities: NormalizedEntity[];
  layers: string[];
}

const EMPTY_FILTER = "همه";

function FilterSelect({
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
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function LegendItem({
  swatch,
  label,
  description,
}: {
  swatch: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
      {swatch}
      <div>
        <div className="text-xs font-medium text-slate-800 dark:text-slate-100">{label}</div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400">{description}</div>
      </div>
    </div>
  );
}

function DetailDrawer({
  entity,
  onClose,
}: {
  entity: NormalizedEntity | null;
  onClose: () => void;
}) {
  if (!entity) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/35 backdrop-blur-[2px]" onClick={onClose}>
      <aside
        className="absolute inset-y-0 left-0 w-full max-w-xl overflow-y-auto border-r border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Building2 className="h-3.5 w-3.5" />
              {entity.parentFirm}
            </div>
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">{entity.brandName}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{entity.description || "توضیحی ثبت نشده است."}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="بستن"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoCard label="صنعت" value={entity.industry} />
          <InfoCard label="فعالیت" value={entity.activity} />
          <InfoCard label="نقش اصلی" value={entity.primaryRole} />
          <InfoCard label="نقش ثانویه" value={entity.secondaryRole || "ندارد"} />
          <InfoCard label="نوع مبادله" value={entity.exchangeType || "نامشخص"} />
          <InfoCard label="نوع رابطه" value={entity.relationshipType} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <TagList title="لایه‌های قوت" items={entity.strengthLayers} tone="emerald" />
          <TagList title="لایه‌های ضعف" items={entity.weaknessLayers} tone="rose" />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <TagList title="همکاری‌های فعلی" items={entity.actualPartnerships} tone="slate" />
          <TagList title="همکاری‌های بالقوه" items={entity.potentialPartnerships} tone="amber" />
        </div>
      </aside>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-sm font-medium leading-6 text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  );
}

function TagList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "emerald" | "rose" | "amber" | "slate";
}) {
  const toneClasses =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
      : tone === "rose"
        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
        : tone === "amber"
          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  return (
    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length === 0 ? (
          <span className="text-xs text-slate-500 dark:text-slate-400">موردی ثبت نشده است.</span>
        ) : (
          items.map((item) => (
            <span key={item} className={`rounded-full px-3 py-1 text-xs font-medium ${toneClasses}`}>
              {LAYER_DISPLAY_LABELS[item] ?? item}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function getCellTone(entity: NormalizedEntity, layer: string) {
  const state = entity.layerStates[layer];
  if (!state) {
    return "bg-slate-100 text-slate-300 dark:bg-slate-800/80 dark:text-slate-700 border-slate-200 dark:border-slate-700";
  }

  if (state.present && entity.relationshipType === "Owned") {
    return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900";
  }
  if (state.present && entity.relationshipType === "Coopetitor") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900";
  }
  if (state.present && entity.isFakherRelated) {
    return "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-900";
  }
  if (state.present) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
  }

  return "bg-slate-100 text-slate-300 dark:bg-slate-800/80 dark:text-slate-700 border-slate-200 dark:border-slate-700";
}

export function ValueChainHeatmap({ entities, layers }: Props) {
  const [query, setQuery] = useState("");
  const [holdingFilter, setHoldingFilter] = useState(EMPTY_FILTER);
  const [industryFilter, setIndustryFilter] = useState(EMPTY_FILTER);
  const [primaryRoleFilter, setPrimaryRoleFilter] = useState(EMPTY_FILTER);
  const [secondaryRoleFilter, setSecondaryRoleFilter] = useState(EMPTY_FILTER);
  const [exchangeTypeFilter, setExchangeTypeFilter] = useState(EMPTY_FILTER);
  const [actualPartnershipFilter, setActualPartnershipFilter] = useState(EMPTY_FILTER);
  const [potentialPartnershipFilter, setPotentialPartnershipFilter] = useState(EMPTY_FILTER);
  const [selectedEntity, setSelectedEntity] = useState<NormalizedEntity | null>(null);

  const filterOptions = useMemo(() => {
    const uniqueSorted = (values: string[]) =>
      [EMPTY_FILTER, ...Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "fa"))];

    return {
      holdings: uniqueSorted(entities.map((entity) => entity.parentFirm)),
      industries: uniqueSorted(entities.map((entity) => entity.industry)),
      primaryRoles: uniqueSorted(entities.map((entity) => entity.primaryRole)),
      secondaryRoles: uniqueSorted(entities.flatMap((entity) => entity.secondaryRoles)),
      exchangeTypes: uniqueSorted(entities.flatMap((entity) => entity.exchangeTypes)),
      actualPartnerships: uniqueSorted(entities.flatMap((entity) => entity.actualPartnerships)),
      potentialPartnerships: uniqueSorted(entities.flatMap((entity) => entity.potentialPartnerships)),
    };
  }, [entities]);

  const visibleLayers = useMemo(() => layers.filter(Boolean), [layers]);

  const filteredEntities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return entities.filter((entity) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          entity.brandName,
          entity.parentFirm,
          entity.industry,
          entity.primaryRole,
          entity.secondaryRole,
          entity.exchangeType,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      if (!matchesQuery) return false;
      if (holdingFilter !== EMPTY_FILTER && entity.parentFirm !== holdingFilter) return false;
      if (industryFilter !== EMPTY_FILTER && entity.industry !== industryFilter) return false;
      if (primaryRoleFilter !== EMPTY_FILTER && entity.primaryRole !== primaryRoleFilter) return false;
      if (secondaryRoleFilter !== EMPTY_FILTER && !entity.secondaryRoles.includes(secondaryRoleFilter)) return false;
      if (exchangeTypeFilter !== EMPTY_FILTER && !entity.exchangeTypes.includes(exchangeTypeFilter)) return false;
      if (
        actualPartnershipFilter !== EMPTY_FILTER &&
        !entity.actualPartnerships.includes(actualPartnershipFilter)
      ) {
        return false;
      }
      if (
        potentialPartnershipFilter !== EMPTY_FILTER &&
        !entity.potentialPartnerships.includes(potentialPartnershipFilter)
      ) {
        return false;
      }

      return true;
    });
  }, [
    actualPartnershipFilter,
    entities,
    exchangeTypeFilter,
    holdingFilter,
    industryFilter,
    potentialPartnershipFilter,
    primaryRoleFilter,
    query,
    secondaryRoleFilter,
  ]);

  function resetLocalFilters() {
    setQuery("");
    setHoldingFilter(EMPTY_FILTER);
    setIndustryFilter(EMPTY_FILTER);
    setPrimaryRoleFilter(EMPTY_FILTER);
    setSecondaryRoleFilter(EMPTY_FILTER);
    setExchangeTypeFilter(EMPTY_FILTER);
    setActualPartnershipFilter(EMPTY_FILTER);
    setPotentialPartnershipFilter(EMPTY_FILTER);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))]">
        <label className="relative block">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جست‌وجو در ماتریس"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pr-10 pl-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>
        <FilterSelect label="هلدینگ" value={holdingFilter} options={filterOptions.holdings} onChange={setHoldingFilter} />
        <FilterSelect label="صنعت" value={industryFilter} options={filterOptions.industries} onChange={setIndustryFilter} />
        <FilterSelect
          label="نقش اصلی"
          value={primaryRoleFilter}
          options={filterOptions.primaryRoles}
          onChange={setPrimaryRoleFilter}
        />
        <button
          onClick={resetLocalFilters}
          className="h-11 self-end rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          پاک‌کردن
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FilterSelect
          label="نقش ثانویه"
          value={secondaryRoleFilter}
          options={filterOptions.secondaryRoles}
          onChange={setSecondaryRoleFilter}
        />
        <FilterSelect
          label="نوع مبادله"
          value={exchangeTypeFilter}
          options={filterOptions.exchangeTypes}
          onChange={setExchangeTypeFilter}
        />
        <FilterSelect
          label="همکاری فعلی"
          value={actualPartnershipFilter}
          options={filterOptions.actualPartnerships}
          onChange={setActualPartnershipFilter}
        />
        <FilterSelect
          label="همکاری بالقوه"
          value={potentialPartnershipFilter}
          options={filterOptions.potentialPartnerships}
          onChange={setPotentialPartnershipFilter}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <LegendItem
          swatch={<div className="h-4 w-4 rounded-md border border-emerald-200 bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/50" />}
          label="حضور / قوت"
          description="برند در این لایه حضور مؤثر دارد"
        />
        <LegendItem
          swatch={<div className="h-4 w-4 rounded-md border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />}
          label="بدون حضور"
          description="در داده فعلی سیگنال مشخصی ثبت نشده"
        />
        <LegendItem
          swatch={
            <div className="relative flex h-4 w-4 items-center justify-center rounded-md border border-rose-300 bg-white dark:border-rose-900 dark:bg-slate-900">
              <AlertTriangle className="h-3 w-3 text-rose-500" />
            </div>
          }
          label="ضعف"
          description="این لایه در sheet به‌عنوان ضعف ثبت شده"
        />
        <LegendItem
          swatch={<div className="h-4 w-4 rounded-md border border-blue-200 bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50" />}
          label="داخلی / مرتبط با فخر"
          description="لایه یا برند به اکوسیستم فخر متصل است"
        />
        <LegendItem
          swatch={<div className="h-4 w-4 rounded-md border border-amber-200 bg-amber-100 dark:border-amber-900 dark:bg-amber-950/50" />}
          label="هم‌رقابتی"
          description="حضور در بستری با ماهیت coopetition"
        />
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>{filteredEntities.length} برند در ماتریس نمایش داده می‌شود</span>
          <span>{visibleLayers.length} لایه ارزش</span>
        </div>

        <div className="overflow-auto pb-2">
          <table className="min-w-[1100px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky right-0 top-0 z-30 min-w-[260px] border-b border-l border-slate-200 bg-white px-4 py-4 text-right font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
                  برند / نقش
                </th>
                {visibleLayers.map((layer) => (
                  <th
                    key={layer}
                    className="sticky top-0 z-20 min-w-[92px] border-b border-slate-200 bg-white px-2 py-4 text-center text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  >
                    <span className="inline-block max-w-[84px] leading-5">{LAYER_DISPLAY_LABELS[layer] ?? layer}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEntities.map((entity) => (
                <tr key={entity.id} className="group">
                  <td className="sticky right-0 z-10 border-b border-l border-slate-200 bg-white px-4 py-3 align-top dark:border-slate-800 dark:bg-slate-950">
                    <button
                      onClick={() => setSelectedEntity(entity)}
                      className="w-full text-right"
                    >
                      <div className="font-semibold text-slate-900 transition group-hover:text-slate-700 dark:text-slate-100 dark:group-hover:text-white">
                        {entity.brandName}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{entity.parentFirm}</div>
                    </button>
                  </td>
                  {visibleLayers.map((layer) => {
                    const state = entity.layerStates[layer];
                    const tone = getCellTone(entity, layer);
                    return (
                      <td key={`${entity.id}-${layer}`} className="border-b border-slate-200 px-1.5 py-2 text-center dark:border-slate-800">
                        <button
                          onClick={() => setSelectedEntity(entity)}
                          className={clsx(
                            "relative flex h-12 w-full min-w-[72px] items-center justify-center rounded-xl border transition-transform hover:scale-[1.02] hover:shadow-sm",
                            tone,
                            state?.weak && "border-rose-300 border-dashed dark:border-rose-900",
                          )}
                          title={[
                            `برند: ${entity.brandName}`,
                            `هلدینگ: ${entity.parentFirm}`,
                            `صنعت: ${entity.industry}`,
                            `نقش اصلی: ${entity.primaryRole}`,
                            `نقش ثانویه: ${entity.secondaryRole || "-"}`,
                            `مبادله: ${entity.exchangeType || "-"}`,
                            `قوت‌ها: ${entity.strengthLayers.map((item) => LAYER_DISPLAY_LABELS[item] ?? item).join("، ") || "-"}`,
                            `ضعف‌ها: ${entity.weaknessLayers.map((item) => LAYER_DISPLAY_LABELS[item] ?? item).join("، ") || "-"}`,
                            `همکاری فعلی: ${entity.actualPartnerships.join("، ") || "-"}`,
                            `همکاری بالقوه: ${entity.potentialPartnerships.join("، ") || "-"}`,
                          ].join("\n")}
                        >
                          {state?.weak ? <AlertTriangle className="h-3.5 w-3.5 text-rose-500" /> : state?.present ? <span className="h-2.5 w-2.5 rounded-full bg-current opacity-80" /> : null}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DetailDrawer entity={selectedEntity} onClose={() => setSelectedEntity(null)} />
    </div>
  );
}
