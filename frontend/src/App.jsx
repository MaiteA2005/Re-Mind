import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CheckInPage from "./pages/CheckInPage";

import PausePage from "./pages/PausePage";
import PauseDetailPage from "./pages/PauseDetailPage";
import PauseSessionPage from "./pages/PauseSessionPage";
import PauseCompletePage from "./pages/PauseCompletePage";

import InsightsPage from "./pages/InsightsPage";
import DagAfsluistingPage from "./pages/DagAfsluistingPage";
import TimerPage from "./pages/TimerPage";
import SettingsPage from "./pages/SettingsPage";
import PremiumPage from "./pages/PremiumPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path="/pause" element={<PausePage />} />
        <Route path="/pause/:slug" element={<PauseDetailPage />} />
        <Route path="/pause/:slug/session" element={<PauseSessionPage />} />
        <Route path="/pause/:slug/complete" element={<PauseCompletePage />} />
        <Route path="/inzichten" element={<InsightsPage />} />
        <Route path="/dagafsluiting" element={<DagAfsluistingPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/instellingen" element={<SettingsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;