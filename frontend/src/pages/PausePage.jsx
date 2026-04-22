import { useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import PauseTabs from "../components/pause/PauseTabs.jsx";
import PauseCard from "../components/pause/PauseCard.jsx";
import { pauseSuggestions } from "../data/pauseSuggestionsData";
import "./PausePage.css";

function PausePage() {
  const [activeTab, setActiveTab] = useState("short");
  const [favorites, setFavorites] = useState([1, 4, 7, 8]);

  const filteredSuggestions = useMemo(() => {
    if (activeTab === "favorites") {
      return pauseSuggestions.filter((item) => favorites.includes(item.id));
    }

    return pauseSuggestions.filter((item) => item.type === activeTab);
  }, [activeTab, favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((favoriteId) => favoriteId !== id)
        : [...prev, id]
    );
  };

  return (
    <MainLayout
      title="Pauze suggesties"
      subtitle="Kies een activiteit die bij je past op dit moment"
    >
      <section className="pausePage">
        <PauseTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="pauseGrid">
          {filteredSuggestions.map((suggestion) => (
            <PauseCard
              key={suggestion.id}
              title={suggestion.title}
              description={suggestion.description}
              duration={suggestion.duration}
              icon={suggestion.icon}
              isFavorite={favorites.includes(suggestion.id)}
              onToggleFavorite={() => toggleFavorite(suggestion.id)}
              to={`/pause/${suggestion.slug}`}
            />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

export default PausePage;