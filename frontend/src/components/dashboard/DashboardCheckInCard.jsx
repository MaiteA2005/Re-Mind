import { Link } from "react-router-dom";
import "./DashboardCheckInCard.css";

import checkinIcon from "../../assets/icons_groen/check-in_groen.svg";
import pijlRechtsIcon from "../../assets/icons_wit/pijl_rechts_wit.svg";

function DashboardCheckInCard({ latestCheckIn }) {
  return (
    <section className="checkinCard">
      <div className="checkinLeft">
        <div className="iconCircle">
          <img src={checkinIcon} alt="" className="checkinIcon" />
        </div>

        <div>
          <h3>Hoe voel je je nu?</h3>
          <p>
            {latestCheckIn
              ? `Laatste check-in: ${new Date(
                  latestCheckIn.createdAt
                ).toLocaleTimeString("nl-BE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Laatste check-in: nog niet beschikbaar"}
          </p>
        </div>
      </div>

      <Link to="/check-in" className="btn btnPrimary">
        <span>Check-in</span>
        <img src={pijlRechtsIcon} alt="" />
      </Link>
    </section>
  );
}

export default DashboardCheckInCard;