import "./SettingsField.css";

function SettingsField({
  label,
  name,
  type = "text",
  value,
  onChange,
  helperText,
  options,
  icon,
}) {
  return (
    <div className="settingsField">
      <label htmlFor={name}>{label}</label>

      {options ? (
        <select 
          className="customSelect"
          id={name} 
          name={name} 
          value={value} 
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          icon={icon}
        />
      )}

      {helperText && <span>{helperText}</span>}
    </div>
  );
}

export default SettingsField;