import { Link } from "react-router-dom";
import Button from "../components/base/Button";

import logoGroen from "../assets/logo_groen.svg";
import pijlRechts from "../assets/icons_wit/pijl_rechts_wit.svg";
import pijlRechtsZ from "../assets/icons_zwart/pijl_rechts_zwart.svg";

import "./css/AuthPages.css";
import "./css/WelcomePage.css";

function WelcomePage() {
  return (
    <main className="authPage welcomePage">
      <section className="authCard welcomeCard">
        <h1>Welkom bij</h1>

        <img src={logoGroen} alt="Re:Mind" className="welcomeLogo" />

        <div className="welcomeActions">
          <Button to="/login" variant="primary" iconRight={pijlRechts}>
            Inloggen
          </Button>

          <Button to="/onboarding" variant="secondary" iconRight={pijlRechtsZ}>
            Aanmelden
          </Button>
        </div>
      </section>
    </main>
  );
}

export default WelcomePage;