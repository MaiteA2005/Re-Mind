import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { getCurrentUser } from "../services/settingsService";
import CheckInReminderPopup from "../components/checkin/CheckInReminderPopup";

const CheckInReminderContext = createContext(null);

const frequencyMap = {
    "Elke 5 minuten": 5,
    "Elk half uur": 30,
    "Elk uur": 60,
    "Elke 2 uur": 120,
    "Elke 3 uur": 180,
};

export function CheckInReminderProvider({ children }) {
    const { user } = useAuth();

    const [showCheckInPopup, setShowCheckInPopup] = useState(false);
    const [settings, setSettings] = useState(null);

    const timeoutRef = useRef(null);
    const hasShownInitialReminderRef = useRef(false);

    const clearReminderTimeout = () => {
        if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        }
    };

    const canShowReminders = (userSettings) => {
        return Boolean(
        userSettings?.notificationsEnabled && userSettings?.checkInReminders
        );
    };

    const getFrequencyMinutes = (userSettings) => {
        return frequencyMap[userSettings?.notificationFrequency] || 120;
    };

    const showReminder = () => {
        setShowCheckInPopup(true);

        window.electronAPI?.showCheckInNotification?.({
        title: "Re:Mind",
        body: "Tijd voor een korte check-in. Hoe voel je je momenteel?",
        });
    };

    const scheduleNextReminder = (minutes) => {
        clearReminderTimeout();

        timeoutRef.current = setTimeout(() => {
        showReminder();

        if (settings && canShowReminders(settings)) {
            scheduleNextReminder(getFrequencyMinutes(settings));
        }
        }, minutes * 60 * 1000);
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
        clearReminderTimeout();
        setShowCheckInPopup(false);
        setSettings(null);
        hasShownInitialReminderRef.current = false;

    if (!user) return;

    refreshSettings();

    return () => clearReminderTimeout();
    }, [user]);

    useEffect(() => {
        clearReminderTimeout();

        if (!settings) return;
        if (!canShowReminders(settings)) return;

        const minutes = getFrequencyMinutes(settings);

        if (!hasShownInitialReminderRef.current) {
            showReminder();
            hasShownInitialReminderRef.current = true;
        }

        scheduleNextReminder(minutes);

        return () => clearReminderTimeout();
    }, [settings]);

    const startCheckIn = async () => {
        setShowCheckInPopup(false);

        if (settings && canShowReminders(settings)) {
        scheduleNextReminder(getFrequencyMinutes(settings));
        }
    };

    const snoozeCheckIn = async (minutes = 15) => {
        setShowCheckInPopup(false);
        scheduleNextReminder(minutes);
    };

    const dismissCheckIn = async () => {
        setShowCheckInPopup(false);

        if (settings && canShowReminders(settings)) {
        scheduleNextReminder(getFrequencyMinutes(settings));
        }
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