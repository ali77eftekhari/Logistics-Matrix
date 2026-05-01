import { useEffect, useMemo, useState } from "react";

import type { FakherCompanyConfig, NormalizedEntity, RecommendationEntity } from "../dataService";
import { EMPTY_FILTER_VALUE, getFakherCompanyPartnershipMatches } from "../dataService";

interface Props {
  entities: NormalizedEntity[];
  fakherCompanies: FakherCompanyConfig[];
}

export function FakherCompanyFilterView({ entities, fakherCompanies }: Props) {
  const [selectedCompany, setSelectedCompany] = useState<string>(fakherCompanies[0]?.name ?? EMPTY_FILTER_VALUE);

  useEffect(() => {
    if (selectedCompany === EMPTY_FILTER_VALUE && fakherCompanies[0]?.name) {
      setSelectedCompany(fakherCompanies[0].name);
    }
  }, [fakherCompanies, selectedCompany]);

  const options = useMemo(
    () => [EMPTY_FILTER_VALUE, ...fakherCompanies.map((company) => company.name)],
    [fakherCompanies],
  );

  const matches = useMemo<RecommendationEntity[]>(
    () =>
      selectedCompany === EMPTY_FILTER_VALUE
        ? []
        : getFakherCompanyPartnershipMatches(entities, fakherCompanies, selectedCompany),
    [entities, fakherCompanies, selectedCompany],
  );

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Fakher Company Filter View</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              انتخاب هر شرکت فاخر برای مشاهده برندهایی که در ستون Potential Partnerships به آن اشاره کرده‌اند.
            </p>
          </div>
          <select
            value={selectedCompany}
            onChange={(event) => setSelectedCompany(event.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm lg:min-w-[260px] dark:border-slate-700 dark:bg-slate-900"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option === EMPTY_FILTER_VALUE ? "یک شرکت انتخاب کنید" : option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {selectedCompany === EMPTY_FILTER_VALUE
              ? "برای نمایش فرصت‌ها، یک شرکت فاخر را انتخاب کنید."
              : `${matches.length} برند برای ${selectedCompany} پیدا شد`}
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="px-5 py-8 text-sm text-slate-500 dark:text-slate-400">
            هنوز موردی برای نمایش وجود ندارد.
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr className="text-right text-xs text-slate-500 dark:text-slate-400">
                  <th className="px-4 py-3 font-medium">Brand Name</th>
                  <th className="px-4 py-3 font-medium">Industry</th>
                  <th className="px-4 py-3 font-medium">Parent Firm</th>
                  <th className="px-4 py-3 font-medium">Primary Role</th>
                  <th className="px-4 py-3 font-medium">Secondary Role</th>
                  <th className="px-4 py-3 font-medium">Exchange Type</th>
                  <th className="px-4 py-3 font-medium">Co-Op</th>
                  <th className="px-4 py-3 font-medium">Comp</th>
                  <th className="px-4 py-3 font-medium">Suggested Move</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((item) => (
                  <tr key={item.id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{item.brandName}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.industry}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.parentFirm}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.primaryRole}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.secondaryRole || "-"}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.exchangeType || "-"}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.coOpAvg}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.compAvg}</td>
                    <td className="px-4 py-3">
                      <div className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
                        {item.recommendedMove}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
