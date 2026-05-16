import { useState } from "react";
import { useTheme } from "next-themes";
import {
  ArrowRightLeft,
  Building2,
  Download,
  Layers3,
  LayoutGrid,
  Moon,
  RefreshCcw,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Sun,
  Target,
} from "lucide-react";

import { formatLastUpdated, PUBLISHED_SHEET_URL } from "./dataService";
import { CompanyProfileView } from "./components/CompanyProfileView";
import { CoopetitionScatter } from "./components/CoopetitionScatter";
import { CollaborationModelsPage } from "./components/collaboration/CollaborationModelsPage";
import {
  EmptyState,
  FilterField,
  FilterSelect,
  RangeFilterField,
  SectionCard,
  StatCard,
} from "./components/dashboard/DashboardPrimitives";
import { E2HRadar } from "./components/E2HRadar";
import { FakherCompanyFilterView } from "./components/FakherCompanyFilterView";
import { FakherValueChainHeatmap } from "./components/FakherValueChainHeatmap";
import { IndustryCoverageView } from "./components/IndustryCoverageView";
import { OpportunityTable } from "./components/OpportunityTable";
import { RoleInsightsView } from "./components/RoleInsightsView";
import { StrategicRecommendationEngine } from "./components/StrategicRecommendationEngine";
import { cn } from "./components/ui/utils";
import { ValueChainHeatmap } from "./components/ValueChainHeatmap";
import { useDashboardData } from "./hooks/useDashboardData";

type WorkspaceView = "dashboard" | "collaboration-models";

