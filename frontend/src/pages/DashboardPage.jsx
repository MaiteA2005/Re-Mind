import { useEffect, useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Link } from "react-router-dom";
import { formatDate, getGreeting } from "../utils/date";
import { getMyPauseSessions } from "../services/pauseStatsService";
import { getMyCheckIns } from "../services/checkInService";
import { useAuth } from "../context/AuthContext";
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

function getTodaySessions(sessions) {
  const today = new Date().toDateString();

  return sessions.filter((session) => {
    return new Date(session.completedAt).toDateString() === today;
  });
}

function DashboardPage() {
  const { user } = useAuth();
  const greeting = getGreeting();

  const [pauseSessions, setPauseSessions] = useState([]);
  const [pauseLoading, setPauseLoading] = useState(true);

  useEffect(() => {
    const fetchPauseSessions = async () => {
      try {
        const data = await getMyPauseSessions();
        setPauseSessions(data);
      } catch (error) {
        console.error("Fout bij ophalen pauzedata:", error);
      } finally {
        setPauseLoading(false);
      }
    };

    fetchPauseSessions();
  }, []);

  const [checkIns, setCheckIns] = useState([]);
  const [checkInsLoading, setCheckInsLoading] = useState(true);

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const data = await getMyCheckIns();
        setCheckIns(data);
      } catch (error) {
        console.error("Fout bij ophalen check-ins:", error);
      } finally {
        setCheckInsLoading(false);
      }
    };

    fetchCheckIns();
  }, []);

  const pausesToday = useMemo(
    () => getTodaySessions(pauseSessions),
    [pauseSessions]
  );

  const pausesTodayCount = pausesToday.length;
  const totalPauses = pauseSessions.length;
  const lastPause = pauseSessions[0];

  const today = new Date().toDateString();
  const checkInsToday = checkIns.filter((checkIn) => {
    return new Date(checkIn.createdAt).toDateString() === today;
  });

  const latestCheckIn = checkIns[0];

  const averageStress =
    checkInsToday.length > 0
      ? (
          checkInsToday.reduce((total, item) => total + item.stressLevel, 0) /
          checkInsToday.length
        ).toFixed(1)
      : null;

  const averageEnergy =
    checkInsToday.length > 0
      ? (
          checkInsToday.reduce((total, item) => total + item.energyLevel, 0) /
          checkInsToday.length
        ).toFixed(1)
      : null;

  return (
    <MainLayout
      title={`${greeting}, ${user?.name || "gebruiker"}`}
      subtitle={formatDate()}
      variant="dashboard"
      action={
        <button
          className="pageHeaderButton"
          type="button"
          aria-label="Rapport openen"
        >
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

          <Link to="/premium" className="btn btnSecondary">
            Meer info
          </Link>
        </section>

        <section className="checkinCard">
          <div className="checkinLeft">
            <div className="iconCircle">
              <img src={checkinIcon} alt="Check-in" className="checkinIcon" aria-hidden="true" />
            </div>

            <div>
              <h3>Hoe voel je je nu?</h3>
              <p>
                {latestCheckIn
                  ? `Laatste check-in: ${new Date(latestCheckIn.createdAt).toLocaleTimeString(
                      "nl-BE",
                      { hour: "2-digit", minute: "2-digit" }
                    )}`
                  : "Laatste check-in: nog niet beschikbaar"}
              </p>
            </div>
          </div>

          <Link to="/check-in" className="btn btnPrimary">
            <span>Check-in</span>
            <img src={pijlRechtsIcon} alt="" aria-hidden="true" />
          </Link>
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
                    <strong>{checkInsLoading ? "..." : averageStress ? `${averageStress}/10` : "-/10"}</strong>
                  </div>
                  <div className="progress">
                    <div
                      className="progressFill"
                      style={{ width: averageStress ? `${averageStress * 10}%` : "0%" }}
                    />
                  </div>
                </div>

                <div className="metric">
                  <div className="metricTop">
                    <span>Energie</span>
                    <strong>{checkInsLoading ? "..." : averageEnergy ? `${averageEnergy}/10` : "-/10"}</strong>
                  </div>
                  <div className="progress">
                    <div
                      className="progressFill"
                      style={{ width: averageEnergy ? `${averageEnergy * 10}%` : "0%" }}
                    />
                  </div>
                </div>
              </div>

              <div className="checkins">
                <h4>Check-ins vandaag</h4>

                <div className="checkinsList">
                  {checkInsLoading ? (
                    <div className="checkinsItem">
                      <span>...</span>
                      <span>Check-ins laden</span>
                    </div>
                  ) : checkInsToday.length > 0 ? (
                    checkInsToday.slice(0, 3).map((checkIn) => (
                      <div className="checkinsItem" key={checkIn._id}>
                        <span>
                          {new Date(checkIn.createdAt).toLocaleTimeString("nl-BE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span>
                          Stress: {checkIn.stressLevel}&nbsp;&nbsp;|&nbsp;&nbsp;Energie:{" "}
                          {checkIn.energyLevel}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="checkinsItem">
                      <span>—</span>
                      <span>Nog geen check-ins vandaag</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </div>

          <div className="dashboardRight">
            <article className="card cardHighlight">
              <img src={sterrenIcon} alt="Sterren" className="cardIcon" aria-hidden="true" />
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
                  <img src={koffieIcon} alt="koffie" className="cardIcon" aria-hidden="true" />
                  <h3>Pauze tijd?</h3>
                </div>
              </div>

              <div className="cardBody">
                <p>
                  {lastPause
                    ? `Laatste pauze: ${lastPause.pauseTitle}`
                    : "Je hebt nog geen pauze opgeslagen."}
                </p>

                <Link to="/pause" className="btn btnSecondary fullWidth">
                  Bekijk suggesties
                </Link>
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

          <Link to="/pause" className="card cardAction">
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