import { useEffect, useMemo, useState } from "react";
import Button from "../base/Button";
import "./DashboardFocusAction.css";

import documentIcon from "../../assets/icons_zwart/notitie_zwart.svg";

import { getRecentDayClosings } from "../../services/dayClosingService";
import {
  getMyFocusTasks,
  createFocusTask,
  updateFocusTask,
  deleteFocusTask,
} from "../../services/focusTaskService";

function DashboardFocusAction({ focusLoading }) {
  const [isFocusPopupOpen, setIsFocusPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [draftTask, setDraftTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [recentDayClosings, setRecentDayClosings] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingDayClosings, setLoadingDayClosings] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const data = await getMyFocusTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
      setError("Focuslijst ophalen mislukt.");
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchRecentDayClosings = async () => {
    try {
      setLoadingDayClosings(true);
      const data = await getRecentDayClosings();
      setRecentDayClosings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDayClosings(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchRecentDayClosings();
  }, []);

  const todayFocusFromYesterday = recentDayClosings[1]?.tomorrowFocus?.trim();
  const tomorrowFocusFromToday = recentDayClosings[0]?.tomorrowFocus?.trim();

  useEffect(() => {
    const syncDayClosingFocuses = async () => {
      if (loadingTasks || loadingDayClosings) return;

      try {
        if (todayFocusFromYesterday) {
          const alreadyExistsToday = tasks.some(
            (task) =>
              task.source === "dayClosing" &&
              task.day === "today" &&
              task.text.toLowerCase() ===
                todayFocusFromYesterday.toLowerCase()
          );

          if (!alreadyExistsToday) {
            const newTodayTask = await createFocusTask({
              text: todayFocusFromYesterday,
              day: "today",
              source: "dayClosing",
            });

            setTasks((previous) => [newTodayTask, ...previous]);
          }
        }

        if (tomorrowFocusFromToday) {
          const alreadyExistsTomorrow = tasks.some(
            (task) =>
              task.source === "dayClosing" &&
              task.day === "tomorrow" &&
              task.text.toLowerCase() ===
                tomorrowFocusFromToday.toLowerCase()
          );

          if (!alreadyExistsTomorrow) {
            const newTomorrowTask = await createFocusTask({
              text: tomorrowFocusFromToday,
              day: "tomorrow",
              source: "dayClosing",
            });

            setTasks((previous) => [newTomorrowTask, ...previous]);
          }
        }
      } catch (error) {
        console.error(error);
        setError("Focus uit dagafsluiting toevoegen mislukt.");
      }
    };

    syncDayClosingFocuses();
  }, [
    loadingTasks,
    loadingDayClosings,
    tasks,
    todayFocusFromYesterday,
    tomorrowFocusFromToday,
  ]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => task.day === activeTab);
  }, [tasks, activeTab]);

  const openTasksCount = useMemo(() => {
    return tasks.filter((task) => !task.done).length;
  }, [tasks]);

  const handleAddTask = async (event) => {
    event.preventDefault();

    const value = draftTask.trim();
    if (!value) return;

    try {
      const newTask = await createFocusTask({
        text: value,
        day: activeTab,
        source: "manual",
      });

      setTasks((previous) => [newTask, ...previous]);
      setDraftTask("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Taak toevoegen mislukt.");
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const updatedTask = await updateFocusTask(task._id, {
        done: !task.done,
      });

      setTasks((previous) =>
        previous.map((item) =>
          item._id === updatedTask._id ? updatedTask : item
        )
      );
    } catch (error) {
      console.error(error);
      setError("Taak aanpassen mislukt.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteFocusTask(taskId);

      setTasks((previous) => previous.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error(error);
      setError("Taak verwijderen mislukt.");
    }
  };

  return (
    <div className="focusPopupWrapper">
      <button
        className="pageHeaderButton"
        type="button"
        aria-label="Focuslijst openen"
        onClick={() => setIsFocusPopupOpen((prev) => !prev)}
      >
        <img src={documentIcon} alt="" className="pageHeaderIcon" />
      </button>

      {openTasksCount > 0 && <span className="focusBadge" />}

      {isFocusPopupOpen && (
        <div className="focusPopup">
          <div className="focusPopupHeader">
            <div>
              <h3>Focuslijst</h3>
              <p>Voeg doorheen de dag taken toe of vink ze af.</p>
            </div>
          </div>

          <div className="focusTabs">
            <button
              type="button"
              className={activeTab === "today" ? "active" : ""}
              onClick={() => setActiveTab("today")}
            >
              Vandaag
            </button>

            <button
              type="button"
              className={activeTab === "tomorrow" ? "active" : ""}
              onClick={() => setActiveTab("tomorrow")}
            >
              Morgen
            </button>
          </div>

          <form className="focusAddForm" onSubmit={handleAddTask}>
            <input
              type="text"
              value={draftTask}
              onChange={(event) => setDraftTask(event.target.value)}
              placeholder={
                activeTab === "today"
                  ? "Taak voor vandaag toevoegen"
                  : "Taak voor morgen toevoegen"
              }
            />

            <Button variant="primary" type="submit">
              +
            </Button>
          </form>

          {error && <p className="focusError">{error}</p>}

          <ul className="focusTaskList">
            {focusLoading || loadingTasks || loadingDayClosings ? (
              <li className="focusEmptyState">Focuslijst laden...</li>
            ) : filteredTasks.length === 0 ? (
              <li className="focusEmptyState">
                Nog geen taken voor{" "}
                {activeTab === "today" ? "vandaag" : "morgen"}.
              </li>
            ) : (
              filteredTasks.map((task) => (
                <li
                  key={task._id}
                  className={`focusTaskItem ${task.done ? "done" : ""}`}
                >
                  <button
                    type="button"
                    className={`focusTaskCheck ${task.done ? "done" : ""}`}
                    onClick={() => handleToggleTask(task)}
                    aria-label="Taak afvinken"
                  >
                    {task.done && "✓"}
                  </button>

                  <span>{task.text}</span>

                  {task.source === "dayClosing" && (
                    <small>Uit dagafsluiting</small>
                  )}

                  <button
                    type="button"
                    className="focusTaskDelete"
                    onClick={() => handleDeleteTask(task._id)}
                    aria-label="Taak verwijderen"
                  >
                    ×
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DashboardFocusAction;