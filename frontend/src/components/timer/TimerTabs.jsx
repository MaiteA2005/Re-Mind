import "./TimerTabs.css";

import werkdagIconZwart from "../../assets/icons_zwart/werkdag_zwart.svg";
import focusIconZwart from "../../assets/icons_zwart/werkdag_zwart.svg";
import pauzeTimerIconZwart from "../../assets/icons_zwart/koffie_zwart.svg";

import werkdagIconWit from "../../assets/icons_wit/werkdag_wit.svg";
import focusIconWit from "../../assets/icons_wit/werkdag_wit.svg";
import pauzeTimerIconWit from "../../assets/icons_wit/koffie_wit.svg";

function TimerTabs({ activeTimer, onChange }) {
  const tabs = [
    { 
      id: "workday", 
      label: "Werkdag", 
      icon: {
        default: werkdagIconZwart,
        active: werkdagIconWit,
      } 
    },
    { 
      id: "focus", 
      label: "Focusblok", 
      icon: {
          default: focusIconZwart,
          active: focusIconWit,
      } 
    },
    { 
        id: "break", 
        label: "Pauze", 
        icon: {
            default: pauzeTimerIconZwart,
            active: pauzeTimerIconWit,
      } 
    },
  ];

  return (
    <div className="timerTabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`timerTab ${
            activeTimer === tab.id ? "timerTabActive" : ""
        }`}
          onClick={() => onChange(tab.id)}
        >
          <img
            src={
                activeTimer === tab.id
                ? tab.icon.active
                : tab.icon.default
            }
            alt="Timer Tab Icon"
            className="timerTabIcon"
          />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export default TimerTabs;