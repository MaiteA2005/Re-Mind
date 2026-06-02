import Button from "../base/Button";
import "./base/SettingsPrivacy.css";

import download_zwart from "../../assets/icons_zwart/downloaden_zwart.svg";
import delete_zwart from "../../assets/icons_zwart/verwijder_zwart.svg";
import logout_zwart from "../../assets/icons_zwart/uitloggen_zwart.svg";
import delete_wit from "../../assets/icons_wit/verwijder_wit.svg";

function SettingsPrivacy({
  onExportData,
  onDeleteData,
  onLogout,
  onDeleteAccount,
}) {
  return (
    <div className="settingsPanel">
      <h2>Privacy en data</h2>

      <div className="settingsSection">
        <h3>Je data</h3>
        <p>
          Al je check-ins, reflecties en inzichten worden veilig opgeslagen. We
          delen nooit je persoonlijke data met derden.
        </p>
      </div>

      <div className="settingsDivider" />

      <div className="settingsSection">
        <h3>Data beheer</h3>

        <div className="settingsButtonRow">
          <Button
            variant="secondary"
            onClick={onExportData}
            iconLeft={download_zwart}
            full
          >
            Download mijn data
          </Button>

          <Button
            variant="secondary"
            onClick={onDeleteData}
            iconLeft={delete_zwart}
            full
          >
            Verwijder mijn data
          </Button>
        </div>
      </div>

      <div className="settingsDivider" />

      <div className="settingsSection">
        <h3>Uitloggen</h3>
        <p>Wil je uitloggen?</p>

        <Button
          variant="secondary"
          onClick={onLogout}
          iconLeft={logout_zwart}
          full
        >
          Uitloggen
        </Button>
      </div>

      <div className="settingsDivider" />

      <div className="settingsDangerZone">
        <h3>Gevaarlijke zone</h3>
        <p>Let op: deze actie kan niet ongedaan gemaakt worden</p>

        <Button
          variant="danger"
          onClick={onDeleteAccount}
          iconLeft={delete_wit}
          full
        >
          Account verwijderen
        </Button>
      </div>
    </div>
  );
}

export default SettingsPrivacy;