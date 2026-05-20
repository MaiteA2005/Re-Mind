import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import TimerTabs from "../components/timer/TimerTabs";
import TimerSetupCard from "../components/timer/TimerSetupCard";
import TimerRunningCard from "../components/timer/TimerRunningCard";
import TimerInfoCard from "../components/timer/TimerInfoCard";

import { useTimer } from "../context/TimerContext.jsx";

import "./TimerPage.css";

function TimerPage() {
  const navigate = useNavigate();
  const [showEndModal, setShowEndModal] = useState(false);

  const {
    activeTimer,
    activeTimerView,
    isRunning,
    isPaused,
    selectedDuration,
    selectedReminder,
    customDuration,
    totalSeconds,
    timeLeft,
    elapsedTime,
    pauseTime,
    sidebarBreakTimer,

    setSelectedReminder,
    setCustomDuration,
    changeTimerType,
    selectDuration,
    startTimer,
    pauseToggle,
    resetTimer,
    stopTimer,
    startBreakFromWorkday,
    toggleSidebarBreakTimer,
    stopSidebarBreakTimer,
    endWorkdayTimer,
  } = useTimer();

  const isViewingSidebarBreak =
    activeTimerView === "break" && sidebarBreakTimer?.isRunning;

  const shownTimer = isViewingSidebarBreak ? "break" : activeTimer;

  const pageTitle = useMemo(() => {
    if (shownTimer === "workday") return "Timer - Werkdag";
    if (shownTimer === "focus") return "Timer - Focusblok";
    return "Timer - Pauze";
  }, [shownTimer]);

  const isTimerRunningOnPage = isViewingSidebarBreak || isRunning;

  async function handleStop() {
    if (isViewingSidebarBreak) {
      stopSidebarBreakTimer();
      return;
    }

    await stopTimer();
  }

  function handleTakeBreak() {
    startBreakFromWorkday();
  }

  function handleEndWorkday() {
    setShowEndModal(true);
  }

  async function confirmEndWorkday() {
    await endWorkdayTimer();
    setShowEndModal(false);
    navigate("/dagafsluiting");
  }

  return (
    <MainLayout title={pageTitle} subtitle="Werk gefocust en neem op tijd pauzes">
      <section className="timerPage">
        {!isTimerRunningOnPage && (
          <TimerTabs activeTimer={activeTimer} onChange={changeTimerType} />
        )}

        {!isTimerRunningOnPage ? (
          <TimerSetupCard
            activeTimer={activeTimer}
            selectedDuration={selectedDuration}
            selectedReminder={selectedReminder}
            customDuration={customDuration}
            onDurationSelect={selectDuration}
            onReminderSelect={setSelectedReminder}
            onCustomDurationChange={setCustomDuration}
            onStart={startTimer}
          />
        ) : (
          <div className="timerRunningLayout">
            <TimerRunningCard
              activeTimer={shownTimer}
              timeLeft={
                isViewingSidebarBreak ? sidebarBreakTimer.timeLeft : timeLeft
              }
              elapsedTime={elapsedTime}
              totalSeconds={
                isViewingSidebarBreak
                  ? sidebarBreakTimer.totalSeconds
                  : totalSeconds
              }
              isPaused={
                isViewingSidebarBreak ? sidebarBreakTimer.isPaused : isPaused
              }
              pauseTime={pauseTime}
              onPauseToggle={
                isViewingSidebarBreak ? toggleSidebarBreakTimer : pauseToggle
              }
              onReset={resetTimer}
              onStop={handleStop}
              onTakeBreak={handleTakeBreak}
              onEndWorkday={handleEndWorkday}
            />

            <TimerInfoCard activeTimer={shownTimer} />
          </div>
        )}

        {showEndModal && (
          <div className="timerModalOverlay">
            <div className="timerModal">
              <h2>Werkdag beëindigen?</h2>
              <p>
                Wil je je werkdag nu afsluiten? Je wordt doorgestuurd naar de
                dagafsluiting waar je kort kan reflecteren op je dag.
              </p>

              <div className="timerModalActions">
                <button
                  type="button"
                  className="timerModalButton timerModalButtonSecondary"
                  onClick={() => setShowEndModal(false)}
                >
                  Annuleren
                </button>

                <button
                  type="button"
                  className="timerModalButton timerModalButtonPrimary"
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