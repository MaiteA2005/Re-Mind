function BreathingOrb({
    phase,
    phaseLabel,
    secondsLeft,
    phaseDuration,
    isStarted,
    }) {
    const style = {
        "--breathing-duration": `${phaseDuration || 4}s`,
    };

    return (
        <div className="breathingOrbWrapper">
        <div
            className={`breathingOrb breathingOrb-${phase || "idle"} ${
            isStarted ? "isRunning" : ""
            }`}
            style={style}
        >
            <div className="breathingOrbInner">
            <span>{isStarted ? phaseLabel : "Start"}</span>
            <strong>{isStarted ? secondsLeft : ""}</strong>
            </div>
        </div>
        </div>
    );
}

export default BreathingOrb;