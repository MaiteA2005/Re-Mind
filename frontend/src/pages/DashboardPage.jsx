import MainLayout from "../components/layout/MainLayout";
import { formatDate, getGreeting } from "../utils/date";
import "./DashboardPage.css";

function DashboardPage() {
  const name = "John Doe"; // later dynamisch
  const greeting = getGreeting();

  return (
    <MainLayout
      title={`${greeting}, ${name}`}
      subtitle={formatDate()}
      variant="dashboard"
    >
      <div className="dashboard-grid">
        <div className="card card--wide">
          <div className="card__row">
            <div>
              <h3>Hoe voel je je nu?</h3>
              <p>Laatste check-in: 11:45</p>
            </div>
            <button className="btn btn-primary">Check-in</button>
          </div>
        </div>

        <div className="card card--large">
          <h3>Vandaag</h3>
          <div className="metrics">
            <div>
              <span>Stress</span>
              <strong>5/10</strong>
            </div>
            <div>
              <span>Energie</span>
              <strong>7/10</strong>
            </div>
          </div>

          <div className="checkins-list">
            <div className="checkins-item">
              <span>09:30</span>
              <span>Stress: 3 | Energie: 7</span>
            </div>
            <div className="checkins-item">
              <span>11:45</span>
              <span>Stress: 5 | Energie: 7</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Vandaag</h3>
          <p>Je nam al 2 momenten voor jezelf</p>
        </div>

        <div className="card">
          <h3>Pauze tijd?</h3>
          <p>Je hebt al 2 uur gewerkt. Tijd voor een korte pauze?</p>
          <button className="btn">Bekijk suggesties</button>
        </div>

        <div className="card card--wide">
          <h3>Maand</h3>
          <div className="stats-row">
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
        </div>

        <div className="card">
          <h3>Start focusblok</h3>
          <p>Begin een gefocuste sessie van 25 min</p>
        </div>

        <div className="card">
          <h3>Inzichten</h3>
          <p>Bekijk je voortgang en patronen</p>
        </div>

        <div className="card">
          <h3>Pauze suggesties</h3>
          <p>Ontdek effectieve pauzes</p>
        </div>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;