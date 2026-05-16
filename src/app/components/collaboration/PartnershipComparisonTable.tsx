import type { PartnershipModel } from "../../data/partnershipModels";
import { PartnershipFitBadge } from "./PartnershipFitBadge";
import { cn } from "../ui/utils";

export function PartnershipComparisonTable({
  models,
  selectedId,
  onSelect,
}: {
  models: PartnershipModel[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
      <div className="border-b border-slate-200/70 px-6 py-5 dark:border-slate-800">
        <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50">مقایسه همه مدل‌ها</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          با کلیک روی هر ردیف، همان مدل به‌عنوان گزینه فعال در workspace تصمیم انتخاب می‌شود.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-right">
          <thead>
            <tr className="border-b border-slate-200/70 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-950/50">
              {["نوع همکاری", "شخصیت حقوقی", "سرمایه مشترک", "سختی خروج", "تناسب با TUBA"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((model) => {
              const selected = model.id === selectedId;

              return (
                <tr
                  key={model.id}
                  tabIndex={0}
                  onClick={() => onSelect(model.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(model.id);
                    }
                  }}
                  className={cn(
                    "cursor-pointer border-b border-slate-200/60 transition-colors last:border-b-0 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:focus:ring-slate-700",
                    selected ? "bg-slate-100/90 dark:bg-slate-800/80" : "hover:bg-slate-50/70 dark:hover:bg-slate-950/40",
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="h-3 w-3 flex-none rounded-full"
                        style={{ backgroundColor: model.color }}
                        aria-hidden="true"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{model.name}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{model.tag}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{model.legalEntity}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{model.sharedCapital}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{model.exitDifficulty}</td>
                  <td className="px-6 py-4">
                    <PartnershipFitBadge fit={model.tubaFit} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
