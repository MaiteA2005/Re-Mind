import "./PauseTabs.css";
import favoriteDefaultIcon from "../../assets/icons_groen/hart_default_groen.svg";
import favoriteActiveIcon from "../../assets/icons_wit/hart_default_wit.svg";

function PauseTabs({ activeTab, onTabChange }) {
  return (
    <div className="pauseTabs">
      <button
        type="button"
        className={`pauseTabButton ${activeTab === "short" ? "active" : ""}`}
        onClick={() => onTabChange("short")}
      >
        Korte pauzes
      </button>

      <button
        type="button"
        className={`pauseTabButton ${activeTab === "long" ? "active" : ""}`}
        onClick={() => onTabChange("long")}
      >
        Lange pauzes
      </button>

      <button
        type="button"
        className={`pauseTabButton ${activeTab === "favorites" ? "active" : ""}`}
        onClick={() => onTabChange("favorites")}
      >
        <img src={activeTab === "favorites" ? favoriteActiveIcon : favoriteDefaultIcon} alt="hart" />
        Favorieten
      </button>
    </div>
  );
}

export default PauseTabs;