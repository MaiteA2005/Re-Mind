import { useEffect, useMemo, useState } from "react";

import { formatDate } from "../utils/date";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";
import UpgradeBanner from "../components/base/UpgradeBanner";

import { getMyCheckIns } from "../services/checkInService";
import { getMyPauseSessions } from "../services/pauseStatsService";
import { getMyDayClosings } from "../services/dayClosingService";
import { getMyPauseReminders } from "../services/pauseReminderService";

import InsightFilters from "../components/insights/InsightFilters";
import StatsGrid from "../components/insights/StatsGrid";
import ChartCard from "../components/insights/ChartCard";
import RecommendationCard from "../components/insights/RecommendationCard";
import DayDetail from "../components/insights/DayDetail";
import DayDetailLocked from "../components/insights/DayDetailLocked";

import "./css/InsightsPage.css";

function getAverage(items, key) {
  if (!items.length) return "-";

  const total = items.reduce((sum, item) => sum + Number(item[key] || 0), 0);
  return (total / items.length).toFixed(1);
}

function getAverageFromNumbers(numbers) {
  if (!numbers.length) return 0;

  const total = numbers.reduce((sum, value) => sum + Number(value || 0), 0);
  return Number((total / numbers.length).toFixed(1));
}

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function getStartOfDay(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getEndOfDay(date = new Date()) {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

function getStartOfWeek(date = new Date()) {
  const current = new Date(date);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);

  const start = new Date(current.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
}

function getEndOfWeek(date = new Date()) {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function getStartOfMonth(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getEndOfMonth(date = new Date()) {
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return end;
}

function getPeriodRange(activeFilter) {
  const now = new Date();

  if (activeFilter === "week") {
    return {
      start: getStartOfWeek(now),
      end: getEndOfWeek(now),
    };
  }

  if (activeFilter === "month") {
    return {
      start: getStartOfMonth(now),
      end: getEndOfMonth(now),
    };
  }

  return {
    start: getStartOfDay(now),
    end: getEndOfDay(now),
  };
}

function filterByPeriod(items, activeFilter, dateKey = "createdAt") {
  const { start, end } = getPeriodRange(activeFilter);

  return items.filter((item) => {
    if (!item?.[dateKey]) return false;

    const itemDate = new Date(item[dateKey]);
    if (!isValidDate(itemDate)) return false;

    return itemDate >= start && itemDate <= end;
  });
}

function formatTimeLabel(date) {
  const parsedDate = new Date(date);
  if (!isValidDate(parsedDate)) return "";

  return parsedDate.toLocaleTimeString("nl-BE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatHourLabel(date) {
  const parsedDate = new Date(date);
  if (!isValidDate(parsedDate)) return "";

  const hour = parsedDate.getHours().toString().padStart(2, "0");
  return `${hour}:00`;
}

function formatDayLabel(date) {
  const parsedDate = new Date(date);
  if (!isValidDate(parsedDate)) return "";

  return parsedDate
    .toLocaleDateString("nl-BE", {
      weekday: "short",
    })
    .replace(".", "");
}

function getWeekOfMonth(date) {
  const parsedDate = new Date(date);
  if (!isValidDate(parsedDate)) return 1;

  return Math.ceil(parsedDate.getDate() / 7);
}

function formatWeekLabel(date) {
  return `Week ${getWeekOfMonth(date)}`;
}

function formatDateRange(start, end) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function getPeriodDateLabel(activeFilter) {
  const { start, end } = getPeriodRange(activeFilter);

  if (activeFilter === "today") {
    return formatDate(start);
  }

  return formatDateRange(start, end);
}

function InsightsPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("today");

  const [checkIns, setCheckIns] = useState([]);
  const [pauseSessions, setPauseSessions] = useState([]);
  const [dayClosings, setDayClosings] = useState([]);
  const [pauseReminders, setPauseReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const isPremiumUser =
    user?.subscription === "premium" ||
    user?.plan === "premium" ||
    user?.subscriptionPlan === "premium" ||
    user?.isPremium === true;

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [checkInData, pauseData, dayClosingData, pauseReminderData] =
          await Promise.all([
            getMyCheckIns(),
            getMyPauseSessions(),
            getMyDayClosings(),
            getMyPauseReminders(),
          ]);

        setCheckIns(checkInData || []);
        setPauseSessions(pauseData || []);
        setDayClosings(dayClosingData || []);
        setPauseReminders(pauseReminderData || []);
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

    const remindersTaken = filteredPauseReminders.filter(
      (reminder) => reminder.action === "taken"
    ).length;

    const remindersMissed = filteredPauseReminders.filter(
      (reminder) =>
        reminder.action === "missed" || reminder.action === "ignored"
    ).length;

    const remindersSnoozed = filteredPauseReminders.filter(
      (reminder) => reminder.action === "snoozed"
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
        value: remindersTaken,
        helper:
          activeFilter === "today"
            ? "Vandaag"
            : activeFilter === "week"
            ? "Deze week"
            : "Deze maand",
      },
      {
        label: "Later herinnerd",
        value: remindersSnoozed,
        helper: `${remindersMissed} gemist`,
      },
    ];
  }, [filteredCheckIns, filteredPauseReminders, activeFilter]);

  const stressEnergyChartData = useMemo(() => {
    if (activeFilter === "week") {
      const labels = ["ma", "di", "wo", "do", "vr", "za", "zo"];

      const grouped = labels.reduce((acc, label) => {
        acc[label] = { stress: [], energy: [] };
        return acc;
      }, {});

      filteredCheckIns.forEach((checkIn) => {
        const label = formatDayLabel(checkIn.createdAt);
        if (!grouped[label]) return;

        grouped[label].stress.push(checkIn.stressLevel);
        grouped[label].energy.push(checkIn.energyLevel);
      });

      return {
        labels,
        datasets: [
          {
            label: "Stress",
            data: labels.map((label) =>
              getAverageFromNumbers(grouped[label].stress)
            ),
            borderColor: "#df7c7f",
            backgroundColor: "#df7c7f",
            tension: 0.35,
          },
          {
            label: "Energie",
            data: labels.map((label) =>
              getAverageFromNumbers(grouped[label].energy)
            ),
            borderColor: "#78977f",
            backgroundColor: "#78977f",
            tension: 0.35,
          },
        ],
      };
    }

    if (activeFilter === "month") {
      const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

      const grouped = labels.reduce((acc, label) => {
        acc[label] = { stress: [], energy: [] };
        return acc;
      }, {});

      filteredCheckIns.forEach((checkIn) => {
        const label = formatWeekLabel(checkIn.createdAt);
        if (!grouped[label]) return;

        grouped[label].stress.push(checkIn.stressLevel);
        grouped[label].energy.push(checkIn.energyLevel);
      });

      return {
        labels,
        datasets: [
          {
            label: "Stress",
            data: labels.map((label) =>
              getAverageFromNumbers(grouped[label].stress)
            ),
            borderColor: "#df7c7f",
            backgroundColor: "#df7c7f",
            tension: 0.35,
          },
          {
            label: "Energie",
            data: labels.map((label) =>
              getAverageFromNumbers(grouped[label].energy)
            ),
            borderColor: "#78977f",
            backgroundColor: "#78977f",
            tension: 0.35,
          },
        ],
      };
    }

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
  }, [filteredCheckIns, activeFilter]);

  const pauseBehaviorChartData = useMemo(() => {
    const labels =
      activeFilter === "week"
        ? ["ma", "di", "wo", "do", "vr", "za", "zo"]
        : activeFilter === "month"
        ? ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
        : [];

    const grouped = labels.reduce((acc, label) => {
      acc[label] = { taken: 0, missed: 0 };
      return acc;
    }, {});

    filteredPauseReminders.forEach((reminder) => {
      const label =
        activeFilter === "week"
          ? formatDayLabel(reminder.createdAt)
          : activeFilter === "month"
          ? formatWeekLabel(reminder.createdAt)
          : formatHourLabel(reminder.createdAt);

      if (!label) return;

      if (!grouped[label]) {
        grouped[label] = { taken: 0, missed: 0 };
      }

      if (reminder.action === "taken") {
        grouped[label].taken += 1;
      }

      if (reminder.action === "missed" || reminder.action === "ignored") {
        grouped[label].missed += 1;
      }
    });

    const finalLabels =
      activeFilter === "today" ? Object.keys(grouped).sort() : labels;

    return {
      labels: finalLabels,
      datasets: [
        {
          label: "Pauze genomen",
          data: finalLabels.map((label) => grouped[label]?.taken || 0),
          backgroundColor: "#78977f",
        },
        {
          label: "Pauze gemist",
          data: finalLabels.map((label) => grouped[label]?.missed || 0),
          backgroundColor: "#df7c7f",
        },
      ],
    };
  }, [filteredPauseReminders, activeFilter]);

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
        reminder.action === "missed" || reminder.action === "ignored"
    ).length;

    const snoozedReminders = filteredPauseReminders.filter(
      (reminder) => reminder.action === "snoozed"
    ).length;

    if (averageStress && averageStress >= 7) {
      return {
        type: "stress",
        title: "Plan een rustige pauze",
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

    if (snoozedReminders > takenReminders) {
      return {
        type: "pause",
        title: "Stel je pauze niet te vaak uit",
        text: "Je kiest vaak voor later herinneren. Probeer je volgende pauze bewust te nemen.",
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
        {!isPremiumUser && <UpgradeBanner />}

        <InsightFilters
          activeFilter={activeFilter}
          onFilterChange={(filter) => {
            if (!isPremiumUser && filter !== "today") return;
            setActiveFilter(filter);
          }}
          isPremium={isPremiumUser}
        />

        <p className="insights-date">{getPeriodDateLabel(activeFilter)}</p>

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

            {isPremiumUser ? (
              <DayDetail
                period={activeFilter}
                checkIns={filteredCheckIns}
                pauseSessions={filteredPauseSessions}
                dayClosings={filteredDayClosings}
              />
            ) : (
              <DayDetailLocked latestDayClosing={latestDayClosing} />
            )}
          </>
        )}
      </section>
    </MainLayout>
  );
}

export default InsightsPage;