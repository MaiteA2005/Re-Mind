function BreathingMethodOptions({ options = [], selectedLabel, onSelect }) {
    if (!options.length) {
        return (
        <div className="breathingMethods">
            <h3>Methode</h3>
            <p className="breathingMethodsEmpty">
            Deze oefening gebruikt één vast ademritme.
            </p>
        </div>
        );
    }

    return (
        <div className="breathingMethods">
        <h3>Methodes</h3>

        <div className="breathingMethodList">
            {options.map((option) => (
            <button
                key={option.label}
                type="button"
                className={
                selectedLabel === option.label
                    ? "breathingMethodOption active"
                    : "breathingMethodOption"
                }
                onClick={() => onSelect(option)}
            >
                {option.label}
            </button>
            ))}
        </div>
        </div>
    );
}

export default BreathingMethodOptions;