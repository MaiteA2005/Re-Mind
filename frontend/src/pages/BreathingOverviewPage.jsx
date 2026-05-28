import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Button from "../components/base/Button";
import PauseCard from "../components/pause/PauseCard";
import BreathingTabs from "../components/pause/BreathingTabs";

import API_URL from "../services/api";
import { getFavoritePauses, addFavoritePause, removeFavoritePause,} from "../services/favoritePauseService";

import pijlLinks from "../assets/icons_zwart/pijl_links_zwart.svg";

import "./PausePage.css";

function BreathingOverviewPage() {
    const navigate = useNavigate();

    const [breathingExercises, setBreathingExercises] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBreathingExercises = async () => {
        try {
            const [pauseResponse, favoriteData] = await Promise.all([
            fetch(`${API_URL}/api/pause-suggestions`),
            getFavoritePauses(),
            ]);

            const data = await pauseResponse.json();

            const exercises = data.filter((item) => item.category === "breathing");

            setBreathingExercises(exercises);
            setFavorites(favoriteData.map((pause) => pause._id));
        } catch (error) {
            console.error("Fout bij ophalen ademhalingsoefeningen:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchBreathingExercises();
    }, []);

    const filteredExercises = useMemo(() => {
        if (activeFilter === "favorites") {
        return breathingExercises.filter((exercise) =>
            favorites.includes(exercise._id)
        );
        }

        return breathingExercises;
    }, [activeFilter, breathingExercises, favorites]);

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
        title="Ademhaling"
        subtitle="Kies een ademhalingsoefening die past bij je moment"
        >
        <section className="pausePage">
            <div className="breathingOverviewTop">
            <Button
                variant="secondary"
                onClick={() => navigate("/pause")}
                iconLeft={pijlLinks}
            >
                Terug
            </Button>

            <BreathingTabs
                activeTab={activeFilter}
                onTabChange={setActiveFilter}
            />
            </div>

            {loading ? (
            <p className="pauseStatusText">Ademhalingsoefeningen laden...</p>
            ) : filteredExercises.length === 0 ? (
            <div className="pauseEmptyState">
                <h3>Geen oefeningen gevonden</h3>
                <p>Je hebt momenteel nog geen favoriete ademhalingsoefeningen.</p>
            </div>
            ) : (
            <div className="pauseGrid">
                {filteredExercises.map((exercise) => (
                <PauseCard
                    key={exercise._id}
                    title={exercise.title}
                    description={exercise.description}
                    duration={exercise.duration}
                    icon={exercise.icon}
                    isFavorite={favorites.includes(exercise._id)}
                    onToggleFavorite={() => toggleFavorite(exercise._id)}
                    to={`/pause/${exercise.slug}`}
                />
                ))}
            </div>
            )}
        </section>
        </MainLayout>
    );
}

export default BreathingOverviewPage;