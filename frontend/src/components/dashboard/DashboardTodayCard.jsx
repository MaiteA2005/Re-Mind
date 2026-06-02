import "./css/DashboardTodayCard.css";

import inzichtenIcon from "../../assets/icons_groen/inzichten_groen.svg";

function DashboardTodayCard({
  checkInsToday,
  checkInsLoading,
  averageStress,
  averageEnergy,
}) {
  return (
    <article className="card cardToday">
      <div className="cardHeader">
        <div className="cardHeaderLeft">
          <img src={inzichtenIcon} alt="" className="cardIcon" />
          <h3>Vandaag</h3>
        </div>
      </div>

      <div className="metrics">
        <div className="metric">
          <div className="metricTop">
            <span>Stress</span>
            <strong>
              {checkInsLoading
                ? "..."
                : averageStress
                ? `${averageStress}/10`
                : "-/10"}
            </strong>
          </div>

          <div className="progress">
            <div
              className="progressFill"
              style={{
                width: averageStress ? `${averageStress * 10}%` : "0%",
              }}
            />
          </div>
        </div>

        <div className="metric">
          <div className="metricTop">
            <span>Energie</span>
            <strong>
              {checkInsLoading
                ? "..."
                : averageEnergy
                ? `${averageEnergy}/10`
                : "-/10"}
            </strong>
          </div>

          <div className="progress">
            <div
              className="progressFill"
              style={{
                width: averageEnergy ? `${averageEnergy * 10}%` : "0%",
              }}
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
  );
}

export default DashboardTodayCard;