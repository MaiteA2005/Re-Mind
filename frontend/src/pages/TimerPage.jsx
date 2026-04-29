import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import TimerTabs from "../components/timer/TimerTabs";
import TimerSetupCard from "../components/timer/TimerSetupCard";
import TimerRunningCard from "../components/timer/TimerRunningCard";
import TimerInfoCard from "../components/timer/TimerInfoCard";
import "./TimerPage.css";

function TimerPage() {
  const navigate = useNavigate();

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

  const pageTitle = useMemo(() => {
    if (activeTimer === "workday") return "Timer - Werkdag";
    if (activeTimer === "focus") return "Timer - Focusblok";
    return "Timer - Pauze";
  }, [activeTimer]);

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
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setPauseTime(0);
    setTimeLeft(totalSeconds);
  };

  const handleTakeBreak = () => {
    handleTimerChange("break");
  };

  const handleEndWorkday = () => {
    setShowEndModal(true);
  };

  const confirmEndWorkday = () => {
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
                <button
                  type="button"
                  className="timerSecondaryButton"
                  onClick={() => setShowEndModal(false)}
                >
                  Annuleren
                </button>

                <button
                  type="button"
                  className="timerPrimaryButton"
                  onClick={confirmEndWorkday}
                >
                  Ja, beëindig werkdag
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default TimerPage;