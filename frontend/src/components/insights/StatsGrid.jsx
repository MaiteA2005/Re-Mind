import "./StatsGrid.css";

const stats = [
  { label: "Gem. Stress", value: "4.4" },
  { label: "Gem. Energie", value: "5.6" },
  { label: "Check-ins", value: "8", helper: "Goed bezig" },
  { label: "Pauzes genomen", value: "2", helper: "Probeer meer pauzes te nemen" },
];

function StatsGrid() {
  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <h4>{stat.label}</h4>
          <strong>{stat.value}</strong>
          {stat.helper && <p>{stat.helper}</p>}
        </article>
      ))}
    </div>
  );
}

export default StatsGrid;