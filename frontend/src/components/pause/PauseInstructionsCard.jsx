import "./PauseInstructionsCard.css";

function PauseInstructionsCard({ title, instructions = [] }) {
  return (
    <section className="pauseInstructionsCard">
      <h3>{title}</h3>

      <ol className="pauseInstructionsList">
        {instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    </section>
  );
}

export default PauseInstructionsCard;