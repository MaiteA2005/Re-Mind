import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createTimerSession } from "../services/timerSessionService";
import {
  createPauseReminder,
  updatePauseReminder,
} from "../services/pauseReminderService";

const TimerContext = createContext(null);
const TIMER_STORAGE_KEY = "remind_timer_state";

const defaultTimerState = {
  activeTimer: "workday",
  activeTimerView: "workday",
  isRunning: false,
  isPaused: false,
  selectedDuration: 360,
  selectedReminder: 60,
  customDuration: "",
  totalSeconds: 360 * 60,
  timeLeft: 360 * 60,
  elapsedTime: 0,
  pauseTime: 0,
  startedAt: null,
  lastUpdatedAt: Date.now(),
  sidebarBreakTimer: {
    isRunning: false,
    isPaused: false,
    timeLeft: 0,
    totalSeconds: 0,
  },
};

function loadStoredTimerState() {
  const stored = localStorage.getItem(TIMER_STORAGE_KEY);

  if (!stored) return defaultTimerState;

  try {
    const parsed = JSON.parse(stored);
    const now = Date.now();
    const lastUpdatedAt = parsed.lastUpdatedAt || now;
    const delta = Math.max(0, Math.floor((now - lastUpdatedAt) / 1000));

    const restored = {
      ...defaultTimerState,
      ...parsed,
      sidebarBreakTimer: {
        ...defaultTimerState.sidebarBreakTimer,
        ...(parsed.sidebarBreakTimer || {}),
      },
      lastUpdatedAt: now,
    };

    if (delta <= 0) return restored;

    if (restored.isRunning) {
      if (restored.isPaused) {
        restored.pauseTime += delta;
      } else {
        const consumedSeconds = Math.min(delta, restored.timeLeft);
        restored.elapsedTime += consumedSeconds;
        restored.timeLeft = Math.max(restored.timeLeft - consumedSeconds, 0);

        if (restored.timeLeft === 0) {
          restored.isRunning = false;
          restored.isPaused = false;
        }
      }
    }

    if (
      restored.sidebarBreakTimer.isRunning &&
      !restored.sidebarBreakTimer.isPaused
    ) {
      const breakConsumedSeconds = Math.min(
        delta,
        restored.sidebarBreakTimer.timeLeft
      );

      restored.sidebarBreakTimer.timeLeft = Math.max(
        restored.sidebarBreakTimer.timeLeft - breakConsumedSeconds,
        0
      );

      if (restored.isRunning && restored.activeTimer === "workday") {
        restored.pauseTime += breakConsumedSeconds;
      }

      if (restored.sidebarBreakTimer.timeLeft === 0) {
        restored.sidebarBreakTimer.isRunning = false;
        restored.sidebarBreakTimer.isPaused = false;
      }
    }

    return restored;
  } catch {
    return defaultTimerState;
  }
}

