import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";

import SettingsTabs from "../components/settings/SettingsTabs";
import SettingsCard from "../components/settings/SettingsCard";
import SettingsField from "../components/settings/SettingsField";
import SettingsToggleRow from "../components/settings/SettingsToggleRow";
import SettingsPersonalization from "../components/settings/SettingsPersonalization";
import SettingsSubscription from "../components/settings/SettingsSubscription";
import SettingsPrivacy from "../components/settings/SettingsPrivacy";
import SettingsPremiumOverlay from "../components/settings/SettingsPremiumOverlay";
import SettingsMessage from "../components/settings/SettingsMessage";

import Button from "../components/base/Button";

import {
  getCurrentUser,
  updateSettings,
  updatePassword,
  exportMyData,
  deleteMyData,
  deleteMyAccount,
} from "../services/settingsService";

import premium_groen from "../assets/icons_groen/premium_groen.svg";
import premium_wit from "../assets/icons_wit/premium_wit.svg";
import arrowDownBlack from "../assets/icons_zwart/arrow_down_zwart.svg";

import "./SettingsPage.css";

function SettingsPage() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    workSituation: "",
    notificationsEnabled: true,
    checkInReminders: true,
    pauseSuggestionsEnabled: true,
    notificationFrequency: "Elke 2 uur",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();

        setSettings({
          name: user.name || "",
          email: user.email || "",
          workSituation: user.workSituation || "",
          notificationsEnabled: user.notificationsEnabled ?? true,
          checkInReminders: user.checkInReminders ?? true,
          pauseSuggestionsEnabled: user.pauseSuggestionsEnabled ?? true,
          notificationFrequency: user.notificationFrequency || "Elke 2 uur",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!message && !error) return;

    const timer = setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, error]);

  const updateField = (field, value) => {
    setMessage("");
    setError("");

    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updatePasswordField = (field, value) => {
    setMessage("");
    setError("");

    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updatedUser = await updateSettings(settings);
      login(updatedUser);
      setMessage("Instellingen opgeslagen");
    } catch (error) {
      setError(error.message || "Instellingen opslaan mislukt");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setMessage("");
    setError("");

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError("Vul je huidig wachtwoord en nieuw wachtwoord in");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Nieuwe wachtwoorden komen niet overeen");
      return;
    }

    try {
      setSaving(true);

      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage("Wachtwoord succesvol aangepast");
    } catch (error) {
      setError(error.message || "Wachtwoord aanpassen mislukt");
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    setMessage("");
    setError("");

    try {
      const data = await exportMyData();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "remind-data-export.json";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setMessage("Data export gedownload");
    } catch (error) {
      setError(error.message || "Data exporteren mislukt");
    }
  };

  const handleDeleteData = async () => {
    setMessage("");
    setError("");

    const confirmed = window.confirm(
      "Weet je zeker dat je al je check-ins en pauzesessies wilt verwijderen?"
    );

    if (!confirmed) return;

    try {
      await deleteMyData();
      setMessage("Je persoonlijke data is verwijderd");
    } catch (error) {
      setError(error.message || "Data verwijderen mislukt");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    setMessage("");
    setError("");

    const confirmed = window.confirm(
      "Weet je zeker dat je je account permanent wilt verwijderen? Dit kan niet ongedaan worden gemaakt."
    );

    if (!confirmed) return;

    try {
      await deleteMyAccount();
      logout();
      navigate("/welcome");
    } catch (error) {
      setError(error.message || "Account verwijderen mislukt");
    }
  };

  const handleUpgrade = () => {
    setMessage("Upgrade naar Premium gestart");
    setError("");
  };

  if (loading) {
    return (
      <MainLayout title="Instellingen" subtitle="Beheer je account en voorkeuren">
        <section className="settingsPage">
          <p>Instellingen laden...</p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Instellingen" subtitle="Beheer je account en voorkeuren">
      <section className="settingsPage">
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <SettingsMessage type="success">{message}</SettingsMessage>
        <SettingsMessage type="error">{error}</SettingsMessage>

        {activeTab === "profile" && (
          <SettingsCard>
            <div className="settingsPanel">
              <h2>Profiel informatie</h2>

              <SettingsField
                label="Naam"
                name="name"
                value={settings.name}
                onChange={(event) => updateField("name", event.target.value)}
              />

              <SettingsField
                label="Email"
                name="email"
                type="email"
                value={settings.email}
                onChange={(event) => updateField("email", event.target.value)}
                helperText="We gebruiken je email alleen voor account gerelateerde berichten"
              />

              <SettingsField
                label="Werksituatie"
                name="workSituation"
                value={settings.workSituation}
                onChange={(event) =>
                  updateField("workSituation", event.target.value)
                }
                options={[
                  { value: "", label: "Selecteer werksituatie" },
                  {
                    value: "Ik werk voornamelijk op kantoor",
                    label: "Ik werk voornamelijk op kantoor",
                  },
                  { value: "Ik werk hybride", label: "Ik werk hybride" },
                  {
                    value: "Ik werk volledig remote",
                    label: "Ik werk volledig remote",
                  },
                  { value: "Anders", label: "Anders" },
                ]}
              />

              <div className="settingsActions">
                <Button variant="primary" onClick={saveSettings} disabled={saving} full>
                  {saving ? "Opslaan..." : "Profiel opslaan"}
                </Button>
              </div>

              <div className="settingsDivider" />

              <div className="settingsSection">
                <h3>Wachtwoord aanpassen</h3>

                <SettingsField
                  label="Huidig wachtwoord"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(event) =>
                    updatePasswordField("currentPassword", event.target.value)
                  }
                />

                <SettingsField
                  label="Nieuw wachtwoord"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(event) =>
                    updatePasswordField("newPassword", event.target.value)
                  }
                />

                <SettingsField
                  label="Bevestig nieuw wachtwoord"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(event) =>
                    updatePasswordField("confirmPassword", event.target.value)
                  }
                />

                <Button
                  variant="secondary"
                  onClick={handlePasswordChange}
                  disabled={saving}
                  full
                >
                  {saving ? "Aanpassen..." : "Wachtwoord aanpassen"}
                </Button>
              </div>
            </div>
          </SettingsCard>
        )}

        {activeTab === "personalization" && (
          <SettingsCard premium>
            <div className="settingsPanelBlurred">
              <SettingsPersonalization />
            </div>

            <SettingsPremiumOverlay
              icon={premium_groen}
              title="Ontgrendel personalisatie instellingen"
              text="Upgrade naar Premium om Re:Mind volledig naar jouw wensen aan te passen"
              buttonLabel="Upgrade naar Premium"
              buttonIcon={premium_wit}
              onUpgrade={handleUpgrade}
            />
          </SettingsCard>
        )}

        {activeTab === "notifications" && (
          <SettingsCard>
            <div className="settingsPanel">
              <h2>Notificatie voorkeuren</h2>

              <SettingsToggleRow
                title="Notificaties inschakelen"
                description="Ontvang herinneringen en updates."
                checked={settings.notificationsEnabled}
                onChange={(event) =>
                  updateField("notificationsEnabled", event.target.checked)
                }
              />

              <SettingsToggleRow
                title="Check-in herinneringen"
                description="Herinner me om in te checken."
                checked={settings.checkInReminders}
                onChange={(event) =>
                  updateField("checkInReminders", event.target.checked)
                }
              />

              <SettingsToggleRow
                title="Pauze suggesties"
                description="Krijg suggesties voor pauzes."
                checked={settings.pauseSuggestionsEnabled}
                onChange={(event) =>
                  updateField("pauseSuggestionsEnabled", event.target.checked)
                }
              />

              <SettingsField
                label="Frequentie"
                name="notificationFrequency"
                value={settings.notificationFrequency}
                onChange={(event) =>
                  updateField("notificationFrequency", event.target.value)
                }
                options={[
                  { value: "Elke 2 uur", label: "Elke 2 uur" },
                  { value: "Elke 3 uur", label: "Elke 3 uur" },
                  { value: "1 keer per dag", label: "1 keer per dag" },
                ]}
              />

              <div className="settingsActions">
                <Button variant="primary" onClick={saveSettings} disabled={saving} full>
                  {saving ? "Opslaan..." : "Voorkeuren opslaan"}
                </Button>
              </div>
            </div>
          </SettingsCard>
        )}

        {activeTab === "subscription" && (
          <SettingsCard>
            <SettingsSubscription
              icon={premium_groen}
              buttonIcon={premium_wit}
              onUpgrade={handleUpgrade}
            />
          </SettingsCard>
        )}

        {activeTab === "privacy" && (
          <SettingsCard>
            <SettingsPrivacy
              onExportData={handleExportData}
              onDeleteData={handleDeleteData}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
            />
          </SettingsCard>
        )}
      </section>
    </MainLayout>
  );
}

export default SettingsPage;