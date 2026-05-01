import type { IndustryOpportunityInsight, RecommendationEntity, StrategicRecommendations } from "../dataService";

interface Props {
  recommendations: StrategicRecommendations;
}

function RecommendationList({
  title,
  subtitle,
  items,
  tone,
}: {
  title: string;
  subtitle: string;
  items: RecommendationEntity[];
  tone: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone}`}>Top {items.length}</span>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {items.map((item, index) => (
          <div key={item.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">{index + 1}</span>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{item.brandName}</div>
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {item.industry} • {item.parentFirm} • {item.primaryRole}
                </div>
              </div>
              <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Score {item.strategicRelevanceScore}
              </div>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-3">
              <div>Co-Op: {item.coOpAvg}</div>
              <div>Comp: {item.compAvg}</div>
              <div>Opportunity: {item.opportunityScore}</div>
            </div>
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {item.recommendedMove}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IndustryOpportunityCard({ item }: { item: IndustryOpportunityInsight }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold text-slate-900 dark:text-slate-100">{item.industry}</div>
        <div className="rounded-xl bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          Opp. {item.opportunityScore}
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Current: {item.currentPresenceCount} • Potential: {item.potentialPresenceCount}
      </div>
      <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
        برندهای کلیدی: {item.topBrands.join("، ") || "ثبت نشده"}
      </div>
    </div>
  );
}

export function StrategicRecommendationEngine({ recommendations }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Strategic Recommendation Engine</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          خروجی‌های این بخش برای استفاده مستقیم در تصمیم‌گیری مدیریتی، اولویت‌بندی مشارکت و پایش تهدیدها طراحی شده‌اند.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <RecommendationList
          title="Top 10 Pure Partners"
          subtitle="بازیگرانی با همکاری بالا و فشار رقابتی پایین"
          items={recommendations.purePartners}
          tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
        />
        <RecommendationList
          title="Top 10 High-Risk Competitors"
          subtitle="بازیگرانی با ریسک رقابتی بالا و نیازمند پایش نزدیک"
          items={recommendations.highRiskCompetitors}
          tone="bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
        />
        <RecommendationList
          title="Top 10 Coopetitors"
          subtitle="بازیگرانی که همزمان فرصت همکاری و تهدید رقابتی دارند"
          items={recommendations.coopetitors}
          tone="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
        />
        <RecommendationList
          title="Top 10 Quick-Win Partnerships"
          subtitle="فرصت‌هایی که می‌توانند با اصطکاک کمتر به همکاری تبدیل شوند"
          items={recommendations.quickWinPartnerships}
          tone="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
        />
        <RecommendationList
          title="Best API / Data Partnership Candidates"
          subtitle="کاندیداهای مناسب برای یکپارچه‌سازی داده، API و ظرفیت‌های تحلیلی"
          items={recommendations.apiDataCandidates}
          tone="bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300"
        />
        <RecommendationList
          title="Best JV Candidates"
          subtitle="بازیگرانی که برای مدل سرمایه‌گذاری یا همکاری عمیق‌تر مناسب‌اند"
          items={recommendations.jvCandidates}
          tone="bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Top Industries with Opportunity but Low Presence</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              صنایعی که سیگنال فرصت در آن‌ها بالا است اما حضور فعلی هنوز محدود مانده است.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {recommendations.industryOpportunities.map((item) => (
              <IndustryOpportunityCard key={item.industry} item={item} />
            ))}
          </div>
        </div>

        <RecommendationList
          title="Best Internal Build Candidates"
          subtitle="حوزه‌هایی که وابستگی بیرونی پایین و فشار رقابتی بالا، ساخت داخلی را معنادار می‌کند"
          items={recommendations.internalBuildCandidates}
          tone="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
        />
      </div>
    </div>
  );
}
