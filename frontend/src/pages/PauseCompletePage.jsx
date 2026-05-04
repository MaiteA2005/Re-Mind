import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/base/Button";
import API_URL from "../services/api";

import PauseCompleteCard from "../components/pause/PauseCompleteCard";
import "./PausePage.css";

function PauseCompletePage() {
  const { slug } = useParams();
  const location = useLocation();

  const statePauseItem = location.state?.pauseItem || null;

  const [pause, setPause] = useState(statePauseItem);
  const [loading, setLoading] = useState(!statePauseItem);

  useEffect(() => {
    if (statePauseItem) return;

    const fetchPause = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/pause-suggestions/${slug}`
        );
        const data = await response.json();

        setPause(data);
      } catch (error) {
        console.error("Fout bij ophalen pauze:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPause();
  }, [slug, statePauseItem]);

  if (loading) {
    return (
      <MainLayout title="Afronden" subtitle="Even geduld">
        <p className="pauseStatusText">Resultaat laden...</p>
      </MainLayout>
    );
  }

  if (!pause || pause.message) {
    return (
      <MainLayout title="Pauze niet gevonden" subtitle="Deze pauze bestaat niet">
        <section className="pauseCompleteWrapper">
          <Button to="/pause" variant="primary" full>
            Terug naar pauzes
          </Button>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={pause.completeTitle} subtitle={pause.completeText}>
      <section className="pauseCompleteWrapper">
        <PauseCompleteCard
          title={pause.completeTitle}
          text={pause.completeText}
        />
      </section>
    </MainLayout>
  );
}

export default PauseCompletePage;