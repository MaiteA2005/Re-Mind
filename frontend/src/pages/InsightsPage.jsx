import { useState } from "react";

import { formatDate, getGreeting } from "../utils/date";
import MainLayout from "../components/layout/MainLayout";
import UpgradeBanner from "../components/base/UpgradeBanner";
import InsightFilters from "../components/insights/InsightFilters";
import StatsGrid from "../components/insights/StatsGrid";
import ChartCard from "../components/insights/ChartCard";
import RecommendationCard from "../components/insights/RecommendationCard";
import DayDetailLocked from "../components/insights/DayDetailLocked";

import "./InsightsPage.css";

function InsightsPage() {
  const [activeFilter, setActiveFilter] = useState("today");

  return (
    <MainLayout title="Inzichten" subtitle="Ontdek je patronen en trends">
      <section className="insights-page">
        <UpgradeBanner />

        <InsightFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        <p className="insights-date">{formatDate(new Date())}</p>

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