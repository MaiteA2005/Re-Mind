import Button from "../base/Button";
import premium_groen from "../../assets/icons_groen/premium_groen.svg";
import "./SettingsSubscription.css";

function SettingsSubscription({ icon, onUpgrade }) {
  return (
    <div className="settingsCenterPanel">
      <div className="settingsIconCircle">
        <img src={premium_groen} alt="Premium Icon" />
      </div>

      <h2>Gratis abonnement</h2>
      <p>
        Upgrade naar premium om maandelijkse inzichten en uitgebreide analyses te
        bekijken.
      </p>

      <Button variant="primary" onClick={onUpgrade}>
        Upgrade naar premium
      </Button>
    </div>
  );
}

export default SettingsSubscription;