import FilterTabs from "../base/FilterTabs";
import premiumIcon from "../../assets/icons_zwart/premium_zwart.svg";

function InsightFilters({ activeFilter, onFilterChange, isPremium }) {
  const tabs = [
    { value: "today", label: "Vandaag" },
    { value: "week", label: "Deze week", locked: !isPremium },
    { value: "month", label: "Deze maand", locked: !isPremium },
  ];

  return (
    <FilterTabs
      tabs={tabs}
      activeTab={activeFilter}
      onTabChange={onFilterChange}
    />
  );
}

export default InsightFilters;