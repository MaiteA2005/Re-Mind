import FilterTabs from "../base/FilterTabs";

import workdayBlack from "../../assets/icons_zwart/werkdag_zwart.svg";
import workdayWhite from "../../assets/icons_wit/werkdag_wit.svg";
import focusBlack from "../../assets/icons_zwart/werkdag_zwart.svg";
import focusWhite from "../../assets/icons_wit/werkdag_wit.svg";
import breakBlack from "../../assets/icons_zwart/koffie_zwart.svg";
import breakWhite from "../../assets/icons_wit/koffie_wit.svg";

function TimerTabs({ activeTimer, onChange }) {
  const tabs = [
    {
      value: "workday",
      label: "Werkdag",
      icon: workdayBlack,
      activeIcon: workdayWhite,
    },
    {
      value: "focus",
      label: "Focusblok",
      icon: focusBlack,
      activeIcon: focusWhite,
    },
    {
      value: "break",
      label: "Pauze",
      icon: breakBlack,
      activeIcon: breakWhite,
    },
  ];

  return (
    <FilterTabs
      tabs={tabs}
      activeTab={activeTimer}
      onTabChange={onChange}
    />
  );
}

export default TimerTabs;