import { useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import "./PremiumPage.css";

const freeFeatures = [
  "Dagelijkse check-ins",
  "Basis pauzesuggesties",
  "Focus timer",
  "Dagelijkse inzichten",
  "Dagafsluiting reflectie",
];

const premiumFeatures = [
  "Wekelijkse & maandelijkse rapporten",
  "Vergelijk je voortgang over tijd",
  "Zie trends in je energie en focus",
  "Aanbevelingen op maat van jouw ritme",
  "Uitgebreide personalisatie opties",
];

const businessFeatures = [
  "Overzichtelijke dashboards voor je team",
  "Inzicht in teamwelzijn en werkdruk",
  "Alle Premium features per medewerker",
  "Bedrijfsbrede personalisatie",
  "Centrale beheer & instellingen",
];

const teamSizes = ["1-10 werknemers", "11-25 werknemers", "26-50 werknemers", "51-100 werknemers", "100+ werknemers"];

function FeatureList({ features, variant = "check" }) {
  return (
    <ul className="premium-feature-list">
      {features.map((feature) => (
        <li key={feature}>
          <span className={`premium-feature-icon premium-feature-icon--${variant}`} aria-hidden="true">
            {variant === "check" ? "✓" : "✦"}
          </span>
          {feature}
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
          <div className="business-benefits">
            <div className="business-benefit-card">
              <span className="benefit-circle" aria-hidden="true">☷</span>
              <h3>Team dashboard</h3>
              <p>Inzicht in teamwelzijn zonder individuele controle</p>
            </div>
            <div className="business-benefit-card">
              <span className="benefit-circle" aria-hidden="true">▣</span>
              <h3>Premium voor iedereen</h3>
              <p>Alle teamleden krijgen toegang tot Premium features</p>
            </div>
            <div className="business-benefit-card">
              <span className="benefit-circle" aria-hidden="true">✉</span>
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

            <button className="primary-button" type="submit">Aanvraag versturen →</button>
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
              <div className="success-icon" aria-hidden="true">✓</div>
              <h2 id="success-title">Bedankt voor je aanvraag!</h2>
              <p>We hebben je aanvraag voor een bedrijfslicentie ontvangen. Ons team neemt binnen 24 uur contact met je op om de volgende stappen te bespreken.</p>

              <div className="success-summary">
                <p><strong>Bedrijf:</strong> {form.company}</p>
                <p><strong>Teamgrootte:</strong> {form.teamSize}</p>
                <p><strong>Email:</strong> {form.email}</p>
              </div>

              <button className="primary-button success-button" type="button" onClick={() => setView("plans")}>Terug naar dashboard</button>
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
            <button className="secondary-button" type="button">Huidige plan</button>
          </PricingCard>

          <PricingCard highlighted>
            <div className="popular-badge">Meest gekozen</div>
            <h2><span aria-hidden="true">♕</span> Premium</h2>
            <p className="price"><strong>{premiumPrice}</strong><span>{priceSuffix}</span></p>
            <p className="card-copy">Meer inzicht in je werkdag:</p>
            <FeatureList features={premiumFeatures} variant="spark" />
            <p className="guarantee">14 dagen geld-terug-garantie</p>
            <button className="primary-button" type="button">Upgrade naar Premium</button>
          </PricingCard>

          <PricingCard>
            <h2><span aria-hidden="true">♙</span> Bedrijfslicentie</h2>
            <p className="price"><strong>{businessPrice}</strong><span>{priceSuffix}/werknemer</span></p>
            <p className="card-copy">Voor teams en organisaties die gezonder en efficiënter willen werken</p>
            <FeatureList features={businessFeatures} variant="spark" />
            <div className="business-actions">
              <button className="secondary-button" type="button">Contacteer ons</button>
              <button className="primary-button" type="button" onClick={() => setView("business")}>Aanvragen</button>
            </div>
          </PricingCard>
        </div>
      </section>
    </MainLayout>
  );
}

export default PremiumPage;
