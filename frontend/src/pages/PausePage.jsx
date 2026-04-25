import { useEffect, useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import PauseTabs from "../components/pause/PauseTabs";
import PauseCard from "../components/pause/PauseCard";
import "./PausePage.css";

function PausePage() {
  const [activeTab, setActiveTab] = useState("short");
  const [pauseSuggestions, setPauseSuggestions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPauseSuggestions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pause-suggestions");
        const data = await response.json();

        setPauseSuggestions(data);
      } catch (error) {
        console.error("Fout bij ophalen pauzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPauseSuggestions();
  }, []);

  const filteredSuggestions = useMemo(() => {
    if (activeTab === "favorites") {
      return pauseSuggestions.filter((item) => favorites.includes(item._id));
    }

    return pauseSuggestions.filter((item) => item.type === activeTab);
  }, [activeTab, favorites, pauseSuggestions]);

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

        {loading ? (
          <p className="pauseStatusText">Pauzes laden...</p>
        ) : (
          <div className="pauseGrid">
            {filteredSuggestions.map((suggestion) => (
              <PauseCard
                key={suggestion._id}
                title={suggestion.title}
                description={suggestion.description}
                duration={suggestion.duration}
                icon={suggestion.icon}
                isFavorite={favorites.includes(suggestion._id)}
                onToggleFavorite={() => toggleFavorite(suggestion._id)}
                to={`/pause/${suggestion.slug}`}
              />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default PausePage;