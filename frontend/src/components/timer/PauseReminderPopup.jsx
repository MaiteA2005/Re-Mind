import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./PauseReminderPopup.css";

import koffieGroen from "../../assets/icons_groen/koffie_groen.svg";

import Button from "../base/Button";

function PauseReminderPopup({
  onTakeBreak,
  onSnooze,
  onDismiss,
}) {
  const navigate = useNavigate();

  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);

  const handleTakeBreak = () => {
    onTakeBreak();
    navigate("/timer");
  };

  const handleSnooze = (minutes) => {
    onSnooze(minutes);
    setShowSnoozeOptions(false);
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

          {!showSnoozeOptions ? (
            <Button
              variant="secondary"
              full
              onClick={() => setShowSnoozeOptions(true)}
            >
              Later herinneren
            </Button>
          ) : (
            <div className="pauseReminderSnoozeOptions">
              <Button
                variant="secondary"
                full
                onClick={() => handleSnooze(5)}
              >
                Herinner me over 5 minuten
              </Button>

              <Button
                variant="secondary"
                full
                onClick={() => handleSnooze(10)}
              >
                Herinner me over 10 minuten
              </Button>

              <Button
                variant="secondary"
                full
                onClick={() => handleSnooze(15)}
              >
                Herinner me over 15 minuten
              </Button>

              <Button
                variant="text"
                full
                onClick={() => setShowSnoozeOptions(false)}
              >
                Annuleren
              </Button>
            </div>
          )}

          {!showSnoozeOptions && (
            <Button
              variant="text"
              full
              onClick={onDismiss}
            >
              Overslaan
            </Button>
          )}
        </div>
      </article>
    </div>
  );
}

export default PauseReminderPopup;