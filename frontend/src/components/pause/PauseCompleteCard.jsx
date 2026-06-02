import Button from "../base/Button";
import "./css/PauseCompleteCard.css";

import CompleteIcon from "../../assets/icons_groen/check_groen.svg";

function PauseCompleteCard({ title, text }) {
  return (
    <div className="pauseCompleteContent">
      <div className="pauseCompleteIcon">
        <img src={CompleteIcon} alt="Voltooid" />
      </div>

      <h2>{title}</h2>
      <p>{text}</p>

      <div className="pauseCompleteButtons">
        <Button to="/dashboard" variant="primary" full>
          Verder werken
        </Button>

        <Button to="/pause" variant="secondary" full>
          Nog een pauze
        </Button>
      </div>
    </div>
  );
}

export default PauseCompleteCard;