export function TimerProvider({ children }) {
  const initialState = loadStoredTimerState();

  const hasSavedRef = useRef(false);
  const lastTickRef = useRef(Date.now());

  const activeReminderIdRef = useRef(null);
  const activeReminderPromiseRef = useRef(null);
  const reminderVisibleRef = useRef(false);
  const ignoredCloseTimeoutRef = useRef(null);

  const [activeTimer, setActiveTimer] = useState(initialState.activeTimer);
  const [activeTimerView, setActiveTimerView] = useState(
    initialState.activeTimerView
  );

  const [isRunning, setIsRunning] = useState(initialState.isRunning);
  const [isPaused, setIsPaused] = useState(initialState.isPaused);

  const [selectedDuration, setSelectedDuration] = useState(
    initialState.selectedDuration
  );
  const [selectedReminder, setSelectedReminder] = useState(
    initialState.selectedReminder
  );
  const [customDuration, setCustomDuration] = useState(
    initialState.customDuration
  );

  const [totalSeconds, setTotalSeconds] = useState(initialState.totalSeconds);
  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft);
  const [elapsedTime, setElapsedTime] = useState(initialState.elapsedTime);
  const [pauseTime, setPauseTime] = useState(initialState.pauseTime);
  const [startedAt, setStartedAt] = useState(initialState.startedAt);

  const [sidebarBreakTimer, setSidebarBreakTimer] = useState(
    initialState.sidebarBreakTimer
  );

  const [pauseReminderPopup, setPauseReminderPopup] = useState(false);
  const [lastReminderAt, setLastReminderAt] = useState(0);
  const [snoozeUntilElapsed, setSnoozeUntilElapsed] = useState(null);
  const [activeReminderId, setActiveReminderId] = useState(null);

  const clearIgnoredCloseTimeout = () => {
    if (ignoredCloseTimeoutRef.current) {
      clearTimeout(ignoredCloseTimeoutRef.current);
      ignoredCloseTimeoutRef.current = null;
    }
  };

  const setCurrentReminderId = (id) => {
    activeReminderIdRef.current = id;
    setActiveReminderId(id);
  };

  const resetActiveReminder = () => {
    activeReminderIdRef.current = null;
    activeReminderPromiseRef.current = null;
    reminderVisibleRef.current = false;
    setActiveReminderId(null);
  };

  const createIgnoredReminder = async () => {
    if (reminderVisibleRef.current || activeReminderPromiseRef.current) return;

    reminderVisibleRef.current = true;

    const reminderPromise = createPauseReminder({
      action: "ignored",
      reminderInterval: selectedReminder,
      workdayElapsedSeconds: elapsedTime,
    });

    activeReminderPromiseRef.current = reminderPromise;

    try {
      const reminder = await reminderPromise;

      if (activeReminderPromiseRef.current === reminderPromise) {
        setCurrentReminderId(reminder._id);
      }

      return reminder;
    } catch (error) {
      console.error("Ignored reminder opslaan mislukt:", error);
      resetActiveReminder();
      return null;
    }
  };

  const updateCurrentReminderAction = async (action) => {
    clearIgnoredCloseTimeout();

    let reminderId = activeReminderIdRef.current || activeReminderId;

    try {
      if (!reminderId && activeReminderPromiseRef.current) {
        const reminder = await activeReminderPromiseRef.current;
        reminderId = reminder?._id;
      }

      if (reminderId) {
        await updatePauseReminder(reminderId, { action });
      }
    } catch (error) {
      console.error("Pauzeherinnering aanpassen mislukt:", error);
    } finally {
      resetActiveReminder();
    }
  };

  useEffect(() => {
    localStorage.setItem(
      TIMER_STORAGE_KEY,
      JSON.stringify({
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
        startedAt,
        sidebarBreakTimer,
        lastUpdatedAt: Date.now(),
      })
    );
  }, [
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
    startedAt,
    sidebarBreakTimer,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - lastTickRef.current) / 1000);

      if (delta <= 0) return;

      lastTickRef.current = now;

      if (isRunning) {
        if (isPaused) {
          setPauseTime((prev) => prev + delta);
        } else {
          setTimeLeft((prev) => {
            const consumedSeconds = Math.min(delta, prev);
            return Math.max(prev - consumedSeconds, 0);
          });

          setElapsedTime((prev) => {
            const consumedSeconds = Math.min(delta, timeLeft);
            return prev + consumedSeconds;
          });
        }
      }

      if (sidebarBreakTimer.isRunning && !sidebarBreakTimer.isPaused) {
        const breakConsumedSeconds = Math.min(
          delta,
          sidebarBreakTimer.timeLeft
        );

        setSidebarBreakTimer((current) => {
          const nextTimeLeft = Math.max(
            current.timeLeft - breakConsumedSeconds,
            0
          );

          return {
            ...current,
            timeLeft: nextTimeLeft,
            isRunning: nextTimeLeft > 0,
            isPaused: nextTimeLeft > 0 ? current.isPaused : false,
          };
        });

        if (isRunning && activeTimer === "workday") {
          setPauseTime((prev) => prev + breakConsumedSeconds);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isRunning,
    isPaused,
    timeLeft,
    activeTimer,
    sidebarBreakTimer.isRunning,
    sidebarBreakTimer.isPaused,
    sidebarBreakTimer.timeLeft,
  ]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      saveCurrentTimerSession(true);
      setIsRunning(false);
      setIsPaused(false);
    }
  }, [timeLeft, isRunning]);

  useEffect(() => {
    if (!isRunning || isPaused || activeTimer !== "workday") return;
    if (!selectedReminder) return;

    const reminderSeconds = selectedReminder * 60;

    const shouldShowRegularReminder =
      elapsedTime > 0 &&
      elapsedTime % reminderSeconds === 0 &&
      elapsedTime !== lastReminderAt;

    const shouldShowSnoozedReminder =
      snoozeUntilElapsed !== null && elapsedTime >= snoozeUntilElapsed;

    if (shouldShowRegularReminder || shouldShowSnoozedReminder) {
      if (reminderVisibleRef.current) return;

      setPauseReminderPopup(true);
      setLastReminderAt(elapsedTime);
      setSnoozeUntilElapsed(null);

      createIgnoredReminder();

      clearIgnoredCloseTimeout();

      ignoredCloseTimeoutRef.current = setTimeout(() => {
        setPauseReminderPopup(false);
        resetActiveReminder();
      }, 60 * 1000);

      window.electronAPI?.showBreakNotification?.({
        title: "Re:Mind",
        body: "Je werkt al even gefocust. Tijd voor een korte pauze",
      });
    }
  }, [
    elapsedTime,
    isRunning,
    isPaused,
    activeTimer,
    selectedReminder,
    lastReminderAt,
    snoozeUntilElapsed,
  ]);

  useEffect(() => {
    return () => {
      clearIgnoredCloseTimeout();
    };
  }, []);

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

  const changeTimerType = (timerType) => {
    clearIgnoredCloseTimeout();
    resetActiveReminder();

    setActiveTimer(timerType);
    setActiveTimerView(timerType);
    setIsRunning(false);
    setIsPaused(false);
    setCustomDuration("");
    setElapsedTime(0);
    setPauseTime(0);
    setStartedAt(null);
    setPauseReminderPopup(false);
    setSnoozeUntilElapsed(null);
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

  const prepareBreakTimer = () => {
    setActiveTimerView("break");
    setSelectedDuration(5);
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
    setActiveTimerView(activeTimer);

    lastTickRef.current = Date.now();
    hasSavedRef.current = false;

    setIsRunning(true);
    setIsPaused(false);
  };

  const startSidebarBreakTimer = (durationMinutes = selectedDuration) => {
    const minutes = Number(durationMinutes) || 5;

    setSidebarBreakTimer({
      isRunning: true,
      isPaused: false,
      totalSeconds: minutes * 60,
      timeLeft: minutes * 60,
    });

    setActiveTimerView("break");
    lastTickRef.current = Date.now();
  };

  const pauseToggle = () => {
    lastTickRef.current = Date.now();
    setIsPaused((prev) => !prev);
  };

  const resetTimer = () => {
    clearIgnoredCloseTimeout();
    resetActiveReminder();

    setTimeLeft(totalSeconds);
    setElapsedTime(0);
    setPauseTime(0);
    setStartedAt(new Date());
    setActiveTimerView(activeTimer);
    setPauseReminderPopup(false);
    setSnoozeUntilElapsed(null);

    lastTickRef.current = Date.now();
    hasSavedRef.current = false;

    setIsPaused(false);
  };

  const stopTimer = async () => {
    clearIgnoredCloseTimeout();
    resetActiveReminder();

    await saveCurrentTimerSession(false);

    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setPauseTime(0);
    setTimeLeft(totalSeconds);
    setStartedAt(null);
    setPauseReminderPopup(false);
    setSnoozeUntilElapsed(null);

    hasSavedRef.current = false;
  };

  const startBreakFromWorkday = (durationMinutes = 5) => {
    startSidebarBreakTimer(durationMinutes);
  };

  const toggleSidebarBreakTimer = () => {
    lastTickRef.current = Date.now();

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

    setActiveTimerView(activeTimer);
  };

  const endWorkdayTimer = async () => {
    clearIgnoredCloseTimeout();
    resetActiveReminder();

    await saveCurrentTimerSession(false);

    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setPauseTime(0);
    setTimeLeft(totalSeconds);
    setStartedAt(null);
    setActiveTimer("workday");
    setActiveTimerView("workday");
    setSnoozeUntilElapsed(null);
    setPauseReminderPopup(false);

    setSidebarBreakTimer({
      isRunning: false,
      isPaused: false,
      timeLeft: 0,
      totalSeconds: 0,
    });

    hasSavedRef.current = false;
    localStorage.removeItem(TIMER_STORAGE_KEY);
  };

  const takeReminderBreak = async () => {
    setPauseReminderPopup(false);
    setSnoozeUntilElapsed(null);
    prepareBreakTimer();

    await updateCurrentReminderAction("taken");
  };

  const snoozeReminder = async (minutes = 5) => {
    setPauseReminderPopup(false);

    setSnoozeUntilElapsed(
      elapsedTime + minutes * 60
    );

    await updateCurrentReminderAction("snoozed");
  };

  const dismissReminder = async () => {
    setPauseReminderPopup(false);
    setSnoozeUntilElapsed(null);

    await updateCurrentReminderAction("missed");
  };

  return (
    <TimerContext.Provider
      value={{
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
        pauseReminderPopup,

        setSelectedReminder,
        setCustomDuration,
        setActiveTimerView,
        changeTimerType,
        selectDuration,
        prepareBreakTimer,
        startTimer,
        startSidebarBreakTimer,
        pauseToggle,
        resetTimer,
        stopTimer,
        startBreakFromWorkday,
        toggleSidebarBreakTimer,
        stopSidebarBreakTimer,
        endWorkdayTimer,
        saveCurrentTimerSession,
        takeReminderBreak,
        snoozeReminder,
        dismissReminder,
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