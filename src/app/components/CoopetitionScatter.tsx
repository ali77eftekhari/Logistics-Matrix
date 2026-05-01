import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import type { NormalizedEntity } from "../dataService";

interface Props {
  data: NormalizedEntity[];
}

type ScatterDatum = NormalizedEntity & {
  x: number;
  y: number;
  z: number;
  shortPrimaryRole: string;
  dominantExchangeType: string;
  hasMultiExchangeTypes: boolean;
  labelOffsetX: number;
  labelOffsetY: number;
};

const ROLE_COLORS = [
  "#155EEF",
  "#0F766E",
  "#B54708",
  "#B42318",
  "#7A5AF8",
  "#087443",
  "#475467",
  "#C11574",
];

const SHAPE_BY_EXCHANGE: Record<string, "circle" | "diamond" | "triangle" | "square" | "star"> = {
  data: "diamond",
  api: "diamond",
  financial: "circle",
  finance: "circle",
  payment: "circle",
  goods: "square",
  product: "square",
  operational: "triangle",
  logistics: "triangle",
  service: "star",
};

function normalizeVisualToken(value: string | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getRoleColor(role: string, roleMap: Map<string, string>) {
  if (!roleMap.has(role)) {
    roleMap.set(role, ROLE_COLORS[roleMap.size % ROLE_COLORS.length]);
  }
  return roleMap.get(role)!;
}

function getExchangeShape(exchangeTypes: string[]) {
  const dominant = exchangeTypes[0] ?? "other";
  const normalized = normalizeVisualToken(dominant);

  for (const [token, shape] of Object.entries(SHAPE_BY_EXCHANGE)) {
    if (normalized.includes(token)) return { dominant, shape };
  }

  return { dominant, shape: "circle" as const };
}

function buildScatterData(data: NormalizedEntity[]): ScatterDatum[] {
  const sorted = [...data].sort((a, b) => b.strategicRelevanceScore - a.strategicRelevanceScore);
  const occupied: Array<{ x: number; y: number; labelOffsetX: number; labelOffsetY: number }> = [];
  const offsetPattern = [
    { x: 16, y: -14 },
    { x: -16, y: -18 },
    { x: 18, y: 14 },
    { x: -18, y: 18 },
    { x: 0, y: -22 },
    { x: 0, y: 24 },
  ];

  return sorted.map((entity) => {
    const closeLabels = occupied.filter(
      (item) => Math.abs(item.x - entity.coOpAvg) < 0.85 && Math.abs(item.y - entity.compAvg) < 0.85,
    );
    const preferredOffset = offsetPattern[closeLabels.length % offsetPattern.length];
    occupied.push({
      x: entity.coOpAvg,
      y: entity.compAvg,
      labelOffsetX: preferredOffset.x,
      labelOffsetY: preferredOffset.y,
    });

    const { dominant, shape } = getExchangeShape(entity.exchangeTypes);

    return {
      ...entity,
      x: entity.coOpAvg,
      y: entity.compAvg,
      z: Math.max(entity.strategicRelevanceScore * 60, 160),
      shortPrimaryRole: entity.primaryRole.split("/")[0]?.trim() || entity.primaryRole,
      dominantExchangeType: dominant,
      hasMultiExchangeTypes: entity.exchangeTypes.length > 1,
      labelOffsetX: preferredOffset.x,
      labelOffsetY: preferredOffset.y,
      shape,
    } as ScatterDatum;
  });
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as ScatterDatum;

  return (
    <div className="max-w-[320px] rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-2xl dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-50">{item.brandName}</div>
      <div className="mb-3 text-xs text-slate-500 dark:text-slate-400">
        {item.parentFirm} • {item.industry}
      </div>
      <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-200">
        <div>Co-Op Avg: {item.coOpAvg}</div>
        <div>Comp Avg: {item.compAvg}</div>
        <div>Primary Role: {item.primaryRole}</div>
        <div>Secondary Role: {item.secondaryRole || "-"}</div>
      </div>
      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
        <div className="font-medium">Exchange Type</div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {item.exchangeTypes.length === 0 ? (
            <span className="text-xs text-slate-500 dark:text-slate-400">ثبت نشده</span>
          ) : (
            item.exchangeTypes.map((type) => (
              <span
                key={type}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] dark:border-slate-600 dark:bg-slate-900"
              >
                {type}
              </span>
            ))
          )}
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
        {item.recommendedMove}
      </div>
    </div>
  );
};

