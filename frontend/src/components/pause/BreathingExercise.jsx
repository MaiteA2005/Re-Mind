import { useEffect, useMemo, useState } from "react";
import { pauseIconMap } from "../../utils/pauseIconMap";
import breath from "../../assets/icons_groen/ademhaling_groen.svg";
import CompleteBlackIcon from "../../assets/icons_zwart/name_one_win_zwart.svg";

import Button from "../base/Button";
import BreathingOrb from "./BreathingOrb";
import BreathingMethodOptions from "./BreathingMethodOptions";
import "./BreathingExercise.css";

const DEFAULT_PATTERN = {
    inhale: 4,
    secondInhale: 0,
    holdAfterInhale: 4,
    exhale: 4,
    holdAfterExhale: 4,
};

function normalizePattern(pattern) {
    return {
        inhale: Number(pattern?.inhale || 0),
        secondInhale: Number(pattern?.secondInhale || 0),
        holdAfterInhale: Number(pattern?.holdAfterInhale || 0),
        exhale: Number(pattern?.exhale || 0),
        holdAfterExhale: Number(pattern?.holdAfterExhale || 0),
    };
}

function buildPhases(pattern) {
    const phases = [];

    if (pattern.inhale > 0) {
        phases.push({
        key: "inhale",
        label: "Adem in",
        statLabel: "Inademen",
        duration: pattern.inhale,
        });
    }

    if (pattern.secondInhale > 0) {
        phases.push({
        key: "secondInhale",
        label: "Adem nog kort in",
        statLabel: "Kort inademen",
        duration: pattern.secondInhale,
        });
    }

    if (pattern.holdAfterInhale > 0) {
        phases.push({
        key: "holdAfterInhale",
        label: "Houd vast",
        statLabel: "Vasthouden",
        duration: pattern.holdAfterInhale,
        });
    }

    if (pattern.exhale > 0) {
        phases.push({
        key: "exhale",
        label: "Adem uit",
        statLabel: "Uitademen",
        duration: pattern.exhale,
        });
    }

    if (pattern.holdAfterExhale > 0) {
        phases.push({
        key: "holdAfterExhale",
        label: "Houd vast",
        statLabel: "Vasthouden",
        duration: pattern.holdAfterExhale,
        });
    }

    return phases;
    }

    function formatPatternLabel(pattern) {
    return [
        pattern.inhale || 0,
        pattern.secondInhale || 0,
        pattern.holdAfterInhale || 0,
        pattern.exhale || 0,
        pattern.holdAfterExhale || 0,
    ].join("-");
    }

    function BreathingExercise({ pause, onComplete }) {
    const iconSrc = pauseIconMap[pause?.icon] || breath;

    const methodOptions = useMemo(() => {
        return Array.isArray(pause?.methodOptions) ? pause.methodOptions : [];
    }, [pause?.methodOptions]);

    const [selectedPattern, setSelectedPattern] = useState(() =>
        normalizePattern(pause?.breathingPattern || DEFAULT_PATTERN)
    );

    const phases = useMemo(() => buildPhases(selectedPattern), [selectedPattern]);

    const [isStarted, setIsStarted] = useState(false);
    const [breathingState, setBreathingState] = useState(() => ({
        phaseIndex: 0,
        secondsLeft: phases[0]?.duration || 0,
    }));

    const currentPhase =
        phases[breathingState.phaseIndex] || phases[0] || null;

    useEffect(() => {
        const nextPattern = normalizePattern(
        pause?.breathingPattern || DEFAULT_PATTERN
        );
        const nextPhases = buildPhases(nextPattern);

        setSelectedPattern(nextPattern);
        setBreathingState({
        phaseIndex: 0,
        secondsLeft: nextPhases[0]?.duration || 0,
        });
        setIsStarted(false);
    }, [pause?.breathingPattern]);

    useEffect(() => {
        if (!isStarted || phases.length === 0) return;

        const interval = setInterval(() => {
        setBreathingState((current) => {
            if (current.secondsLeft > 1) {
            return {
                ...current,
                secondsLeft: current.secondsLeft - 1,
            };
            }

            const nextPhaseIndex =
            current.phaseIndex + 1 >= phases.length
                ? 0
                : current.phaseIndex + 1;

            return {
            phaseIndex: nextPhaseIndex,
            secondsLeft: phases[nextPhaseIndex]?.duration || 0,
            };
        });
        }, 1000);

        return () => clearInterval(interval);
    }, [isStarted, phases]);

    const handleMethodChange = (option) => {
        const nextPattern = normalizePattern(option);
        const nextPhases = buildPhases(nextPattern);

        setSelectedPattern(nextPattern);
        setBreathingState({
        phaseIndex: 0,
        secondsLeft: nextPhases[0]?.duration || 0,
        });
        setIsStarted(false);
    };

    const selectedLabel =
        methodOptions.find((option) => {
        const normalizedOption = normalizePattern(option);

        return (
            normalizedOption.inhale === selectedPattern.inhale &&
            normalizedOption.secondInhale === selectedPattern.secondInhale &&
            normalizedOption.holdAfterInhale === selectedPattern.holdAfterInhale &&
            normalizedOption.exhale === selectedPattern.exhale &&
            normalizedOption.holdAfterExhale === selectedPattern.holdAfterExhale
        );
        })?.label || formatPatternLabel(selectedPattern);

    return (
        <section className="breathingExercise">
        <div className="breathingStage">
            <div className="breathingCenter">
            <header className="breathingHeader">
                <div className="breathingIconCircle">
                <img src={iconSrc} alt={pause?.title || "Ademhaling"} />
                </div>

                <h2>{pause?.title}</h2>

                <Button
                variant="secondary"
                onClick={() => setIsStarted((prev) => !prev)}
                >
                {isStarted ? "Pauzeer" : "Start"}
                </Button>
            </header>

            <BreathingOrb
                phase={currentPhase?.key}
                phaseLabel={currentPhase?.label}
                secondsLeft={breathingState.secondsLeft}
                phaseDuration={currentPhase?.duration}
                isStarted={isStarted}
            />

            <div className="breathingPhaseInfo">
                <h3>{isStarted ? currentPhase?.label : "Klaar om te starten"}</h3>
                <p>
                {isStarted
                    ? `Nog ${breathingState.secondsLeft}s`
                    : "Volg het ritme van de adembol wanneer je start."}
                </p>
            </div>

            <div className="breathingStats">
                <div>
                    <span>Inademen</span>
                    <strong>{selectedPattern.inhale || 0}s</strong>
                </div>

                {selectedPattern.secondInhale > 0 && (
                    <div>
                    <span>Kort inademen</span>
                    <strong>{selectedPattern.secondInhale}s</strong>
                    </div>
                )}

                <div>
                    <span>Vasthouden</span>
                    <strong>{selectedPattern.holdAfterInhale || 0}s</strong>
                </div>

                <div>
                    <span>Uitademen</span>
                    <strong>{selectedPattern.exhale || 0}s</strong>
                </div>

                {(selectedPattern.holdAfterExhale > 0 ||
                    selectedPattern.secondInhale === 0) && (
                    <div>
                    <span>Vasthouden</span>
                    <strong>{selectedPattern.holdAfterExhale || 0}s</strong>
                    </div>
                )}
            </div>

            <Button
                variant="secondary"
                full
                onClick={onComplete}
                iconLeft={CompleteBlackIcon}
            >
                Markeer als voltooid
            </Button>
            </div>

            <aside className="breathingSide">
            <BreathingMethodOptions
                options={methodOptions}
                selectedLabel={selectedLabel}
                onSelect={handleMethodChange}
            />
            </aside>
        </div>
        </section>
    );
}

export default BreathingExercise;