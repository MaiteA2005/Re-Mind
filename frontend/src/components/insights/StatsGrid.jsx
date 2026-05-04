import "./StatsGrid.css";

function StatsGrid({ stats = [] }) {
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