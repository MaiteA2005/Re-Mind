import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createTimerSession } from "../services/timerSessionService";

const TimerContext = createContext(null);

export function TimerProvider({ children }) {
  const hasSavedRef = useRef(false);

  const [activeTimer, setActiveTimer] = useState("workday");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [selectedDuration, setSelectedDuration] = useState(360);
  const [selectedReminder, setSelectedReminder] = useState(60);
  const [customDuration, setCustomDuration] = useState("");

  const [totalSeconds, setTotalSeconds] = useState(360 * 60);
  const [timeLeft, setTimeLeft] = useState(360 * 60);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);
  const [startedAt, setStartedAt] = useState(null);

  const [activeTimerView, setActiveTimerView] = useState("workday");

  const [sidebarBreakTimer, setSidebarBreakTimer] = useState({
    isRunning: false,
    isPaused: false,
    timeLeft: 0,
    totalSeconds: 0,
  });

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

  useEffect(() => {
    if (!sidebarBreakTimer.isRunning || sidebarBreakTimer.isPaused) return;

    const interval = setInterval(() => {
      setSidebarBreakTimer((current) => {
        const nextTimeLeft = Math.max(current.timeLeft - 1, 0);

        if (nextTimeLeft === 0) {
          return {
            ...current,
            isRunning: false,
            timeLeft: 0,
          };
        }

        return {
          ...current,
          timeLeft: nextTimeLeft,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sidebarBreakTimer.isRunning, sidebarBreakTimer.isPaused]);

  const changeTimerType = (timerType) => {
    setActiveTimer(timerType);
    setIsRunning(false);
    setIsPaused(false);
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

  const selectDuration = (duration) => {
    setSelectedDuration(duration);
    setCustomDuration("");
  };

  const startTimer = () => {
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

  const pauseToggle = () => {
    setIsPaused((prev) => !prev);
  };

  const resetTimer = () => {
    setTimeLeft(totalSeconds);
    setElapsedTime(0);
    setPauseTime(0);
    setStartedAt(new Date());
    hasSavedRef.current = false;
    setIsPaused(false);
  };

  const stopTimer = async () => {
    await saveCurrentTimerSession(false);

    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setPauseTime(0);
    setTimeLeft(totalSeconds);
    setStartedAt(null);
  };

  const startBreakFromWorkday = () => {
    setSidebarBreakTimer({
      isRunning: true,
      isPaused: false,
      totalSeconds: 5 * 60,
      timeLeft: 5 * 60,
    });

    setActiveTimerView("break");
  };

  const toggleSidebarBreakTimer = () => {
    setSidebarBreakTimer((current) => ({
      ...current,
      isPaused: !current.isPaused,
    }));
  };

  const stopSidebarBreakTimer = () => {
    setSidebarBreakTimer({
      isRunning: false,
      isPaused: false,
      timeLeft: 0,
      totalSeconds: 0,
    });
  };

  const endWorkdayTimer = async () => {
    await saveCurrentTimerSession(false);

    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setPauseTime(0);
    setTimeLeft(totalSeconds);
    setStartedAt(null);
    setActiveTimer("workday");
    setActiveTimerView("workday");

    setSidebarBreakTimer({
      isRunning: false,
      isPaused: false,
      timeLeft: 0,
      totalSeconds: 0,
    });
  };

  return (
    <TimerContext.Provider
      value={{
        activeTimer,
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
        activeTimerView,

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
        saveCurrentTimerSession,
        setActiveTimerView,
        endWorkdayTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error("useTimer moet binnen TimerProvider gebruikt worden");
  }

  return context;
}