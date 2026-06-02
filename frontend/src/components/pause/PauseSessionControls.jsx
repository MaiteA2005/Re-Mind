import Button from "../base/Button";
import "./css/PauseSessionControls.css";

import pauseIcon from "../../assets/icons_zwart/pauze_zwart.svg";
import playIcon from "../../assets/icons_zwart/play_zwart.svg";
import stopIcon from "../../assets/icons_wit/stop_wit.svg";

function PauseSessionControls({ isRunning, onPause, onStop }) {
  return (
    <div className="pauseSessionButtons">
      <Button variant="secondary" onClick={onPause} full iconLeft={isRunning ? pauseIcon : playIcon}>
        {isRunning ? "Pauzeren" : "Verdergaan"}
      </Button>

      <Button variant="danger" onClick={onStop} full iconLeft={stopIcon}>
        Stoppen
      </Button>
    </div>
  );
}

export default PauseSessionControls;