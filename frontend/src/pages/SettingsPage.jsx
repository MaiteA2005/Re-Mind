import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import "./SettingsPage.css";

//icons zwart
import profiel_zwart from "../assets/icons_zwart/houding_check_zwart.svg";
import instellingen_zwart from "../assets/icons_zwart/instellingen_zwart.svg";
import notificatie_zwart from "../assets/icons_zwart/notificatie_zwart.svg";
import abonnement_zwart from "../assets/icons_zwart/abonnement_zwart.svg";
import privacy_zwart from "../assets/icons_zwart/privacy_zwart.svg";
import premium_zwart from "../assets/icons_zwart/premium_zwart.svg";

import arrowDown_zwart from "../assets/icons_zwart/arrow_down_zwart.svg";
import download_zwart from "../assets/icons_zwart/downloaden_zwart.svg";
import delete_zwart from "../assets/icons_zwart/verwijder_zwart.svg";
import logout_zwart from "../assets/icons_zwart/uitloggen_zwart.svg";

//icons wit
import profiel_wit from "../assets/icons_wit/houding_check_wit.svg";
import instellingen_wit from "../assets/icons_wit/instellingen_wit.svg";
import notificatie_wit from "../assets/icons_wit/notificatie_wit.svg";
import abonnement_wit from "../assets/icons_wit/abonnement_wit.svg";
import privacy_wit from "../assets/icons_wit/privacy_wit.svg";
import premium_wit from "../assets/icons_wit/premium_wit.svg";

import download_wit from "../assets/icons_wit/downloaden_wit.svg";
import delete_wit from "../assets/icons_wit/verwijder_wit.svg";
import logout_wit from "../assets/icons_wit/uitloggen_wit.svg";

//icons groen
import premium_groen from "../assets/icons_groen/premium_groen.svg";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

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

        <article className="settingsCard">
          {activeTab === "profile" && (
            <div className="settingsPanel">
              <h2>Profiel informatie</h2>

              <div className="settingsField">
                <label htmlFor="name">Naam</label>
                <input id="name" type="text" placeholder="Emma" />
              </div>

              <div className="settingsField">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="emma@email.com" />
              </div>

              <div className="settingsField">
                <label htmlFor="workType">Wachtwoord</label>
                <input id="password" type="password" placeholder="••••••••" />
              </div>

              <div className="settingsField">
                <label htmlFor="workSituation">Werksituatie</label>
                <select id="workSituation">
                  <option>Hybride werk</option>
                  <option>Op kantoor</option>
                  <option>Remote</option>
                </select>
              </div>

              <button type="button" className="settingsPrimaryButton">
                Profiel opslaan
              </button>
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
                    Upgrade naar Premium om Re:Mind volledig naar jouw wensen aan te passen
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
                  <p>Ontvang herinneringen voor pauzes.</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="settingsToggleRow">
                <div>
                  <h3>Check-in herinneringen</h3>
                  <p>Herinnering om je daggevoel bij te houden.</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="settingsToggleRow">
                <div>
                  <h3>Pauze suggesties</h3>
                  <p>Krijg suggesties op basis van je stemming.</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="settingsField">
                <label htmlFor="frequency">Frequentie</label>
                <select id="frequency">
                  <option>Elke 2 uur</option>
                  <option>Elke 3 uur</option>
                  <option>1 keer per dag</option>
                </select>
              </div>

              <button type="button" className="settingsPrimaryButton">
                Voorkeuren opslaan
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
                  <button type="button" className="settingsSecondaryButton">
                    <img src={download_zwart} alt="" />
                    Download mijn data
                  </button>

                  <button type="button" className="settingsSecondaryButton">
                    <img src={delete_zwart} alt="" />
                    Verwijder mijn data
                  </button>
                </div>
              </div>

              <div className="settingsDivider" />

              <div className="settingsSection">
                <h3>Uitloggen</h3>
                <p>Wil je uitloggen?</p>

                <button type="button" className="settingsFullButton">
                  <img src={logout_zwart} alt="" />
                  Uitloggen
                </button>
              </div>

              <div className="settingsDivider" />

              <div className="settingsDangerZone">
                <h3>Gevaarlijke zone</h3>
                <p>Let op: deze actie kan niet ongedaan gemaakt worden</p>

                <button type="button" className="settingsDangerButton">
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