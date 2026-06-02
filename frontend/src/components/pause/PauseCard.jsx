import { Link } from "react-router-dom";
import "./css/PauseCard.css";
import { pauseIconMap } from "../../utils/pauseIconMap";

import HeartDefault from "../../assets/icons_groen/hart_default_groen.svg";
import HeartClicked from "../../assets/icons_groen/hart_filled_groen.svg";
import Clock from "../../assets/icons_groen/klok_groen.svg";


function PauseCard({
    title,
    description,
    duration,
    icon,
    isFavorite,
    onToggleFavorite,
    to,
}) {
    const iconSrc = pauseIconMap[icon] || posture;

    return (
        <Link to={to} className="pauseCardLink">
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
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onToggleFavorite();
                    }}
                    aria-label={
                        isFavorite
                        ? "Verwijder uit favorieten"
                        : "Voeg toe aan favorieten"
                    }
                    >
                    <img
                        src={isFavorite ? HeartClicked : HeartDefault}
                        alt=""
                        className="pauseFavoriteIcon"
                    />
                </button>
            </div>

            <div className="pauseCardMeta">
                <img src={Clock} alt="" className="pauseMetaIcon" />
                <span>{duration}</span>
            </div>
            </article>
        </Link>
    );
}

export default PauseCard;