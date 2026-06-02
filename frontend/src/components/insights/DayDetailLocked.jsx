import "./css/DayDetailLocked.css";
import Button from "../base/Button";
import premiumGroen from "../../assets/icons_groen/premium_groen.svg";

function DayDetailLocked({ latestDayClosing }) {
  const rows = latestDayClosing
    ? [
        `Gevoel — ${latestDayClosing.dayFeeling || "Niet ingevuld"}`,
        `Energie na werk — ${latestDayClosing.energyAfterWork || "Niet ingevuld"}`,
        `Hoogtepunt — ${latestDayClosing.highlight || "Niet ingevuld"}`,
        `Uitdaging — ${latestDayClosing.challenge || "Niet ingevuld"}`,
        `Dankbaarheid — ${latestDayClosing.gratitude || "Niet ingevuld"}`,
        `Focus morgen — ${latestDayClosing.tomorrowFocus || "Niet ingevuld"}`,
      ]
    : [
        "Nog geen dagafsluiting ingevuld",
        "Reflecteer aan het einde van je dag",
        "Je inzichten verschijnen hier zodra er data is",
      ];

  return (
    <section className="day-detail">
      <h2>Bekijk je dag in detail</h2>

      <div className="locked-detail">
        <div className="blurred-list">
          {rows.map((row, index) => (
            <div className="timeline-row" key={`${row}-${index}`}>
              <span />
              <p>{row}</p>
            </div>
          ))}
        </div>

        <div className="locked-modal">
          <div className="lock-icon">
            <img src={premiumGroen} alt="" />
          </div>
          <h3>Ontgrendel meer inzichten</h3>
          <p>
            Ontdek je persoonlijke patronen en krijg gepersonaliseerde
            aanbevelingen.
          </p>
          <Button variant="primary">Upgrade naar Premium</Button>
        </div>
      </div>
    </section>
  );
}

export default DayDetailLocked;