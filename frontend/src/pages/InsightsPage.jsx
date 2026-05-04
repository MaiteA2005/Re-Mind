import { useEffect, useMemo, useState } from "react";

import { formatDate } from "../utils/date";
import MainLayout from "../components/layout/MainLayout";
import UpgradeBanner from "../components/base/UpgradeBanner";

import { getMyCheckIns } from "../services/checkInService";
import { getMyPauseSessions } from "../services/pauseStatsService";
import { getMyTimerSessions } from "../services/timerSessionService";
import { getMyDayClosings } from "../services/dayClosingService";

import InsightFilters from "../components/insights/InsightFilters";
import StatsGrid from "../components/insights/StatsGrid";
import ChartCard from "../components/insights/ChartCard";
import RecommendationCard from "../components/insights/RecommendationCard";
import DayDetailLocked from "../components/insights/DayDetailLocked";

import "./InsightsPage.css";

function getAverage(items, key) {
  if (!items.length) return "-";

  const total = items.reduce((sum, item) => sum + Number(item[key] || 0), 0);
  return (total / items.length).toFixed(1);
}

function isToday(date) {
  return new Date(date).toDateString() === new Date().toDateString();
}

function filterByPeriod(items, activeFilter, dateKey = "createdAt") {
  const now = new Date();

  return items.filter((item) => {
    const itemDate = new Date(item[dateKey]);

    if (activeFilter === "today") {
      return itemDate.toDateString() === now.toDateString();
    }

    if (activeFilter === "week") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      return itemDate >= sevenDaysAgo;
    }

    if (activeFilter === "month") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      return itemDate >= thirtyDaysAgo;
    }

    return true;
  });
}

function formatTimeLabel(date) {
  return new Date(date).toLocaleTimeString("nl-BE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimerMinutes(timerSessions, type) {
  const seconds = timerSessions
    .filter((session) => session.type === type)
    .reduce((total, session) => total + Number(session.elapsedSeconds || 0), 0);

  return Math.round(seconds / 60);
}

function InsightsPage() {
  const [activeFilter, setActiveFilter] = useState("today");

  const [checkIns, setCheckIns] = useState([]);
  const [pauseSessions, setPauseSessions] = useState([]);
  const [timerSessions, setTimerSessions] = useState([]);
  const [dayClosings, setDayClosings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [checkInData, pauseData, timerData, dayClosingData] =
          await Promise.all([
            getMyCheckIns(),
            getMyPauseSessions(),
            getMyTimerSessions(),
            getMyDayClosings(),
          ]);

        setCheckIns(checkInData);
        setPauseSessions(pauseData);
        setTimerSessions(timerData);
        setDayClosings(dayClosingData);
      } catch (error) {
        console.error("Insights ophalen mislukt:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const filteredCheckIns = useMemo(
    () => filterByPeriod(checkIns, activeFilter),
    [checkIns, activeFilter]
  );

  const filteredPauseSessions = useMemo(
    () => filterByPeriod(pauseSessions, activeFilter, "completedAt"),
    [pauseSessions, activeFilter]
  );

  const filteredTimerSessions = useMemo(
    () => filterByPeriod(timerSessions, activeFilter),
    [timerSessions, activeFilter]
  );

  const filteredDayClosings = useMemo(
    () => filterByPeriod(dayClosings, activeFilter),
    [dayClosings, activeFilter]
  );

  const stats = useMemo(() => {
    const averageStress = getAverage(filteredCheckIns, "stressLevel");
    const averageEnergy = getAverage(filteredCheckIns, "energyLevel");

    const pausesToday = pauseSessions.filter((session) =>
      isToday(session.completedAt)
    );

    return [
      {
        label: "Gem. Stress",
        value: averageStress,
        helper: "Op basis van je check-ins",
      },
      {
        label: "Gem. Energie",
        value: averageEnergy,
        helper: "Op basis van je check-ins",
      },
      {
        label: "Check-ins",
        value: filteredCheckIns.length,
        helper: `${checkIns.filter((item) => isToday(item.createdAt)).length} vandaag`,
      },
      {
        label: "Pauzes genomen",
        value: filteredPauseSessions.length,
        helper: `${pausesToday.length} vandaag`,
      },
    ];
  }, [filteredCheckIns, filteredPauseSessions, checkIns, pauseSessions]);

  const stressEnergyChartData = useMemo(() => {
    const sortedCheckIns = [...filteredCheckIns].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    const labels = sortedCheckIns.map((checkIn) =>
      formatTimeLabel(checkIn.createdAt)
    );

    return {
      labels,
      datasets: [
        {
          label: "Stress",
          data: sortedCheckIns.map((checkIn) => checkIn.stressLevel),
          borderColor: "#df7c7f",
          backgroundColor: "#df7c7f",
          tension: 0.35,
        },
        {
          label: "Energie",
          data: sortedCheckIns.map((checkIn) => checkIn.energyLevel),
          borderColor: "#78977f",
          backgroundColor: "#78977f",
          tension: 0.35,
        },
      ],
    };
  }, [filteredCheckIns]);

  const timerChartData = useMemo(() => {
    const focusMinutes = getTimerMinutes(filteredTimerSessions, "focus");
    const breakMinutes = getTimerMinutes(filteredTimerSessions, "break");
    const workdayMinutes = getTimerMinutes(filteredTimerSessions, "workday");

    return {
      labels: ["Focus", "Pauze", "Werkdag"],
      datasets: [
        {
          label: "Minuten",
          data: [focusMinutes, breakMinutes, workdayMinutes],
          backgroundColor: ["#78977f", "#c7d8ca", "#dfc978"],
        },
      ],
    };
  }, [filteredTimerSessions]);

  const recommendation = useMemo(() => {
    const averageStress =
      filteredCheckIns.length > 0
        ? Number(getAverage(filteredCheckIns, "stressLevel"))
        : null;

    const breakTimers = filteredTimerSessions.filter(
      (timer) => timer.type === "break"
    );

    if (averageStress && averageStress >= 7) {
      return {
        type: "stress",
        title: "Plan vandaag een rustige pauze",
        text: "Je stress ligt wat hoger. Een korte ademhalingsoefening of wandeling kan helpen.",
      };
    }

    if (breakTimers.length === 0) {
      return {
        type: "pause",
        title: "Neem bewust een korte pauze",
        text: "Je hebt in deze periode nog geen pauzetimer gebruikt.",
      };
    }

    return {
      type: "balance",
      title: "Je bouwt al bewuste rustmomenten in",
      text: "Blijf luisteren naar je energie en neem pauzes wanneer je merkt dat je focus zakt.",
    };
  }, [filteredCheckIns, filteredTimerSessions]);

  const latestDayClosing = filteredDayClosings[0] || dayClosings[0] || null;

  return (
    <MainLayout title="Inzichten" subtitle="Ontdek je patronen en trends">
      <section className="insights-page">
        <UpgradeBanner />

        <InsightFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <p className="insights-date">{formatDate(new Date())}</p>

        {loading ? (
          <p>Inzichten laden...</p>
        ) : (
          <>
            <StatsGrid stats={stats} />

            <div className="insights-charts">
              <ChartCard
                title="Stress & Energie Trends"
                type="line"
                data={stressEnergyChartData}
              />

              <ChartCard
                title="Timergebruik"
                type="bar"
                data={timerChartData}
              />
            </div>

            <RecommendationCard recommendation={recommendation} />

            <DayDetailLocked latestDayClosing={latestDayClosing} />
          </>
        )}
      </section>
    </MainLayout>
  );
}

export default InsightsPage;