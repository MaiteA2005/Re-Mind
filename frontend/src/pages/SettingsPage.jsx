import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import {
  getCurrentUser,
  updateSettings,
  updatePassword,
  exportMyData,
  deleteMyData,
  deleteMyAccount,
} from "../services/settingsService";
import "./SettingsPage.css";

// icons zwart
import profiel_zwart from "../assets/icons_zwart/houding_check_zwart.svg";
import instellingen_zwart from "../assets/icons_zwart/instellingen_zwart.svg";
import notificatie_zwart from "../assets/icons_zwart/notificatie_zwart.svg";
import abonnement_zwart from "../assets/icons_zwart/abonnement_zwart.svg";
import privacy_zwart from "../assets/icons_zwart/privacy_zwart.svg";

import download_zwart from "../assets/icons_zwart/downloaden_zwart.svg";
import delete_zwart from "../assets/icons_zwart/verwijder_zwart.svg";
import logout_zwart from "../assets/icons_zwart/uitloggen_zwart.svg";

// icons wit
import profiel_wit from "../assets/icons_wit/houding_check_wit.svg";
import instellingen_wit from "../assets/icons_wit/instellingen_wit.svg";
import notificatie_wit from "../assets/icons_wit/notificatie_wit.svg";
import abonnement_wit from "../assets/icons_wit/abonnement_wit.svg";
import privacy_wit from "../assets/icons_wit/privacy_wit.svg";
import premium_wit from "../assets/icons_wit/premium_wit.svg";

import delete_wit from "../assets/icons_wit/verwijder_wit.svg";

