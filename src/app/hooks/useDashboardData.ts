import { useCallback, useEffect, useMemo, useState } from "react";

import {
  applyGlobalFilters,
  calculateDashboardStats,
  createDefaultGlobalFilters,
  getFakherRelatedEntities,
  getGlobalFilterOptions,
  getIndustryCoverageInsights,
  getPrimaryRoleInsights,
  getSecondaryRoleInsights,
  getStrategicRecommendations,
  loadAllSheets,
  mapEntitiesToCompanies,
  type CanonicalValueChainLayer,
  type FakherCompanyConfig,
  type FakherHeatmapDataset,
  type GlobalFilters,
  type NormalizedEntity,
} from "../dataService";

export function useDashboardData() {
  const [entities, setEntities] = useState<NormalizedEntity[]>([]);
  const [fakherCompanies, setFakherCompanies] = useState<FakherCompanyConfig[]>([]);
  const [fakherHeatmap, setFakherHeatmap] = useState<FakherHeatmapDataset>({
    companies: [],
    layers: [],
    error: null,
  });
  const [valueChainLayers, setValueChainLayers] = useState<CanonicalValueChainLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState<"google-sheet" | "fallback">("google-sheet");
  const [lastUpdated, setLastUpdated] = useState("");
  const [filters, setFilters] = useState<GlobalFilters>(createDefaultGlobalFilters);

  const refreshData = useCallback(async (showLoader: boolean) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);

    try {
      const result = await loadAllSheets();
      setEntities(result.entities);
      setFakherCompanies(result.fakherCompanies);
      setFakherHeatmap(result.fakherHeatmap);
      setValueChainLayers(result.valueChainLayers);
      setSource(result.source);
      setLastUpdated(result.lastUpdated);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshData(true);
  }, [refreshData]);

  const filterOptions = useMemo(() => getGlobalFilterOptions(entities), [entities]);
  const filteredEntities = useMemo(() => applyGlobalFilters(entities, filters), [entities, filters]);
  const filteredCompanies = useMemo(() => mapEntitiesToCompanies(filteredEntities), [filteredEntities]);
  const fakherIndustryInsights = useMemo(
    () => getIndustryCoverageInsights(getFakherRelatedEntities(filteredEntities)),
    [filteredEntities],
  );
  const primaryRoleInsights = useMemo(() => getPrimaryRoleInsights(filteredEntities), [filteredEntities]);
  const secondaryRoleInsights = useMemo(() => getSecondaryRoleInsights(filteredEntities), [filteredEntities]);
  const strategicRecommendations = useMemo(
    () => getStrategicRecommendations(filteredEntities),
    [filteredEntities],
  );
  const dashboardStats = useMemo(() => calculateDashboardStats(entities), [entities]);

  const updateFilter = useCallback(<Key extends keyof GlobalFilters>(key: Key, value: GlobalFilters[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(createDefaultGlobalFilters());
  }, []);

  return {
    dashboardStats,
    entities,
    fakherCompanies,
    fakherHeatmap,
    fakherIndustryInsights,
    filterOptions,
    filteredCompanies,
    filteredEntities,
    filters,
    lastUpdated,
    loading,
    primaryRoleInsights,
    refreshing,
    resetFilters,
    refreshData,
    secondaryRoleInsights,
    source,
    strategicRecommendations,
    updateFilter,
    valueChainLayers,
  };
}
