import { useEffect, useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import PauseTabs from "../components/pause/PauseTabs";
import PauseCard from "../components/pause/PauseCard";

import API_URL from "../services/api";
import {
  getFavoritePauses,
  addFavoritePause,
  removeFavoritePause,
} from "../services/favoritePauseService";

import "./PausePage.css";

function PausePage() {
  const [activeTab, setActiveTab] = useState("short");
  const [pauseSuggestions, setPauseSuggestions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPauseData = async () => {
      try {
        const pauseResponse = await fetch(
          `${API_URL}/api/pause-suggestions`
        );

        const pauseData = await pauseResponse.json();

        setPauseSuggestions(
          Array.isArray(pauseData) ? pauseData : []
        );
      } catch (error) {
        console.error("Pauzes ophalen mislukt:", error);
      }

      try {
        const favoriteData = await getFavoritePauses();

        setFavorites(
          favoriteData.map((pause) => pause._id)
        );
      } catch (error) {
        console.error("Favorieten ophalen mislukt:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPauseData();
  }, []);

  const filteredSuggestions = useMemo(() => {
    if (activeTab === "favorites") {
      return pauseSuggestions.filter((item) => favorites.includes(item._id));
    }
    
    return pauseSuggestions.filter((item) => item.type === activeTab);
  }, [activeTab, favorites, pauseSuggestions]);

  const toggleFavorite = async (id) => {
    const isFavorite = favorites.includes(id);

    try {
      if (isFavorite) {
        await removeFavoritePause(id);
        setFavorites((prev) => prev.filter((favoriteId) => favoriteId !== id));
      } else {
        await addFavoritePause(id);
        setFavorites((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("Favoriet aanpassen mislukt:", error);
    }
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
        ) : filteredSuggestions.length === 0 ? (
          <div className="pauseEmptyState">
            <h3>Geen pauzes gevonden</h3>
            <p>Er zijn momenteel geen pauzes beschikbaar binnen deze categorie.</p>
          </div>
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
                to={
                  suggestion.isCategory &&
                  suggestion.title?.toLowerCase().includes("ademhaling")
                    ? "/pause/breathing"
                    : `/pause/${suggestion.slug}`
                }
              />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default PausePage;