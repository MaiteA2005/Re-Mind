import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
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
          `http://localhost:5000/api/pause-suggestions/${slug}`
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
          <Link to="/pause" className="pausePrimaryButton">
            Terug naar pauzes
          </Link>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={pause.completeTitle} subtitle={pause.completeText}>
      <section className="pauseCompleteWrapper">
        <div className="pauseCompleteContent">
          <div className="pauseCompleteIcon">✓</div>

          <h2>{pause.completeTitle}</h2>
          <p>{pause.completeText}</p>

          <div className="pauseCompleteButtons">
            <Link to="/dashboard" className="pausePrimaryButton">
              Verder werken
            </Link>

            <Link to="/pause" className="pauseOutlineButton pauseOutlineLink">
              Nog een pauze
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default PauseCompletePage;