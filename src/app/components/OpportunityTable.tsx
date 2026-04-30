import { CompanyData } from "../dataService";
import { ArrowUpRight, AlertTriangle, RefreshCcw, Zap } from "lucide-react";

interface Props {
  data: CompanyData[];
}

export function OpportunityTable({ data }: Props) {
  // Top Partners: High Coop >= 6, Low Comp < 5
  const topPartners = data.filter(d => d.cooperationScore >= 6 && d.competitionScore < 5)
                          .sort((a, b) => b.strategicImportance - a.strategicImportance).slice(0, 5);
                          
  // High-Risk: Low Coop < 5, High Comp >= 6
  const highRisk = data.filter(d => d.cooperationScore < 5 && d.competitionScore >= 6)
                       .sort((a, b) => b.strategicImportance - a.strategicImportance).slice(0, 5);
                       
  // Coopetitors: High Coop >= 6, High Comp >= 6
  const coopetitors = data.filter(d => d.cooperationScore >= 5 && d.competitionScore >= 5 && d.relationshipType.includes("Coopetitor"))
                          .sort((a, b) => b.strategicImportance - a.strategicImportance).slice(0, 5);
                          
  // Quick Wins / Opportunity: Strategic importance >= 5 but currently low relation, or mapped as opportunity
  const quickWins = data.filter(d => d.relationshipType === "Opportunity" || (d.strategicImportance >= 4 && d.cooperationScore < 4 && d.competitionScore < 4))
                        .sort((a, b) => b.strategicImportance - a.strategicImportance).slice(0, 5);

  const TableCard = ({ title, icon: Icon, colorClass, items }: any) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className={`p-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 font-bold ${colorClass}`}>
        <Icon className="w-5 h-5" />
        {title}
      </div>
      <div className="p-0">
        {items.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-sm">موردی یافت نشد</div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item: CompanyData) => (
              <li key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{item.brand}</span>
                  <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                    استراتژیک: {item.strategicImportance}
                  </span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-2 truncate">
                  {item.category}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-700">
                  <span className="font-medium">اقدام: </span>{item.suggestedMove || "بررسی مدل همکاری"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <TableCard 
        title="شرکای کلیدی (Top Partners)" 
        icon={ArrowUpRight} 
        colorClass="text-emerald-600 dark:text-emerald-400" 
        items={topPartners} 
      />
      <TableCard 
        title="رقبای پرخطر (High-Risk)" 
        icon={AlertTriangle} 
        colorClass="text-rose-600 dark:text-rose-400" 
        items={highRisk} 
      />
      <TableCard 
        title="شریک-رقیب (Coopetitors)" 
        icon={RefreshCcw} 
        colorClass="text-amber-600 dark:text-amber-400" 
        items={coopetitors} 
      />
      <TableCard 
        title="بردهای سریع (Quick Wins)" 
        icon={Zap} 
        colorClass="text-purple-600 dark:text-purple-400" 
        items={quickWins} 
      />
    </div>
  );
}
