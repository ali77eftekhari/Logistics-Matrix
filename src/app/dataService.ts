import Papa from "papaparse";

import fakherCsvFallback from "../imports/fakher-companies-export.csv?raw";
import matrixCsvFallback from "../imports/Stakeholder_Mapping_-_Copy_of_Co-opetiton_Matrix.csv?raw";

const IS_DEV = import.meta.env.DEV;

export const PUBLISHED_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6vb4P3i6elriPF93ArmeBilZCZ67AF-v4KGo_ood5P6Lvi8boEiSFBMvbKJfv1_H6d2PnSFo5Vs7Z/pubhtml";

const SHEET_TABS = {
  ecosystem: {
    key: "ecosystem",
    label: "Main ecosystem data",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6vb4P3i6elriPF93ArmeBilZCZ67AF-v4KGo_ood5P6Lvi8boEiSFBMvbKJfv1_H6d2PnSFo5Vs7Z/pub?gid=1748233832&single=true&output=csv",
    fallbackCsv: matrixCsvFallback,
    required: true,
  },
  fakherCompanies: {
    key: "fakherCompanies",
    label: "Fakher companies config",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6vb4P3i6elriPF93ArmeBilZCZ67AF-v4KGo_ood5P6Lvi8boEiSFBMvbKJfv1_H6d2PnSFo5Vs7Z/pub?gid=2058631696&single=true&output=csv",
    fallbackCsv: fakherCsvFallback,
    required: true,
  },
  valueChainConfig: {
    key: "valueChainConfig",
    label: "Value chain config",
    url: null,
    fallbackCsv: null,
    required: false,
  },
  legendConfig: {
    key: "legendConfig",
    label: "Legend config",
    url: null,
    fallbackCsv: null,
    required: false,
  },
} as const;

const LEGACY_LAYER_ORDER = [
  "Market",
  "First Mile",
  "Mid Mile",
  "Fulfillment",
  "Last Mile",
  "Reverse",
  "Fintech",
  "Data",
  "Infrastructure",
  "Innovation",
] as const;

type LegacyLayer = (typeof LEGACY_LAYER_ORDER)[number];
type SheetTabKey = keyof typeof SHEET_TABS;

export interface CompanyData {
  id: string;
  brand: string;
  category: string;
  cooperationScore: number;
  competitionScore: number;
  primaryRole: string;
  suggestedMove: string;
  flowType: string;
  strategicImportance: number;
  relationshipType: string;
  layers: Record<string, number>;
}

export interface NormalizedEntity {
  id: string;
  brandName: string;
  industry: string;
  parentFirm: string;
  activity: string;
  description: string;
  coOpAvg: number;
  compAvg: number;
  primaryRole: string;
  secondaryRole: string;
  secondaryRoles: string[];
  exchangeType: string;
  exchangeTypes: string[];
  valueChainStrenghts: string;
  valueChainWeakness: string;
  strengthLayers: string[];
  weaknessLayers: string[];
  actualPartnerships: string[];
  potentialPartnerships: string[];
  exchangeTypeCount: number;
  actualPartnerCount: number;
  potentialPartnerCount: number;
  strategicRelevanceScore: number;
  riskScore: number;
  opportunityScore: number;
  relationshipType: string;
  flowType: string;
  isFakherRelated: boolean;
  layerStates: Record<string, { present: boolean; weak: boolean; source: "strength" | "weakness" | "fakher" | "none" }>;
  recommendedMove: string;
  legacyLayers: Record<string, number>;
}

export interface FakherCompanyConfig {
  id: string;
  name: string;
  normalizedName: string;
  layers: Record<string, number>;
}

export interface ParsedCsv {
  rows: string[][];
}

export interface LoadedSheet {
  key: SheetTabKey;
  label: string;
  rows: string[][];
  source: "google-sheet" | "fallback";
}

export interface LogisticsDataset {
  entities: NormalizedEntity[];
  companies: CompanyData[];
  fakherCompanies: FakherCompanyConfig[];
  valueChainLayers: string[];
  lastUpdated: string;
  source: "google-sheet" | "fallback";
  sheets: Partial<Record<SheetTabKey, LoadedSheet>>;
}

export interface RangeFilter {
  min: number;
  max: number;
}

export interface GlobalFilters {
  search: string;
  holding: string;
  industry: string;
  primaryRole: string;
  secondaryRole: string;
  exchangeType: string;
  actualPartnership: string;
  potentialPartnership: string;
  coOpRange: RangeFilter;
  compRange: RangeFilter;
  minStrategicRelevance: number;
}

export interface GlobalFilterOptions {
  holdings: string[];
  industries: string[];
  primaryRoles: string[];
  secondaryRoles: string[];
  exchangeTypes: string[];
  actualPartnerships: string[];
  potentialPartnerships: string[];
}

export const EMPTY_FILTER_VALUE = "All";

