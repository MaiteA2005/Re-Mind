import { Link } from "react-router-dom";
import premiumIcon from "../../assets/icons_zwart/premium_zwart.svg";
import "./UpgradeBanner.css";

function UpgradeBanner() {
  return (
    <section className="banner">
      <div className="bannerLeft">
        <img src={premiumIcon} alt="" className="bannerIcon" />

        <div>
          <h3>Ontgrendel je volledige potentieel</h3>
          <p>
            Krijg toegang tot wekelijkse rapporten, trending inzichten en
            gepersonaliseerde aanbevelingen.
          </p>
        </div>
      </div>

      <Link to="/premium" className="btn btnSecondary">
        Meer info
      </Link>
    </section>
  );
}

export default UpgradeBanner;