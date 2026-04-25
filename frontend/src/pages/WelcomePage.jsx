import { Link } from "react-router-dom";
import "./AuthPages.css";

function WelcomePage() {
  return (
    <main className="authPage">
      <section className="authCard">
        <div className="authLogo">Re:Mind</div>

        <h1>Welkom bij Re:Mind</h1>
        <p>
          Je digitale balanscoach die je helpt om stress te beheren en energie
          te vinden in je werkdag.
        </p>

        <div className="authActions">
          <Link to="/onboarding" className="authPrimaryButton">
            Aanmelden
          </Link>

          <Link to="/login" className="authSecondaryButton">
            Inloggen
          </Link>
        </div>
      </section>
    </main>
  );
}

export default WelcomePage;