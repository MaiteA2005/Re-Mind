import "./css/SettingsToggleRow.css";

function SettingsToggleRow({ title, description, checked, onChange }) {
  return (
    <label className="settingsToggleRow">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <input type="checkbox" checked={checked} onChange={onChange} />
    </label>
  );
}

export default SettingsToggleRow;