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
        ♡ Favorieten
      </button>
    </div>
  );
}

export default PauseTabs;