import premiumIcon from "../../assets/icons_zwart/premium_zwart.svg";
import "./FilterTabs.css";

function FilterTabs({ tabs, activeTab, onTabChange, size = "default" }) {
  return (
    <div className={`filterTabs ${size === "compact" ? "compact" : ""}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const iconSrc = tab.locked
          ? premiumIcon
          : isActive && tab.activeIcon
          ? tab.activeIcon
          : tab.icon;

        return (
          <button
            key={tab.value}
            type="button"
            className={`filterTab ${isActive ? "active" : ""} ${
              tab.locked ? "locked" : ""
            }`}
            onClick={() => {
              if (!tab.locked) {
                onTabChange(tab.value);
              }
            }}
          >
            {iconSrc && <img src={iconSrc} alt="" className="filterTabIcon" />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;