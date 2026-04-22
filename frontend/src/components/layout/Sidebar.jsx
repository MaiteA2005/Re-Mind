import { NavLink } from "react-router-dom";
import logo from "../../assets/logo_groen.svg";
import "./Sidebar.css";

// zwarte icons
import homeBlack from "../../assets/icons_zwart/home_zwart.svg";
import checkinBlack from "../../assets/icons_zwart/check-in_zwart.svg";
import koffieBlack from "../../assets/icons_zwart/koffie_zwart.svg";
import inzichtenBlack from "../../assets/icons_zwart/inzichten_zwart.svg";
import maanBlack from "../../assets/icons_zwart/maan_zwart.svg";
import timerBlack from "../../assets/icons_zwart/timer_zwart.svg";
import instellingenBlack from "../../assets/icons_zwart/instellingen_zwart.svg";
import premiumBlack from "../../assets/icons_zwart/premium_zwart.svg";

// witte icons
import homeWhite from "../../assets/icons_wit/home_wit.svg";
import checkinWhite from "../../assets/icons_wit/check-in_wit.svg";
import koffieWhite from "../../assets/icons_wit/koffie_wit.svg";
import inzichtenWhite from "../../assets/icons_wit/inzichten_wit.svg";
import maanWhite from "../../assets/icons_wit/maan_wit.svg";
import timerWhite from "../../assets/icons_wit/timer_wit.svg";
import instellingenWhite from "../../assets/icons_wit/instellingen_wit.svg";
import premiumWhite from "../../assets/icons_wit/premium_wit.svg";

const mainLinks = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: homeBlack,
    activeIcon: homeWhite,
  },
  {
    to: "/check-in",
    label: "Check-in",
    icon: checkinBlack,
    activeIcon: checkinWhite,
  },
  {
    to: "/pauze",
    label: "Pauze",
    icon: koffieBlack,
    activeIcon: koffieWhite,
  },
  {
    to: "/inzichten",
    label: "Inzichten",
    icon: inzichtenBlack,
    activeIcon: inzichtenWhite,
  },
  {
    to: "/dagafsluiting",
    label: "Dagafsluiting",
    icon: maanBlack,
    activeIcon: maanWhite,
  },
  {
    to: "/timer",
    label: "Timer",
    icon: timerBlack,
    activeIcon: timerWhite,
  },
];

const bottomLinks = [
  {
    to: "/premium",
    label: "Premium proberen",
    icon: premiumBlack,
    activeIcon: premiumWhite,
  },
  {
    to: "/instellingen",
    label: "Instellingen",
    icon: instellingenBlack,
    activeIcon: instellingenWhite,
  },
];

function SidebarLink({ to, label, icon, activeIcon }) {
  return (
    <NavLink to={to} className="navLink">
      {({ isActive }) => (
        <div className={isActive ? "sideLink sideLinkActive" : "sideLink"}>
          <img
            src={isActive ? activeIcon : icon}
            alt=""
            className="sideIcon"
            aria-hidden="true"
          />
          <span>{label}</span>
        </div>
      )}
    </NavLink>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebarTop">
        <div className="brand">
          <img src={logo} alt="Re:Mind" className="brandLogo" />
          <p>Slim pauzeren, sterk presteren</p>
        </div>

        <nav className="mainNav" aria-label="Hoofdnavigatie">
          {mainLinks.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </nav>
      </div>

      <div className="sidebarBottom">
        <nav className="subNav" aria-label="Ondernavigatie">
          {bottomLinks.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;