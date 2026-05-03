import koffieGroen from '../../assets/icons_groen/koffie_groen.svg';
import energieGroen from '../../assets/icons_groen/bliksem_groen.svg';

function RecommendationCard() {
  return (
    <article className="recommendation-card">
      <h3>Aanbevolen voor vandaag</h3>

      <div className="recommendation-item">
        <img src={koffieGroen} alt="Koffie Icon" />
        <div>
          <h4>Neem een pauze rond 14:00</h4>
          <p>Je stress piekt meestal in de namiddag</p>
        </div>
      </div>

      <div className="recommendation-item">
        <img src={energieGroen} alt="Energie Icon" />
        <div>
          <h4>Beweeg na langere focusmomenten</h4>
          <p>Je energie daalt na intensieve blokken</p>
        </div>
      </div>
    </article>
  );
}

export default RecommendationCard;