export function Dashboard() {
  const { theme, setTheme } = useTheme();
  const [activeView, setActiveView] = useState<WorkspaceView>("dashboard");
  const {
    dashboardStats,
    entities,
    fakherCompanies,
    fakherHeatmap,
    fakherIndustryInsights,
    filterOptions,
    filteredCompanies,
    filteredEntities,
    filters,
    lastUpdated,
    loading,
    primaryRoleInsights,
    refreshing,
    resetFilters,
    refreshData,
    secondaryRoleInsights,
    source,
    strategicRecommendations,
    updateFilter,
    valueChainLayers,
  } = useDashboardData();

  const workspaceViews = [
    {
      id: "dashboard" as const,
      label: "داشبورد اصلی",
      description: "نمای کامل اکوسیستم، فیلترها و تحلیل‌های موجود",
      icon: LayoutGrid,
    },
    {
      id: "collaboration-models" as const,
      label: "مدل‌های همکاری",
      description: "راهنمای انتخاب مدل همکاری و workspace تصمیم",
      icon: ArrowRightLeft,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100" dir="rtl">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-40 animate-pulse rounded-[32px] border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-[24px] border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
              />
            ))}
          </div>
          <div className="h-32 animate-pulse rounded-[28px] border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70" />
          <div className="h-[440px] animate-pulse rounded-[28px] border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100" dir="rtl">
      <div className="absolute inset-x-0 top-0 -z-10 h-[320px] bg-slate-200/55 dark:bg-slate-900/70" />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="flex flex-col gap-8 px-6 py-6 lg:px-8 lg:py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Logistics Ecosystem Intelligence
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 lg:text-4xl">
                  پلتفرم هوشمندی اکوسیستم لجستیک
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 lg:text-base">
                  فاز اول با تمرکز روی فیلترهای سراسری و ماتریس همکاری-رقابت ارتقا یافته تا تیم استراتژی بتواند همه
                  نماهای فعلی را با یک منطق داده‌ای واحد بررسی کند.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:min-w-[320px]">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => refreshData(false)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
                  >
                    <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    بروزرسانی داده
                  </button>
                  <a
                    href={PUBLISHED_SHEET_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Download className="h-4 w-4" />
                    مشاهده منبع
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
                  <div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">آخرین بروزرسانی</div>
                    <div className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                      {lastUpdated ? formatLastUpdated(lastUpdated) : "-"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        source === "google-sheet"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
                      )}
                    >
                      {source === "google-sheet" ? "منبع زنده" : "فالبک محلی"}
                    </span>
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      aria-label="تغییر تم"
                    >
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              <StatCard
                label="کل برندها"
                value={dashboardStats.totalBrands}
                hint="تعداد کل بازیگران تحلیل‌شده"
                icon={Building2}
                accent="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
              <StatCard
                label="کل هلدینگ‌ها"
                value={dashboardStats.totalHoldings}
                hint="تنوع ساختار مالکیتی اکوسیستم"
                icon={Layers3}
                accent="bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
              />
              <StatCard
                label="شرکای پرتانسيل"
                value={dashboardStats.highOpportunityPartners}
                hint="امتیاز بالای همکاری و فرصت"
                icon={Target}
                accent="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
              />
              <StatCard
                label="رقبای پرریسک"
                value={dashboardStats.highRiskCompetitors}
                hint="فشار رقابتی بالا و نیازمند پایش"
                icon={ShieldAlert}
                accent="bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
              />
              <StatCard
                label="شکاف زنجیره ارزش"
                value={dashboardStats.valueChainGaps}
                hint="لایه‌هایی که پوشش قوی ندارند"
                icon={Sparkles}
                accent="bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
              />
            </div>
          </div>
        </header>

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-5">
          <div className="grid gap-3 md:grid-cols-2">
            {workspaceViews.map((view) => {
              const selected = activeView === view.id;

              return (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveView(view.id)}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-[22px] border p-4 text-right transition-all",
                    selected
                      ? "border-slate-900 bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)] dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                      : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-950",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <view.icon className="mt-1 h-4 w-4 flex-none" />
                    <div>
                      <div className="text-sm font-semibold">{view.label}</div>
                      <div
                        className={cn(
                          "mt-2 text-xs leading-6",
                          selected ? "text-white/75 dark:text-slate-700" : "text-slate-500 dark:text-slate-400",
                        )}
                      >
                        {view.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {activeView === "collaboration-models" ? (
          <CollaborationModelsPage />
        ) : (
          <>
            <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                      فیلترهای سراسری
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      این فیلترها هم‌زمان Scatter، ماتریس زنجیره ارزش و خلاصه فرصت‌های استراتژیک را به‌روز می‌کنند.
                    </p>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 self-start rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <RotateCcw className="h-4 w-4" />
                    پاک‌کردن فیلترها
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <FilterField label="جست‌وجوی برند / صنعت / نقش">
                    <div className="relative">
                      <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={filters.search}
                        onChange={(event) => updateFilter("search", event.target.value)}
                        placeholder="مثل دیجی‌کالا، لجستیک، داده"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-10 pl-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-900"
                      />
                    </div>
                  </FilterField>
                  <FilterSelect
                    label="هلدینگ"
                    value={filters.holding}
                    options={filterOptions.holdings}
                    onChange={(value) => updateFilter("holding", value)}
                  />
                  <FilterSelect
                    label="صنعت"
                    value={filters.industry}
                    options={filterOptions.industries}
                    onChange={(value) => updateFilter("industry", value)}
                  />
                  <FilterSelect
                    label="نقش اصلی"
                    value={filters.primaryRole}
                    options={filterOptions.primaryRoles}
                    onChange={(value) => updateFilter("primaryRole", value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <FilterSelect
                    label="نقش ثانویه"
                    value={filters.secondaryRole}
                    options={filterOptions.secondaryRoles}
                    onChange={(value) => updateFilter("secondaryRole", value)}
                  />
                  <FilterSelect
                    label="Exchange Type"
                    value={filters.exchangeType}
                    options={filterOptions.exchangeTypes}
                    onChange={(value) => updateFilter("exchangeType", value)}
                  />
                  <FilterSelect
                    label="همکاری فعلی"
                    value={filters.actualPartnership}
                    options={filterOptions.actualPartnerships}
                    onChange={(value) => updateFilter("actualPartnership", value)}
                  />
                  <FilterSelect
                    label="همکاری بالقوه"
                    value={filters.potentialPartnership}
                    options={filterOptions.potentialPartnerships}
                    onChange={(value) => updateFilter("potentialPartnership", value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <RangeFilterField
                    label="بازه Co-Op Avg"
                    range={filters.coOpRange}
                    onChange={(value) => updateFilter("coOpRange", value)}
                  />
                  <RangeFilterField
                    label="بازه Comp Avg"
                    range={filters.compRange}
                    onChange={(value) => updateFilter("compRange", value)}
                  />
                  <FilterField label={`حداقل Strategic Relevance: ${filters.minStrategicRelevance}`}>
                    <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 dark:border-slate-700 dark:bg-slate-800">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={filters.minStrategicRelevance}
                        onChange={(event) => updateFilter("minStrategicRelevance", Number(event.target.value))}
                        className="w-full accent-slate-900 dark:accent-slate-100"
                      />
                    </div>
                  </FilterField>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                    {filteredEntities.length} مورد از {entities.length} برند نمایش داده می‌شود
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                    Exchange Type چندانتخابی در Scatter و Tooltip به‌صورت چندگانه نمایش داده می‌شود
                  </span>
                </div>
              </div>
            </section>

            <SectionCard
              title="E2H Ecosystem Radar"
              description="رادار اکوسیستم E2H با فیلترهای مستقل، حلقه‌بندی نقش‌ها و تفکیک شفاف قطاع‌ها."
            >
              <E2HRadar entities={entities} />
            </SectionCard>

            {filteredEntities.length === 0 ? (
              <EmptyState
                title="موردی با این فیلترها پیدا نشد"
                description="فیلترها را سبک‌تر کنید یا بازه‌های Co-Op و Comp را بازتر کنید تا داده دوباره نمایش داده شود."
              />
            ) : (
              <div className="space-y-8">
                <SectionCard
                  title="Enhanced Co-opetition Scatter"
                  description="رنگ بر اساس نقش اصلی، شکل بر اساس Exchange Type غالب، و حاشیه بر اساس چندانتخابی بودن Exchange Type تنظیم شده است."
                >
                  <div className="rounded-[24px] bg-slate-50/90 p-4 dark:bg-slate-950/40">
                    <CoopetitionScatter data={filteredEntities} />
                  </div>
                </SectionCard>

                <SectionCard
                  title="پوشش زنجیره ارزش"
                  description="این نما حالا دقیقاً از همان مجموعه فیلترشده‌ی سراسری تغذیه می‌شود."
                >
                  <div className="rounded-[24px] bg-slate-50/90 p-3 dark:bg-slate-950/40">
                    <ValueChainHeatmap entities={filteredEntities} layers={valueChainLayers} />
                  </div>
                </SectionCard>

                <SectionCard
                  title="Fakher Companies Value Chain Heatmap"
                  description="Presence of Fakher Holding companies across logistics value chain layers"
                >
                  <FakherValueChainHeatmap dataset={fakherHeatmap} />
                </SectionCard>

                <SectionCard
                  title="Fakher Partnership Coverage by Industry"
                  description="پوشش صنعتی همکاری‌های فعلی و بالقوه فاخر برای شناسایی سریع شکاف‌ها و اولویت‌های توسعه."
                >
                  <IndustryCoverageView insights={fakherIndustryInsights} />
                </SectionCard>

                <SectionCard
                  title="Company Strength & Weakness Profile"
                  description="نمای پروفایل‌محور از قوت‌ها، ضعف‌ها، نقش‌ها، نوع مبادله و تفسیر استراتژیک هر شرکت."
                >
                  <CompanyProfileView entities={filteredEntities} />
                </SectionCard>

                <SectionCard
                  title="Role-Based Insights"
                  description="تحلیل مدیریتی نقش‌های اصلی و ثانویه برای تشخیص الگوهای غالب و جهت‌گیری استراتژیک."
                >
                  <RoleInsightsView
                    primaryInsights={primaryRoleInsights}
                    secondaryInsights={secondaryRoleInsights}
                  />
                </SectionCard>

                <SectionCard
                  title="Fakher Company Filter View"
                  description="نمای سریع برای تشخیص برندهایی که هر شرکت فاخر می‌تواند به‌صورت بالقوه با آن‌ها وارد همکاری شود."
                >
                  <FakherCompanyFilterView entities={filteredEntities} fakherCompanies={fakherCompanies} />
                </SectionCard>

                <SectionCard
                  title="Strategic Recommendation Engine"
                  description="خروجی‌های این بخش برای مدیران ارشد، اولویت‌بندی تصمیم‌ها و تشخیص سریع فرصت‌ها و تهدیدها طراحی شده‌اند."
                >
                  <StrategicRecommendationEngine recommendations={strategicRecommendations} />
                </SectionCard>

                <SectionCard
                  title="خلاصه فرصت‌های استراتژیک"
                  description="این خروجی همچنان با همان منطق فیلتر سراسری به‌روز می‌شود و برای جمع‌بندی سریع تصمیم قابل استفاده است."
                >
                  <OpportunityTable data={filteredCompanies} />
                </SectionCard>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
