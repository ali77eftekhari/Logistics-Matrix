import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PartnershipModel } from "../../data/partnershipModels";
import { PartnershipFitBadge } from "./PartnershipFitBadge";
import { PartnershipMetricMeter } from "./PartnershipMetricMeter";
import { cn } from "../ui/utils";

function DetailInfoCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className={cn("mt-2 text-sm leading-6 text-slate-900 dark:text-slate-100", valueClassName)}>{value}</div>
    </div>
  );
}

function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <span
            className="mt-2 h-2 w-2 flex-none rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PartnershipDetailPanel({
  model,
  previousModel,
  nextModel,
  onPrevious,
  onNext,
}: {
  model: PartnershipModel;
  previousModel?: PartnershipModel;
  nextModel?: PartnershipModel;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_14px_34px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
      <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-5 dark:border-slate-800 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <PartnershipFitBadge fit={model.tubaFit} />
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
                model.surfaceClassName,
                model.accentClassName,
              )}
            >
              {model.tag}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{model.name}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{model.description}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
          <DetailInfoCard label="شخصیت حقوقی" value={model.legalEntity} />
          <DetailInfoCard label="سرمایه مشترک" value={model.sharedCapital} />
          <DetailInfoCard label="سختی خروج" value={model.exitDifficulty} />
          <DetailInfoCard label="تناسب با TUBA / Fakher" value={<PartnershipFitBadge fit={model.tubaFit} />} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-6">
          <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/50">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">شاخص‌های تصمیم</h3>
            <div className="mt-4 space-y-4">
              <PartnershipMetricMeter label="یکپارچگی" value={model.integration} color={model.color} />
              <PartnershipMetricMeter label="کنترل" value={model.control} color={model.color} />
              <PartnershipMetricMeter label="ریسک سرمایه" value={model.risk} color={model.color} />
              <PartnershipMetricMeter label="تعهد" value={model.commitment} color={model.color} />
            </div>
          </div>

          <div className={cn("rounded-[24px] border p-5", model.surfaceClassName, model.borderClassName)}>
            <div className="text-[11px] font-semibold tracking-wide text-slate-600/75 dark:text-slate-300/80">
              دیدگاه TUBA / Fakher
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-800 dark:text-slate-100">{model.tubaNote}</p>
            <p className="mt-4 text-xs leading-6 text-slate-600 dark:text-slate-300">{model.example}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/30">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">نحوه عملکرد</h3>
            <div className="mt-4">
              <BulletList items={model.mechanics} color={model.color} />
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200/80 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-950/30">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">چه زمانی استفاده شود</h3>
            <div className="mt-4">
              <BulletList items={model.whenToUse} color={model.color} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200/70 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onNext}
          disabled={!nextModel}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ChevronRight className="h-4 w-4" />
          {nextModel ? nextModel.name : "مدل بعدی"}
        </button>
        <button
          type="button"
          onClick={onPrevious}
          disabled={!previousModel}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {previousModel ? previousModel.name : "مدل قبلی"}
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