function shapeRenderer(props: any) {
  const { cx, cy, payload } = props;
  const item = payload as ScatterDatum;
  const size = Math.max(Math.sqrt(item.z), 12);
  const fill = item.fill;
  const stroke = item.hasMultiExchangeTypes ? "#0f172a" : "#ffffff";
  const strokeWidth = item.hasMultiExchangeTypes ? 2.5 : 1.5;
  const dash = item.hasMultiExchangeTypes ? "4 3" : undefined;

  if (item.shape === "diamond") {
    return (
      <path
        d={`M ${cx} ${cy - size} L ${cx + size} ${cy} L ${cx} ${cy + size} L ${cx - size} ${cy} Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        opacity={0.92}
      />
    );
  }

  if (item.shape === "triangle") {
    return (
      <path
        d={`M ${cx} ${cy - size} L ${cx + size} ${cy + size} L ${cx - size} ${cy + size} Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        opacity={0.92}
      />
    );
  }

  if (item.shape === "square") {
    return (
      <rect
        x={cx - size}
        y={cy - size}
        width={size * 2}
        height={size * 2}
        rx={4}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        opacity={0.92}
      />
    );
  }

  if (item.shape === "star") {
    const r = size;
    const star = [
      [cx, cy - r],
      [cx + r * 0.32, cy - r * 0.3],
      [cx + r, cy - r * 0.2],
      [cx + r * 0.45, cy + r * 0.22],
      [cx + r * 0.62, cy + r],
      [cx, cy + r * 0.5],
      [cx - r * 0.62, cy + r],
      [cx - r * 0.45, cy + r * 0.22],
      [cx - r, cy - r * 0.2],
      [cx - r * 0.32, cy - r * 0.3],
    ]
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point[0]} ${point[1]}`)
      .join(" ");
    return (
      <path
        d={`${star} Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        opacity={0.92}
      />
    );
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={size}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={dash}
      opacity={0.92}
    />
  );
}

function labelRenderer(props: any) {
  const { x, y, value, payload } = props;
  const item = payload as ScatterDatum | undefined;
  if (!item) return null;

  const offsetX = Number.isFinite(item.labelOffsetX) ? item.labelOffsetX : 12;
  const offsetY = Number.isFinite(item.labelOffsetY) ? item.labelOffsetY : -12;

  return (
    <text
      x={x + offsetX}
      y={y + offsetY}
      fill="#0f172a"
      fontSize={11}
      fontWeight={600}
      textAnchor={offsetX >= 0 ? "start" : "end"}
      className="dark:fill-slate-100"
    >
      {value}
    </text>
  );
}

function QuadrantLegend() {
  return (
    <div className="mb-4 flex flex-wrap gap-2 text-xs">
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">Partner Zone</span>
      <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">Coopetition Zone</span>
      <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-800">Threat Zone</span>
      <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700">Low Relevance Zone</span>
      <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-slate-700">
        dashed border = multi-select exchange type
      </span>
    </div>
  );
}

export function CoopetitionScatter({ data }: Props) {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";
  const roleMap = useMemo(() => new Map<string, string>(), []);
  const scatterData = useMemo(() => buildScatterData(data), [data]);

  return (
    <div className="space-y-4" dir="ltr">
      <QuadrantLegend />

      <div className="grid gap-2 text-xs text-slate-500 dark:text-slate-400 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
          Colors represent <span className="font-semibold">Primary Role</span>.
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
          Shapes represent the dominant <span className="font-semibold">Exchange Type</span>; tooltips show all selected values.
        </div>
      </div>

      <div className="h-[620px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 28, right: 32, bottom: 48, left: 48 }}>
            <ReferenceArea x1={0} x2={5} y1={0} y2={5} fill="#E5E7EB" fillOpacity={0.35} />
            <ReferenceArea x1={5} x2={10} y1={0} y2={5} fill="#DCFCE7" fillOpacity={0.45} />
            <ReferenceArea x1={5} x2={10} y1={5} y2={10} fill="#FEF3C7" fillOpacity={0.45} />
            <ReferenceArea x1={0} x2={5} y1={5} y2={10} fill="#FEE2E2" fillOpacity={0.45} />

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 10]}
              stroke={textColor}
              tick={{ fill: textColor }}
              label={{ value: "Co-Op Avg", position: "bottom", fill: textColor, offset: 18 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 10]}
              stroke={textColor}
              tick={{ fill: textColor }}
              label={{ value: "Comp Avg", angle: -90, position: "left", fill: textColor, offset: 10 }}
            />
            <ZAxis type="number" dataKey="z" range={[220, 1400]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "4 4" }} />

            <ReferenceLine x={5} stroke={gridColor} strokeDasharray="4 4" />
            <ReferenceLine y={5} stroke={gridColor} strokeDasharray="4 4" />

            <Scatter data={scatterData} shape={shapeRenderer}>
              {scatterData.map((entry) => (
                <Cell key={entry.id} fill={getRoleColor(entry.shortPrimaryRole, roleMap)} />
              ))}
              <LabelList dataKey="brandName" content={labelRenderer} />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
