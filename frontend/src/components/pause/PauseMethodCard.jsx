import { Link } from "react-router-dom";
import "./css/PauseMethodCard.css";

function PauseMethodCard({ method }) {
  return (
    <Link
      to={`/pause/${method.slug}/session`}
      state={{ pauseItem: method }}
      className="pauseMethodCard"
    >
      <h4>{method.title}</h4>
      <p>{method.description}</p>
      <span>{method.duration}</span>
    </Link>
  );
}

export default PauseMethodCard;