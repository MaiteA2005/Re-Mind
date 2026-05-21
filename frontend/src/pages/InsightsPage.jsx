import { useEffect, useMemo, useState } from "react";

import { formatDate } from "../utils/date";
import MainLayout from "../components/layout/MainLayout";
import UpgradeBanner from "../components/base/UpgradeBanner";

import { getMyCheckIns } from "../services/checkInService";
import { getMyPauseSessions } from "../services/pauseStatsService";
import { getMyTimerSessions } from "../services/timerSessionService";
import { getMyDayClosings } from "../services/dayClosingService";
import { getMyPauseReminders } from "../services/pauseReminderService";

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

function formatHourLabel(date) {
  const hour = new Date(date).getHours().toString().padStart(2, "0");
  return `${hour}:00`;
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
  const [pauseReminders, setPauseReminders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [
          checkInData,
          pauseData,
          timerData,
          dayClosingData,
          pauseReminderData,
        ] = await Promise.all([
          getMyCheckIns(),
          getMyPauseSessions(),
          getMyTimerSessions(),
          getMyDayClosings(),
          getMyPauseReminders(),
        ]);

        setCheckIns(checkInData);
        setPauseSessions(pauseData);
        setTimerSessions(timerData);
        setDayClosings(dayClosingData);
        setPauseReminders(pauseReminderData);
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

  const filteredPauseReminders = useMemo(
    () => filterByPeriod(pauseReminders, activeFilter),
    [pauseReminders, activeFilter]
  );

  const stats = useMemo(() => {
    const averageStress = getAverage(filteredCheckIns, "stressLevel");
    const averageEnergy = getAverage(filteredCheckIns, "energyLevel");

    const pausesToday = pauseSessions.filter((session) =>
      isToday(session.completedAt)
    );

    const remindersTaken = filteredPauseReminders.filter(
      (reminder) => reminder.action === "taken"
    ).length;

    const remindersMissed = filteredPauseReminders.filter(
      (reminder) =>
        reminder.action === "missed" ||
        reminder.action === "skipped" ||
        reminder.action === "ignored"
    ).length;

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
        label: "Pauzes genomen",
        value: remindersTaken || filteredPauseSessions.length,
        helper: `${pausesToday.length} vandaag`,
      },
      {
        label: "Pauzes gemist",
        value: remindersMissed,
        helper: "Op basis van reminders",
      },
    ];
  }, [
    filteredCheckIns,
    filteredPauseSessions,
    filteredPauseReminders,
    pauseSessions,
  ]);

  const stressEnergyChartData = useMemo(() => {
    const sortedCheckIns = [...filteredCheckIns].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    return {
      labels: sortedCheckIns.map((checkIn) =>
        formatTimeLabel(checkIn.createdAt)
      ),
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

  const pauseBehaviorChartData = useMemo(() => {
    const grouped = {};

    filteredPauseReminders.forEach((reminder) => {
      const label = formatHourLabel(reminder.createdAt);

      if (!grouped[label]) {
        grouped[label] = {
          taken: 0,
          missed: 0,
        };
      }

      if (reminder.action === "taken") {
        grouped[label].taken += 1;
      }

      if (
        reminder.action === "missed" ||
        reminder.action === "skipped" ||
        reminder.action === "ignored"
      ) {
        grouped[label].missed += 1;
      }
    });

    const labels = Object.keys(grouped).sort();

    return {
      labels,
      datasets: [
        {
          label: "Pauze genomen",
          data: labels.map((label) => grouped[label].taken),
          backgroundColor: "#78977f",
        },
        {
          label: "Pauze gemist",
          data: labels.map((label) => grouped[label].missed),
          backgroundColor: "#df7c7f",
        },
      ],
    };
  }, [filteredPauseReminders]);

  const recommendation = useMemo(() => {
    const averageStress =
      filteredCheckIns.length > 0
        ? Number(getAverage(filteredCheckIns, "stressLevel"))
        : null;

    const takenReminders = filteredPauseReminders.filter(
      (reminder) => reminder.action === "taken"
    ).length;

    const missedReminders = filteredPauseReminders.filter(
      (reminder) =>
        reminder.action === "missed" ||
        reminder.action === "skipped" ||
        reminder.action === "ignored"
    ).length;

    if (averageStress && averageStress >= 7) {
      return {
        type: "stress",
        title: "Plan vandaag een rustige pauze",
        text: "Je stress ligt wat hoger. Een korte ademhalingsoefening of wandeling kan helpen.",
      };
    }

    if (missedReminders > takenReminders) {
      return {
        type: "pause",
        title: "Probeer één reminder bewust op te volgen",
        text: "Je slaat vaker pauzes over dan je ze neemt. Begin klein met één korte pauze.",
      };
    }

    if (takenReminders > 0) {
      return {
        type: "balance",
        title: "Je reageert goed op je pauzemomenten",
        text: "Je neemt bewust pauzes wanneer Re:Mind je eraan herinnert.",
      };
    }

    return {
      type: "pause",
      title: "Neem bewust een korte pauze",
      text: "Je hebt in deze periode nog geen pauzereminders opgevolgd.",
    };
  }, [filteredCheckIns, filteredPauseReminders]);

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
                title="Pauzegedrag"
                type="bar"
                data={pauseBehaviorChartData}
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