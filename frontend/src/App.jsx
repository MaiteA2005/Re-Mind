import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { TimerProvider } from "./context/TimerContext";

import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";

import DashboardPage from "./pages/DashboardPage";
import CheckInPage from "./pages/CheckInPage";

import PausePage from "./pages/PausePage";
import PauseDetailPage from "./pages/PauseDetailPage";
import PauseSessionPage from "./pages/PauseSessionPage";
import PauseCompletePage from "./pages/PauseCompletePage";

import InsightsPage from "./pages/InsightsPage";
import DagAfsluitingPage from "./pages/DagAfsluitingPage";
import TimerPage from "./pages/TimerPage";
import SettingsPage from "./pages/SettingsPage";
import PremiumPage from "./pages/PremiumPage";

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

function App() {
  return (
    <HashRouter>
      <TimerProvider>
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
      </TimerProvider>
    </HashRouter>
  );
}

export default App;