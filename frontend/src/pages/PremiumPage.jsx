import { useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import "./PremiumPage.css";
import Button from "../components/base/Button";

//icons
//zwart
import premium_zwart from "../assets/icons_zwart/premium_zwart.svg";
import bedrijfslicentie from "../assets/icons_zwart/team_zwart.svg";
import pijlLinks from "../assets/icons_zwart/pijl_links_zwart.svg";

//groen
import premium_groen from "../assets/icons_groen/premium_groen.svg";
import bedrijfslicentie_groen from "../assets/icons_groen/team_groen.svg";
import check from "../assets/icons_groen/check_groen.svg";
import grafiek from "../assets/icons_groen/inzichten_groen.svg";
import kalender from "../assets/icons_groen/agenda_groen.svg";
import trend from "../assets/icons_groen/trend_groen.svg";
import spark from "../assets/icons_groen/stretchen_groen.svg";
import instellingen from "../assets/icons_groen/instellingen_groen.svg";
import bedrijf from "../assets/icons_groen/bedrijf_groen.svg";
import mail from "../assets/icons_groen/mail_groen.svg";

//Wit
import dropdown from "../assets/icons_wit/arrow down_wit.svg";
import pijlLinksWit from "../assets/icons_wit/pijl_links_wit.svg";
import pijlRechts from "../assets/icons_wit/pijl_rechts_wit.svg";

const freeFeatures = [
  { icon: check, text: "Dagelijkse check-ins" },
  { icon: check, text: "Basis pauzesuggesties" },
  { icon: check, text: "Focus timer" },
  { icon: check, text: "Dagelijkse inzichten" },
  { icon: check, text: "Dagafsluiting reflectie" },
];

const premiumFeatures = [
  { icon: grafiek, text: "Wekelijkse & maandelijkse rapporten" },
  { icon: kalender, text: "Vergelijk je voortgang over tijd" },
  { icon: trend, text: "Zie trends in je energie en focus" },
  { icon: spark, text: "Aanbevelingen op maat van jouw ritme" },
  { icon: instellingen, text: "Uitgebreide personalisatie opties" },
];

const businessFeatures = [
  { icon: grafiek, text: "Overzichtelijke dashboards voor je team" },
  { icon: trend, text: "Inzicht in teamwelzijn en werkdruk" },
  { icon: premium_groen, text: "Alle Premium features per medewerker" },
  { icon: spark, text: "Bedrijfsbrede personalisatie" },
  { icon: instellingen, text: "Centrale beheer & instellingen" },
];

const teamSizes = ["1-10 werknemers", "11-25 werknemers", "26-50 werknemers", "51-100 werknemers", "100+ werknemers"];

function FeatureList({ features, variant = "check" }) {
  return (
    <ul className="premium-feature-list">
      {features.map((feature) => (
        <li key={feature.text}>
          <img src={feature.icon} alt="feature icon" className={`feature-icon feature-icon--${variant}`} />
          {feature.text}
        </li>
      ))}
    </ul>
  );
}

function PricingCard({ children, highlighted = false }) {
  return <article className={`pricing-card ${highlighted ? "pricing-card--highlighted" : ""}`}>{children}</article>;
}

function PremiumPage() {
  const [billing, setBilling] = useState("monthly");
  const [view, setView] = useState("plans");
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    company: "",
    contact: "",
    email: "",
    teamSize: "",
    phone: "",
    message: "",
  });

  const premiumPrice = useMemo(() => (billing === "monthly" ? "€2,99" : "€33,00"), [billing]);
  const businessPrice = useMemo(() => (billing === "monthly" ? "€2,20" : "€20,00"), [billing]);
  const priceSuffix = billing === "monthly" ? "/maand" : "/jaar";

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleBusinessSubmit(event) {
    event.preventDefault();
    setShowSuccess(true);
  }

  if (view === "business") {
    return (
      <MainLayout title="Bedrijfslicentie" subtitle="Geef je team toegang tot Re:Mind en verbeter het welzijn op de werkvloer">
        <section className="business-page" aria-label="Bedrijfslicentie aanvraag">
          <div className="business-topbar">
            <Button
              type="button"
              variant="secondary"
              iconLeft={pijlLinks}
              onClick={() => setView("plans")}
            >
              Terug naar plannen
            </Button>
          </div>
          <div className="business-benefits">
            <div className="business-benefit-card">
              <div className="benefit-circle" >
                <img src={bedrijfslicentie_groen} alt="Bedrijf" className="benefit-img" />
              </div>
              <h3>Team dashboard</h3>
              <p>Inzicht in teamwelzijn zonder individuele controle</p>
            </div>
            <div className="business-benefit-card">
              <div className="benefit-circle" >
                <img src={bedrijf} alt="Bedrijf" className="benefit-img" />
              </div>
              <h3>Premium voor iedereen</h3>
              <p>Alle teamleden krijgen toegang tot Premium features</p>
            </div>
            <div className="business-benefit-card">
              <div className="benefit-circle" >
                <img src={mail} alt="Email" className="benefit-img" />
              </div>
              <h3>Persoonlijke support</h3>
              <p>Dedicated ondersteuning voor je organisatie</p>
            </div>
          </div>

          <form className="business-form" onSubmit={handleBusinessSubmit}>
            <h2>Aanvraag formulier</h2>

            <label>
              Bedrijfsnaam *
              <input name="company" value={form.company} onChange={updateField} placeholder="bijv. Acme BV" required />
            </label>

            <label>
              Contactpersoon *
              <input name="contact" value={form.contact} onChange={updateField} placeholder="Voor- en achternaam" required />
            </label>

            <div className="form-grid">
              <label>
                Email *
                <input name="email" type="email" value={form.email} onChange={updateField} placeholder="naam@bedrijf.com" required />
              </label>

              <label>
                Telefoonnummer (optioneel)
                <input name="phone" value={form.phone} onChange={updateField} placeholder="+32 4 12345678" />
              </label>
            </div>

            <label>
              Teamgrootte *
              <select name="teamSize" value={form.teamSize} onChange={updateField} required>
                <option value="" disabled>Kies je teamgrootte</option>
                {teamSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>

            <label>
              Bericht (optioneel)
              <textarea name="message" value={form.message} onChange={updateField} placeholder="Vertel ons meer over je behoeften..." rows="5" />
            </label>

            <Button variant="primary" type="submit">
              Aanvraag versturen 
              <img src={pijlRechts} alt="Pijl rechts" className="button-icon" />
            </Button>
          </form>

          <aside className="after-request-card">
            <h3>Wat gebeurt er na je aanvraag?</h3>
            <p>
              Ons team beoordeelt je aanvraag en neemt binnen 24 uur contact op om een gepersonaliseerde offerte te maken en de implementatie te bespreken.
              Je kunt ook een gratis demo aanvragen om Re:Mind in actie te zien.
            </p>
          </aside>
        </section>

        {showSuccess && (
          <div className="modal-backdrop" role="presentation">
            <section className="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title">
              <div className="success-icon"><img src={check} alt="check"/></div>
              <h2 id="success-title">Bedankt voor je aanvraag!</h2>
              <p>We hebben je aanvraag voor een bedrijfslicentie ontvangen. Ons team neemt binnen 24 uur contact met je op om de volgende stappen te bespreken.</p>

              <div className="success-summary">
                <p><strong>Bedrijf:</strong> {form.company}</p>
                <p><strong>Teamgrootte:</strong> {form.teamSize}</p>
                <p><strong>Email:</strong> {form.email}</p>
              </div>

              <Button className="success-button" to={'/dashboard'} iconLeft={pijlLinksWit}>
                Terug naar dashboard
              </Button>
            </section>
          </div>
        )}
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Premium" subtitle="Kies het plan dat bij jou past">
      <section className="premium-page" aria-label="Premium abonnementen">
        <div className="billing-toggle" aria-label="Facturatieperiode kiezen">
          <button className={billing === "monthly" ? "active" : ""} type="button" onClick={() => setBilling("monthly")}>Maandelijks</button>
          <button className={billing === "yearly" ? "active" : ""} type="button" onClick={() => setBilling("yearly")}>
            Jaarlijks <span>Bespaar 25%</span>
          </button>
        </div>

        <div className="pricing-grid">
          <PricingCard>
            <h2>Gratis</h2>
            <p className="price"><strong>€0,00</strong><span>/maand</span></p>
            <p className="card-copy">Perfect om te beginnen met werkbalans</p>
            <FeatureList features={freeFeatures} />
            
            <div className="pricing-card-action">
              <Button variant="secondary" onClick={() => setView("plans")}>
                Huidige plan
              </Button>
            </div>
          </PricingCard>

          <PricingCard highlighted>
            <div className="popular-badge">Meest gekozen</div>
            <h2 className="card-title">
              <img src={premium_zwart} alt="Premium" className="card-title-icon" />
              Premium
            </h2>
            <p className="price"><strong>{premiumPrice}</strong><span>{priceSuffix}</span></p>
            <p className="card-copy">Meer inzicht in je werkdag:</p>
            <FeatureList features={premiumFeatures} variant="spark" />
            <p className="guarantee">14 dagen geld-terug-garantie</p>
            <Button variant="primary" onClick={() => setView("business")}>
              Upgrade naar Premium
            </Button>
          </PricingCard>

          <PricingCard>
            <h2 className="card-title">
              <img src={bedrijfslicentie} alt="Bedrijfslicentie" className="card-title-icon" />
              Bedrijfslicentie
            </h2>
            <p className="price"><strong>{businessPrice}</strong><span>{priceSuffix}/werknemer</span></p>
            <p className="card-copy">Voor teams en organisaties die gezonder en efficiënter willen werken</p>
            <FeatureList features={businessFeatures} variant="spark" />
            <div className="business-actions">
              <Button variant="secondary" onClick={() => setView("business")}>
                Contacteer ons
              </Button>
              <Button variant="primary" onClick={() => setView("business")}>
                Aanvragen
              </Button>
            </div>
          </PricingCard>
        </div>
      </section>
    </MainLayout>
  );
}

export default PremiumPage;