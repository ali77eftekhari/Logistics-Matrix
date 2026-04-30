import { CompanyData } from "../dataService";
import { clsx } from "clsx";

interface Props {
  data: CompanyData[];
}

const LAYERS = [
  "Market", 
  "First Mile", 
  "Mid Mile", 
  "Fulfillment", 
  "Last Mile", 
  "Reverse", 
  "Fintech", 
  "Data", 
  "Infrastructure", 
  "Innovation"
];

const LAYER_TRANSLATION: Record<string, string> = {
  Market: "بازار و پلتفرم",
  "First Mile": "فرست‌مایل",
  "Mid Mile": "مید‌مایل",
  Fulfillment: "فولفیلمنت",
  "Last Mile": "لست‌مایل",
  Reverse: "لجستیک معکوس",
  Fintech: "فین‌تک",
  Data: "داده",
  Infrastructure: "زیرساخت",
  Innovation: "نوآوری"
};

function getCellClass(intensity: number, relationshipType: string) {
  if (intensity === 0) return "bg-slate-100 dark:bg-slate-800 text-transparent border-slate-200 dark:border-slate-700";
  
  if (relationshipType === "Owned") {
    return intensity >= 2 ? "bg-blue-600 text-white" : "bg-blue-300 text-blue-900";
  }
  if (relationshipType.includes("Partner")) {
    return intensity >= 2 ? "bg-emerald-600 text-white" : "bg-emerald-300 text-emerald-900";
  }
  if (relationshipType.includes("Competitor") || relationshipType.includes("رقیب")) {
    return intensity >= 2 ? "bg-rose-600 text-white" : "bg-rose-300 text-rose-900";
  }
  if (relationshipType.includes("Coopetitor") || relationshipType.includes("شریک-رقیب")) {
    return intensity >= 2 ? "bg-amber-500 text-white" : "bg-amber-300 text-amber-900";
  }
  
  // default / neutral / opportunity
  return intensity >= 2 ? "bg-purple-600 text-white" : "bg-purple-300 text-purple-900";
}

export function ValueChainHeatmap({ data }: Props) {
  // Only show companies that have some layer score
  const validData = data.filter(d => 
    Object.values(d.layers).some(v => v > 0)
  );

  return (
    <div className="overflow-x-auto w-full pb-4">
      <table className="w-full text-sm text-right min-w-[800px]">
        <thead>
          <tr>
            <th className="sticky right-0 bg-white dark:bg-slate-900 z-10 p-3 border-b-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold w-48 shadow-sm">
              موجودیت / سرویس
            </th>
            {LAYERS.map(layer => (
              <th key={layer} className="p-3 border-b-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap text-center">
                {LAYER_TRANSLATION[layer]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {validData.map(company => (
            <tr key={company.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="sticky right-0 bg-white dark:bg-slate-900 z-10 p-3 border-b border-slate-100 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300 shadow-sm truncate max-w-[200px]" title={company.brand}>
                {company.brand}
              </td>
              {LAYERS.map(layer => {
                const score = company.layers[layer] || 0;
                return (
                  <td key={layer} className="p-1 border-b border-slate-100 dark:border-slate-800 text-center">
                    <div 
                      className={clsx(
                        "w-full h-10 flex items-center justify-center rounded-md text-xs font-bold transition-all duration-300 cursor-default",
                        getCellClass(score, company.relationshipType)
                      )}
                      title={`${company.brand} - ${LAYER_TRANSLATION[layer]}\nشدت: ${score}\nنقش: ${company.relationshipType}`}
                    >
                      {score > 0 ? score : ""}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
