import posture from "../../assets/icons_groen/houding_check_groen.svg";
import win from "../../assets/icons_groen/name_one_win_groen.svg";
import hand from "../../assets/icons_groen/hand_stretch_groen.svg";
import touch from "../../assets/icons_groen/hart_default_groen.svg";
import water from "../../assets/icons_groen/koffie_groen.svg";
import eye from "../../assets/icons_groen/oog_reset_groen.svg";   
import breath from "../../assets/icons_groen/ademhaling_groen.svg";
import walk from "../../assets/icons_groen/korte_wandeling_groen.svg";
import stretch from "../../assets/icons_groen/stretchen_groen.svg";

import HeartDefault from "../../assets/icons_groen/hart_default_groen.svg";
import HeartClicked from "../../assets/icons_groen/hart_filled_groen.svg";
import Clock from "../../assets/icons_groen/klok_groen.svg";

const iconMap = {
  posture,
  win,
  hand,
  touch,
  water,
  eye,
  breath,
  walk,
  stretch,
};

function PauseCard({
  title,
  description,
  duration,
  icon,
  isFavorite,
  onToggleFavorite,
}) {
  const iconSrc = iconMap[icon] || posture;

  return (
    <article className="pauseCard">
      <div className="pauseCardTop">
        <div className="pauseCardTitleWrapper">
          <div className="pauseCardIcon">
            <img src={iconSrc} alt="" className="pauseCardIconImage" />
          </div>

          <div className="pauseCardText">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>

        <button
          type="button"
          className={`pauseFavoriteButton ${isFavorite ? "active" : ""}`}
          onClick={onToggleFavorite}
          aria-label={
            isFavorite
              ? "Verwijder uit favorieten"
              : "Voeg toe aan favorieten"
          }
        >
          <img src={isFavorite ? HeartClicked : HeartDefault} alt="" className="pauseFavoriteIcon" />
        </button>
      </div>

      <div className="pauseCardMeta">
        <img src={Clock} alt="" className="pauseMetaIcon" />
        <span>{duration}</span>
      </div>
    </article>
  );
}

export default PauseCard;