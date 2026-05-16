import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { buildFilterOptionList } from "../dataService";
import type { NormalizedEntity } from "../dataService";

interface Props {
  entities: NormalizedEntity[];
}

type FlowName =
  | "Survival Flow"
  | "Speed Economy"
  | "Cost Efficiency Flow"
  | "Trust-Critical Flow"
  | "Network Economy";

type RoleName = "Orchestrator" | "Realizer" | "Enabler";

type RadarNode = {
  id: string;
  entityId: string;
  brandName: string;
  displayLabel: string;
  industry: string;
  parentFirm: string;
  description: string;
  primaryRole: string;
  secondaryRole: string;
  ecosystemRole: string;
  coOpAvg: number;
  compAvg: number;
  flow: FlowName;
  flowCapabilities: string[];
  strategicRelevanceScore: number;
  x: number;
  y: number;
  radius: number;
  labelCenterX: number;
  labelY: number;
  labelWidth: number;
  labelRectX: number;
  color: string;
  ringLabel: string;
};

type CollisionShape = {
  x: number;
  y: number;
  radius: number;
};

type LabelBox = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

type RadarFilters = {
  holding: string;
  industry: string;
  flow: string;
  role: string;
};

const VIEWBOX_SIZE = 1000;
const CENTER = VIEWBOX_SIZE / 2;
const OUTER_RADIUS = 432;
const HUB_RADIUS = 132;
const SECTOR_SPAN = 64;
const FILTER_ALL = "همه";

const FLOW_CONFIG: Record<
  FlowName,
  {
    angle: number;
    color: string;
    shortLabel: string;
    faLabel: string;
  }
> = {
  "Survival Flow": { angle: -90, color: "#2E9B45", shortLabel: "Survival", faLabel: "جریان بقا" },
  "Speed Economy": { angle: -18, color: "#1565D8", shortLabel: "Speed", faLabel: "اقتصاد سرعت" },
  "Cost Efficiency Flow": { angle: 54, color: "#F28C28", shortLabel: "Cost", faLabel: "جریان بهره وری هزینه" },
  "Trust-Critical Flow": { angle: 126, color: "#7B3FB3", shortLabel: "Trust", faLabel: "جریان حساس به اعتماد" },
  "Network Economy": { angle: 198, color: "#0E8F8F", shortLabel: "Network", faLabel: "اقتصاد شبکه" },
};

const ROLE_LAYOUT: Record<
  RoleName,
  {
    radius: number;
    size: number;
    strokeWidth: number;
    glow: boolean;
    ringLabel: string;
    faLabel: string;
  }
> = {
  Orchestrator: {
    radius: 208,
    size: 16,
    strokeWidth: 2.8,
    glow: true,
    ringLabel: "Core ring",
    faLabel: "ارکستریتور",
  },
  Realizer: {
    radius: 292,
    size: 12.5,
    strokeWidth: 2.1,
    glow: false,
    ringLabel: "Execution ring",
    faLabel: "ریلایزر",
  },
  Enabler: {
    radius: 370,
    size: 10,
    strokeWidth: 1.6,
    glow: false,
    ringLabel: "Edge ring",
    faLabel: "انیبلر",
  },
};

const ROLE_PRIORITY: RoleName[] = ["Orchestrator", "Realizer", "Enabler"];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function polarToCartesian(angle: number, radius: number) {
  const radians = toRadians(angle);
  return {
    x: CENTER + Math.cos(radians) * radius,
    y: CENTER + Math.sin(radians) * radius,
  };
}

function normalizeRole(role: string): RoleName {
  const normalized = role.trim().toLowerCase();
  if (normalized === "orchestrator") return "Orchestrator";
  if (normalized === "realizer") return "Realizer";
  return "Enabler";
}

