import { Link } from "react-router-dom";
import TimerOptionCard from "./TimerOptionCard";

import playIconWit from "../../assets/icons_wit/play_wit.svg";

function TimerSetupCard({
  activeTimer,
  selectedDuration,
  selectedReminder,
  customDuration,
  onDurationSelect,
  onReminderSelect,
  onCustomDurationChange,
  onStart,
}) {
  const isWorkday = activeTimer === "workday";
  const isFocus = activeTimer === "focus";
  const isBreak = activeTimer === "break";

  const title = isWorkday
    ? "Start je werkdag"
    : isFocus
    ? "Start een focusblok"
    : "Start een pauze";

  const description = isWorkday
    ? "Structureer je werkdag met focus en regelmatige pauzes"
    : isFocus
    ? "Kies een duur voor je werkblok. Gefocuste blokken van 25-45 minuten werken vaak het best."
    : "Neem een moment voor jezelf. Korte, regelmatige pauzes helpen je focus en energie behouden.";

  const durationOptions = isWorkday
    ? [360, 420, 480, 540]
    : isFocus
    ? [15, 25, 45, 60]
    : [3, 5, 10, 15];

  const reminderOptions = [60, 75, 90];

  const maxCustom = isFocus ? 180 : 60;

  return (
    <article className="timerSetupCard">
      <h2>{title}</h2>
      <p>{description}</p>

      <h3>{isWorkday ? "Hoe lang duurt je werkdag?" : "Kies een duur:"}</h3>

      <div className="timerOptionsGrid">
        {durationOptions.map((duration) => (
          <TimerOptionCard
            key={duration}
            label={isWorkday ? `${duration / 60} uur` : `${duration} minuten`}
            selected={selectedDuration === duration}
            onClick={() => onDurationSelect(duration)}
            iconType="clock"
          />
        ))}
      </div>

      {!isWorkday && (
        <>
          <label className="timerCustomField">
            Of kies een eigen duur:
            <input
              type="number"
              min="1"
              max={maxCustom}
              placeholder={`Minuten (max ${maxCustom})`}
              value={customDuration}
              onChange={(event) => onCustomDurationChange(event.target.value)}
            />
          </label>
        </>
      )}

      {isWorkday && (
        <>
          <h3>Hoe vaak wil je een pauzeherinnering?</h3>

          <div className="timerReminderGrid">
            {reminderOptions.map((reminder) => (
              <TimerOptionCard
                key={reminder}
                label={`Elke ${reminder} minuten`}
                selected={selectedReminder === reminder}
                onClick={() => onReminderSelect(reminder)}
                iconType="coffee"
              />
            ))}
          </div>
        </>
      )}

      <button type="button" className="timerPrimaryButton" onClick={onStart}>
        <img src={playIconWit} alt="" className="timerButtonIcon" />
        <span>
            Start {isWorkday ? "werkdag" : isFocus ? "focusblok" : "pauze"}
        </span>
      </button>

      {isBreak && (
        <div className="timerSuggestionBox">
          <p>Weet je niet wat je wilt doen tijdens je pauze?</p>
          <Link to="/pause" className="timerSuggestionLink">
            Bekijk pauzesuggesties
          </Link>
        </div>
      )}
    </article>
  );
}

export default TimerSetupCard;