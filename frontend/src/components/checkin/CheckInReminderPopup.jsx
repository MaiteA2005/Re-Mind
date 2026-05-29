import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../base/Button";

import checkinIcon from "../../assets/icons_groen/check-in_groen.svg";

import "./CheckInReminderPopup.css";

function CheckInReminderPopup({ onStartCheckIn, onSnooze, onDismiss }) {
    const navigate = useNavigate();
    const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);

    const handleStartCheckIn = async () => {
        await onStartCheckIn();
        navigate("/check-in");
    };

    const handleSnooze = async (minutes) => {
        await onSnooze(minutes);
        setShowSnoozeOptions(false);
    };

    return (
        <div className="checkInReminderOverlay">
        <article className="checkInReminderPopup">
            <div className="checkInReminderIcon">
            <img src={checkinIcon} alt="" />
            </div>

            <h2>Tijd voor een check-in</h2>

            <p>
            Neem kort de tijd om je stress en energie te registreren. Zo kan
            Re:Mind je beter ondersteunen tijdens je werkdag.
            </p>

            <div className="checkInReminderActions">
            <Button variant="primary" full onClick={handleStartCheckIn}>
                Check-in starten
            </Button>

            {!showSnoozeOptions ? (
                <Button
                variant="secondary"
                full
                onClick={() => setShowSnoozeOptions(true)}
                >
                Later herinneren
                </Button>
            ) : (
                <div className="checkInReminderSnoozeOptions">
                <Button variant="secondary" full onClick={() => handleSnooze(15)}>
                    Over 15 minuten
                </Button>

                <Button variant="secondary" full onClick={() => handleSnooze(30)}>
                    Over 30 minuten
                </Button>

                <Button variant="secondary" full onClick={() => handleSnooze(60)}>
                    Over 1 uur
                </Button>

                <Button
                    variant="text"
                    full
                    onClick={() => setShowSnoozeOptions(false)}
                >
                    Annuleren
                </Button>
                </div>
            )}

            {!showSnoozeOptions && (
                <Button variant="text" full onClick={onDismiss}>
                Overslaan
                </Button>
            )}
            </div>
        </article>
        </div>
    );
}

export default CheckInReminderPopup;