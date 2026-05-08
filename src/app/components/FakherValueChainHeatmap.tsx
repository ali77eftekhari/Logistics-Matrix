import { type ComponentType, useDeferredValue, useMemo, useState } from "react";
import { AlertCircle, Building2, Layers3, Search, TrendingDown, TrendingUp } from "lucide-react";

import {
  calculateCoverageStats,
  getCellStatus,
  LAYER_DISPLAY_LABELS,
  type FakherHeatmapDataset,
} from "../dataService";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
  dataset: FakherHeatmapDataset;
}

const SHOW_ALL_LAYERS = "All layers";

function InsightChip({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/80">
      <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  );
}

function LegendItem({ label, className }: { label: string; className: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      <span className={`h-3.5 w-3.5 rounded-[4px] border ${className}`} />
      {label}
    </div>
  );
}

function formatLayerName(layer: string) {
  return LAYER_DISPLAY_LABELS[layer] ?? layer;
}

export function FakherValueChainHeatmap({ dataset }: Props) {
  const [search, setSearch] = useState("");
  const [selectedLayer, setSelectedLayer] = useState(SHOW_ALL_LAYERS);
  const deferredSearch = useDeferredValue(search);

  const stats = useMemo(() => calculateCoverageStats(dataset), [dataset]);

  const layerOptions = useMemo(
    () => [SHOW_ALL_LAYERS, ...dataset.layers],
    [dataset.layers],
  );

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = deferredSearch.trim().toLowerCase();

    return dataset.companies.filter((company) => {
      const matchesSearch =
        !normalizedQuery || company.normalizedCompanyName.includes(normalizedQuery.toLowerCase());
      const matchesLayer =
        selectedLayer === SHOW_ALL_LAYERS || company.coverageByLayer[selectedLayer] === 1;

      return matchesSearch && matchesLayer;
    });
  }, [dataset.companies, deferredSearch, selectedLayer]);

  if (dataset.error) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[24px] border border-dashed border-rose-200 bg-rose-50/60 px-6 text-center dark:border-rose-900/60 dark:bg-rose-950/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm dark:bg-slate-900">
          <AlertCircle className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">Heatmap unavailable</h3>
        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">{dataset.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.6fr)_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by company name"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        <select
          value={selectedLayer}
          onChange={(event) => setSelectedLayer(event.target.value)}
          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          {layerOptions.map((option) => (
            <option key={option} value={option}>
              {option === SHOW_ALL_LAYERS ? "Show all companies" : `Only with presence in ${formatLayerName(option)}`}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <LegendItem
            label="Presence"
            className="border-emerald-300 bg-emerald-500 dark:border-emerald-800 dark:bg-emerald-500"
          />
          <LegendItem
            label="No Presence"
            className="border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-700"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <InsightChip label="Total companies" value={String(stats.totalCompanies)} icon={Building2} />
        <InsightChip label="Total layers" value={String(stats.totalLayers)} icon={Layers3} />
        <InsightChip label="Average coverage" value={`${stats.averageCoveragePercentage}%`} icon={TrendingUp} />
        <InsightChip
          label="Strongest layer"
          value={stats.strongestLayer ? formatLayerName(stats.strongestLayer) : "-"}
          icon={TrendingUp}
        />
        <InsightChip
          label="Weakest layer"
          value={stats.weakestLayer ? formatLayerName(stats.weakestLayer) : "-"}
          icon={TrendingDown}
        />
      </div>

      <div className="rounded-[24px] border border-slate-200/80 bg-white/90 shadow-[0_6px_18px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>{filteredCompanies.length} companies visible</span>
          <span>{dataset.layers.length} value chain layers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[920px] border-separate border-spacing-x-1 border-spacing-y-1.5 px-3 py-3 text-sm">
            <thead>
              <tr>
                <th className="sticky right-0 top-0 z-30 min-w-[240px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right text-xs font-semibold tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  Company
                </th>
                {dataset.layers.map((layer) => (
                  <th
                    key={layer}
                    className="sticky top-0 z-20 min-w-[88px] rounded-2xl border border-slate-200 bg-white px-2 py-3 text-center text-[11px] font-semibold leading-5 text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                  >
                    {formatLayerName(layer)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id}>
                  <td className="sticky right-0 z-10 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 shadow-[6px_0_16px_rgba(255,255,255,0.95)] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:shadow-[6px_0_16px_rgba(2,6,23,0.95)]">
                    {company.companyName}
                  </td>
                  {dataset.layers.map((layer) => {
                    const status = getCellStatus(company.coverageByLayer[layer]);
                    const isPresent = status === "present";

                    return (
                      <td key={`${company.id}-${layer}`} className="p-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              aria-label={`${company.companyName} - ${formatLayerName(layer)} - ${isPresent ? "Present" : "Not Present"}`}
                              className={`h-11 w-full min-w-[76px] rounded-2xl border transition-transform hover:scale-[1.02] ${
                                isPresent
                                  ? "border-emerald-200 bg-emerald-500/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] dark:border-emerald-800 dark:bg-emerald-500/75"
                                  : "border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80"
                              }`}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={8} className="rounded-xl bg-slate-950 px-3 py-2 text-left text-slate-50 dark:bg-slate-100 dark:text-slate-950">
                            <div className="font-semibold">{company.companyName}</div>
                            <div className="mt-1 text-[11px] opacity-80">{formatLayerName(layer)}</div>
                            <div className="mt-1 text-[11px]">{isPresent ? "Status: Present" : "Status: Not Present"}</div>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="border-t border-slate-200/80 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            No companies match the current search or layer filter.
          </div>
        ) : null}
      </div>
    </div>
  );
}
