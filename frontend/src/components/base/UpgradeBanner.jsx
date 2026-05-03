import premiumGroen from '../../assets/icons_groen/premium_groen.svg';

function UpgradeBanner() {
  return (
    <div className="upgrade-banner">
      <div>
        <img src={premiumGroen} alt="Premium Icon" />
        <h3>Upgrade voor volledige inzichten</h3>
        <p>Ontgrendel maandelijkse trends, patroonherkenning en gepersonaliseerde aanbevelingen</p>
      </div>

      <button>Meer info</button>
    </div>
  );
}

export default UpgradeBanner;