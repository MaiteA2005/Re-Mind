import FilterTabs from "../base/FilterTabs";
import heartIcon from "../../assets/icons_groen/hart_default_groen.svg";
import heartFilledIcon from "../../assets/icons_wit/hart_filled_wit.svg";

function PauseTabs({ activeTab, onTabChange }) {
  const tabs = [
    { value: "short", label: "Korte pauzes" },
    { value: "long", label: "Lange pauzes" },
    {
      value: "favorites",
      label: "Favorieten",
      icon: heartIcon,
      activeIcon: heartFilledIcon,
    },
  ];

  return (
    <FilterTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}

export default PauseTabs;