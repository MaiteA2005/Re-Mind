import FilterTabs from "../base/FilterTabs";

// icons zwart
import profiel_zwart from "../../assets/icons_zwart/houding_check_zwart.svg";
import instellingen_zwart from "../../assets/icons_zwart/instellingen_zwart.svg";
import notificatie_zwart from "../../assets/icons_zwart/notificatie_zwart.svg";
import abonnement_zwart from "../../assets/icons_zwart/abonnement_zwart.svg";
import privacy_zwart from "../../assets/icons_zwart/privacy_zwart.svg";

// icons wit
import profiel_wit from "../../assets/icons_wit/houding_check_wit.svg";
import instellingen_wit from "../../assets/icons_wit/instellingen_wit.svg";
import notificatie_wit from "../../assets/icons_wit/notificatie_wit.svg";
import abonnement_wit from "../../assets/icons_wit/abonnement_wit.svg";
import privacy_wit from "../../assets/icons_wit/privacy_wit.svg";

function SettingsTabs({ activeTab, onTabChange }) {
  const tabs = [
    {
      value: "profile",
      label: "Profiel",
      icon: profiel_zwart,
      activeIcon: profiel_wit,
    },
    {
      value: "personalization",
      label: "Personalisatie",
      icon: instellingen_zwart,
      activeIcon: instellingen_wit,
    },
    {
      value: "notifications",
      label: "Notificaties",
      icon: notificatie_zwart,
      activeIcon: notificatie_wit,
    },
    {
      value: "subscription",
      label: "Abonnement",
      icon: abonnement_zwart,
      activeIcon: abonnement_wit,
    },
    {
      value: "privacy",
      label: "Privacy",
      icon: privacy_zwart,
      activeIcon: privacy_wit,
    },
  ];

  return (
    <FilterTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}

export default SettingsTabs;