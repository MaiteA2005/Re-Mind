import "./TimerOptionCard.css";

import klokZwart from "../../assets/icons_zwart/klok_zwart.svg";
import koffieZwart from "../../assets/icons_zwart/koffie_zwart.svg";

import klokWit from "../../assets/icons_wit/klok_wit.svg";
import koffieWit from "../../assets/icons_wit/koffie_wit.svg";

function TimerOptionCard({
  label,
  selected,
  onClick,
  iconType = "clock",
}) {
  let iconSrc;

  if (iconType === "coffee") {
    iconSrc = selected ? koffieWit : koffieZwart;
  } else {
    iconSrc = selected ? klokWit : klokZwart;
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`timerOptionCard ${selected ? "timerOptionCardActive" : ""}`}
      onClick={onClick}
    >
      <img src={iconSrc} alt="" className="timerOptionIcon" />
      <span>{label}</span>
    </button>
  );
}

export default TimerOptionCard;