// icons groen
import premium_groen from "../assets/icons_groen/premium_groen.svg";

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

  const tabs = [
    {
      id: "profile",
      label: "Profiel",
      icon: profiel_zwart,
      activeIcon: profiel_wit,
    },
    {
      id: "personalization",
      label: "Personalisatie",
      icon: instellingen_zwart,
      activeIcon: instellingen_wit,
    },
    {
      id: "notifications",
      label: "Notificaties",
      icon: notificatie_zwart,
      activeIcon: notificatie_wit,
    },
    {
      id: "subscription",
      label: "Abonnement",
      icon: abonnement_zwart,
      activeIcon: abonnement_wit,
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: privacy_zwart,
      activeIcon: privacy_wit,
    },
  ];

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
        <nav className="settingsTabs" aria-label="Instellingen tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                className={`settingsTab ${isActive ? "settingsTabActive" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <img
                  src={isActive ? tab.activeIcon : tab.icon}
                  alt=""
                  className="settingsTabIcon"
                />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {(message || error) && (
          <div className={error ? "settingsError" : "settingsSuccess"}>
            {error || message}
          </div>
        )}

        <article className="settingsCard">
          {activeTab === "profile" && (
            <div className="settingsPanel">
              <h2>Profiel informatie</h2>

              <div className="settingsField">
                <label htmlFor="name">Naam</label>
                <input
                  id="name"
                  type="text"
                  value={settings.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />
              </div>

              <div className="settingsField">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
                <span>
                  We gebruiken je email alleen voor account gerelateerde berichten
                </span>
              </div>

              <div className="settingsField">
                <label htmlFor="workSituation">Werksituatie</label>
                <select
                  id="workSituation"
                  value={settings.workSituation}
                  onChange={(event) =>
                    updateField("workSituation", event.target.value)
                  }
                >
                  <option value="">Selecteer werksituatie</option>
                  <option value="Ik werk voornamelijk op kantoor">
                    Ik werk voornamelijk op kantoor
                  </option>
                  <option value="Ik werk hybride">Ik werk hybride</option>
                  <option value="Ik werk volledig remote">
                    Ik werk volledig remote
                  </option>
                  <option value="Anders">Anders</option>
                </select>
              </div>

              <button
                type="button"
                className="settingsPrimaryButton"
                onClick={saveSettings}
                disabled={saving}
              >
                {saving ? "Opslaan..." : "Profiel opslaan"}
              </button>

              <div className="settingsDivider" />

              <div className="settingsSection">
                <h3>Wachtwoord aanpassen</h3>

                <div className="settingsField">
                  <label htmlFor="currentPassword">Huidig wachtwoord</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(event) =>
                      updatePasswordField("currentPassword", event.target.value)
                    }
                  />
                </div>

                <div className="settingsField">
                  <label htmlFor="newPassword">Nieuw wachtwoord</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(event) =>
                      updatePasswordField("newPassword", event.target.value)
                    }
                  />
                </div>

                <div className="settingsField">
                  <label htmlFor="confirmPassword">
                    Bevestig nieuw wachtwoord
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(event) =>
                      updatePasswordField("confirmPassword", event.target.value)
                    }
                  />
                </div>

                <button
                  type="button"
                  className="settingsSecondaryButton"
                  onClick={handlePasswordChange}
                  disabled={saving}
                >
                  {saving ? "Aanpassen..." : "Wachtwoord aanpassen"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "personalization" && (
            <div className="settingsPremiumWrapper">
              <div className="settingsPanel settingsPanelBlurred">
                <h2>Personalisatie</h2>
                <p className="settingsIntro">
                  Pas Re:Mind aan naar jouw persoonlijke voorkeuren
                </p>

                <div className="settingsField">
                  <label>Standaard werkdag duur</label>
                  <select disabled>
                    <option>8 uur</option>
                  </select>
                  <span>Deze waarde wordt gebruikt als je een werkdag start</span>
                </div>

                <div className="settingsField">
                  <label>Standaard pauze frequentie</label>
                  <select disabled>
                    <option>Elke 60 minuten</option>
                  </select>
                  <span>Hoe vaak je een pauze-herinnering wilt ontvangen</span>
                </div>

                <div className="settingsField">
                  <label>Standaard focusblok duur</label>
                  <select disabled>
                    <option>25 minuten</option>
                  </select>
                  <span>Je favoriete focusblok lengte</span>
                </div>

                <div className="settingsField">
                  <label>Thema</label>
                  <select disabled>
                    <option>Rustig</option>
                  </select>
                </div>

                <button type="button" className="settingsPrimaryButton" disabled>
                  Personalisatie opslaan
                </button>
              </div>

              <div className="settingsPremiumOverlay">
                <div className="settingsPremiumBox">
                  <img src={premium_groen} alt="" />
                  <h3>Ontgrendel personalisatie instellingen</h3>
                  <p>
                    Upgrade naar Premium om Re:Mind volledig naar jouw wensen aan
                    te passen
                  </p>
                  <button type="button" className="settingsPrimaryButton">
                    <img src={premium_wit} alt="" />
                    Upgrade naar Premium
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="settingsPanel">
              <h2>Notificatie voorkeuren</h2>

              <div className="settingsToggleRow">
                <div>
                  <h3>Notificaties inschakelen</h3>
                  <p>Ontvang herinneringen en updates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(event) =>
                    updateField("notificationsEnabled", event.target.checked)
                  }
                />
              </div>

              <div className="settingsToggleRow">
                <div>
                  <h3>Check-in herinneringen</h3>
                  <p>Herinner me om in te checken.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.checkInReminders}
                  onChange={(event) =>
                    updateField("checkInReminders", event.target.checked)
                  }
                />
              </div>

              <div className="settingsToggleRow">
                <div>
                  <h3>Pauze suggesties</h3>
                  <p>Krijg suggesties voor pauzes.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pauseSuggestionsEnabled}
                  onChange={(event) =>
                    updateField("pauseSuggestionsEnabled", event.target.checked)
                  }
                />
              </div>

              <div className="settingsField">
                <label htmlFor="frequency">Frequentie</label>
                <select
                  id="frequency"
                  value={settings.notificationFrequency}
                  onChange={(event) =>
                    updateField("notificationFrequency", event.target.value)
                  }
                >
                  <option value="Elke 2 uur">Elke 2 uur</option>
                  <option value="Elke 3 uur">Elke 3 uur</option>
                  <option value="1 keer per dag">1 keer per dag</option>
                </select>
              </div>

              <button
                type="button"
                className="settingsPrimaryButton"
                onClick={saveSettings}
                disabled={saving}
              >
                {saving ? "Opslaan..." : "Voorkeuren opslaan"}
              </button>
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="settingsCenterPanel">
              <div className="settingsIconCircle">
                <img src={premium_groen} alt="" />
              </div>

              <h2>Je gebruikt de gratis versie</h2>
              <p>Upgrade naar Premium voor extra inzichten en personalisatie.</p>

              <button type="button" className="settingsPrimaryButton">
                <img src={premium_wit} alt="" />
                Upgrade naar Premium
              </button>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="settingsPanel">
              <h2>Privacy en data</h2>

              <div className="settingsSection">
                <h3>Je data</h3>
                <p>
                  Al je check-ins, reflecties en inzichten worden veilig
                  opgeslagen. We delen nooit je persoonlijke data met derden.
                </p>
              </div>

              <div className="settingsDivider" />

              <div className="settingsSection">
                <h3>Data beheer</h3>

                <div className="settingsButtonRow">
                  <button
                    type="button"
                    className="settingsSecondaryButton"
                    onClick={handleExportData}
                  >
                    <img src={download_zwart} alt="" />
                    Download mijn data
                  </button>

                  <button
                    type="button"
                    className="settingsSecondaryButton"
                    onClick={handleDeleteData}
                  >
                    <img src={delete_zwart} alt="" />
                    Verwijder mijn data
                  </button>
                </div>
              </div>

              <div className="settingsDivider" />

              <div className="settingsSection">
                <h3>Uitloggen</h3>
                <p>Wil je uitloggen?</p>

                <button
                  type="button"
                  className="settingsFullButton"
                  onClick={handleLogout}
                >
                  <img src={logout_zwart} alt="" />
                  Uitloggen
                </button>
              </div>

              <div className="settingsDivider" />

              <div className="settingsDangerZone">
                <h3>Gevaarlijke zone</h3>
                <p>Let op: deze actie kan niet ongedaan gemaakt worden</p>

                <button
                  type="button"
                  className="settingsDangerButton"
                  onClick={handleDeleteAccount}
                >
                  <img src={delete_wit} alt="" />
                  Account verwijderen
                </button>
              </div>
            </div>
          )}
        </article>
      </section>
    </MainLayout>
  );
}

export default SettingsPage;