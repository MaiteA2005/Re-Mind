import premiumGroen from '../../assets/icons_groen/premium_groen.svg';

function DayDetailLocked() {
  const rows = [
    "Hoge stress — Check-in",
    "Pauze — Koffiepauze",
    "Hoge energie — Focusmoment",
    "Pauze — Wandeling",
    "Hoge stress — Check-in",
    "Vermoeidheid — Check-in",
  ];

  return (
    <section className="day-detail">
      <h2>Bekijk je dag in detail</h2>

      <div className="locked-detail">
        <div className="blurred-list">
          {rows.map((row, index) => (
            <div className="timeline-row" key={index}>
              <span />
              <p>{row}</p>
            </div>
          ))}
        </div>

        <div className="locked-modal">
          <div className="lock-icon">
            <img src={premiumGroen} alt="Premium Icon" />
          </div>
          <h3>Ontgrendel meer inzichten</h3>
          <p>Ontdek je persoonlijke patronen en krijg gepersonaliseerde aanbevelingen.</p>
          <button>Upgrade naar Premium</button>
        </div>
      </div>
    </section>
  );
}

export default DayDetailLocked;