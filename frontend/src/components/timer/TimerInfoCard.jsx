import { Link } from "react-router-dom";
import "./TimerInfoCard.css";

import infoIcon from "../../assets/icons_groen/uitroepteken_groen.svg";

function TimerInfoCard({ activeTimer }) {
  const content = {
    workday: {
      title: "Tips voor een gezonde werkdag",
      items: [
        "Neem regelmatig pauzes - Re:Mind herinnert je hieraan",
        "Blijf gehydrateerd - houd water bij de hand",
        "Doe regelmatig een check-in om je energie te monitoren",
        "Stap tijdens pauzes weg van je scherm",
      ],
    },
    focus: {
      title: "Tips voor een productief werkblok",
      items: [
        "Schakel notificaties uit om je focus te behouden",
        "Focus op één taak tegelijk",
        "Houd water binnen handbereik",
        "Neem na dit blok even tijd voor een pauze",
      ],
    },
    break: {
      title: "Maak optimaal gebruik van je pauze",
      items: [
        "Stap weg van je scherm",
        "Beweeg, stretch of loop een rondje",
        "Drink water, thee of koffie",
        <li>
          Bekijk{" "}
            <Link to="/pause" className="timerInfoLink">
              onze pauzesuggesties
            </Link>{" "}
          om je focus en energie te verbeteren
        </li>,
      ],
    },
  };

  const selected = content[activeTimer];

  return (
    <article className="timerInfoCard">
      <h3>
        <img src={infoIcon} alt="" className="timerInfoTitleIcon" />
        {selected.title}
      </h3>

      <ul>
        {selected.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export default TimerInfoCard;