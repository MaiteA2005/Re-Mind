import { HashRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { TimerProvider, useTimer } from "./context/TimerContext";
import { CheckInReminderProvider } from "./context/CheckInReminderContext";

import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";

import DashboardPage from "./pages/DashboardPage";
import CheckInPage from "./pages/CheckInPage";

import PausePage from "./pages/PausePage";
import BreathingOverviewPage from "./pages/BreathingOverviewPage";
import PauseDetailPage from "./pages/PauseDetailPage";
import PauseSessionPage from "./pages/PauseSessionPage";
import PauseCompletePage from "./pages/PauseCompletePage";

import InsightsPage from "./pages/InsightsPage";
import DagAfsluitingPage from "./pages/DagAfsluitingPage";
import TimerPage from "./pages/TimerPage";
import SettingsPage from "./pages/SettingsPage";
import PremiumPage from "./pages/PremiumPage";

import PauseReminderPopup from "./components/timer/PauseReminderPopup";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function GlobalTimerPopups() {
  const {
    pauseReminderPopup,
    takeReminderBreak,
    snoozeReminder,
    dismissReminder,
  } = useTimer();

  if (!pauseReminderPopup) return null;

  return (
    <PauseReminderPopup
      onTakeBreak={takeReminderBreak}
      onSnooze={snoozeReminder}
      onDismiss={dismissReminder}
    />
  );
}

function ElectronNavigationListener() {
  const navigate = useNavigate();

  useEffect(() => {
    window.electronAPI?.onOpenTimer?.(() => {
      navigate("/timer");
    });

    window.electronAPI?.onOpenCheckIn?.(() => {
      navigate("/check-in");
    });
  }, [navigate]);

  return null;
}

function App() {
  return (
    <HashRouter>
      <TimerProvider>
      <CheckInReminderProvider>
        <ElectronNavigationListener />
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />

          <Route 
            path="/welcome"
            element={
              <PublicRoute>
                <WelcomePage />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/onboarding"
            element={
              <PublicRoute>
                <OnboardingPage />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/check-in"
            element={
              <ProtectedRoute>
                <CheckInPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pause"
            element={
              <ProtectedRoute>
                <PausePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pause/breathing"
            element={
              <ProtectedRoute>
                <BreathingOverviewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pause/:slug"
            element={
              <ProtectedRoute>
                <PauseDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pause/:slug/session"
            element={
              <ProtectedRoute>
                <PauseSessionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pause/:slug/complete"
            element={
              <ProtectedRoute>
                <PauseCompletePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inzichten"
            element={
              <ProtectedRoute>
                <InsightsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dagafsluiting"
            element={
              <ProtectedRoute>
                <DagAfsluitingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/timer"
            element={
              <ProtectedRoute>
                <TimerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/premium"
            element={
              <ProtectedRoute>
                <PremiumPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instellingen"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      <GlobalTimerPopups />
      </CheckInReminderProvider>
      </TimerProvider>
    </HashRouter>
  );
}

export default App;