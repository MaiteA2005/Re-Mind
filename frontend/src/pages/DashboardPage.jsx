import { useEffect, useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { formatDate, getGreeting } from "../utils/date";
import { getMyPauseSessions } from "../services/pauseStatsService";
import { getMyCheckIns } from "../services/checkInService";
import { useAuth } from "../context/AuthContext";
import { useTimer } from "../context/TimerContext";
import {
  getTomorrowFocus,
  completeTomorrowFocus,
} from "../services/dayClosingService";

import Button from "../components/base/Button";
import UpgradeBanner from "../components/base/UpgradeBanner";
import DashboardFocusAction from "../components/dashboard/DashboardFocusAction";
import DashboardCheckInCard from "../components/dashboard/DashboardCheckInCard";
import DashboardTodayCard from "../components/dashboard/DashboardTodayCard";
import DashboardPauseSummary from "../components/dashboard/DashboardPauseSummary";
import DashboardMonthLocked from "../components/dashboard/DashboardMonthLocked";
import DashboardMonthStats from "../components/dashboard/DashboardMonthStats";
import DashboardActionGrid from "../components/dashboard/DashboardActionGrid";

import "./css/DashboardPage.css";

function getTodayItems(items, dateKey = "createdAt") {
  const today = new Date().toDateString();

  return items.filter((item) => {
    return new Date(item[dateKey]).toDateString() === today;
  });
}

function getTodayDismissKey(userId) {
  const today = new Date().toISOString().split("T")[0];
  return `workday-start-notice-dismissed-${userId}-${today}`;
}

function isCurrentTimeAfter(timeString) {
  if (!timeString) return false;

  const [hours, minutes] = timeString.split(":").map(Number);

  const now = new Date();
  const compareTime = new Date();

  compareTime.setHours(hours, minutes, 0, 0);

  return now >= compareTime;
}

function DashboardPage() {
  const { user } = useAuth();
  const {
    activeTimer,
    isRunning,
    changeTimerType,
    startTimer,
  } = useTimer();

  const greeting = getGreeting();

  const isPremiumUser =
    user?.subscription === "premium" ||
    user?.plan === "premium" ||
    user?.subscriptionPlan === "premium" ||
    user?.isPremium === true;

  const [pauseSessions, setPauseSessions] = useState([]);
  const [pauseLoading, setPauseLoading] = useState(true);

  const [checkIns, setCheckIns] = useState([]);
  const [checkInsLoading, setCheckInsLoading] = useState(true);

  const [todayFocus, setTodayFocus] = useState(null);
  const [focusLoading, setFocusLoading] = useState(true);

  const [showStartWorkdayNotice, setShowStartWorkdayNotice] = useState(false);

  useEffect(() => {
    const fetchPauseSessions = async () => {
      try {
        const data = await getMyPauseSessions();
        setPauseSessions(data);
      } catch (error) {
        console.error("Fout bij ophalen pauzedata:", error);
      } finally {
        setPauseLoading(false);
      }
    };

    fetchPauseSessions();
  }, []);

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const data = await getMyCheckIns();
        setCheckIns(data);
      } catch (error) {
        console.error("Fout bij ophalen check-ins:", error);
      } finally {
        setCheckInsLoading(false);
      }
    };

    fetchCheckIns();
  }, []);

  useEffect(() => {
    const fetchTodayFocus = async () => {
      try {
        const data = await getTomorrowFocus();
        setTodayFocus(data);
      } catch (error) {
        console.error("Fout bij ophalen focus:", error);
      } finally {
        setFocusLoading(false);
      }
    };

    fetchTodayFocus();
  }, []);

  useEffect(() => {
    if (!user) return;

    const workdayStartTime =
      user?.settings?.workdayStartTime || user?.workdayStartTime || "09:00";

    const userId = user._id || user.id;
    const dismissedKey = getTodayDismissKey(userId);
    const dismissedToday = localStorage.getItem(dismissedKey) === "true";

    const workdayTimerIsRunning = activeTimer === "workday" && isRunning;

    if (
      isCurrentTimeAfter(workdayStartTime) &&
      !workdayTimerIsRunning &&
      !dismissedToday
    ) {
      setShowStartWorkdayNotice(true);
    } else {
      setShowStartWorkdayNotice(false);
    }
  }, [user, activeTimer, isRunning]);

  const pausesToday = useMemo(
    () => getTodayItems(pauseSessions, "completedAt"),
    [pauseSessions]
  );

  const checkInsToday = useMemo(
    () => getTodayItems(checkIns, "createdAt"),
    [checkIns]
  );

  const averageStress =
    checkInsToday.length > 0
      ? (
          checkInsToday.reduce((total, item) => total + item.stressLevel, 0) /
          checkInsToday.length
        ).toFixed(1)
      : null;

  const averageEnergy =
    checkInsToday.length > 0
      ? (
          checkInsToday.reduce((total, item) => total + item.energyLevel, 0) /
          checkInsToday.length
        ).toFixed(1)
      : null;

  const handleCompleteFocus = async () => {
    if (!todayFocus?._id) return;

    try {
      const updatedFocus = await completeTomorrowFocus(todayFocus._id);
      setTodayFocus(updatedFocus);
    } catch (error) {
      console.error("Fout bij voltooien focus:", error);
    }
  };

  const handleDismissWorkdayNotice = () => {
    const userId = user?._id || user?.id;

    if (userId) {
      const dismissedKey = getTodayDismissKey(userId);
      localStorage.setItem(dismissedKey, "true");
    }

    setShowStartWorkdayNotice(false);
  };

  const handleStartWorkdayTimer = () => {
    if (activeTimer !== "workday") {
      changeTimerType("workday");

      setTimeout(() => {
        startTimer();
      }, 0);
    } else {
      startTimer();
    }

    setShowStartWorkdayNotice(false);
  };

  return (
    <MainLayout
      title={`${greeting}, ${user?.name || "gebruiker"}`}
      subtitle={formatDate()}
      variant="dashboard"
      action={
        <DashboardFocusAction
          todayFocus={todayFocus}
          focusLoading={focusLoading}
          onCompleteFocus={handleCompleteFocus}
        />
      }
    >
      <div className="dashboard">
        {showStartWorkdayNotice && (
          <section className="workdayStartNotice">
            <div>
              <h3>Je werkdag is gestart</h3>
              <p>
                Wil je je werkdagtimer starten zodat Re:Mind je dag kan
                opvolgen?
              </p>
            </div>

            <div className="workdayStartNoticeActions">
              <Button variant="secondary" onClick={handleDismissWorkdayNotice}>
                Wegklikken
              </Button>

              <Button variant="primary" onClick={handleStartWorkdayTimer}>
                Timer starten
              </Button>
            </div>
          </section>
        )}

        {!isPremiumUser && <UpgradeBanner />}

        <DashboardCheckInCard latestCheckIn={checkIns[0]} />

        <section className="dashboardMain">
          <div className="dashboardLeft">
            <DashboardTodayCard
              checkInsToday={checkInsToday}
              checkInsLoading={checkInsLoading}
              averageStress={averageStress}
              averageEnergy={averageEnergy}
            />
          </div>

          <div className="dashboardRight">
            <DashboardPauseSummary
              pauseLoading={pauseLoading}
              pausesTodayCount={pausesToday.length}
              lastPause={pauseSessions[0]}
            />
          </div>
        </section>

        {isPremiumUser ? (
          <DashboardMonthStats
            checkIns={checkIns}
            pauseSessions={pauseSessions}
          />
        ) : (
          <DashboardMonthLocked />
        )}

        <DashboardActionGrid />
      </div>
    </MainLayout>
  );
}

export default DashboardPage;