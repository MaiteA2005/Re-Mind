import { useNavigate } from "react-router-dom";
import "./PauseReminderPopup.css";
import koffieGroen from "../../assets/icons_groen/koffie_groen.svg";
import Button from "../base/Button";

function PauseReminderPopup({ onTakeBreak, onSnooze, onDismiss }) {
  const navigate = useNavigate();

  const handleTakeBreak = () => {
    onTakeBreak();       // popup sluiten
    navigate("/pause");  // daarna navigeren
  };

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
          <Button
            variant="primary"
            full
            onClick={handleTakeBreak}
          >
            Pauze nemen
          </Button>

          <Button
            variant="secondary"
            full
            onClick={onSnooze}
          >
            Later herinneren
          </Button>

          <Button
            variant="text"
            full
            onClick={onDismiss}
          >
            Overslaan
          </Button>
        </div>
      </article>
    </div>
  );
}

export default PauseReminderPopup;