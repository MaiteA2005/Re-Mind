import { useEffect, useMemo, useState } from "react";
import Button from "../base/Button";
import "./DashboardFocusAction.css";

import documentIcon from "../../assets/icons_zwart/notitie_zwart.svg";

import {
  getMyFocusTasks,
  createFocusTask,
  updateFocusTask,
  deleteFocusTask,
} from "../../services/focusTaskService";

function DashboardFocusAction({ todayFocus, focusLoading }) {
  const [isFocusPopupOpen, setIsFocusPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [draftTask, setDraftTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState("");

  const importedTomorrowFocus = todayFocus?.tomorrowFocus?.trim();

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

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const addTomorrowFocusFromDayClosing = async () => {
      if (!importedTomorrowFocus || loadingTasks) return;

      const alreadyExists = tasks.some(
        (task) =>
          task.source === "dayClosing" &&
          task.day === "tomorrow" &&
          task.text.toLowerCase() === importedTomorrowFocus.toLowerCase()
      );

      if (alreadyExists) return;

      try {
        const newTask = await createFocusTask({
          text: importedTomorrowFocus,
          day: "tomorrow",
          source: "dayClosing",
        });

        setTasks((previous) => [newTask, ...previous]);
      } catch (error) {
        console.error(error);
      }
    };

    addTomorrowFocusFromDayClosing();
  }, [importedTomorrowFocus, loadingTasks, tasks]);

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