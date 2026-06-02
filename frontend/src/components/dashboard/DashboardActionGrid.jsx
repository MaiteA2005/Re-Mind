import { Link } from "react-router-dom";
import "./css/DashboardActionGrid.css";

import timerIcon from "../../assets/icons_groen/timer_groen.svg";
import inzichtenIcon from "../../assets/icons_groen/inzichten_groen.svg";
import koffieIcon from "../../assets/icons_groen/koffie_groen.svg";

function DashboardActionGrid() {
  return (
    <section className="actionsGrid">
      <Link to="/timer" className="card cardAction">
        <img src={timerIcon} alt="" className="cardIcon" />
        <h3>Start focusblok</h3>
        <p>Begin een gefocuste sessie van 25 min</p>
      </Link>

      <Link to="/inzichten" className="card cardAction">
        <img src={inzichtenIcon} alt="" className="cardIcon" />
        <h3>Inzichten</h3>
        <p>Bekijk je voortgang en patronen</p>
      </Link>

      <Link to="/pause" className="card cardAction">
        <img src={koffieIcon} alt="" className="cardIcon" />
        <h3>Pauze suggesties</h3>
        <p>Ontdek effectieve pauzes</p>
      </Link>
    </section>
  );
}

export default DashboardActionGrid;