export interface IndustryCoverageInsight {
  industry: string;
  actualMatches: number;
  potentialMatches: number;
  status: "current" | "potential-only" | "no-presence";
  topPotentialBrands: string[];
}

export interface PrimaryRoleInsight {
  role: string;
  brandCount: number;
  averageCoOpAvg: number;
  averageCompAvg: number;
  commonExchangeTypes: string[];
  commonStrengths: string[];
  commonWeaknesses: string[];
  recommendedMove: string;
}

export interface SecondaryRoleInsight {
  role: string;
  brandCount: number;
  averageCoOpAvg: number;
  averageCompAvg: number;
  dominantHoldings: string[];
  orientation: "partnership-heavy" | "competition-heavy" | "hybrid";
}

export interface RecommendationEntity {
  id: string;
  brandName: string;
  industry: string;
  parentFirm: string;
  primaryRole: string;
  secondaryRole: string;
  exchangeType: string;
  coOpAvg: number;
  compAvg: number;
  strategicRelevanceScore: number;
  riskScore: number;
  opportunityScore: number;
  recommendedMove: string;
}

export interface IndustryOpportunityInsight {
  industry: string;
  opportunityScore: number;
  currentPresenceCount: number;
  potentialPresenceCount: number;
  topBrands: string[];
}

export interface StrategicRecommendations {
  purePartners: RecommendationEntity[];
  highRiskCompetitors: RecommendationEntity[];
  coopetitors: RecommendationEntity[];
  quickWinPartnerships: RecommendationEntity[];
  apiDataCandidates: RecommendationEntity[];
  jvCandidates: RecommendationEntity[];
  internalBuildCandidates: RecommendationEntity[];
  industryOpportunities: IndustryOpportunityInsight[];
}

export const LAYER_DISPLAY_LABELS: Record<string, string> = {
  Market: "بازار و اکوسیستم",
  "First Mile": "فرست‌مایل",
  "Mid Mile": "میدمایل",
  Fulfillment: "فولفیلمنت",
  "Last Mile": "لست‌مایل",
  Reverse: "لجستیک معکوس",
  Fintech: "فین‌تک",
  Data: "داده",
  Infrastructure: "زیرساخت",
  Innovation: "نوآوری و استراتژی",
};

type RawRecord = Record<string, string>;

function debugLog(message: string, payload?: unknown) {
  if (!IS_DEV) return;
  if (payload === undefined) {
    console.debug(`[dataService] ${message}`);
    return;
  }
  console.debug(`[dataService] ${message}`, payload);
}

function normalizeHeaderKey(value: string | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/["'`]/g, "")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeToken(value: string | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/\u200c/g, "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, "")
    .replace(/[-–—]/g, "")
    .replace(/[&/|]/g, "");
}

function normalizeName(value: string | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ");
}

