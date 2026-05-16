import { useEffect, useMemo, useState } from "react";
import { BarChart3, BriefcaseBusiness, GitMerge, Scale, Waypoints } from "lucide-react";

import {
  collaborationInsightChips,
  partnershipModels,
  type PartnershipModel,
  type PartnershipWeight,
} from "../../data/partnershipModels";
import { PartnershipComparisonTable } from "./PartnershipComparisonTable";
import { PartnershipDetailPanel } from "./PartnershipDetailPanel";
import { PartnershipModelCard } from "./PartnershipModelCard";
import { PartnershipSpectrumBar } from "./PartnershipSpectrumBar";
import { cn } from "../ui/utils";

const weightFilters: Array<{ id: "all" | PartnershipWeight; label: string }> = [
  { id: "all", label: "همه" },
  { id: "light", label: "سبک" },
  { id: "medium", label: "متوسط" },
  { id: "heavy", label: "سنگین" },
];

function findModelIndex(models: PartnershipModel[], selectedId: string) {
  const index = models.findIndex((model) => model.id === selectedId);
  return index >= 0 ? index : 0;
}

export function CollaborationModelsPage() {
  const [weightFilter, setWeightFilter] = useState<"all" | PartnershipWeight>("all");
  const [selectedId, setSelectedId] = useState<string>("jv");

  const filteredModels = useMemo(() => {
    if (weightFilter === "all") {
      return partnershipModels;
    }

    return partnershipModels.filter((model) => model.weight === weightFilter);
  }, [weightFilter]);

  useEffect(() => {
    if (!filteredModels.some((model) => model.id === selectedId)) {
      setSelectedId(filteredModels[0]?.id ?? partnershipModels[0].id);
    }
  }, [filteredModels, selectedId]);

  const selectedIndex = findModelIndex(filteredModels, selectedId);
  const selectedModel = filteredModels[selectedIndex] ?? partnershipModels[0];
  const previousModel = selectedIndex > 0 ? filteredModels[selectedIndex - 1] : undefined;
  const nextModel = selectedIndex < filteredModels.length - 1 ? filteredModels[selectedIndex + 1] : undefined;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Collaboration Model Explorer
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 lg:text-4xl">
              راهنمای انتخاب مدل همکاری
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 dark:text-slate-300 lg:text-base">
              این صفحه برای انتخاب سریع نوع مدل همکاری طراحی شده است. هر مدل بر اساس میزان یکپارچگی، کنترل، ریسک
              سرمایه، سطح تعهد، ساختار حقوقی و تناسب با منطق همکاری‌های فاخر/TUBA مقایسه می‌شود.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {collaborationInsightChips.map((chip) => (
                <div
                  key={chip.id}
                  className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                >
                  <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">{chip.title}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{chip.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "زاویه تصمیم",
                text: "این workspace برای مقایسه سریع گزینه‌ها و تشخیص سطح تعهد مناسب قبل از ورود به ساختارهای عمیق‌تر ساخته شده است.",
                icon: Scale,
              },
              {
                title: "منطق طیف",
                text: "حرکت از معرفی و MoU به سمت JV و تملک، یعنی افزایش هم‌زمان یکپارچگی، کنترل و پیچیدگی خروج.",
                icon: Waypoints,
              },
              {
                title: "کاربرد برای TUBA",
                text: "کمک می‌کند مشخص شود کدام سازوکار با منطق ساخت شریک، کنترل سرمایه و توسعه اکوسیستم هماهنگ‌تر است.",
                icon: GitMerge,
              },
              {
                title: "فرمت استفاده",
                text: "ابتدا کارت‌ها را مقایسه کنید، سپس با detail panel و جدول تصمیم، گزینه مناسب معامله را جمع‌بندی کنید.",
                icon: BarChart3,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <item.icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</h2>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnershipSpectrumBar models={partnershipModels} />

      <section className="rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50">مدل‌ها روی میز تصمیم</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              یک مدل را انتخاب کنید تا عمق همکاری، منطق اجرا و تناسب آن با چارچوب TUBA/Fakher نمایش داده شود.
            </p>
          </div>

          <div className="inline-flex w-full flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-950/50 lg:w-auto">
            {weightFilters.map((filter) => {
              const active = weightFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setWeightFilter(filter.id)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
                      : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredModels.map((model) => (
            <PartnershipModelCard
              key={model.id}
              model={model}
              selected={model.id === selectedModel.id}
              onSelect={() => setSelectedId(model.id)}
            />
          ))}
        </div>
      </section>

      <PartnershipDetailPanel
        model={selectedModel}
        previousModel={previousModel}
        nextModel={nextModel}
        onPrevious={() => previousModel && setSelectedId(previousModel.id)}
        onNext={() => nextModel && setSelectedId(nextModel.id)}
      />

      <PartnershipComparisonTable
        models={partnershipModels}
        selectedId={selectedModel.id}
        onSelect={setSelectedId}
      />
    </div>
  );
}
