import Button from "../base/Button";
import premium_groen from "../../assets/icons_groen/premium_groen.svg";

import "./css/SettingsPremiumOverlay.css";

function SettingsPremiumOverlay({
  icon = premium_groen,
  title = "Premium functie",
  text = "Deze instellingen zijn beschikbaar voor premium gebruikers. Upgrade om alles te ontgrendelen.",
  buttonLabel = "Upgrade naar premium",
  onUpgrade,
}) {
  return (
    <div className="settingsPremiumOverlay">
      <div className="settingsPremiumBox">
        <img src={icon} alt="Premium Icon" className="settingsPremiumIcon" />
        <h3>{title}</h3>
        <p>{text}</p>

        <Button variant="primary" onClick={onUpgrade} full>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}

export default SettingsPremiumOverlay;