function safeNumber(value: string | undefined): number {
  const parsed = Number.parseFloat((value ?? "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function round(value: number): number {
  return Number.parseFloat(value.toFixed(2));
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function topValues(values: string[], count = 3): string[] {
  const tally = values.reduce<Map<string, number>>((acc, value) => {
    if (!value) return acc;
    acc.set(value, (acc.get(value) ?? 0) + 1);
    return acc;
  }, new Map());

  return [...tally.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fa"))
    .slice(0, count)
    .map(([value]) => value);
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function toRecommendationEntity(entity: NormalizedEntity): RecommendationEntity {
  return {
    id: entity.id,
    brandName: entity.brandName,
    industry: entity.industry,
    parentFirm: entity.parentFirm,
    primaryRole: entity.primaryRole,
    secondaryRole: entity.secondaryRole,
    exchangeType: entity.exchangeType,
    coOpAvg: entity.coOpAvg,
    compAvg: entity.compAvg,
    strategicRelevanceScore: entity.strategicRelevanceScore,
    riskScore: entity.riskScore,
    opportunityScore: entity.opportunityScore,
    recommendedMove: entity.recommendedMove,
  };
}

const COLUMN_ALIASES: Record<string, keyof RawRecord> = {
  "brand name(firm name)": "brandName",
  "brandname(firmname)": "brandName",
  industry: "industry",
  "parent firm (holding)": "parentFirm",
  "parentfirm(holding)": "parentFirm",
  activity: "activity",
  description: "description",
  "co-op avg": "coOpAvg",
  "coop avg": "coOpAvg",
  "comp avg": "compAvg",
  "primary role": "primaryRole",
  "secondary role": "secondaryRole",
  "exchange type": "exchangeType",
  "value chain strenghts": "valueChainStrenghts",
  "value chain strengths": "valueChainStrenghts",
  "value chain weakness": "valueChainWeakness",
  "actual partnerships": "actualPartnerships",
  "potential partnerships": "potentialPartnerships",
};

const LAYER_ALIASES: Record<string, LegacyLayer> = {
  market: "Market",
  ecosystem: "Market",
  "بازارواکوسیستم": "Market",
  "firstmile": "First Mile",
  "first-mile": "First Mile",
  "firstmile.": "First Mile",
  "midmile": "Mid Mile",
  "mid-mile": "Mid Mile",
  storage: "Fulfillment",
  hub: "Fulfillment",
  fulfillment: "Fulfillment",
  fullfillment: "Fulfillment",
  fullfillments: "Fulfillment",
  "lastmile": "Last Mile",
  "last-mile": "Last Mile",
  reverse: "Reverse",
  reverselogistics: "Reverse",
  fintech: "Fintech",
  payment: "Fintech",
  finance: "Fintech",
  data: "Data",
  cloud: "Data",
  infrastructure: "Infrastructure",
  innovation: "Innovation",
  strategy: "Innovation",
  strategyinnovations: "Innovation",
};

export function parseCSV(csvText: string): ParsedCsv {
  const rows = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: false,
  }).data;

  return { rows };
}

export function splitMultiValueField(
  value: string | undefined,
  delimiters: RegExp = /[,،;\n]+/,
): string[] {
  return unique(
    (value ?? "")
      .split(delimiters)
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

export function extractValueChainLayers(value: string | undefined): string[] {
  const items = splitMultiValueField(value, /[,،|\n]+/).flatMap((item) => item.split(/\s{2,}/));

  return unique(
    items
      .map((item) => LAYER_ALIASES[normalizeToken(item)] ?? null)
      .filter((item): item is LegacyLayer => Boolean(item)),
  );
}

export function calculateStrategicScores(input: {
  coOpAvg: number;
  compAvg: number;
  exchangeTypeCount: number;
  potentialPartnerCount: number;
  actualPartnerCount?: number;
}) {
  return {
    strategicRelevanceScore: round(
      input.coOpAvg * 0.35 +
        input.compAvg * 0.25 +
        input.exchangeTypeCount * 0.15 +
        input.potentialPartnerCount * 0.25,
    ),
    riskScore: round(input.compAvg * 0.6 + input.coOpAvg * 0.2 + input.exchangeTypeCount * 0.2),
    opportunityScore: round(
      input.coOpAvg * 0.45 + input.potentialPartnerCount * 0.3 + input.exchangeTypeCount * 0.25,
    ),
  };
}

async function fetchCsvText(
  key: SheetTabKey,
  url: string | null,
  fallbackCsv: string | null,
  required: boolean,
): Promise<{ text: string | null; source: "google-sheet" | "fallback" | "missing" }> {
  if (!url) {
    debugLog(`No URL configured for optional tab "${key}"`);
    return { text: fallbackCsv, source: fallbackCsv ? "fallback" : "missing" };
  }

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const text = await response.text();
    debugLog(`Loaded remote CSV for "${key}"`, { length: text.length });
    return { text, source: "google-sheet" };
  } catch (error) {
    if (!fallbackCsv && required) {
      throw error;
    }
    debugLog(`Falling back for "${key}"`, error);
    return { text: fallbackCsv, source: fallbackCsv ? "fallback" : "missing" };
  }
}

function rowsToRecords(rows: string[][], headerRowIndex: number, dataStartRowIndex: number): RawRecord[] {
  const headers = rows[headerRowIndex]?.map((header) => COLUMN_ALIASES[normalizeHeaderKey(header)] ?? "") ?? [];

  return rows.slice(dataStartRowIndex).reduce<RawRecord[]>((records, row) => {
    if (!row.some((cell) => (cell ?? "").trim())) return records;

    const record = headers.reduce<RawRecord>((acc, header, index) => {
      if (header) {
        acc[header] = row[index]?.trim() ?? "";
      }
      return acc;
    }, {} as RawRecord);

    if (record.brandName || record.parentFirm || record.industry) {
      records.push(record);
    }

    return records;
  }, []);
}

function parseFakherCompanies(rows: string[][]): FakherCompanyConfig[] {
  const headers = rows[0] ?? [];
  const normalizedLayers = headers.slice(1).map((header) => LAYER_ALIASES[normalizeToken(header)] ?? null);

  return rows.slice(1).reduce<FakherCompanyConfig[]>((companies, row, index) => {
    const name = row[0]?.trim();
    if (!name) return companies;

    const layers = normalizedLayers.reduce<Record<string, number>>((acc, layer, layerIndex) => {
      if (!layer) return acc;
      acc[layer] = safeNumber(row[layerIndex + 1]);
      return acc;
    }, {});

    companies.push({
      id: `fakher-${index}`,
      name,
      normalizedName: normalizeName(name),
      layers,
    });

    return companies;
  }, []);
}

function calculateRelationshipType(primaryRole: string, coOpAvg: number, compAvg: number, isOwned: boolean) {
  const normalizedRole = normalizeHeaderKey(primaryRole);

  if (isOwned || normalizedRole.includes("owned") || normalizedRole.includes("مالک") || normalizedRole.includes("داخلی")) {
    return "Owned";
  }
  if (normalizedRole.includes("coopetitor") || primaryRole.includes("شریک-رقیب")) {
    return "Coopetitor";
  }
  if (normalizedRole.includes("partner") || primaryRole.includes("شریک")) {
    return "Partner";
  }
  if (normalizedRole.includes("competitor") || primaryRole.includes("رقیب")) {
    return "Competitor";
  }
  if (coOpAvg >= 5 && compAvg >= 5) return "Coopetitor";
  if (coOpAvg >= 5 && compAvg < 5) return "Partner";
  if (compAvg >= 5) return "Competitor";
  if (coOpAvg >= 4) return "Opportunity";
  return "Neutral";
}

function determineFlowType(exchangeTypes: string[], layers: string[]): string {
  const normalizedExchange = exchangeTypes.map((item) => normalizeToken(item));

  if (normalizedExchange.some((item) => item.includes("data"))) return "Data";
  if (normalizedExchange.some((item) => item.includes("payment") || item.includes("finance") || item.includes("fintech"))) {
    return "Financial";
  }
  if (normalizedExchange.some((item) => item.includes("goods") || item.includes("product"))) return "Goods";
  if (
    normalizedExchange.some((item) => item.includes("logistic") || item.includes("operation")) ||
    layers.some((layer) =>
      ["First Mile", "Mid Mile", "Fulfillment", "Last Mile", "Reverse"].includes(layer),
    )
  ) {
    return "Operational";
  }
  return "Mixed";
}

function toLegacyLayerMap(strengthLayers: string[], weaknessLayers: string[], fakherLayers: Record<string, number>) {
  return LEGACY_LAYER_ORDER.reduce<Record<string, number>>((acc, layer) => {
    if ((fakherLayers[layer] ?? 0) > 0) {
      acc[layer] = Math.max(1, Math.min(3, Math.round(fakherLayers[layer] * 3)));
      return acc;
    }
    if (strengthLayers.includes(layer)) {
      acc[layer] = 3;
      return acc;
    }
    if (weaknessLayers.includes(layer)) {
      acc[layer] = 1;
      return acc;
    }
    acc[layer] = 0;
    return acc;
  }, {});
}

function createRecommendedMove(relationshipType: string, opportunityScore: number, riskScore: number) {
  if (relationshipType === "Owned") return "توسعه هم‌افزایی داخلی";
  if (relationshipType === "Partner") return "تعریف همکاری ساختاریافته";
  if (relationshipType === "Coopetitor") return "همکاری کنترل‌شده با مرزبندی روشن";
  if (relationshipType === "Competitor" && riskScore >= 5.5) return "پایش رقابتی و پاسخ تهاجمی";
  if (opportunityScore >= 4.5) return "بررسی شراکت بالقوه";
  return "نیازمند بررسی بیشتر";
}

function createLayerStates(
  layers: string[],
  strengthLayers: string[],
  weaknessLayers: string[],
  fakherLayers: Record<string, number>,
) {
  return layers.reduce<
    Record<string, { present: boolean; weak: boolean; source: "strength" | "weakness" | "fakher" | "none" }>
  >((acc, layer) => {
    const hasFakherPresence = (fakherLayers[layer] ?? 0) > 0;
    const hasStrength = strengthLayers.includes(layer);
    const hasWeakness = weaknessLayers.includes(layer);

    acc[layer] = {
      present: hasFakherPresence || hasStrength,
      weak: hasWeakness,
      source: hasFakherPresence ? "fakher" : hasStrength ? "strength" : hasWeakness ? "weakness" : "none",
    };
    return acc;
  }, {});
}

export function normalizeData(
  ecosystemRows: string[][],
  fakherRows: string[][],
  valueChainRows?: string[][],
  legendRows?: string[][],
): LogisticsDataset {
  const ecosystemRecords = rowsToRecords(ecosystemRows, 0, 3);
  const fakherCompanies = parseFakherCompanies(fakherRows);
  const fakherLookup = new Map(fakherCompanies.map((company) => [company.normalizedName, company]));
  const allDiscoveredLayers = unique([
    ...LEGACY_LAYER_ORDER,
    ...ecosystemRecords.flatMap((record) => [
      ...extractValueChainLayers(record.valueChainStrenghts),
      ...extractValueChainLayers(record.valueChainWeakness),
    ]),
    ...fakherCompanies.flatMap((company) =>
      Object.keys(company.layers).filter((layer) => (company.layers[layer] ?? 0) > 0),
    ),
  ]);

  const entities = ecosystemRecords.map<NormalizedEntity>((record, index) => {
    const brandName = record.brandName || `Entity ${index + 1}`;
    const exchangeTypes = splitMultiValueField(record.exchangeType, /[,،/|\n]+/);
    const strengthLayers = extractValueChainLayers(record.valueChainStrenghts);
    const weaknessLayers = extractValueChainLayers(record.valueChainWeakness);
    const actualPartnerships = splitMultiValueField(record.actualPartnerships);
    const potentialPartnerships = splitMultiValueField(record.potentialPartnerships);
    const secondaryRoles = splitMultiValueField(record.secondaryRole, /[\/|,،\n]+/);
    const scoreBundle = calculateStrategicScores({
      coOpAvg: safeNumber(record.coOpAvg),
      compAvg: safeNumber(record.compAvg),
      exchangeTypeCount: exchangeTypes.length,
      potentialPartnerCount: potentialPartnerships.length,
      actualPartnerCount: actualPartnerships.length,
    });
    const matchedFakher = fakherLookup.get(normalizeName(brandName));
    const isFakherRelated =
      Boolean(matchedFakher) ||
      actualPartnerships.some((partner) => fakherLookup.has(normalizeName(partner))) ||
      potentialPartnerships.some((partner) => fakherLookup.has(normalizeName(partner)));
    const relationshipType = calculateRelationshipType(
      record.primaryRole ?? "",
      safeNumber(record.coOpAvg),
      safeNumber(record.compAvg),
      Boolean(matchedFakher),
    );
    const flowType = determineFlowType(exchangeTypes, strengthLayers);
    const legacyLayers = toLegacyLayerMap(strengthLayers, weaknessLayers, matchedFakher?.layers ?? {});
    const layerStates = createLayerStates(
      allDiscoveredLayers,
      strengthLayers,
      weaknessLayers,
      matchedFakher?.layers ?? {},
    );

    return {
      id: `entity-${index}`,
      brandName,
      industry: record.industry || "نامشخص",
      parentFirm: record.parentFirm || "مستقل",
      activity: record.activity || "نامشخص",
      description: record.description || "",
      coOpAvg: safeNumber(record.coOpAvg),
      compAvg: safeNumber(record.compAvg),
      primaryRole: record.primaryRole || "نامشخص",
      secondaryRole: record.secondaryRole || "",
      secondaryRoles,
      exchangeType: record.exchangeType || "",
      exchangeTypes,
      valueChainStrenghts: record.valueChainStrenghts || "",
      valueChainWeakness: record.valueChainWeakness || "",
      strengthLayers,
      weaknessLayers,
      actualPartnerships,
      potentialPartnerships,
      exchangeTypeCount: exchangeTypes.length,
      actualPartnerCount: actualPartnerships.length,
      potentialPartnerCount: potentialPartnerships.length,
      strategicRelevanceScore: scoreBundle.strategicRelevanceScore,
      riskScore: scoreBundle.riskScore,
      opportunityScore: scoreBundle.opportunityScore,
      relationshipType,
      flowType,
      isFakherRelated,
      layerStates,
      recommendedMove: createRecommendedMove(
        relationshipType,
        scoreBundle.opportunityScore,
        scoreBundle.riskScore,
      ),
      legacyLayers,
    };
  });

  const companies = entities.map<CompanyData>((entity) => ({
    id: entity.id,
    brand: entity.brandName,
    category: entity.industry,
    cooperationScore: entity.coOpAvg,
    competitionScore: entity.compAvg,
    primaryRole: entity.primaryRole,
    suggestedMove: entity.recommendedMove,
    flowType: entity.flowType,
    strategicImportance: entity.strategicRelevanceScore,
    relationshipType: entity.relationshipType,
    layers: entity.legacyLayers,
  }));

  const valueChainLayers = allDiscoveredLayers;

  debugLog("Normalized sheet data", {
    ecosystemRows: ecosystemRecords.length,
    fakherRows: fakherCompanies.length,
    valueChainConfigRows: valueChainRows?.length ?? 0,
    legendConfigRows: legendRows?.length ?? 0,
  });

  return {
    entities,
    companies,
    fakherCompanies,
    valueChainLayers,
    lastUpdated: new Date().toISOString(),
    source: "google-sheet",
    sheets: {},
  };
}

export async function loadAllSheets(): Promise<LogisticsDataset> {
  const entries = await Promise.all(
    Object.values(SHEET_TABS).map(async (tab) => {
      const result = await fetchCsvText(tab.key, tab.url, tab.fallbackCsv, tab.required);
      if (!result.text) return null;

      return {
        key: tab.key,
        label: tab.label,
        rows: parseCSV(result.text).rows,
        source: result.source === "missing" ? "fallback" : result.source,
      } satisfies LoadedSheet;
    }),
  );

  const sheets = entries.reduce<Partial<Record<SheetTabKey, LoadedSheet>>>((acc, entry) => {
    if (entry) {
      acc[entry.key] = entry;
    }
    return acc;
  }, {});

  const ecosystemSheet = sheets.ecosystem;
  const fakherSheet = sheets.fakherCompanies;

  if (!ecosystemSheet || !fakherSheet) {
    throw new Error("Required Google Sheet tabs are not available.");
  }

  const dataset = normalizeData(
    ecosystemSheet.rows,
    fakherSheet.rows,
    sheets.valueChainConfig?.rows,
    sheets.legendConfig?.rows,
  );

  const hasFallback = Object.values(sheets).some((sheet) => sheet.source === "fallback");

  return {
    ...dataset,
    source: hasFallback ? "fallback" : "google-sheet",
    lastUpdated: new Date().toISOString(),
    sheets,
  };
}

export async function loadCompanyData(): Promise<{
  companies: CompanyData[];
  source: "google-sheet" | "fallback";
  lastUpdated: string;
}> {
  const dataset = await loadAllSheets();
  return {
    companies: dataset.companies,
    source: dataset.source,
    lastUpdated: dataset.lastUpdated,
  };
}

export function filterData(data: CompanyData[], filters: { type?: string; minStrategy?: number }) {
  return data.filter((company) => {
    if (
      filters.type &&
      filters.type !== "All" &&
      company.relationshipType !== filters.type &&
      company.primaryRole !== filters.type &&
      !company.primaryRole.includes(filters.type)
    ) {
      return false;
    }

    if (filters.minStrategy && company.strategicImportance < filters.minStrategy) {
      return false;
    }

    return true;
  });
}

export function formatLastUpdated(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function createDefaultGlobalFilters(): GlobalFilters {
  return {
    search: "",
    holding: EMPTY_FILTER_VALUE,
    industry: EMPTY_FILTER_VALUE,
    primaryRole: EMPTY_FILTER_VALUE,
    secondaryRole: EMPTY_FILTER_VALUE,
    exchangeType: EMPTY_FILTER_VALUE,
    actualPartnership: EMPTY_FILTER_VALUE,
    potentialPartnership: EMPTY_FILTER_VALUE,
    coOpRange: { min: 0, max: 10 },
    compRange: { min: 0, max: 10 },
    minStrategicRelevance: 0,
  };
}

export function getGlobalFilterOptions(entities: NormalizedEntity[]): GlobalFilterOptions {
  const uniqueSorted = (values: string[]) =>
    [EMPTY_FILTER_VALUE, ...Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "fa"))];

  return {
    holdings: uniqueSorted(entities.map((entity) => entity.parentFirm)),
    industries: uniqueSorted(entities.map((entity) => entity.industry)),
    primaryRoles: uniqueSorted(entities.map((entity) => entity.primaryRole)),
    secondaryRoles: uniqueSorted(entities.flatMap((entity) => entity.secondaryRoles)),
    exchangeTypes: uniqueSorted(entities.flatMap((entity) => entity.exchangeTypes)),
    actualPartnerships: uniqueSorted(entities.flatMap((entity) => entity.actualPartnerships)),
    potentialPartnerships: uniqueSorted(entities.flatMap((entity) => entity.potentialPartnerships)),
  };
}

export function applyGlobalFilters(entities: NormalizedEntity[], filters: GlobalFilters) {
  const normalizedQuery = filters.search.trim().toLowerCase();

  return entities.filter((entity) => {
    const matchesSearch =
      !normalizedQuery ||
      [
        entity.brandName,
        entity.industry,
        entity.parentFirm,
        entity.primaryRole,
        entity.secondaryRole,
        entity.exchangeType,
        entity.actualPartnerships.join(" "),
        entity.potentialPartnerships.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    if (!matchesSearch) return false;
    if (filters.holding !== EMPTY_FILTER_VALUE && entity.parentFirm !== filters.holding) return false;
    if (filters.industry !== EMPTY_FILTER_VALUE && entity.industry !== filters.industry) return false;
    if (filters.primaryRole !== EMPTY_FILTER_VALUE && entity.primaryRole !== filters.primaryRole) return false;
    if (
      filters.secondaryRole !== EMPTY_FILTER_VALUE &&
      !entity.secondaryRoles.includes(filters.secondaryRole)
    ) {
      return false;
    }
    if (
      filters.exchangeType !== EMPTY_FILTER_VALUE &&
      !entity.exchangeTypes.includes(filters.exchangeType)
    ) {
      return false;
    }
    if (
      filters.actualPartnership !== EMPTY_FILTER_VALUE &&
      !entity.actualPartnerships.includes(filters.actualPartnership)
    ) {
      return false;
    }
    if (
      filters.potentialPartnership !== EMPTY_FILTER_VALUE &&
      !entity.potentialPartnerships.includes(filters.potentialPartnership)
    ) {
      return false;
    }
    if (entity.coOpAvg < filters.coOpRange.min || entity.coOpAvg > filters.coOpRange.max) return false;
    if (entity.compAvg < filters.compRange.min || entity.compAvg > filters.compRange.max) return false;
    if (entity.strategicRelevanceScore < filters.minStrategicRelevance) return false;

    return true;
  });
}

export function getFakherRelatedEntities(entities: NormalizedEntity[]) {
  return entities.filter((entity) => entity.isFakherRelated);
}

export function getIndustryCoverageInsights(entities: NormalizedEntity[]): IndustryCoverageInsight[] {
  const industries = Array.from(new Set(entities.map((entity) => entity.industry).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "fa"),
  );

  return industries.map((industry) => {
    const industryEntities = entities.filter((entity) => entity.industry === industry);
    const actualMatches = industryEntities.filter((entity) => entity.actualPartnerCount > 0).length;
    const potentialMatches = industryEntities.filter((entity) => entity.potentialPartnerCount > 0).length;
    const status =
      actualMatches > 0 ? "current" : potentialMatches > 0 ? "potential-only" : "no-presence";

    return {
      industry,
      actualMatches,
      potentialMatches,
      status,
      topPotentialBrands: industryEntities
        .filter((entity) => entity.potentialPartnerCount > 0)
        .sort((a, b) => b.opportunityScore - a.opportunityScore)
        .slice(0, 4)
        .map((entity) => entity.brandName),
    };
  });
}

export function getPrimaryRoleInsights(entities: NormalizedEntity[]): PrimaryRoleInsight[] {
  const groups = Array.from(
    entities.reduce<Map<string, NormalizedEntity[]>>((acc, entity) => {
      const key = entity.primaryRole || "نامشخص";
      const items = acc.get(key) ?? [];
      items.push(entity);
      acc.set(key, items);
      return acc;
    }, new Map()),
  );

  return groups
    .map(([role, items]) => {
      const avgCoOp = round(items.reduce((sum, item) => sum + item.coOpAvg, 0) / items.length);
      const avgComp = round(items.reduce((sum, item) => sum + item.compAvg, 0) / items.length);
      const commonExchangeTypes = topValues(items.flatMap((item) => item.exchangeTypes), 4);
      const commonStrengths = topValues(items.flatMap((item) => item.strengthLayers), 4);
      const commonWeaknesses = topValues(items.flatMap((item) => item.weaknessLayers), 4);

      const recommendedMove =
        avgCoOp >= 6 && avgComp < 5
          ? "تقویت مشارکت ساختاریافته و تعریف بسته همکاری استاندارد"
          : avgCoOp >= 5 && avgComp >= 5
            ? "تعریف چارچوب همکاری کنترل‌شده با مرزبندی رقابتی روشن"
            : avgComp >= 6
              ? "پایش رقابتی مستمر و تقویت مزیت‌های متمایز"
              : "پایش فرصت و آماده‌سازی مسیر ورود مرحله‌ای";

      return {
        role,
        brandCount: items.length,
        averageCoOpAvg: avgCoOp,
        averageCompAvg: avgComp,
        commonExchangeTypes,
        commonStrengths,
        commonWeaknesses,
        recommendedMove,
      };
    })
    .sort((a, b) => b.brandCount - a.brandCount || b.averageCoOpAvg - a.averageCoOpAvg);
}

export function getSecondaryRoleInsights(entities: NormalizedEntity[]): SecondaryRoleInsight[] {
  const roleMap = new Map<string, NormalizedEntity[]>();

  entities.forEach((entity) => {
    const roles = entity.secondaryRoles.length > 0 ? entity.secondaryRoles : ["بدون نقش ثانویه"];
    roles.forEach((role) => {
      const items = roleMap.get(role) ?? [];
      items.push(entity);
      roleMap.set(role, items);
    });
  });

  return [...roleMap.entries()]
    .map(([role, items]) => {
      const averageCoOpAvg = round(items.reduce((sum, item) => sum + item.coOpAvg, 0) / items.length);
      const averageCompAvg = round(items.reduce((sum, item) => sum + item.compAvg, 0) / items.length);
      const dominantHoldings = topValues(items.map((item) => item.parentFirm), 3);
      const orientation =
        averageCoOpAvg >= 5.5 && averageCompAvg < 5
          ? "partnership-heavy"
          : averageCompAvg >= 5.5 && averageCoOpAvg < 5
            ? "competition-heavy"
            : "hybrid";

      return {
        role,
        brandCount: items.length,
        averageCoOpAvg,
        averageCompAvg,
        dominantHoldings,
        orientation,
      };
    })
    .sort((a, b) => b.brandCount - a.brandCount || b.averageCoOpAvg - a.averageCoOpAvg);
}

export function getFakherCompanyPartnershipMatches(
  entities: NormalizedEntity[],
  fakherCompanies: FakherCompanyConfig[],
  selectedCompanyName: string,
) {
  const normalizedTarget = normalizeName(selectedCompanyName);
  const fakherLookup = new Set(fakherCompanies.map((company) => company.normalizedName));
  const targetExists = fakherLookup.has(normalizedTarget);

  if (!targetExists) return [];

  return entities
    .filter((entity) => entity.potentialPartnerships.some((partner) => normalizeName(partner) === normalizedTarget))
    .map((entity) => ({
      ...toRecommendationEntity(entity),
      recommendedMove:
        entity.coOpAvg >= 6 && entity.compAvg < 5
          ? "ورود سریع به مذاکره و تعریف پایلوت همکاری"
          : entity.coOpAvg >= 5 && entity.compAvg >= 5
            ? "همکاری مرحله‌ای با مرزبندی شفاف و KPI مشترک"
            : entity.opportunityScore >= 4.5
              ? "اعتبارسنجی فرصت و طراحی بسته مشارکت"
              : "نیازمند بررسی عمیق‌تر و امتیازدهی تکمیلی",
    }))
    .sort((a, b) => b.opportunityScore - a.opportunityScore || b.strategicRelevanceScore - a.strategicRelevanceScore);
}

export function getIndustryOpportunityInsights(entities: NormalizedEntity[]): IndustryOpportunityInsight[] {
  const industryMap = new Map<string, NormalizedEntity[]>();

  entities.forEach((entity) => {
    const items = industryMap.get(entity.industry) ?? [];
    items.push(entity);
    industryMap.set(entity.industry, items);
  });

  return [...industryMap.entries()]
    .map(([industry, items]) => {
      const opportunityScore = average(items.map((item) => item.opportunityScore));
      const currentPresenceCount = items.filter((item) => item.actualPartnerCount > 0).length;
      const potentialPresenceCount = items.filter((item) => item.potentialPartnerCount > 0).length;

      return {
        industry,
        opportunityScore,
        currentPresenceCount,
        potentialPresenceCount,
        topBrands: items
          .sort((a, b) => b.opportunityScore - a.opportunityScore)
          .slice(0, 4)
          .map((item) => item.brandName),
      };
    })
    .filter((item) => item.potentialPresenceCount > item.currentPresenceCount || item.currentPresenceCount <= 1)
    .sort(
      (a, b) =>
        b.opportunityScore - a.opportunityScore ||
        b.potentialPresenceCount - a.potentialPresenceCount ||
        a.currentPresenceCount - b.currentPresenceCount,
    )
    .slice(0, 10);
}

export function getStrategicRecommendations(entities: NormalizedEntity[]): StrategicRecommendations {
  const purePartners = entities
    .filter((entity) => entity.coOpAvg >= 6 && entity.compAvg < 5)
    .sort((a, b) => b.strategicRelevanceScore - a.strategicRelevanceScore)
    .slice(0, 10)
    .map(toRecommendationEntity);

  const highRiskCompetitors = entities
    .filter((entity) => entity.compAvg >= 6 && entity.coOpAvg < 5)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10)
    .map(toRecommendationEntity);

  const coopetitors = entities
    .filter((entity) => entity.coOpAvg >= 5 && entity.compAvg >= 5)
    .sort((a, b) => b.strategicRelevanceScore - a.strategicRelevanceScore)
    .slice(0, 10)
    .map(toRecommendationEntity);

  const quickWinPartnerships = entities
    .filter((entity) => entity.potentialPartnerCount > 0 && entity.compAvg < 5.5 && entity.opportunityScore >= 4.5)
    .sort((a, b) => b.opportunityScore - a.opportunityScore || b.coOpAvg - a.coOpAvg)
    .slice(0, 10)
    .map(toRecommendationEntity);

  const apiDataCandidates = entities
    .filter(
      (entity) =>
        entity.flowType === "Data" ||
        entity.exchangeTypes.some((type) => {
          const normalized = normalizeToken(type);
          return normalized.includes("data") || normalized.includes("api") || normalized.includes("cloud");
        }),
    )
    .sort((a, b) => b.opportunityScore - a.opportunityScore || b.strategicRelevanceScore - a.strategicRelevanceScore)
    .slice(0, 10)
    .map(toRecommendationEntity);

  const jvCandidates = entities
    .filter(
      (entity) =>
        entity.coOpAvg >= 5 &&
        entity.compAvg >= 4 &&
        (entity.exchangeTypeCount > 1 || entity.potentialPartnerCount > 1 || entity.actualPartnerCount > 0),
    )
    .sort((a, b) => b.strategicRelevanceScore - a.strategicRelevanceScore || b.coOpAvg - a.coOpAvg)
    .slice(0, 10)
    .map(toRecommendationEntity);

  const internalBuildCandidates = entities
    .filter(
      (entity) =>
        entity.compAvg >= 6 &&
        entity.actualPartnerCount === 0 &&
        (entity.weaknessLayers.length > 0 || entity.potentialPartnerCount === 0),
    )
    .sort((a, b) => b.riskScore - a.riskScore || b.strategicRelevanceScore - a.strategicRelevanceScore)
    .slice(0, 10)
    .map(toRecommendationEntity);

  return {
    purePartners,
    highRiskCompetitors,
    coopetitors,
    quickWinPartnerships,
    apiDataCandidates,
    jvCandidates,
    internalBuildCandidates,
    industryOpportunities: getIndustryOpportunityInsights(entities),
  };
}
