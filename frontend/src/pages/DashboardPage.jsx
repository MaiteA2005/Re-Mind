import MainLayout from "../components/layout/MainLayout";
import { Link } from "react-router-dom";
import { formatDate, getGreeting } from "../utils/date";
import "./DashboardPage.css";

// icons
import premiumIconZwart from "../assets/icons_zwart/premium_zwart.svg";
import premiumIconGroen from "../assets/icons_groen/premium_groen.svg";
import inzichtenIcon from "../assets/icons_groen/inzichten_groen.svg";
import checkinIcon from "../assets/icons_groen/check-in_groen.svg";
import koffieIcon from "../assets/icons_groen/koffie_groen.svg";
import timerIcon from "../assets/icons_groen/timer_groen.svg";
import sterrenIcon from "../assets/icons_groen/stretchen_groen.svg";
import pijlRechtsIcon from "../assets/icons_wit/pijl_rechts_wit.svg";
import documentIcon from "../assets/icons_zwart/notitie_zwart.svg";

function DashboardPage() {
  const name = "John Doe"; // later dynamisch
  const greeting = getGreeting();

  return (
    <MainLayout
      title={`${greeting}, ${name}`}
      subtitle={formatDate()}
      variant="dashboard"
      action={
        <button className="pageHeaderButton" type="button" aria-label="Rapport openen">
          <img src={documentIcon} alt="" className="pageHeaderIcon" />
        </button>
      }
    >
      <div className="dashboard">
        <section className="banner">
          <div className="bannerLeft">
            <img src={premiumIconZwart} alt="premium" className="bannerIcon" aria-hidden="true" />
            <div>
              <h3>Ontgrendel je volledige potentieel</h3>
              <p>
                Krijg toegang tot wekelijkse rapporten, trending inzichten en
                gepersonaliseerde aanbevelingen.
              </p>
            </div>
          </div>

          <button className="btn btnSecondary" type="button">
            Meer info
          </button>
        </section>

        <section className="checkinCard">
          <div className="checkinLeft">
            <div className="iconCircle">
              <img src={checkinIcon} alt="Check-in" className="checkinIcon" aria-hidden="true" />
            </div>

            <div>
              <h3>Hoe voel je je nu?</h3>
              <p>Laatste check-in: [Tijd]</p>
            </div>
          </div>

          <button className="btn btnPrimary" type="button">
            <span>Check-in</span>
            <img src={pijlRechtsIcon} alt="" aria-hidden="true" />
          </button>
        </section>

        <section className="dashboardMain">
          <div className="dashboardLeft">
            <article className="card cardToday">
              <div className="cardHeader">
                <div className="cardHeaderLeft">
                  <img src={inzichtenIcon} alt="Inzichten" className="cardIcon" aria-hidden="true" />
                  <h3>Vandaag</h3>
                </div>
              </div>

              <div className="metrics">
                <div className="metric">
                  <div className="metricTop">
                    <span>Stress</span>
                    <strong>5/10</strong>
                  </div>
                  <div className="progress">
                    <div className="progressFill" style={{ width: "50%" }} />
                  </div>
                </div>

                <div className="metric">
                  <div className="metricTop">
                    <span>Energie</span>
                    <strong>7/10</strong>
                  </div>
                  <div className="progress">
                    <div className="progressFill" style={{ width: "70%" }} />
                  </div>
                </div>
              </div>

              <div className="checkins">
                <h4>Check-ins vandaag</h4>

                <div className="checkinsList">
                  <div className="checkinsItem">
                    <span>9:30</span>
                    <span>Stress: 3&nbsp;&nbsp;|&nbsp;&nbsp;Energie: 7</span>
                  </div>
                  <div className="checkinsItem">
                    <span>11:45</span>
                    <span>Stress: 5&nbsp;&nbsp;|&nbsp;&nbsp;Energie: 7</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="dashboardRight">
            <article className="card cardHighlight">
              <img src={sterrenIcon} alt="Sterren" className="cardIcon" aria-hidden="true" />
              <p className="cardMiniLabel">Vandaag</p>
              <h3>Je nam al 2 momenten voor jezelf</h3>
            </article>

            <article className="card cardPause">
              <div className="cardHeader cardHeaderBordered">
                <div className="cardHeaderLeft">
                  <img src={koffieIcon} alt="koffie" className="cardIcon" aria-hidden="true" />
                  <h3>Pauze tijd?</h3>
                </div>
              </div>

              <div className="cardBody">
                <p>Je hebt al [... uur] gewerkt. Tijd voor een korte pauze?</p>
                <button className="btn btnSecondary btnFull" type="button">
                  Bekijk suggesties
                </button>
              </div>
            </article>
          </div>
        </section>

        <section className="monthSection">
          <article className="card cardMonth">
            <div className="cardHeader">
              <div className="cardHeaderLeft">
                <img src={inzichtenIcon} alt="Inzichten" className="cardIcon" aria-hidden="true" />
                <h3>Maand</h3>
              </div>

              <div className="premiumLabel">
                <img src={premiumIconGroen} alt="Premium" className="premiumLabelIcon" aria-hidden="true" />
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
                <img src={premiumIconGroen} alt="Premium" className="premiumOverlayIcon" aria-hidden="true" />
                <h4>Ontgrendel wekelijkse inzichten</h4>
                <p>
                  Zie je trends, patronen en krijg gepersonaliseerde aanbevelingen.
                </p>
                <button className="btn btnPrimary" type="button">
                  Upgrade naar Premium
                </button>
              </div>
            </div>
          </article>
        </section>

        <section className="actionsGrid">
          <Link to="/timer" className="card cardAction">
            <img src={timerIcon} alt="Timer" className="cardIcon" />
            <h3>Start focusblok</h3>
            <p>Begin een gefocuste sessie van 25 min</p>
          </Link>

          <Link to="/inzichten" className="card cardAction">
            <img src={inzichtenIcon} alt="Inzichten" className="cardIcon" />
            <h3>Inzichten</h3>
            <p>Bekijk je voortgang en patronen</p>
          </Link>

          <Link to="/pauze" className="card cardAction">
            <img src={koffieIcon} alt="Koffie" className="cardIcon" />
            <h3>Pauze suggesties</h3>
            <p>Ontdek effectieve pauzes</p>
          </Link>
        </section>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;