import Button from "../base/Button";
import SettingsField from "./SettingsField";
import "./base/SettingsPersonalization.css";

import premium_wit from "../../assets/icons_wit/premium_wit.svg";

function SettingsPersonalization() {
  return (
    <div className="settingsPanel">
      <h2>Personalisatie</h2>

      <p className="settingsIntro">
        Pas Re:Mind aan naar jouw persoonlijke voorkeuren
      </p>

      <SettingsField
        label="Standaard werkdag duur"
        name="workdayDuration"
        value="8 uur"
        onChange={() => {}}
        options={[{ value: "8 uur", label: "8 uur" }]}
      />

      <span className="settingsHelperText">
        Deze waarde wordt gebruikt als je een werkdag start
      </span>

      <SettingsField
        label="Standaard pauze frequentie"
        name="breakFrequency"
        value="60"
        onChange={() => {}}
        options={[
          { value: "60", label: "Elke 60 minuten" },
        ]}
      />

      <span className="settingsHelperText">
        Hoe vaak je een pauze-herinnering wilt ontvangen
      </span>

      <SettingsField
        label="Standaard focusblok duur"
        name="focusDuration"
        value="25"
        onChange={() => {}}
        options={[
          { value: "25", label: "25 minuten" },
        ]}
      />

      <span className="settingsHelperText">
        Je favoriete focusblok lengte
      </span>

      <Button variant="primary" disabled full>
        Personalisatie opslaan
      </Button>
    </div>
  );
}

export default SettingsPersonalization;