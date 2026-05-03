import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/base/Button";

import PauseBackButton from "../components/pause/PauseBackButton";
import PauseHeader from "../components/pause/PauseHeader";
import PauseTimer from "../components/pause/PauseTimer";
import PauseProgressBar from "../components/pause/PauseProgressBar";
import PauseSessionControls from "../components/pause/PauseSessionControls";

import { savePauseSession } from "../services/pauseSessionService";
import CompleteBlackIcon from "../assets/icons_zwart/name_one_win_zwart.svg";
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

  const completePause = async () => {
    if (!pause) return;

    try {
      await savePauseSession(pause);
    } catch (error) {
      console.error("Fout bij opslaan pauze:", error);
    } finally {
      navigate(`/pause/${pause.slug}/complete`, {
        state: { pauseItem: pause },
      });
    }
  };

  useEffect(() => {
    if (!pause || isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          completePause();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pause, isPaused, timeLeft]);

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
          <PauseBackButton />
        </section>
      </MainLayout>
    );
  }

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <MainLayout title={pause.title} subtitle={pause.description}>
      <section className="pauseSessionWrapper">
        <PauseBackButton />

        <div className="pauseSessionContent">
          <PauseHeader title={pause.title} icon={pause.icon} />

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

          <PauseTimer time={formatTime(timeLeft)} />

          <PauseProgressBar progress={progress} />

          <PauseSessionControls
            isRunning={!isPaused}
            onPause={() => setIsPaused((prev) => !prev)}
            onStop={() => navigate("/pause")}
          />

          <div className="pauseCompleteAction">
            <Button variant="secondary" onClick={completePause} iconLeft={CompleteBlackIcon}>
              Markeer als voltooid
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default PauseSessionPage;