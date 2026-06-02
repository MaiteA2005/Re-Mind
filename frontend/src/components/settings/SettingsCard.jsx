import "./css/SettingsCard.css";

function SettingsCard({ children, premium = false }) {
  return (
    <div className={premium ? "settingsPremiumWrapper" : "settingsCard"}>
      {children}
    </div>
  );
}

export default SettingsCard;