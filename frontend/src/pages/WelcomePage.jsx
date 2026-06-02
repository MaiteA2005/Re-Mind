import { Link } from "react-router-dom";
import logoGroen from "../assets/logo_groen.svg";
import "./AuthPages.css";
import "./WelcomePage.css";

function WelcomePage() {
  return (
    <main className="authPage welcomePage">
      <section className="authCard welcomeCard">
        <h1>Welkom bij</h1>

        <img src={logoGroen} alt="Re:Mind" className="welcomeLogo" />

        <div className="welcomeActions">
          <Link to="/login" className="authPrimaryButton">
            Inloggen
          </Link>

          <Link to="/onboarding" className="authSecondaryButton">
            Aanmelden
          </Link>
        </div>
      </section>
    </main>
  );
}

export default WelcomePage;