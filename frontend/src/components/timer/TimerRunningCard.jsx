import { useState } from "react";
import Button from "../base/Button";
import "./TimerRunningCard.css";

import pauzeIconZwart from "../../assets/icons_zwart/pauze_zwart.svg";
import playIconZwart from "../../assets/icons_zwart/play_zwart.svg";
import stopIconZwart from "../../assets/icons_zwart/stop_zwart.svg";
import resetIconZwart from "../../assets/icons_zwart/opnieuw_zwart.svg";
import koffieIconZwart from "../../assets/icons_zwart/koffie_zwart.svg";

import pauzeIconWit from "../../assets/icons_wit/pauze_wit.svg";
import playIconWit from "../../assets/icons_wit/play_wit.svg";
import stopIconWit from "../../assets/icons_wit/stop_wit.svg";
import resetIconWit from "../../assets/icons_wit/opnieuw_wit.svg";
import koffieIconWit from "../../assets/icons_wit/koffie_wit.svg";

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function TimerRunningCard({
  activeTimer,
  timeLeft,
  elapsedTime,
  totalSeconds,
  isPaused,
  pauseTime,
  onPauseToggle,
  onReset,
  onStop,
  onTakeBreak,
  onEndWorkday,
}) {
  const [pauseHover, setPauseHover] = useState(false);
  const [resetHover, setResetHover] = useState(false);
  const [breakHover, setBreakHover] = useState(false);

  const progress =
    totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  const title =
    activeTimer === "workday"
      ? "Werkdag loopt"
      : activeTimer === "focus"
      ? "Focusblok"
      : "Pauze";

  const pauseIcon = pauseHover
    ? isPaused
      ? playIconWit
      : pauzeIconWit
    : isPaused
    ? playIconZwart
    : pauzeIconZwart;

  return (
    <>
      <article className="timerRunningCard">
        <h2>{title}</h2>

        {activeTimer === "workday" ? (
          <>
            <p>Je bent bezig voor</p>
            <strong>{formatTime(elapsedTime)}</strong>
          </>
        ) : (
          <>
            <strong>{formatTime(timeLeft)}</strong>
            <p>Nog {formatTime(timeLeft)} te gaan</p>
          </>
        )}

        <div className="timerProgressBar">
          <div className="timerProgressFill" style={{ width: `${progress}%` }} />
        </div>

        {activeTimer === "workday" && (
          <div className="timerWorkdayStats">
            <div>
              <span>Resterende tijd</span>
              <strong>{formatTime(timeLeft)}</strong>
            </div>

            <div>
              <span>Pauzetijd</span>
              <strong>{Math.floor(pauseTime / 60)}m</strong>
            </div>
          </div>
        )}
      </article>

      <article className="timerControlsCard">
        {activeTimer === "workday" ? (
          <>
            <div className="timerControlRow">
              <Button
                variant="secondary"
                onClick={onTakeBreak}
                onMouseEnter={() => setBreakHover(true)}
                onMouseLeave={() => setBreakHover(false)}
                iconLeft={breakHover ? koffieIconWit : koffieIconZwart}
              >
                Pauze nemen
              </Button>

              <Button
                variant="secondary"
                onClick={onPauseToggle}
                onMouseEnter={() => setPauseHover(true)}
                onMouseLeave={() => setPauseHover(false)}
                iconLeft={pauseIcon}
              >
                {isPaused ? "Hervat timer" : "Pauzeer timer"}
              </Button>
            </div>
            <div className="workdayEndButton">
              <Button
                variant="danger"
                onClick={onEndWorkday}
                iconLeft={stopIconWit}
                full
              >
                Werkdag beëindigen
              </Button>
            </div>
          </>
        ) : (
          <div className="timerControlRow">
            <Button
              variant="secondary"
              onClick={onPauseToggle}
              onMouseEnter={() => setPauseHover(true)}
              onMouseLeave={() => setPauseHover(false)}
              iconLeft={pauseIcon}
            >
              {isPaused ? "Hervat" : "Pauzeer"}
            </Button>

            <Button
              variant="secondary"
              onClick={onReset}
              onMouseEnter={() => setResetHover(true)}
              onMouseLeave={() => setResetHover(false)}
              iconLeft={resetHover ? resetIconWit : resetIconZwart}
            >
              Opnieuw
            </Button>

            <Button
              variant="danger"
              onClick={onStop}
              iconLeft={stopIconWit}
              full
            >
              Stop
            </Button>
          </div>
        )}
      </article>
    </>
  );
}

export default TimerRunningCard;