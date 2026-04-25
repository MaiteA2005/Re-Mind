import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import "./PausePage.css";

function getDurationSeconds(duration) {
  if (!duration) return 60;

  if (duration.includes("10")) return 600;
  if (duration.includes("5")) return 300;
  if (duration.includes("3")) return 180;
  if (duration.includes("2")) return 120;

  return 60;
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function PauseSessionPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const statePauseItem = location.state?.pauseItem || null;

  const [pause, setPause] = useState(statePauseItem);
  const [loading, setLoading] = useState(!statePauseItem);
  const [isPaused, setIsPaused] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

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

  const totalSeconds = useMemo(
    () => getDurationSeconds(pause?.duration),
    [pause?.duration]
  );

  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    setTimeLeft(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!pause || isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate(`/pause/${pause.slug}/complete`, {
            state: { pauseItem: pause },
          });
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pause, isPaused, timeLeft, navigate]);

  if (loading) {
    return (
      <MainLayout title="Pauze laden" subtitle="Even geduld">
        <p className="pauseStatusText">Pauze laden...</p>
      </MainLayout>
    );
  }

  if (!pause || pause.message) {
    return (
      <MainLayout title="Pauze niet gevonden" subtitle="Deze pauze bestaat niet">
        <section className="pauseSessionWrapper">
          <Link to="/pause" className="pauseBackButton">
            ← Terug naar pauzes
          </Link>
        </section>
      </MainLayout>
    );
  }

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <MainLayout title={pause.title} subtitle={pause.description}>
      <section className="pauseSessionWrapper">
        <Link to="/pause" className="pauseBackButton">
          ← Terug naar pauzes
        </Link>

        <div className="pauseSessionContent">
          <div className="pauseSessionIconCircle">
            <span>{pause.icon}</span>
          </div>

          <h2>{pause.title}</h2>

          <button
            type="button"
            className="pauseDropdownButton"
            onClick={() => setShowInstructions((prev) => !prev)}
          >
            <span>Instructies</span>
            <span>{showInstructions ? "⌃" : "⌄"}</span>
          </button>

          {showInstructions && (
            <div className="pauseDropdownContent">
              <ol className="pauseInstructionsList">
                {pause.instructions?.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="pauseTimer">{formatTime(timeLeft)}</div>

          <div className="pauseProgressBar">
            <div
              className="pauseProgressFill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="pauseSessionButtons">
            <button
              type="button"
              className="pauseSecondaryButton"
              onClick={() => setIsPaused((prev) => !prev)}
            >
              {isPaused ? "Hervatten" : "Pauzeren"}
            </button>

            <button
              type="button"
              className="pauseStopButton"
              onClick={() => navigate("/pause")}
            >
              Stop
            </button>
          </div>

          <button
            type="button"
            className="pauseOutlineButton"
            onClick={() =>
              navigate(`/pause/${pause.slug}/complete`, {
                state: { pauseItem: pause },
              })
            }
          >
            Markeer als voltooid
          </button>
        </div>
      </section>
    </MainLayout>
  );
}

export default PauseSessionPage;