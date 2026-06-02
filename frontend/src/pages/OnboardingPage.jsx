import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, saveOnboarding } from "../services/authService";
import Button from "../components/base/Button";

import logoGroen from "../assets/logo_groen.svg";
import oogIcon from "../assets/icons_zwart/oog_zwart.svg";
import oogUitIcon from "../assets/icons_zwart/oog_uit_zwart.svg";
import pijlLinks from "../assets/icons_zwart/pijl_links_zwart.svg";
import pijlRechts from "../assets/icons_wit/pijl_rechts_wit.svg";
import checkGroen from "../assets/icons_groen/check_groen.svg";

import "./css/AuthPages.css";
import "./css/OnboardingPage.css";

const totalSteps = 7;

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    workSituation: "",
    workload: "",
    goals: [],
    notificationsEnabled: true,
  });

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleGoal = (goal) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((item) => item !== goal)
        : [...prev.goals, goal],
    }));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const finishOnboarding = async () => {
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      await saveOnboarding({
        workSituation: formData.workSituation,
        workload: formData.workload,
        goals: formData.goals,
        notificationsEnabled: formData.notificationsEnabled,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <main className="authPage onboardingPage">
      <img src={logoGroen} alt="Re:Mind" className="authCornerLogo" />

      {step === 1 && (
        <Link to="/welcome" className="authBackButton">
          <img src={pijlLinks} alt="" className="backIcon"/>
          Terug
        </Link>
      )}

      <section className="onboardingCard">
        {step === 1 && (
          <div className="onboardingIntro">
            <h1>Welkom bij Re:Mind</h1>
            <p>
              Je digitale balanscoach die je helpt om stress te beheren en
              energie te vinden in je werkdag.
            </p>

            <div className="onboardingInfoCard">
              <h2>Hoe werkt het?</h2>

              <ul>
                <li><img src={checkGroen} alt="Check-in" /> Check-ins gedurende de dag om je stress en energie te monitoren</li>
                <li><img src={checkGroen} alt="Pauze" /> Persoonlijke pauzesuggesties op het juiste moment</li>
                <li><img src={checkGroen} alt="Inzichten" /> Wekelijkse inzichten in je werkbalans</li>
                <li><img src={checkGroen} alt="Reflectie" /> Dagafsluiting voor betere reflectie</li>
              </ul>
            </div>

            <div className="onboardingIntroActions"> 
              <Button variant="secondary" to="/login">
                Al een account? <span className="aanmeldBtnLink">Log in</span>
              </Button>

              <Button variant="primary" onClick={nextStep} iconRight={pijlRechts}>
                Laten we beginnen
              </Button>
            </div>
          </div>
        )}

        {step > 1 && step < 7 && (
          <div className="onboardingProgress">
            <div className="onboardingProgressTrack">
              <div
                className="onboardingProgressFill"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>

            <span>
              Stap {step} van {totalSteps}
            </span>
          </div>
        )}

        {step === 2 && (
          <div className="onboardingStep">
            <h1>Maak je account aan</h1>
            <p>Zo kunnen we je ervaring personaliseren en je voortgang bewaren.</p>

            <div className="authForm">
              <label>
                Je naam
                <input
                  type="text"
                  placeholder="bijv. Anna"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  placeholder="bijv. Anna@gmail.com"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </label>

              <label>
                Wachtwoord
                <div className="passwordInputWrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Wachtwoord"
                    value={formData.password}
                    onChange={(event) => updateField("password", event.target.value)}
                  />

                  <button
                    type="button"
                    className="passwordToggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toon wachtwoord"
                  >
                    <img src={showPassword ? oogIcon : oogUitIcon} alt="" />
                  </button>
                </div>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboardingStep">
            <h1>Wat beschrijft jouw werksituatie het beste?</h1>
            <p>Dit helpt ons om passende suggesties te geven.</p>

            <div className="optionList">
              {[
                "Ik werk voornamelijk op kantoor",
                "Ik werk hybride (thuis en kantoor)",
                "Ik werk volledig remote",
                "Anders",
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`optionButton ${
                    formData.workSituation === option ? "active" : ""
                  }`}
                  onClick={() => updateField("workSituation", option)}
                >
                  <span className="optionCheck" />
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="onboardingStep">
            <h1>Hoe ervaar je momenteel je werkdruk?</h1>
            <p>Er is geen goed of fout antwoord - we willen je huidige situatie begrijpen.</p>

            <div className="optionList">
              {[
                "Rustig - Ik voel me goed in balans",
                "Gemiddeld - Soms druk, maar hanteerbaar",
                "Hoog - Ik voel regelmatig veel druk",
                "Zeer hoog - Ik voel me overweldigd",
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`optionButton ${
                    formData.workload === option ? "active" : ""
                  }`}
                  onClick={() => updateField("workload", option)}
                >
                  <span className="optionCheck" />
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="onboardingStep">
            <h1>Wat wil je bereiken met Re:Mind?</h1>
            <p>Selecteer alles wat op jou van toepassing is.</p>

            <div className="optionList">
              {[
                "Stress verminderen",
                "Betere pauzes nemen",
                "Energie beter beheren",
                "Werk-privé balans verbeteren",
                "Meer bewust worden van mijn patronen",
                "Burnout voorkomen",
              ].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  className={`optionButton ${
                    formData.goals.includes(goal) ? "active" : ""
                  }`}
                  onClick={() => toggleGoal(goal)}
                >
                  <span className="optionCheck" />
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="onboardingStep">
            <h1>Mogen we je herinneren aan je check-ins?</h1>
            <p>Vriendelijke notificaties helpen je om je balans bij te houden.</p>

            <div className="optionList notificationOptions">
              <button
                type="button"
                className={`optionButton ${
                  formData.notificationsEnabled ? "active" : ""
                }`}
                onClick={() => updateField("notificationsEnabled", true)}
              >
                <span className="optionCheck" />
                <span>
                  <strong>Ja, stuur me vriendelijke herinneringen</strong>
                  <small>
                    Je ontvangt 3-4 herinneringen per dag om in te checken. Je kunt dit
                    altijd aanpassen in je instellingen.
                  </small>
                </span>
              </button>

              <button
                type="button"
                className={`optionButton ${
                  !formData.notificationsEnabled ? "active" : ""
                }`}
                onClick={() => updateField("notificationsEnabled", false)}
              >
                <span className="optionCheck" />
                <span>
                  <strong>Nee liever niet</strong>
                  <small>
                    Je ontvangt geen meldingen doorheen de dag. Je kunt dit altijd
                    aanpassen in je instellingen.
                  </small>
                </span>
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="onboardingStep onboardingFinish">
            <p className="finishIntro">Je bent klaar, {formData.name || "Naam"}!</p>

            <h1>
              Je kunt nu beginnen met het monitoren van je werkbalans. We sturen
              je je eerste check-in over een paar uur.
            </h1>

            <div className="tipsList">
              <h2>Tips om te starten:</h2>

              <div>
                <h3>1. Check regelmatig in</h3>
                <p> Hoe vaker je incheckt, hoe beter we je kunnen helpen</p>
              </div>

              <div>
                <h3>2. Neem pauzes serieus</h3>
                <p>Ook korte pauzes maken een groot verschil</p>
              </div>

              <div>
                <h3>3. Bekijk je wekelijkse inzichten</h3>
                <p>Leer je patronen kennen en verbeter je balans</p>
              </div>
            </div>

            <Button variant="primary" onClick={finishOnboarding}>
              Naar mijn dashboard
            </Button>
          </div>
        )}

        {step > 1 && step < 7 && (
          <div className="onboardingActions">
            <Button variant="secondary" onClick={previousStep} iconLeft={pijlLinks}>
              Terug
            </Button>

            <Button variant="primary" onClick={nextStep} iconRight={pijlRechts}>
              {step === 6 ? "Afronden" : "Volgende"}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}

export default OnboardingPage;