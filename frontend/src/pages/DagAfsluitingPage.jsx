import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDayClosing } from "../services/dayClosingService";
import MainLayout from "../components/layout/MainLayout";
import "./DagAfsluitingPage.css";

// Icons
import dagafsluitingGroen from "../assets/icons_groen/maan_groen.svg";
import breinGroen from "../assets/icons_groen/brein_groen.svg";
import sterGroen from "../assets/icons_groen/ster_groen.svg";
import trendGroen from "../assets/icons_groen/trend_groen.svg";
import hartGroen from "../assets/icons_groen/hart_default_groen.svg";

import pijlRechtsZwart from "../assets/icons_zwart/pijl_rechts_zwart.svg";
import pijlLinksZwart from "../assets/icons_zwart/pijl_links_zwart.svg";
import pijlRechtsWit from "../assets/icons_wit/pijl_rechts_wit.svg";

function DagAfsluitingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [reflection, setReflection] = useState({
    dayFeeling: "",
    highlight: "",
    challenge: "",
    energyAfterWork: "",
    gratitude: "",
    tomorrowFocus: "",
  });
  
  const reflectionBenefits = [
    {
      icon: breinGroen,
      text: "Verwerk je dag mentaal en creëer afsluiting",
    },
    {
      icon: sterGroen,
      text: "Herken positieve momenten en successen",
    },
    {
      icon: trendGroen,
      text: "Leer van uitdagingen voor morgen",
    },
    {
      icon: hartGroen,
      text: "Bevorder een positieve mindset voor de nacht",
    },
  ];

  const dayOptions = [
    "Geweldig - Het ging goed vandaag",
    "Goed - Over het algemeen positief",
    "Oké - Gemiddelde dag",
    "Uitdagend - Het was zwaar",
    "Moeilijk - Een zware dag",
  ];

  const energyOptions = [
    "Energiek - Ik voel me goed",
    "Tevreden - Rustig en content",
    "Moe - Klaar voor rust",
    "Uitgeput - Heel erg moe",
  ];

  const updateReflection = (key, value) => {
    setError("");
    setReflection((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 8));
  };

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const finishDayClosing = async () => {
    if (!reflection.dayFeeling) {
      setError("Kies hoe je dag was.");
      setStep(2);
      return;
    }

    if (!reflection.energyAfterWork) {
      setError("Kies hoe je je nu voelt.");
      setStep(5);
      return;
    }

    setSaving(true);
    setError("");

    try {
      await createDayClosing(reflection);
      setStep(8);
    } catch (error) {
      console.error(error);
      setError(error.message || "Dagafsluiting opslaan mislukt");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout title="Dagafsluiting" subtitle="30 maart 2026">
      <section className="dayClosingPage">
        {step === 1 && (
          <article className="dayClosingCard dayClosingIntroCard">
            <div className="dayClosingIconCircle">
              <img src={dagafsluitingGroen} alt="" />
            </div>

            <h2>Tijd om je dag af te sluiten</h2>
            <p>
              Neem een moment om te reflecteren op je dag. Dit helpt je om
              bewuster te worden en beter te slapen.
            </p>

            <div className="dayClosingInfoBox">
              <h3>Waarom reflecteren?</h3>

              <ul>
                {reflectionBenefits.map((benefit) => (
                  <li key={benefit.text}>
                    <img src={benefit.icon} alt="" />
                    {benefit.text}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="dayClosingPrimaryButton"
              onClick={nextStep}
            >
              Begin reflectie
              <img src={pijlRechtsWit} alt="" />
            </button>
          </article>
        )}

        {step === 2 && (
          <article className="dayClosingCard">
            <span className="dayClosingStep">Stap 2 van 7</span>
            <h2>Hoe was je dag over het algemeen?</h2>
            <p>Kies het gevoel dat het beste past</p>

            {error && <p className="dayClosingError">{error}</p>}

            <div className="dayClosingOptions">
              {dayOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`dayClosingOption ${
                    reflection.dayFeeling === option
                      ? "dayClosingOptionActive"
                      : ""
                  }`}
                  onClick={() => updateReflection("dayFeeling", option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="dayClosingActions">
              <button
                type="button"
                className="dayClosingSecondaryButton"
                onClick={previousStep}
              >
                <img src={pijlLinksZwart} alt="" />
                Terug
              </button>

              <button
                type="button"
                className="dayClosingPrimaryButton"
                onClick={nextStep}
              >
                Volgende
                <img src={pijlRechtsWit} alt="" />
              </button>
            </div>
          </article>
        )}

        {step === 3 && (
          <article className="dayClosingCard">
            <span className="dayClosingStep">Stap 3 van 7</span>
            <h2>Wat was een hoogtepunt van vandaag?</h2>
            <p>
              Ook kleine dingen tellen - een fijn gesprek, een voltooide taak,
              een mooie pauze
            </p>

            <textarea
              value={reflection.highlight}
              onChange={(event) =>
                updateReflection("highlight", event.target.value)
              }
              placeholder="bijv. 'Leuk gesprek met collega tijdens lunch' of 'Eindelijk dat project afgerond'"
            />

            <div className="dayClosingActions">
              <button
                type="button"
                className="dayClosingSecondaryButton"
                onClick={previousStep}
              >
                <img src={pijlLinksZwart} alt="" />
                Terug
              </button>

              <button
                type="button"
                className="dayClosingPrimaryButton"
                onClick={nextStep}
              >
                Volgende
                <img src={pijlRechtsWit} alt="" />
              </button>
            </div>
          </article>
        )}
        
        {step === 4 && (
          <article className="dayClosingCard">
            <span className="dayClosingStep">Stap 4 van 7</span>
            <h2>Was er iets uitdagends?</h2>
            <p>Het helpt om moeilijke momenten te benoemen en los te laten</p>

            <textarea
              value={reflection.challenge}
              onChange={(event) =>
                updateReflection("challenge", event.target.value)
              }
              placeholder="bijv. 'Moeilijke feedback ontvangen' of 'Te veel taken tegelijk'"
            />

            <span className="dayClosingHint">
              Dit is optioneel. Als er niets was, kun je dit overslaan.
            </span>

            <div className="dayClosingActions">
              <button
                type="button"
                className="dayClosingSecondaryButton"
                onClick={previousStep}
              >
                <img src={pijlLinksZwart} alt="" />
                Terug
              </button>

              <button
                type="button"
                className="dayClosingGhostButton"
                onClick={nextStep}
              >
                Overslaan
                <img src={pijlRechtsZwart} alt="" />
              </button>

              <button
                type="button"
                className="dayClosingPrimaryButton"
                onClick={nextStep}
              >
                Volgende
                <img src={pijlRechtsWit} alt="" />
              </button>
            </div>
          </article>
        )}

        {step === 5 && (
          <article className="dayClosingCard">
            <span className="dayClosingStep">Stap 5 van 7</span>
            <h2>Hoe voel je je nu?</h2>
            <p>Kies het gevoel dat het beste past</p>

            {error && <p className="dayClosingError">{error}</p>}

            <div className="dayClosingOptions">
              {energyOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`dayClosingOption ${
                    reflection.energyAfterWork === option
                      ? "dayClosingOptionActive"
                      : ""
                  }`}
                  onClick={() => updateReflection("energyAfterWork", option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="dayClosingActions">
              <button
                type="button"
                className="dayClosingSecondaryButton"
                onClick={previousStep}
              >
                <img src={pijlLinksZwart} alt="" />
                Terug
              </button>

              <button
                type="button"
                className="dayClosingPrimaryButton"
                onClick={nextStep}
              >
                Volgende
                <img src={pijlRechtsWit} alt="" />
              </button>
            </div>
          </article>
        )}

        {step === 6 && (
          <article className="dayClosingCard">
            <span className="dayClosingStep">Stap 6 van 7</span>
            <h2>Waar ben je dankbaar voor vandaag?</h2>
            <p>Dankbaarheid bevordert een positieve mindset en beter slapen</p>

            <textarea
              value={reflection.gratitude}
              onChange={(event) =>
                updateReflection("gratitude", event.target.value)
              }
              placeholder="bijv. 'Fijne collega's om me heen' of 'Gezond en wel thuisgekomen'"
            />

            <div className="dayClosingActions">
              <button
                type="button"
                className="dayClosingSecondaryButton"
                onClick={previousStep}
              >
                <img src={pijlLinksZwart} alt="" />
                Terug
              </button>

              <button
                type="button"
                className="dayClosingPrimaryButton"
                onClick={nextStep}
              >
                Volgende
                <img src={pijlRechtsWit} alt="" />
              </button>
            </div>
          </article>
        )}

        {step === 7 && (
          <article className="dayClosingCard">
            <span className="dayClosingStep">Stap 7 van 7</span>
            <h2>Waar wil je morgen op focussen?</h2>
            <p>Eén heldere intentie voor morgen</p>

            <textarea
              value={reflection.tomorrowFocus}
              onChange={(event) =>
                updateReflection("tomorrowFocus", event.target.value)
              }
              placeholder="bijv. 'Rustig beginnen met één taak tegelijk' of 'Meer pauzes nemen'"
            />

            <span className="dayClosingHint">
              Houd het simpel en haalbaar, 1 ding is genoeg
            </span>

            {error && <p className="dayClosingError">{error}</p>}

            <div className="dayClosingActions">
              <button
                type="button"
                className="dayClosingSecondaryButton"
                onClick={previousStep}
                disabled={saving}
              >
                <img src={pijlLinksZwart} alt="" />
                Terug
              </button>

              <button
                type="button"
                className="dayClosingPrimaryButton"
                onClick={finishDayClosing}
                disabled={saving}
              >
                {saving ? "Opslaan..." : "Afronden"}
                <img src={pijlRechtsWit} alt="" />
              </button>
            </div>
          </article>
        )}

        {step === 8 && (
          <article className="dayClosingCard dayClosingEndCard">
            <div className="dayClosingIconCircle">
              <img src={dagafsluitingGroen} alt="" />
            </div>

            <h2>Dag afgesloten</h2>
            <p>
              Je reflectie is opgeslagen. Tijd om los te laten en te
              ontspannen.
            </p>

            <div className="dayClosingSummary">
              <h3>Je reflectie samenvatting</h3>

              <div>
                <span>Hoogtepunt van vandaag</span>
                <p>{reflection.highlight || "Geen hoogtepunt ingevuld"}</p>
              </div>

              <div>
                <span>Dankbaar voor:</span>
                <p>{reflection.gratitude || "Niet ingevuld"}</p>
              </div>

              <div>
                <span>Focus voor morgen:</span>
                <p>{reflection.tomorrowFocus || "Niet ingevuld"}</p>
              </div>
            </div>

            <button
              type="button"
              className="dayClosingPrimaryButton"
              onClick={() => navigate("/dashboard")}
            >
              Naar dashboard
              <img src={pijlRechtsWit} alt="" />
            </button>
          </article>
        )}
      </section>
    </MainLayout>
  );
}

export default DagAfsluitingPage;