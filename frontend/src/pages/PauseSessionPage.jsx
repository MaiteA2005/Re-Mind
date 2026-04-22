import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { pauseSuggestions } from "../data/pauseSuggestionsData";
import "./PausePage.css";

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `00:${minutes}:${seconds}`;
}

function PauseSessionPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const pauseItem = useMemo(
    () => pauseSuggestions.find((item) => item.slug === slug),
    [slug]
  );

  const [timeLeft, setTimeLeft] = useState(pauseItem?.durationSeconds || 0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  useEffect(() => {
    if (!pauseItem) return;
    setTimeLeft(pauseItem.durationSeconds);
  }, [pauseItem]);

  useEffect(() => {
    if (!pauseItem || isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate(`/pause/${pauseItem.slug}/complete`);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pauseItem, isPaused, timeLeft, navigate]);

  if (!pauseItem) {
    return (
      <MainLayout title="Pauze niet gevonden" subtitle="Deze pauze bestaat niet">
        <div className="pauseDetailWrapper">
          <Link to="/pause" className="pauseBackButton">
            ← Terug
          </Link>
        </div>
      </MainLayout>
    );
  }

  const progress =
    ((pauseItem.durationSeconds - timeLeft) / pauseItem.durationSeconds) * 100;

  return (
    <MainLayout title={pauseItem.title} subtitle={pauseItem.description}>
      <div className="pauseSessionWrapper">
        <Link to={`/pause/${pauseItem.slug}`} className="pauseBackButton">
          ← Terug
        </Link>

        <div className="pauseSessionContent">
          <div className="pauseSessionIconCircle" />
          <h2>{pauseItem.title}</h2>

          <button
            type="button"
            className="pauseDropdownButton"
            onClick={() => setIsInstructionsOpen((prev) => !prev)}
          >
            <span>Instructies</span>
            <span>{isInstructionsOpen ? "⌃" : "⌄"}</span>
          </button>

          {isInstructionsOpen && (
            <div className="pauseDropdownContent">
              <ol className="pauseInstructionsList">
                {pauseItem.instructions.map((step, index) => (
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
              onClick={() => navigate(`/pause/${pauseItem.slug}`)}
            >
              Stop
            </button>
          </div>

          <button
            type="button"
            className="pauseOutlineButton"
            onClick={() => navigate(`/pause/${pauseItem.slug}/complete`)}
          >
            Markeer als voltooid
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default PauseSessionPage;