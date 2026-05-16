import type { PartnershipModel } from "../../data/partnershipModels";
import { cn } from "../ui/utils";

export function PartnershipModelCard({
  model,
  selected,
  onSelect,
}: {
  model: PartnershipModel;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "rounded-[24px] border bg-white/90 p-5 text-right shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:bg-slate-900/85 dark:hover:border-slate-700",
        model.borderClassName,
        selected
          ? "ring-2 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-950"
          : "border-slate-200/80 dark:border-slate-800",
      )}
      style={selected ? { borderColor: model.color, boxShadow: `0 0 0 2px ${model.color}33` } : undefined}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
            model.surfaceClassName,
            model.accentClassName,
          )}
        >
          {model.tag}
        </span>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{model.name}</h3>
      </div>

      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{model.description}</p>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {model.attributes.map((attribute) => (
          <span
            key={attribute}
            className="rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {attribute}
          </span>
        ))}
      </div>
    </button>
  );
}