function truncateLabel(value: string, maxLength = 19) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3)}...`;
}

function getNodeRadius(role: RoleName, strategicRelevanceScore: number) {
  const base = ROLE_LAYOUT[role].size;
  const modifier = strategicRelevanceScore * (role === "Orchestrator" ? 0.7 : role === "Realizer" ? 0.45 : 0.35);
  return clamp(base + modifier, base, base + 8);
}

function arcPoint(angle: number, radius: number) {
  const point = polarToCartesian(angle, radius);
  return `${point.x} ${point.y}`;
}

function describeSectorPath(centerAngle: number, innerRadius: number, outerRadius: number) {
  const startAngle = centerAngle - SECTOR_SPAN / 2;
  const endAngle = centerAngle + SECTOR_SPAN / 2;
  const largeArcFlag = 0;

  const outerStart = arcPoint(startAngle, outerRadius);
  const outerEnd = arcPoint(endAngle, outerRadius);
  const innerEnd = arcPoint(endAngle, innerRadius);
  const innerStart = arcPoint(startAngle, innerRadius);

  return [
    `M ${outerStart}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd}`,
    `L ${innerEnd}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart}`,
    "Z",
  ].join(" ");
}

function buildLabelBox(centerX: number, centerY: number, labelWidth: number): LabelBox {
  return {
    left: centerX - labelWidth / 2,
    right: centerX + labelWidth / 2,
    top: centerY - 13,
    bottom: centerY + 13,
  };
}

function rectsOverlap(a: LabelBox, b: LabelBox) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function circleOverlaps(a: CollisionShape, b: CollisionShape) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy) < a.radius + b.radius + 8;
}

function circleIntersectsRect(circle: CollisionShape, rect: LabelBox) {
  const closestX = clamp(circle.x, rect.left, rect.right);
  const closestY = clamp(circle.y, rect.top, rect.bottom);
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy < (circle.radius + 6) * (circle.radius + 6);
}

function getLabelPlacement(point: { x: number; y: number }, radius: number, angle: number, labelWidth: number) {
  const horizontalSign = Math.cos(toRadians(angle)) >= 0 ? 1 : -1;
  const verticalOffset = Math.sin(toRadians(angle)) * 6;
  const centerX = point.x + horizontalSign * (radius + 16 + labelWidth / 2);
  const centerY = point.y + verticalOffset;
  const box = buildLabelBox(centerX, centerY, labelWidth);

  return {
    labelCenterX: centerX,
    labelY: centerY + 4,
    labelRectX: centerX - labelWidth / 2,
    box,
  };
}

function buildRadarNodes(entities: NormalizedEntity[]): RadarNode[] {
  const candidates = entities
    .flatMap((entity) =>
      entity.e2hFlows
        .filter((flow): flow is FlowName => flow in FLOW_CONFIG)
        .map((flow) => ({
          entity,
          flow,
          role: normalizeRole(entity.ecosystemRole),
        })),
    )
    .sort((a, b) => {
      const roleDelta = ROLE_PRIORITY.indexOf(a.role) - ROLE_PRIORITY.indexOf(b.role);
      if (roleDelta !== 0) return roleDelta;
      return b.entity.strategicRelevanceScore - a.entity.strategicRelevanceScore;
    });

  const occupiedNodes: CollisionShape[] = [];
  const occupiedLabels: LabelBox[] = [];

  return candidates.map(({ entity, flow, role }, index) => {
    const flowConfig = FLOW_CONFIG[flow];
    const roleConfig = ROLE_LAYOUT[role];
    const displayLabel = truncateLabel(entity.brandName);
    const labelWidth = clamp(displayLabel.length * 8.8 + 26, 92, 196);
    const radius = getNodeRadius(role, entity.strategicRelevanceScore);
    const densityInSector = Math.max(1, candidates.filter((item) => item.flow === flow && item.role === role).length);
    const angleStep = clamp(SECTOR_SPAN / (densityInSector + 1), 5.4, 12);
    const angleOffsets = [0, -1, 1, -2, 2, -3, 3, -4, 4, -5, 5];
    const radialOffsets = [0, -18, 18, -34, 34, -48, 48];

    let bestCandidate:
      | {
          x: number;
          y: number;
          labelCenterX: number;
          labelY: number;
          labelRectX: number;
          labelBox: LabelBox;
          score: number;
        }
      | undefined;

    for (const angleOffset of angleOffsets) {
      for (const radialOffset of radialOffsets) {
        const angle = flowConfig.angle + angleOffset * angleStep;
        const distance = clamp(roleConfig.radius + radialOffset, HUB_RADIUS + 70, OUTER_RADIUS - 34);
        const point = polarToCartesian(angle, distance);
        const labelPlacement = getLabelPlacement(point, radius, angle, labelWidth);
        const currentCircle = { x: point.x, y: point.y, radius };

        const circleCollisions = occupiedNodes.filter((item) => circleOverlaps(currentCircle, item)).length;
        const labelCollisions = occupiedLabels.filter((item) => rectsOverlap(labelPlacement.box, item)).length;
        const circleLabelCollisions = occupiedNodes.filter((item) => circleIntersectsRect(item, labelPlacement.box)).length;
        const score = circleCollisions * 4 + labelCollisions * 3 + circleLabelCollisions * 2 + Math.abs(angleOffset) * 0.35;

        if (!bestCandidate || score < bestCandidate.score) {
          bestCandidate = {
            x: point.x,
            y: point.y,
            labelCenterX: labelPlacement.labelCenterX,
            labelY: labelPlacement.labelY,
            labelRectX: labelPlacement.labelRectX,
            labelBox: labelPlacement.box,
            score,
          };
        }

        if (score === 0) break;
      }

      if (bestCandidate?.score === 0) break;
    }

    const placement = bestCandidate ?? {
      x: CENTER,
      y: CENTER,
      labelCenterX: CENTER,
      labelY: CENTER,
      labelRectX: CENTER - labelWidth / 2,
      labelBox: buildLabelBox(CENTER, CENTER, labelWidth),
      score: 99,
    };

    occupiedNodes.push({ x: placement.x, y: placement.y, radius });
    occupiedLabels.push(placement.labelBox);

    return {
      id: `${entity.id}-${flow}-${index}`,
      entityId: entity.id,
      brandName: entity.brandName,
      displayLabel,
      industry: entity.industry,
      parentFirm: entity.parentFirm,
      description: entity.description,
      primaryRole: entity.primaryRole,
      secondaryRole: entity.secondaryRole,
      ecosystemRole: entity.ecosystemRole || role,
      coOpAvg: entity.coOpAvg,
      compAvg: entity.compAvg,
      flowCapabilities: entity.flowCapabilities,
      strategicRelevanceScore: entity.strategicRelevanceScore,
      flow,
      x: placement.x,
      y: placement.y,
      radius,
      labelCenterX: placement.labelCenterX,
      labelY: placement.labelY,
      labelWidth,
      labelRectX: placement.labelRectX,
      color: flowConfig.color,
      ringLabel: roleConfig.ringLabel,
    };
  });
}

function createDefaultRadarFilters(): RadarFilters {
  return {
    holding: FILTER_ALL,
    industry: FILTER_ALL,
    flow: FILTER_ALL,
    role: FILTER_ALL,
  };
}

function RadarFilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function RadarFilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <RadarFilterField label={label}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-slate-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </RadarFilterField>
  );
}

function RadarTooltip({ node }: { node: RadarNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="pointer-events-none absolute z-10 w-[320px] rounded-[24px] border border-white/35 bg-slate-950/80 p-4 text-right text-sm text-white shadow-[0_24px_80px_rgba(15,23,42,0.42)] backdrop-blur-xl"
      style={{
        left: `calc(${(node.x / VIEWBOX_SIZE) * 100}% + 16px)`,
        top: `calc(${(node.y / VIEWBOX_SIZE) * 100}% - 16px)`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-medium text-white"
          style={{ backgroundColor: node.color }}
        >
          {FLOW_CONFIG[node.flow].faLabel}
        </span>
        <div>
          <div className="text-base font-semibold tracking-tight">{node.brandName}</div>
          <div className="mt-1 text-xs text-slate-300">
            {node.parentFirm} | {node.industry}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-200">
        <div>نقش اصلی: {node.primaryRole || "-"}</div>
        <div>نقش ثانویه: {node.secondaryRole || "-"}</div>
        <div>نقش اکوسیستمی: {node.ecosystemRole || "-"}</div>
        <div>حلقه: {ROLE_LAYOUT[normalizeRole(node.ecosystemRole)].faLabel}</div>
        <div>Co-op Avg: {node.coOpAvg}</div>
        <div>Comp Avg: {node.compAvg}</div>
      </div>

      {node.description ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/8 p-3 text-xs leading-6 text-slate-100">
          {node.description}
        </div>
      ) : null}

      {node.flowCapabilities.length > 0 ? (
        <div className="mt-4 flex flex-wrap justify-end gap-1.5">
          {node.flowCapabilities.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[11px] text-slate-100"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}

export function E2HRadar({ entities }: Props) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filters, setFilters] = useState<RadarFilters>(createDefaultRadarFilters);

  const e2hEntities = useMemo(
    () => entities.filter((entity) => entity.e2hFlows.some((flow): flow is FlowName => flow in FLOW_CONFIG)),
    [entities],
  );

  const filterOptions = useMemo(
    () => ({
      holdings: buildFilterOptionList(e2hEntities.map((entity) => entity.parentFirm), FILTER_ALL),
      industries: buildFilterOptionList(e2hEntities.map((entity) => entity.industry), FILTER_ALL),
      flows: buildFilterOptionList(e2hEntities.flatMap((entity) => entity.e2hFlows), FILTER_ALL),
      roles: buildFilterOptionList(e2hEntities.map((entity) => entity.ecosystemRole), FILTER_ALL),
    }),
    [e2hEntities],
  );

  const filteredEntities = useMemo(
    () =>
      e2hEntities.filter((entity) => {
        if (filters.holding !== FILTER_ALL && entity.parentFirm !== filters.holding) return false;
        if (filters.industry !== FILTER_ALL && entity.industry !== filters.industry) return false;
        if (filters.flow !== FILTER_ALL && !entity.e2hFlows.includes(filters.flow)) return false;
        if (filters.role !== FILTER_ALL && entity.ecosystemRole !== filters.role) return false;
        return true;
      }),
    [e2hEntities, filters],
  );

  const radarNodes = useMemo(() => buildRadarNodes(filteredEntities), [filteredEntities]);
  const hoveredNode = radarNodes.find((node) => node.id === hoveredNodeId) ?? null;

  const totals = useMemo(() => {
    const uniqueBrands = new Set(radarNodes.map((node) => node.entityId)).size;
    const flowCounts = Object.keys(FLOW_CONFIG).map((flow) => ({
      flow: flow as FlowName,
      count: radarNodes.filter((node) => node.flow === flow).length,
    }));

    return {
      visibleBrands: uniqueBrands,
      nodeInstances: radarNodes.length,
      flowCounts,
    };
  }, [radarNodes]);

  const sectorLines = useMemo(
    () =>
      Object.values(FLOW_CONFIG).flatMap((config) => [
        config.angle - SECTOR_SPAN / 2,
        config.angle + SECTOR_SPAN / 2,
      ]),
    [],
  );

  function updateFilter<Key extends keyof RadarFilters>(key: Key, value: RadarFilters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters(createDefaultRadarFilters());
  }

  if (e2hEntities.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-950/40">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          داده E2H برای نمایش موجود نیست
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          این رادار فقط برندهایی را نمایش می دهد که در ستون E2H Flow مقدار داشته باشند.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5" dir="rtl">
      <div className="rounded-[24px] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-950/40">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-medium tracking-[0.2em] text-slate-400">E2H RADAR FILTERS</div>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              فیلترهای این بخش مستقل از سایر نمودارها عمل می کنند.
            </div>
          </div>
          <button
            onClick={resetFilters}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            پاک کردن فیلترهای رادار
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <RadarFilterSelect
            label="هلدینگ"
            value={filters.holding}
            options={filterOptions.holdings}
            onChange={(value) => updateFilter("holding", value)}
          />
          <RadarFilterSelect
            label="صنعت"
            value={filters.industry}
            options={filterOptions.industries}
            onChange={(value) => updateFilter("industry", value)}
          />
          <RadarFilterSelect
            label="جریان E2H"
            value={filters.flow}
            options={filterOptions.flows}
            onChange={(value) => updateFilter("flow", value)}
          />
          <RadarFilterSelect
            label="نقش اکوسیستمی"
            value={filters.role}
            options={filterOptions.roles}
            onChange={(value) => updateFilter("role", value)}
          />
        </div>
      </div>

      {radarNodes.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-950/40">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            موردی با این فیلترهای رادار پیدا نشد
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            یکی از فیلترهای هلدینگ، صنعت، جریان E2H یا نقش اکوسیستمی را آزادتر کنید.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-[1.15fr_1fr]">
            <div className="rounded-[24px] border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="text-xs font-medium tracking-[0.2em] text-slate-400">خلاصه رادار</div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {totals.visibleBrands} برند
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {totals.nodeInstances} جایگذاری
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  برندهای چندجریانی در همه بخش های مرتبط تکرار می شوند
                </span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {totals.flowCounts.map(({ flow, count }) => (
                <div
                  key={flow}
                  className="rounded-[22px] border border-slate-200 bg-white/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: FLOW_CONFIG[flow].color }} />
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {FLOW_CONFIG[flow].faLabel}
                    </div>
                  </div>
                  <div className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(241,245,249,0.94)_45%,_rgba(226,232,240,0.9)_100%)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.96),_rgba(15,23,42,0.92)_48%,_rgba(2,6,23,0.98)_100%)] dark:shadow-none">
            <div className="absolute inset-x-8 top-8 flex items-center justify-between text-[11px] font-medium tracking-[0.12em] text-slate-400">
              <span>زیرساخت جریان انسان محور</span>
              <span>برای مشاهده جزئیات روی گره ها بروید</span>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[920px]">
              <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} className="h-full w-full">
                <defs>
                  <filter id="orchestrator-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="10" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS} fill="transparent" stroke="rgba(148,163,184,0.18)" strokeWidth="1.2" />
                <circle cx={CENTER} cy={CENTER} r={ROLE_LAYOUT.Orchestrator.radius} fill="rgba(255,255,255,0.08)" stroke="rgba(148,163,184,0.28)" strokeWidth="1.5" />
                <circle cx={CENTER} cy={CENTER} r={ROLE_LAYOUT.Realizer.radius} fill="transparent" stroke="rgba(148,163,184,0.24)" strokeWidth="1.4" />
                <circle cx={CENTER} cy={CENTER} r={ROLE_LAYOUT.Enabler.radius} fill="transparent" stroke="rgba(148,163,184,0.22)" strokeWidth="1.2" />

                {Object.entries(FLOW_CONFIG).map(([flow, config]) => {
                  const path = describeSectorPath(config.angle, HUB_RADIUS + 18, OUTER_RADIUS);
                  const labelPoint = polarToCartesian(config.angle, OUTER_RADIUS - 26);

                  return (
                    <g key={flow}>
                      <path
                        d={path}
                        fill={config.color}
                        fillOpacity="0.09"
                        stroke={config.color}
                        strokeOpacity="0.2"
                        strokeWidth="1"
                      />
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y}
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="700"
                        fill={config.color}
                      >
                        {config.faLabel}
                      </text>
                    </g>
                  );
                })}

                {sectorLines.map((angle, index) => {
                  const outerPoint = polarToCartesian(angle, OUTER_RADIUS);
                  return (
                    <line
                      key={`${angle}-${index}`}
                      x1={CENTER}
                      y1={CENTER}
                      x2={outerPoint.x}
                      y2={outerPoint.y}
                      stroke="rgba(71,85,105,0.24)"
                      strokeWidth="1.2"
                    />
                  );
                })}

                <circle cx={CENTER} cy={CENTER} r={HUB_RADIUS} fill="rgba(15,23,42,0.92)" />
                <circle cx={CENTER} cy={CENTER} r={HUB_RADIUS - 10} fill="rgba(30,41,59,0.9)" stroke="rgba(255,255,255,0.16)" />
                <text x={CENTER} y={CENTER - 10} textAnchor="middle" fontSize="30" fontWeight="700" fill="#F8FAFC">
                  Human
                </text>
                <text x={CENTER} y={CENTER + 22} textAnchor="middle" fontSize="15" fill="rgba(226,232,240,0.82)">
                  E2H Flow Infrastructure
                </text>

                <text x={CENTER + ROLE_LAYOUT.Orchestrator.radius + 16} y={CENTER - 10} fontSize="12" fill="rgba(71,85,105,0.9)">
                  ارکستریتور
                </text>
                <text x={CENTER + ROLE_LAYOUT.Realizer.radius + 16} y={CENTER - 10} fontSize="12" fill="rgba(71,85,105,0.8)">
                  ریلایزر
                </text>
                <text x={CENTER + ROLE_LAYOUT.Enabler.radius + 16} y={CENTER - 10} fontSize="12" fill="rgba(71,85,105,0.75)">
                  انیبلر
                </text>

                {radarNodes.map((node) => (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: hoveredNodeId === node.id ? 1.04 : 1 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId((current) => (current === node.id ? null : current))}
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius + (hoveredNodeId === node.id ? 8 : 0)}
                      fill={node.color}
                      fillOpacity={hoveredNodeId === node.id ? 0.18 : 0.1}
                      filter={ROLE_LAYOUT[normalizeRole(node.ecosystemRole)].glow ? "url(#orchestrator-glow)" : undefined}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={node.color}
                      stroke="rgba(255,255,255,0.95)"
                      strokeWidth={ROLE_LAYOUT[normalizeRole(node.ecosystemRole)].strokeWidth}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={Math.max(node.radius - 4.5, 3)}
                      fill="rgba(255,255,255,0.14)"
                      stroke="rgba(15,23,42,0.16)"
                      strokeWidth="0.8"
                    />
                    <rect
                      x={node.labelRectX}
                      y={node.labelY - 15}
                      width={node.labelWidth}
                      height={24}
                      rx={12}
                      fill={hoveredNodeId === node.id ? "rgba(15,23,42,0.88)" : "rgba(255,255,255,0.84)"}
                      stroke={hoveredNodeId === node.id ? node.color : "rgba(148,163,184,0.22)"}
                    />
                    <text
                      x={node.labelCenterX}
                      y={node.labelY}
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight="600"
                      fill={hoveredNodeId === node.id ? "#F8FAFC" : "#0F172A"}
                    >
                      {node.displayLabel}
                    </text>
                  </motion.g>
                ))}
              </svg>

              <AnimatePresence>{hoveredNode ? <RadarTooltip node={hoveredNode} /> : null}</AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
