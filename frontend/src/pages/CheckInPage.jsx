import { useState } from "react";
import Button from "../components/base/Button";
import MainLayout from "../components/layout/MainLayout";
import { formatDateTime } from "../utils/date";
import { createCheckIn } from "../services/checkInService";
import "./css/CheckInPage.css";

import checkinIcon from "../assets/icons_groen/check-in_groen.svg";
import infoIcon from "../assets/info_blauw.svg";
import pijlRechtsIcon from "../assets/icons_wit/pijl_rechts_wit.svg";
import pijlLinksIcon from "../assets/icons_zwart/pijl_links_zwart.svg";
import energieIcon from "../assets/icons_groen/bliksem_groen.svg";
import checkIcon from "../assets/icons_groen/check_groen.svg";
import notitieIcon from "../assets/icons_groen/notitie_groen.svg";

function CheckInPage() {
  const [step, setStep] = useState(1);
  const [stress, setStress] = useState(1);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stressLabel =
    stress <= 3 ? "Laag" : stress <= 7 ? "Gemiddeld" : "Hoog";

  const energyLabel =
    energy <= 3
      ? "Weinig energie"
      : energy <= 7
      ? "Energiek genoeg"
      : "Heel energiek";

  const getSliderStyle = (value, min = 1, max = 10) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return {
      background: `linear-gradient(
        to right,
        #7e9a88 0%,
        #7e9a88 ${percentage}%,
        #dbe3de ${percentage}%,
        #dbe3de 100%
      )`,
    };
  };

  const goNext = () => setStep((prev) => Math.min(prev + 1, 5));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSkip = () => {
    setNote("");
    finishCheckIn();
  };

  const finishCheckIn = async () => {
    setLoading(true);
    setError("");

    try {
      await createCheckIn({
        stressLevel: stress,
        energyLevel: energy,
        note,
      });

      setStep(5);
    } catch (error) {
      console.error(error);
      setError(error.message || "Check-in opslaan mislukt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Check-in" subtitle={formatDateTime()}>
      <div className="checkInPage">
        <section className="checkInPanel">
          {step === 1 && (
            <div className="checkInStep checkInIntro">
              <div className="checkInIconWrap">
                <img
                  src={checkinIcon}
                  alt="Stress"
                  aria-hidden="true"
                  className="checkInTopIcon"
                />
              </div>

              <p className="checkInIntroText">
                Neem even een moment om bij jezelf te checken. Dit duurt maar
                30 seconden.
              </p>

              <div className="checkInReasonBox">
                <h3>Waarom inchecken?</h3>
                <ul>
                  <li>Krijg inzicht in hoe de werkdag voor jou verloopt</li>
                  <li>Help patronen herkennen in stress en energieniveau</li>
                  <li>Ontvang op het juiste moment passende suggesties</li>
                  <li>Bouw aan duurzame gewoontes voor jezelf op het werk</li>
                </ul>
              </div>

              <Button onClick={goNext} variant="primary" iconRight={pijlRechtsIcon}>
                Start check-in
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="checkInStep">
              <div className="checkInIconWrap">
                <img
                  src={checkinIcon}
                  alt="Stress"
                  aria-hidden="true"
                  className="checkInTopIcon"
                />
              </div>

              <h2>Hoe is je stressniveau?</h2>
              <p className="checkInDescription">
                Schuif de slider naar het niveau dat het best bij je past.
              </p>

              <div className="checkInScaleCard">
                <div className="checkInValue">{stress}</div>
                <div className="checkInValueLabel">{stressLabel}</div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="checkInRange"
                  style={getSliderStyle(stress)}
                />

                <div className="checkInRangeLabels">
                  <span>Geen stress</span>
                  <span>Zeer hoog</span>
                </div>

                <div className="checkInInfoBox">
                  <img src={infoIcon} alt="" aria-hidden="true" />
                  <p>
                    Dit helpt ons om beter te begrijpen wanneer jij extra
                    ondersteuning nodig hebt.
                  </p>
                </div>
              </div>

              <div className="checkInActions">
                <Button variant="secondary" onClick={goBack} iconLeft={pijlLinksIcon}>
                  Terug
                </Button>

                <Button variant="primary" onClick={goNext} iconRight={pijlRechtsIcon}>
                  Volgende
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="checkInStep">
              <div className="checkInIconWrap">
                <img
                  src={energieIcon}
                  alt="Energie"
                  aria-hidden="true"
                  className="checkInTopIcon"
                />
              </div>

              <h2>Hoe is je energieniveau?</h2>
              <p className="checkInDescription">
                Schuif de slider naar het niveau dat nu het beste bij je past.
              </p>

              <div className="checkInScaleCard">
                <div className="checkInValue">{energy}</div>
                <div className="checkInValueLabel">{energyLabel}</div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="checkInRange"
                  style={getSliderStyle(energy)}
                />

                <div className="checkInRangeLabels">
                  <span>Geen energie</span>
                  <span>Zeer hoog</span>
                </div>

                <div className="checkInInfoBox">
                  <img src={infoIcon} alt="" aria-hidden="true" />
                  <p>
                    Je energieniveau helpt om betere pauzesuggesties te geven.
                  </p>
                </div>
              </div>

              <div className="checkInActions">


                <Button variant="secondary" onClick={goBack} iconLeft={pijlLinksIcon}>
                  Terug
                </Button>

                <Button variant="primary" onClick={goNext} iconRight={pijlRechtsIcon}>
                  Volgende
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="checkInStep">
              <div className="checkInIconWrap">
                <img
                  src={notitieIcon}
                  alt="Notitie"
                  aria-hidden="true"
                  className="checkInTopIcon"
                />
              </div>

              <h2>Wil je iets toevoegen?</h2>
              <p className="checkInDescription">
                Optioneel: voeg een korte notitie toe over hoe je je voelt.
              </p>

              {error && <p className="checkInError">{error}</p>}

              <div className="checkInNoteCard">
                <textarea
                  className="checkInTextarea"
                  placeholder="Bijv. Drukke vergadering net achter de rug."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <p className="checkInNoteHint">
                  Dit is optioneel, je notitie helpt bij het begrijpen van je
                  situatie.
                </p>
              </div>

              <div className="checkInActions">
                <Button variant="secondary" onClick={goBack} iconLeft={pijlLinksIcon}>
                  Terug
                </Button>

                <Button variant="secondary" onClick={handleSkip}>
                  Overslaan
                </Button>

                <Button variant="primary" onClick={finishCheckIn} >
                  {loading ? "Opslaan..." : "Afronden"}
                </Button>
                </div>
              </div>
          )}

          {step === 5 && (
            <div className="checkInStep checkInSummaryStep">
              <div className="checkInIconWrap">
                <img
                  src={checkIcon}
                  alt="Check"
                  aria-hidden="true"
                  className="checkInTopIcon"
                />
              </div>

              <h2>Check-in voltooid</h2>
              <p className="checkInDescription">
                Bedankt voor het inchecken. Je data is opgeslagen.
              </p>

              <div className="checkInSummaryCard">
                <h3>Je check-in samenvatting</h3>

                <div className="checkInSummaryGrid">
                  <div className="checkInSummaryItem">
                    <span>Stress</span>
                    <strong>{stress}</strong>
                    <small>{stressLabel}</small>
                  </div>

                  <div className="checkInSummaryItem">
                    <span>Energie</span>
                    <strong>{energy}</strong>
                    <small>{energyLabel}</small>
                  </div>
                </div>

                {note && (
                  <div className="checkInNoteSummary">
                    <span>Notitie</span>
                    <p>{note}</p>
                  </div>
                )}
              </div>

              <div className="checkInActions checkInActionsCenter">
                <Button variant="secondary" to="/dashboard">
                  Naar dashboard
                </Button>

                <Button variant="primary" to="/inzichten">
                  Bekijk inzichten
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

export default CheckInPage;