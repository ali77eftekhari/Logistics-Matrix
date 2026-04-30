import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell, ReferenceLine } from "recharts";
import { CompanyData } from "../dataService";
import { useTheme } from "next-themes";

interface Props {
  data: CompanyData[];
}

const FLOW_COLORS: Record<string, string> = {
  Data: "#3b82f6",      // blue
  Financial: "#10b981", // green
  Goods: "#f59e0b",     // amber
  Operational: "#8b5cf6",// purple
  Mixed: "#6b7280"      // gray
};

const FLOW_TRANSLATION: Record<string, string> = {
  Data: "داده",
  Financial: "مالی",
  Goods: "کالا",
  Operational: "عملیاتی",
  Mixed: "ترکیبی"
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CompanyData;
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 text-sm max-w-[280px]">
        <div className="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">{data.brand}</div>
        <div className="mb-2 text-slate-600 dark:text-slate-300"><strong>حوزه:</strong> {data.category}</div>
        <div className="grid grid-cols-2 gap-2 mb-2 text-slate-700 dark:text-slate-200">
          <div><strong>همکاری:</strong> {data.cooperationScore}</div>
          <div><strong>رقابت:</strong> {data.competitionScore}</div>
        </div>
        <div className="mb-2 text-slate-700 dark:text-slate-200">
          <strong>جریان:</strong> {FLOW_TRANSLATION[data.flowType] || data.flowType}
        </div>
        <div className="mb-2 text-slate-700 dark:text-slate-200">
          <strong>نقش:</strong> {data.primaryRole.split('/')[0]}
        </div>
        <div className="text-emerald-600 dark:text-emerald-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          <strong>اقدام پیشنهادی:</strong><br />
          {data.suggestedMove || "بررسی بیشتر"}
        </div>
      </div>
    );
  }
  return null;
};

export function CoopetitionScatter({ data }: Props) {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  return (
    <div className="h-[500px] w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            type="number" 
            dataKey="cooperationScore" 
            name="همکاری" 
            domain={[0, 10]} 
            stroke={textColor}
            tick={{ fill: textColor }}
            label={{ value: "امتیاز همکاری", position: 'bottom', fill: textColor, offset: 20 }}
          />
          <YAxis 
            type="number" 
            dataKey="competitionScore" 
            name="رقابت" 
            domain={[0, 10]} 
            stroke={textColor}
            tick={{ fill: textColor }}
            label={{ value: "امتیاز رقابت", angle: -90, position: 'left', fill: textColor, offset: 10 }}
          />
          <ZAxis 
            type="number" 
            dataKey="strategicImportance" 
            range={[100, 600]} 
            name="اهمیت استراتژیک" 
          />
          <Tooltip content={<CustomTooltip />} />
          
          <ReferenceLine x={5} stroke={gridColor} strokeDasharray="3 3" />
          <ReferenceLine y={5} stroke={gridColor} strokeDasharray="3 3" />
          
          <Scatter name="شرکت‌ها" data={data}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={FLOW_COLORS[entry.flowType] || FLOW_COLORS.Mixed} opacity={0.8} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
