export const CANONICAL_VALUE_CHAIN_LAYERS = [
  "بازار و اکوسیستم",
  "First - mile",
  "Mid-Mile",
  "Storage & Hub & Fullfillments",
  "Last-Mile",
  "Reverse Logistics",
  "Strategy & Innovations",
  "Infrastructure",
] as const;

export type CanonicalValueChainLayer = (typeof CANONICAL_VALUE_CHAIN_LAYERS)[number];

export const LAYER_DISPLAY_LABELS: Record<CanonicalValueChainLayer, string> = CANONICAL_VALUE_CHAIN_LAYERS.reduce(
  (acc, layer) => {
    acc[layer] = layer;
    return acc;
  },
  {} as Record<CanonicalValueChainLayer, string>,
);

const CANONICAL_LAYER_SET = new Set<string>(CANONICAL_VALUE_CHAIN_LAYERS);
const CANONICAL_LAYER_ORDER = new Map<string, number>(
  CANONICAL_VALUE_CHAIN_LAYERS.map((layer, index) => [layer, index]),
);

const VALUE_CHAIN_LAYER_ALIASES: Record<string, CanonicalValueChainLayer> = {
  "بازارواکوسیستم": "بازار و اکوسیستم",
  market: "بازار و اکوسیستم",
  marketecosystem: "بازار و اکوسیستم",
  ecosystem: "بازار و اکوسیستم",
  "firstmile": "First - mile",
  "first-mile": "First - mile",
  "firstmile.": "First - mile",
  "first-mile.": "First - mile",
  "firstmilelogistics": "First - mile",
  "midmile": "Mid-Mile",
  "mid-mile": "Mid-Mile",
  "midmilelogistics": "Mid-Mile",
  "storagehubfullfillments": "Storage & Hub & Fullfillments",
  "storagehubfulfillment": "Storage & Hub & Fullfillments",
  "storagehubfulfillments": "Storage & Hub & Fullfillments",
  "storagehubfullfillment": "Storage & Hub & Fullfillments",
  "storagehubfullfillments.": "Storage & Hub & Fullfillments",
  storage: "Storage & Hub & Fullfillments",
  hub: "Storage & Hub & Fullfillments",
  fulfillment: "Storage & Hub & Fullfillments",
  fullfillment: "Storage & Hub & Fullfillments",
  fullfillments: "Storage & Hub & Fullfillments",
  warehousing: "Storage & Hub & Fullfillments",
  "lastmile": "Last-Mile",
  "last-mile": "Last-Mile",
  "lastmilelogistics": "Last-Mile",
  reverse: "Reverse Logistics",
  reverselogistics: "Reverse Logistics",
  "strategyinnovations": "Strategy & Innovations",
  strategy: "Strategy & Innovations",
  innovation: "Strategy & Innovations",
  innovations: "Strategy & Innovations",
  infrastructure: "Infrastructure",
};

function normalizeValueChainToken(value: string | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/\u200c/g, "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, "")
    .replace(/[-–—]/g, "")
    .replace(/[&/|]/g, "");
}

export function getCanonicalValueChainLayers(): CanonicalValueChainLayer[] {
  return [...CANONICAL_VALUE_CHAIN_LAYERS];
}

export function mapLegacyLayerAlias(value: string | undefined): CanonicalValueChainLayer | null {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return null;
  if (CANONICAL_LAYER_SET.has(trimmed)) return trimmed as CanonicalValueChainLayer;

  return VALUE_CHAIN_LAYER_ALIASES[normalizeValueChainToken(trimmed)] ?? null;
}

export function normalizeValueChainLayer(value: string | undefined): CanonicalValueChainLayer | null {
  return mapLegacyLayerAlias(value);
}

export function isCanonicalValueChainLayer(value: string | undefined): value is CanonicalValueChainLayer {
  return CANONICAL_LAYER_SET.has(value ?? "");
}

export function sortByCanonicalLayerOrder<T extends string>(layers: T[]): T[] {
  return [...layers].sort((a, b) => {
    const aOrder = CANONICAL_LAYER_ORDER.get(a) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = CANONICAL_LAYER_ORDER.get(b) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder || a.localeCompare(b, "fa");
  });
}

export function formatValueChainLayer(layer: string): string {
  return LAYER_DISPLAY_LABELS[layer as CanonicalValueChainLayer] ?? layer;
}

export function isOperationalValueChainLayer(layer: string): boolean {
  return (
    layer === "First - mile" ||
    layer === "Mid-Mile" ||
    layer === "Storage & Hub & Fullfillments" ||
    layer === "Last-Mile" ||
    layer === "Reverse Logistics"
  );
}
