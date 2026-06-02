import Button from "../base/Button";
import "./css/DashboardMonthLocked.css";

import inzichtenIcon from "../../assets/icons_groen/inzichten_groen.svg";
import premiumIconGroen from "../../assets/icons_groen/premium_groen.svg";

function DashboardMonthLocked() {
  return (
    <section className="monthSection">
      <article className="card cardMonth">
        <div className="cardHeader">
          <div className="cardHeaderLeft">
            <img src={inzichtenIcon} alt="" className="cardIcon" />
            <h3>Maand</h3>
          </div>

          <div className="premiumLabel">
            <img src={premiumIconGroen} alt="" className="premiumLabelIcon" />
            <span>Premium</span>
          </div>
        </div>

        <div className="monthStats monthStatsBlurred">
          <div>
            <span>Gemiddelde stress</span>
            <strong>4.2</strong>
          </div>

          <div>
            <span>Gemiddelde energie</span>
            <strong>6.5</strong>
          </div>

          <div>
            <span>Check-ins</span>
            <strong>24</strong>
          </div>
        </div>

        <div className="premiumOverlay">
          <div className="premiumBox">
            <img src={premiumIconGroen} alt="" className="premiumOverlayIcon" />

            <h4>Ontgrendel wekelijkse inzichten</h4>

            <p>
              Zie je trends, patronen en krijg gepersonaliseerde aanbevelingen.
            </p>

            <Button to="/premium" variant="primary">
              Upgrade naar Premium
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
}

export default DashboardMonthLocked;