import { Link } from "react-router-dom";
import "./DashboardPauseSummary.css";

import sterrenIcon from "../../assets/icons_groen/stretchen_groen.svg";
import koffieIcon from "../../assets/icons_groen/koffie_groen.svg";

function DashboardPauseSummary({ pauseLoading, pausesTodayCount, lastPause }) {
  return (
    <>
      <article className="card cardHighlight">
        <img src={sterrenIcon} alt="" className="cardIcon" />

        <p className="cardMiniLabel">Vandaag</p>

        <h3>
          {pauseLoading
            ? "Pauzedata laden..."
            : `Je nam vandaag al ${pausesTodayCount} moment${
                pausesTodayCount === 1 ? "" : "en"
              } voor jezelf`}
        </h3>
      </article>

      <article className="card cardPause">
        <div className="cardHeader cardHeaderBordered">
          <div className="cardHeaderLeft">
            <img src={koffieIcon} alt="" className="cardIcon" />
            <h3>Pauze tijd?</h3>
          </div>
        </div>

        <div className="cardBody">
          <p>
            {lastPause
              ? `Laatste pauze: ${lastPause.pauseTitle}`
              : "Je hebt nog geen pauze opgeslagen."}
          </p>

          <Link to="/pause" className="btn btnSecondary btnFull">
            Bekijk suggesties
          </Link>
        </div>
      </article>
    </>
  );
}

export default DashboardPauseSummary;