import { cn } from "../ui/utils";
import type { PartnershipFit } from "../../data/partnershipModels";

const fitConfig: Record<
  PartnershipFit,
  {
    label: string;
    className: string;
  }
> = {
  low: {
    label: "پایین",
    className: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
  },
  medium: {
    label: "متوسط",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  },
  high: {
    label: "بالا",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  selective: {
    label: "انتخابی",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  },
};

export function PartnershipFitBadge({ fit }: { fit: PartnershipFit }) {
  const config = fitConfig[fit];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
