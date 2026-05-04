import Button from "../base/Button";
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

      <Button to="/premium" variant="secondary">
        Meer info
      </Button>
    </section>
  );
}

export default UpgradeBanner;