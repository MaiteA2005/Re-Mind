import "./css/PauseInfoCard.css";

function PauseInfoCard({ title, text }) {
  return (
    <section className="pauseInfoCard">
      <h4>{title}</h4>
      <p>{text}</p>
    </section>
  );
}

export default PauseInfoCard;