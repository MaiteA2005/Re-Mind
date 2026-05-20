import "./PauseReminderPopup.css";
import koffieGroen from "../../assets/icons_groen/koffie_groen.svg";

function PauseReminderPopup({ onTakeBreak, onSnooze, onDismiss }) {
  return (
    <div className="pauseReminderOverlay">
      <article className="pauseReminderPopup">
        <div className="pauseReminderIcon">
          <img src={koffieGroen} alt="" />
        </div>

        <h2>Tijd voor een korte pauze</h2>

        <p>
          Je bent al even bezig. Een korte pauze kan helpen om je focus en
          energie te behouden.
        </p>

        <div className="pauseReminderActions">
          <button
            type="button"
            className="pauseReminderPrimary"
            onClick={onTakeBreak}
          >
            Pauze nemen
          </button>

          <button
            type="button"
            className="pauseReminderSecondary"
            onClick={onSnooze}
          >
            Later herinneren
          </button>

          <button
            type="button"
            className="pauseReminderGhost"
            onClick={onDismiss}
          >
            Overslaan
          </button>
        </div>
      </article>
    </div>
  );
}

export default PauseReminderPopup;