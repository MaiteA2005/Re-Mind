import "./css/RecommendationCard.css";
import koffieGroen from "../../assets/icons_groen/koffie_groen.svg";
import energieGroen from "../../assets/icons_groen/bliksem_groen.svg";
import checkGroen from "../../assets/icons_groen/check_groen.svg";

function RecommendationCard({ recommendation }) {
  const icon =
    recommendation?.type === "stress"
      ? koffieGroen
      : recommendation?.type === "pause"
      ? koffieGroen
      : recommendation?.type === "balance"
      ? checkGroen
      : energieGroen;

  return (
    <article className="recommendation-card">
      <h3>Aanbevolen voor vandaag</h3>

      <div className="recommendation-item">
        <img src={icon} alt="" />
        <div>
          <h4>{recommendation?.title || "Nog geen aanbeveling"}</h4>
          <p>
            {recommendation?.text ||
              "Vul eerst enkele check-ins of timers in om persoonlijke inzichten te krijgen."}
          </p>
        </div>
      </div>
    </article>
  );
}

export default RecommendationCard;