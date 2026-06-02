import "./base/SettingsMessage.css";

function SettingsMessage({ type = "success", children }) {
  if (!children) return null;

  return (
    <p className={type === "error" ? "settingsError" : "settingsSuccess"}>
      {children}
    </p>
  );
}

export default SettingsMessage;