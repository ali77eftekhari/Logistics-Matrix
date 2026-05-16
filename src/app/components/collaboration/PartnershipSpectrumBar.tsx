import type { PartnershipModel } from "../../data/partnershipModels";

export function PartnershipSpectrumBar({ models }: { models: PartnershipModel[] }) {
  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">طیف یکپارچگی همکاری</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            از مدل‌های سبک با استقلال بالا تا ساختارهای عمیق با کنترل و سرمایه مشترک
          </p>
        </div>
      </div>

      <div className="flex h-3 overflow-hidden rounded-full">
        {models.map((model) => (
          <div key={model.id} className="flex-1" style={{ backgroundColor: model.color }} aria-hidden="true" />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span>یکپارچگی بالا، کنترل مشترک</span>
        <span>یکپارچگی پایین، استقلال بالا</span>
      </div>
    </div>
  );
}
