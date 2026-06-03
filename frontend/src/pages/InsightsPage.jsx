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

function getComparePeriodRange(activeFilter, offset = 1) {
  const now = new Date();

  if (activeFilter === "week") {
    const compareDate = new Date(now);
    compareDate.setDate(now.getDate() - offset * 7);

    return {
      start: getStartOfWeek(compareDate),
      end: getEndOfWeek(compareDate),
    };
  }

  if (activeFilter === "month") {
    const compareDate = new Date(
      now.getFullYear(),
      now.getMonth() - offset,
      1
    );

    return {
      start: getStartOfMonth(compareDate),
      end: getEndOfMonth(compareDate),
    };
  }

  return null;
}

function filterByPeriod(items, activeFilter, dateKey = "createdAt") {
  const { start, end } = getPeriodRange(activeFilter);

  return filterByCustomRange(items, { start, end }, dateKey);
}

function filterByCustomRange(items, range, dateKey = "createdAt") {
  if (!range) return [];

  return items.filter((item) => {
    if (!item?.[dateKey]) return false;

    const itemDate = new Date(item[dateKey]);
    if (!isValidDate(itemDate)) return false;

    return itemDate >= range.start && itemDate <= range.end;
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

function getCompareLabel(activeFilter, compareRange) {
  if (!compareRange) return "";

  if (activeFilter === "week") {
    return `${formatDate(compareRange.start)} - ${formatDate(compareRange.end)}`;
  }

  if (activeFilter === "month") {
    return compareRange.start.toLocaleDateString("nl-BE", {
      month: "long",
      year: "numeric",
    });
  }

  return "";
}

function getComparisonOptions(activeFilter) {
  if (activeFilter === "week") {
    return [
      { value: 1, label: "Vorige week" },
      { value: 2, label: "2 weken geleden" },
      { value: 3, label: "3 weken geleden" },
      { value: 4, label: "4 weken geleden" },
    ];
  }

  if (activeFilter === "month") {
    return [
      { value: 1, label: "Vorige maand" },
      { value: 2, label: "2 maanden geleden" },
      { value: 3, label: "3 maanden geleden" },
      { value: 4, label: "4 maanden geleden" },
    ];
  }

  return [];
}

function buildStressEnergyData({
  activeFilter,
  filteredCheckIns,
  compareCheckIns = [],
  compareEnabled = false,
}) {
  if (activeFilter === "week") {
    const labels = ["ma", "di", "wo", "do", "vr", "za", "zo"];

    const grouped = labels.reduce((acc, label) => {
      acc[label] = { stress: [], energy: [] };
      return acc;
    }, {});

    const compareGrouped = labels.reduce((acc, label) => {
      acc[label] = { stress: [], energy: [] };
      return acc;
    }, {});

    filteredCheckIns.forEach((checkIn) => {
      const label = formatDayLabel(checkIn.createdAt);
      if (!grouped[label]) return;

      grouped[label].stress.push(checkIn.stressLevel);
      grouped[label].energy.push(checkIn.energyLevel);
    });

    compareCheckIns.forEach((checkIn) => {
      const label = formatDayLabel(checkIn.createdAt);
      if (!compareGrouped[label]) return;

      compareGrouped[label].stress.push(checkIn.stressLevel);
      compareGrouped[label].energy.push(checkIn.energyLevel);
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
        ...(compareEnabled
          ? [
              {
                label: "Stress vergelijking",
                data: labels.map((label) =>
                  getAverageFromNumbers(compareGrouped[label].stress)
                ),
                borderColor: "#efb0b0",
                backgroundColor: "#efb0b0",
                borderDash: [6, 6],
                tension: 0.35,
              },
              {
                label: "Energie vergelijking",
                data: labels.map((label) =>
                  getAverageFromNumbers(compareGrouped[label].energy)
                ),
                borderColor: "#b8cdbd",
                backgroundColor: "#b8cdbd",
                borderDash: [6, 6],
                tension: 0.35,
              },
            ]
          : []),
      ],
    };
  }

  if (activeFilter === "month") {
    const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

    const grouped = labels.reduce((acc, label) => {
      acc[label] = { stress: [], energy: [] };
      return acc;
    }, {});

    const compareGrouped = labels.reduce((acc, label) => {
      acc[label] = { stress: [], energy: [] };
      return acc;
    }, {});

    filteredCheckIns.forEach((checkIn) => {
      const label = formatWeekLabel(checkIn.createdAt);
      if (!grouped[label]) return;

      grouped[label].stress.push(checkIn.stressLevel);
      grouped[label].energy.push(checkIn.energyLevel);
    });

    compareCheckIns.forEach((checkIn) => {
      const label = formatWeekLabel(checkIn.createdAt);
      if (!compareGrouped[label]) return;

      compareGrouped[label].stress.push(checkIn.stressLevel);
      compareGrouped[label].energy.push(checkIn.energyLevel);
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
        ...(compareEnabled
          ? [
              {
                label: "Stress vergelijking",
                data: labels.map((label) =>
                  getAverageFromNumbers(compareGrouped[label].stress)
                ),
                borderColor: "#efb0b0",
                backgroundColor: "#efb0b0",
                borderDash: [6, 6],
                tension: 0.35,
              },
              {
                label: "Energie vergelijking",
                data: labels.map((label) =>
                  getAverageFromNumbers(compareGrouped[label].energy)
                ),
                borderColor: "#b8cdbd",
                backgroundColor: "#b8cdbd",
                borderDash: [6, 6],
                tension: 0.35,
              },
            ]
          : []),
      ],
    };
  }

  const sortedCheckIns = [...filteredCheckIns].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return {
    labels: sortedCheckIns.map((checkIn) => formatTimeLabel(checkIn.createdAt)),
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
}

function buildPauseBehaviorData({
  activeFilter,
  filteredPauseReminders,
  comparePauseReminders = [],
  compareEnabled = false,
}) {
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

  const compareGrouped = labels.reduce((acc, label) => {
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

    if (reminder.action === "taken") grouped[label].taken += 1;

    if (reminder.action === "missed" || reminder.action === "ignored") {
      grouped[label].missed += 1;
    }
  });

  comparePauseReminders.forEach((reminder) => {
    const label =
      activeFilter === "week"
        ? formatDayLabel(reminder.createdAt)
        : activeFilter === "month"
        ? formatWeekLabel(reminder.createdAt)
        : formatHourLabel(reminder.createdAt);

    if (!label) return;

    if (!compareGrouped[label]) {
      compareGrouped[label] = { taken: 0, missed: 0 };
    }

    if (reminder.action === "taken") compareGrouped[label].taken += 1;

    if (reminder.action === "missed" || reminder.action === "ignored") {
      compareGrouped[label].missed += 1;
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
      ...(compareEnabled
        ? [
            {
              label: "Pauze genomen vergelijking",
              data: finalLabels.map((label) => compareGrouped[label]?.taken || 0),
              backgroundColor: "#b8cdbd",
            },
            {
              label: "Pauze gemist vergelijking",
              data: finalLabels.map(
                (label) => compareGrouped[label]?.missed || 0
              ),
              backgroundColor: "#efb0b0",
            },
          ]
        : []),
    ],
  };
}

function InsightsPage() {
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState("today");
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareOffset, setCompareOffset] = useState(1);

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
    if (activeFilter === "today") {
      setCompareEnabled(false);
      setCompareOffset(1);
    }
  }, [activeFilter]);

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

  const compareRange = useMemo(
    () => getComparePeriodRange(activeFilter, compareOffset),
    [activeFilter, compareOffset]
  );

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

  const compareCheckIns = useMemo(
    () =>
      compareEnabled && activeFilter !== "today"
        ? filterByCustomRange(checkIns, compareRange)
        : [],
    [checkIns, compareRange, compareEnabled, activeFilter]
  );

  const comparePauseReminders = useMemo(
    () =>
      compareEnabled && activeFilter !== "today"
        ? filterByCustomRange(pauseReminders, compareRange)
        : [],
    [pauseReminders, compareRange, compareEnabled, activeFilter]
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

  const stressEnergyChartData = useMemo(
    () =>
      buildStressEnergyData({
        activeFilter,
        filteredCheckIns,
        compareCheckIns,
        compareEnabled,
      }),
    [activeFilter, filteredCheckIns, compareCheckIns, compareEnabled]
  );

  const pauseBehaviorChartData = useMemo(
    () =>
      buildPauseBehaviorData({
        activeFilter,
        filteredPauseReminders,
        comparePauseReminders,
        compareEnabled,
      }),
    [
      activeFilter,
      filteredPauseReminders,
      comparePauseReminders,
      compareEnabled,
    ]
  );

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
  const comparisonOptions = getComparisonOptions(activeFilter);
  const compareLabel = getCompareLabel(activeFilter, compareRange);

  return (
    <MainLayout title="Inzichten" subtitle="Ontdek je patronen en trends">
      <section className="insights-page">
        {!isPremiumUser && <UpgradeBanner />}

        <div className="insightsTopControls">
          <InsightFilters
            activeFilter={activeFilter}
            onFilterChange={(filter) => {
              if (!isPremiumUser && filter !== "today") return;
              setActiveFilter(filter);
            }}
            isPremium={isPremiumUser}
          />

          {activeFilter !== "today" && isPremiumUser && (
            <div className="insightsCompareControls">
              <label className="compareToggle">
                <span>
                  Vergelijk met vorige {activeFilter === "week" ? "week" : "maand"}
                </span>

                <input
                  type="checkbox"
                  checked={compareEnabled}
                  onChange={(event) => setCompareEnabled(event.target.checked)}
                />

                <span className="compareSlider" />
              </label>
            </div>
          )}
        </div>

        <div className="insightsDateCompareRow">
          <p className="insights-date">
            {getPeriodDateLabel(activeFilter)}
            {compareEnabled && compareLabel && (
              <span> • vergelijking: {compareLabel}</span>
            )}
          </p>

          {activeFilter !== "today" && isPremiumUser && (
            <div className="compareSelectSlot">
              <select
                value={compareOffset}
                onChange={(event) => setCompareOffset(Number(event.target.value))}
                className={`compareSelect ${compareEnabled ? "" : "isHidden"}`}
                disabled={!compareEnabled}
              >
                {comparisonOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

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