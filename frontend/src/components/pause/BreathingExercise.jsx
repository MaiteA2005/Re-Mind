import { useEffect, useMemo, useState } from "react";
import Button from "../base/Button";
import BreathingOrb from "./BreathingOrb";
import BreathingMethodOptions from "./BreathingMethodOptions";
import "./BreathingExercise.css";

const DEFAULT_PATTERN = {
    inhale: 4,
    holdAfterInhale: 4,
    exhale: 4,
    holdAfterExhale: 4,
};

function buildPhases(pattern) {
const phases = [];

if (pattern.inhale > 0) {
    phases.push({
    key: "inhale",
    label: "Adem in",
    duration: pattern.inhale,
    });
}

if (pattern.secondInhale > 0) {
    phases.push({
    key: "secondInhale",
    label: "Adem nog kort in",
    duration: pattern.secondInhale,
    });
}

if (pattern.holdAfterInhale > 0) {
    phases.push({
    key: "holdAfterInhale",
    label: "Houd vast",
    duration: pattern.holdAfterInhale,
    });
}

if (pattern.exhale > 0) {
    phases.push({
    key: "exhale",
    label: "Adem uit",
    duration: pattern.exhale,
    });
}

if (pattern.holdAfterExhale > 0) {
    phases.push({
    key: "holdAfterExhale",
    label: "Houd vast",
    duration: pattern.holdAfterExhale,
    });
}

return phases;
}

function formatPatternLabel(pattern) {
    return [
        pattern.inhale || 0,
        pattern.holdAfterInhale || 0,
        pattern.exhale || 0,
        pattern.holdAfterExhale || 0,
    ].join("-");
}

function BreathingExercise({ pause, onComplete }) {
    const defaultPattern = pause?.breathingPattern || DEFAULT_PATTERN;
    const methodOptions = pause?.methodOptions || [];

    const [selectedPattern, setSelectedPattern] = useState(defaultPattern);
    const [isStarted, setIsStarted] = useState(false);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [completedCycles, setCompletedCycles] = useState(0);

    const phases = useMemo(() => buildPhases(selectedPattern), [selectedPattern]);

    const currentPhase = phases[phaseIndex] || phases[0];

    useEffect(() => {
        if (!currentPhase) return;
        setSecondsLeft(currentPhase.duration);
    }, [currentPhase]);

    useEffect(() => {
        if (!isStarted || !currentPhase) return;

        const interval = setInterval(() => {
        setSecondsLeft((current) => {
            if (current > 1) return current - 1;

            setPhaseIndex((previousIndex) => {
            const nextIndex = previousIndex + 1;

            if (nextIndex >= phases.length) {
                setCompletedCycles((cycles) => cycles + 1);
                return 0;
            }

            return nextIndex;
            });

            return currentPhase.duration;
        });
        }, 1000);

        return () => clearInterval(interval);
    }, [isStarted, currentPhase, phases.length]);

    const handleStartToggle = () => {
        setIsStarted((current) => !current);
    };

    const handleMethodChange = (option) => {
        const nextPattern = {
        inhale: option.inhale || 0,
        secondInhale: option.secondInhale || 0,
        holdAfterInhale: option.holdAfterInhale || 0,
        exhale: option.exhale || 0,
        holdAfterExhale: option.holdAfterExhale || 0,
        };

        setSelectedPattern(nextPattern);
        setIsStarted(false);
        setPhaseIndex(0);
        setCompletedCycles(0);
    };

    const selectedLabel =
        methodOptions.find(
        (option) =>
            option.inhale === selectedPattern.inhale &&
            (option.secondInhale || 0) === (selectedPattern.secondInhale || 0) &&
            option.holdAfterInhale === selectedPattern.holdAfterInhale &&
            option.exhale === selectedPattern.exhale &&
            option.holdAfterExhale === selectedPattern.holdAfterExhale
        )?.label || formatPatternLabel(selectedPattern);

    return (
        <section className="breathingExercise">
        <header className="breathingHeader">
            <div>
            <p className="breathingEyebrow">Ademhalingsoefening</p>
            <h2>{pause?.title}</h2>
            </div>

            <Button variant="secondary" onClick={handleStartToggle}>
            {isStarted ? "Pauzeer" : "Start"}
            </Button>
        </header>

        <div className="breathingContent">
            <div className="breathingMain">
            <BreathingOrb
                phase={currentPhase?.key}
                phaseLabel={currentPhase?.label}
                secondsLeft={secondsLeft}
                phaseDuration={currentPhase?.duration}
                isStarted={isStarted}
            />

            <div className="breathingPhaseInfo">
                <h3>{isStarted ? currentPhase?.label : "Klaar om te starten"}</h3>
                <p>
                {isStarted
                    ? `Nog ${secondsLeft}s`
                    : "Volg het ritme van de adembol wanneer je start."}
                </p>
            </div>

            <div className="breathingStats">
                <div>
                <span>Inademen</span>
                <strong>{selectedPattern.inhale || 0}s</strong>
                </div>

                <div>
                <span>Vasthouden</span>
                <strong>{selectedPattern.holdAfterInhale || 0}s</strong>
                </div>

                <div>
                <span>Uitademen</span>
                <strong>{selectedPattern.exhale || 0}s</strong>
                </div>

                <div>
                <span>Vasthouden</span>
                <strong>{selectedPattern.holdAfterExhale || 0}s</strong>
                </div>
            </div>

            <Button variant="secondary" full onClick={onComplete}>
                Markeer als voltooid
            </Button>
            </div>

            <aside className="breathingSide">
            <BreathingMethodOptions
                options={methodOptions}
                selectedLabel={selectedLabel}
                onSelect={handleMethodChange}
            />

            <div className="breathingTip">
                <h3>Tip</h3>
                <p>
                Adem rustig door je neus in en laat je schouders ontspannen bij de
                uitademing.
                </p>
            </div>
            </aside>
        </div>
        </section>
    );
}

export default BreathingExercise;