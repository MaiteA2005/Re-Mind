import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/base/Button";

import MainLayout from "../components/layout/MainLayout";
import TimerTabs from "../components/timer/TimerTabs";
import TimerSetupCard from "../components/timer/TimerSetupCard";
import TimerRunningCard from "../components/timer/TimerRunningCard";
import TimerInfoCard from "../components/timer/TimerInfoCard";

import { createTimerSession } from "../services/timerSessionService";
import "./TimerPage.css";

function TimerPage() {
  const navigate = useNavigate();
  const hasSavedRef = useRef(false);

  const [activeTimer, setActiveTimer] = useState("workday");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  const [selectedDuration, setSelectedDuration] = useState(360);
  const [selectedReminder, setSelectedReminder] = useState(60);
  const [customDuration, setCustomDuration] = useState("");

  const [totalSeconds, setTotalSeconds] = useState(360 * 60);
  const [timeLeft, setTimeLeft] = useState(360 * 60);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  
  const pageTitle = useMemo(() => {
    if (activeTimer === "workday") return "Timer - Werkdag";
    if (activeTimer === "focus") return "Timer - Focusblok";
    return "Timer - Pauze";
  }, [activeTimer]);

  const saveCurrentTimerSession = async (completed = false) => {
    if (hasSavedRef.current || !startedAt || totalSeconds <= 0) return;

    hasSavedRef.current = true;

    try {
      await createTimerSession({
        type: activeTimer,
        durationMinutes: Math.round(totalSeconds / 60),
        elapsedSeconds: elapsedTime,
        pauseSeconds: pauseTime,
        completed,
        startedAt,
        endedAt: new Date(),
      });
    } catch (error) {
      console.error("Timer opslaan mislukt:", error);
      hasSavedRef.current = false;
    }
  };

  useEffect(() => {
    if (!isRunning || isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft]);

  useEffect(() => {
    if (!isRunning || !isPaused) return;

    const interval = setInterval(() => {
      setPauseTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);
  
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      saveCurrentTimerSession(true);
      setIsRunning(false);
      setIsPaused(false);
    }
  }, [timeLeft, isRunning]);

  const handleTimerChange = (timerType) => {
    setActiveTimer(timerType);
    setIsRunning(false);
    setIsPaused(false);
    setShowEndModal(false);
    setCustomDuration("");
    setElapsedTime(0);
    setPauseTime(0);
    setStartedAt(null);
    hasSavedRef.current = false;

    if (timerType === "workday") {
      setSelectedDuration(360);
      setSelectedReminder(60);
      setTotalSeconds(360 * 60);
      setTimeLeft(360 * 60);
    }

    if (timerType === "focus") {
      setSelectedDuration(25);
      setTotalSeconds(25 * 60);
      setTimeLeft(25 * 60);
    }

    if (timerType === "break") {
      setSelectedDuration(5);
      setTotalSeconds(5 * 60);
      setTimeLeft(5 * 60);
    }
  };

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    setCustomDuration("");
  };

  const handleStart = () => {
    const durationInMinutes = customDuration
      ? Number(customDuration)
      : selectedDuration;

    if (!durationInMinutes || durationInMinutes <= 0) return;

    const seconds = durationInMinutes * 60;

    setTotalSeconds(seconds);
    setTimeLeft(seconds);
    setElapsedTime(0);
    setPauseTime(0);
    setStartedAt(new Date());
    hasSavedRef.current = false;

    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev);
  };

  const handleReset = () => {
    setTimeLeft(totalSeconds);
    setElapsedTime(0);
    setPauseTime(0);
    setStartedAt(new Date());
    hasSavedRef.current = false;
    setIsPaused(false);
  };

  const handleStop = async () => {
    await saveCurrentTimerSession(false);

    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setPauseTime(0);
    setTimeLeft(totalSeconds);
    setStartedAt(null);
  };

  const handleTakeBreak = () => {
    handleTimerChange("break");
  };

  const handleEndWorkday = () => {
    setShowEndModal(true);
  };

  const confirmEndWorkday = async () => {
    await saveCurrentTimerSession(false);

    setShowEndModal(false);
    setIsRunning(false);
    setIsPaused(false);
    navigate("/dagafsluiting");
  };

  return (
    <MainLayout title={pageTitle} subtitle="Werk gefocust en neem op tijd pauzes">
      <section className="timerPage">
        {!isRunning && (
          <TimerTabs activeTimer={activeTimer} onChange={handleTimerChange} />
        )}

        {!isRunning ? (
          <TimerSetupCard
            activeTimer={activeTimer}
            selectedDuration={selectedDuration}
            selectedReminder={selectedReminder}
            customDuration={customDuration}
            onDurationSelect={handleDurationSelect}
            onReminderSelect={setSelectedReminder}
            onCustomDurationChange={setCustomDuration}
            onStart={handleStart}
          />
        ) : (
          <>
            <TimerRunningCard
              activeTimer={activeTimer}
              timeLeft={timeLeft}
              elapsedTime={elapsedTime}
              totalSeconds={totalSeconds}
              isPaused={isPaused}
              pauseTime={pauseTime}
              onPauseToggle={handlePauseToggle}
              onReset={handleReset}
              onStop={handleStop}
              onTakeBreak={handleTakeBreak}
              onEndWorkday={handleEndWorkday}
            />

            <TimerInfoCard activeTimer={activeTimer} />
          </>
        )}

        {showEndModal && (
          <div className="timerModalOverlay">
            <div className="timerModal">
              <h2>Werkdag beëindigen?</h2>
              <p>
                Wil je je werkdag nu afsluiten? Je wordt doorgestuurd naar de
                dagafsluiting waar je kunt reflecteren op je dag.
              </p>

              <div className="timerModalActions">
                <Button
                  variant="secondary"
                  onClick={() => setShowEndModal(false)}
                >
                  Annuleren
                </Button>

                <Button
                  variant="primary"
                  onClick={confirmEndWorkday}
                >
                  Ja, beëindig werkdag
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default TimerPage;