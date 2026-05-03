import MainLayout from "../components/layout/MainLayout";
import UpgradeBanner from "../components/base/UpgradeBanner";
import InsightFilters from "../components/insights/InsightFilters";
import StatsGrid from "../components/insights/StatsGrid";
import ChartCard from "../components/insights/ChartCard";
import RecommendationCard from "../components/insights/RecommendationCard";
import DayDetailLocked from "../components/insights/DayDetailLocked";
import "./InsightsPage.css";

function InsightsPage() {
  return (
    <MainLayout title="Inzichten" subtitle="Ontdek je patronen en trends">
      <section className="insights-page">
        <UpgradeBanner />

        <InsightFilters />

        <p className="insights-date">30 maart 2026</p>

        <StatsGrid />

        <div className="insights-charts">
          <ChartCard title="Stress & Energie Trends" type="line" />
          <ChartCard title="Pauzegedrag" type="bar" />
        </div>

        <RecommendationCard />

        <DayDetailLocked />
      </section>
    </MainLayout>
  );
}

export default InsightsPage;