import { useEffect, useMemo, useState } from "react";
import Button from "../base/Button";
import "./css/DashboardFocusAction.css";

import documentIcon from "../../assets/icons_zwart/notitie_zwart.svg";

import { getRecentDayClosings } from "../../services/dayClosingService";
import {
  getMyFocusTasks,
  createFocusTask,
  updateFocusTask,
  deleteFocusTask,
} from "../../services/focusTaskService";

function isSameDay(dateA, dateB = new Date()) {
  const first = new Date(dateA);
  const second = new Date(dateB);

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isYesterday(date, today = new Date()) {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return isSameDay(date, yesterday);
}

function normalizeText(text) {
  return text.trim().toLowerCase();
}

function getTaskKey(task) {
  return `${task.day}-${task.source}-${normalizeText(task.text)}`;
}

function DashboardFocusAction({ focusLoading }) {
  const [isFocusPopupOpen, setIsFocusPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [draftTask, setDraftTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState("");

  const loadFocusData = async () => {
    try {
      setLoadingTasks(true);
      setError("");

      const [focusTasks, dayClosings] = await Promise.all([
        getMyFocusTasks(),
        getRecentDayClosings(),
      ]);

      const expectedDayClosingTasks = [];

      dayClosings.forEach((dayClosing) => {
        const text = dayClosing.tomorrowFocus?.trim();
        if (!text) return;

        if (isYesterday(dayClosing.createdAt)) {
          expectedDayClosingTasks.push({
            text,
            day: "today",
            source: "dayClosing",
          });
        }

        if (isSameDay(dayClosing.createdAt)) {
          expectedDayClosingTasks.push({
            text,
            day: "tomorrow",
            source: "dayClosing",
          });
        }
      });

      const expectedKeys = new Set(expectedDayClosingTasks.map(getTaskKey));
      const seenDayClosingKeys = new Set();

      const tasksToKeep = [];
      const tasksToDelete = [];

      focusTasks.forEach((task) => {
        if (task.source !== "dayClosing") {
          tasksToKeep.push(task);
          return;
        }

        const key = getTaskKey(task);

        if (!expectedKeys.has(key) || seenDayClosingKeys.has(key)) {
          tasksToDelete.push(task);
          return;
        }

        seenDayClosingKeys.add(key);
        tasksToKeep.push(task);
      });

      if (tasksToDelete.length > 0) {
        await Promise.all(tasksToDelete.map((task) => deleteFocusTask(task._id)));
      }

      const existingKeys = new Set(tasksToKeep.map(getTaskKey));
      const tasksToCreate = expectedDayClosingTasks.filter(
        (task) => !existingKeys.has(getTaskKey(task))
      );

      const createdTasks = await Promise.all(
        tasksToCreate.map((task) => createFocusTask(task))
      );

      setTasks([...createdTasks, ...tasksToKeep]);
    } catch (error) {
      console.error(error);
      setError("Focuslijst ophalen mislukt.");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    loadFocusData();
  }, []);

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

    const alreadyExists = tasks.some(
      (task) =>
        task.day === activeTab &&
        normalizeText(task.text) === normalizeText(value)
    );

    if (alreadyExists) {
      setDraftTask("");
      return;
    }

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
            {focusLoading || loadingTasks ? (
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