import { pauseIconMap } from "../../utils/pauseIconMap";
import "./PauseHeader.css";

function PauseHeader({ title, duration, icon }) {
  const iconSrc = pauseIconMap[icon] || posture;

  return (
    <div className="pauseDetailHeader">
      <div className="pauseDetailIconCircle">
        {iconSrc ? <img src={iconSrc} alt="" /> : <span>{icon}</span>}
      </div>

      <div className="pauseDetailHeaderText">
        <h2>{title}</h2>
        {duration && <span>{duration}</span>}
      </div>
    </div>
  );
}

export default PauseHeader;