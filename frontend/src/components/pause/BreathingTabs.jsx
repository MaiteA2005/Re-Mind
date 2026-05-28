import FilterTabs from "../base/FilterTabs";
import heartIcon from "../../assets/icons_zwart/hart_default_zwart.svg";
import heartFilledIcon from "../../assets/icons_wit/hart_filled_wit.svg";

function BreathingTabs({ activeTab, onTabChange }) {
  const tabs = [
    { value: "all", label: "Alle methoden" },
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

export default BreathingTabs;