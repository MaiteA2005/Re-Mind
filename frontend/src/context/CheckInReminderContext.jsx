import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { getCurrentUser } from "../services/settingsService";
import CheckInReminderPopup from "../components/checkin/CheckInReminderPopup";

const CheckInReminderContext = createContext(null);

const frequencyMap = {
    "elke 5 minuten": 0.2,
    "Elk half uur": 30,
    "Elk uur": 60,
    "Elke 2 uur": 120,
    "Elke 3 uur": 180,
};

export function CheckInReminderProvider({ children }) {
    const { user } = useAuth();

    const [showCheckInPopup, setShowCheckInPopup] = useState(false);
    const [settings, setSettings] = useState(null);

    const intervalRef = useRef(null);
    const snoozeTimeoutRef = useRef(null);

    const clearTimers = () => {
        if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        }

        if (snoozeTimeoutRef.current) {
        clearTimeout(snoozeTimeoutRef.current);
        snoozeTimeoutRef.current = null;
        }
    };

    const showReminder = () => {
        setShowCheckInPopup(true);

        window.electronAPI?.showCheckInNotification?.({
        title: "Re:Mind",
        body: "Tijd voor een korte check-in. Hoe voel je je momenteel?",
        });
    };

    const refreshSettings = async () => {
        if (!user) {
        setSettings(null);
        return;
        }

        try {
        const currentUser = await getCurrentUser();
        setSettings(currentUser);
        } catch (error) {
        console.error("Check-in instellingen ophalen mislukt:", error);
        }
    };

    useEffect(() => {
        clearTimers();
        setShowCheckInPopup(false);

        if (!user) {
        setSettings(null);
        return;
        }

        refreshSettings();

        return () => clearTimers();
    }, [user]);

    useEffect(() => {
        clearTimers();

        if (!settings) return;

        const shouldShowReminders =
        settings.notificationsEnabled && settings.checkInReminders;

        if (!shouldShowReminders) return;

        const minutes = frequencyMap[settings.notificationFrequency] || 120;

        intervalRef.current = setInterval(() => {
        showReminder();
        }, minutes * 60 * 1000);

        return () => clearTimers();
    }, [settings]);

    const startCheckIn = async () => {
        setShowCheckInPopup(false);
    };

    const snoozeCheckIn = async (minutes = 15) => {
        setShowCheckInPopup(false);

        if (snoozeTimeoutRef.current) {
        clearTimeout(snoozeTimeoutRef.current);
        }

        snoozeTimeoutRef.current = setTimeout(() => {
        showReminder();
        }, minutes * 60 * 1000);
    };

    const dismissCheckIn = async () => {
        setShowCheckInPopup(false);
    };

    return (
        <CheckInReminderContext.Provider
        value={{
            settings,
            showCheckInPopup,
            showReminder,
            refreshSettings,
        }}
        >
        {children}

        {showCheckInPopup && (
            <CheckInReminderPopup
            onStartCheckIn={startCheckIn}
            onSnooze={snoozeCheckIn}
            onDismiss={dismissCheckIn}
            />
        )}
        </CheckInReminderContext.Provider>
    );
}

export function useCheckInReminder() {
    const context = useContext(CheckInReminderContext);

    if (!context) {
        throw new Error(
        "useCheckInReminder moet binnen CheckInReminderProvider gebruikt worden"
        );
    }

    return context;
}