import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, saveOnboarding } from "../services/authService";

import logoGroen from "../assets/logo_groen.svg";
import oogIcon from "../assets/icons_zwart/oog_zwart.svg";
import oogUitIcon from "../assets/icons_zwart/oog_uit_zwart.svg";

import "./AuthPages.css";
import "./OnboardingPage.css";

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

      <section className="onboardingCard">
        {step === 1 && (
          <div className="onboardingIntro">
            <Link to="/welcome" className="authBackButton">
              ← Terug
            </Link>

            <h1>Welkom bij Re:Mind</h1>
            <p>
              Je digitale balanscoach die je helpt om stress te beheren en
              energie te vinden in je werkdag.
            </p>

            <div className="onboardingInfoCard">
              <h2>Hoe werkt het?</h2>

              <ul>
                <li>Check-ins gedurende de dag om je stress en energie te monitoren</li>
                <li>Persoonlijke pauzesuggesties op het juiste moment</li>
                <li>Wekelijkse inzichten in je werkbalans</li>
                <li>Dagafsluiting voor betere reflectie</li>
              </ul>
            </div>

            <button type="button" className="authPrimaryButton" onClick={nextStep}>
              Laten we beginnen →
            </button>

            <Link to="/login" className="authSecondaryButton onboardingLoginButton">
              Al een account? <span>Log in</span>
            </Link>
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
                <span>1.</span>
                <p>
                  <strong>Check regelmatig in</strong>
                  Hoe vaker je incheckt, hoe beter we je kunnen helpen
                </p>
              </div>

              <div>
                <span>2.</span>
                <p>
                  <strong>Neem pauzes serieus</strong>
                  Ook korte pauzes maken een groot verschil
                </p>
              </div>

              <div>
                <span>3.</span>
                <p>
                  <strong>Bekijk je wekelijkse inzichten</strong>
                  Leer je patronen kennen en verbeter je balans
                </p>
              </div>
            </div>

            <button
              type="button"
              className="authPrimaryButton dashboardButton"
              onClick={finishOnboarding}
            >
              Naar mijn dashboard
            </button>
          </div>
        )}

        {step > 1 && step < 7 && (
          <div className="onboardingActions">
            <button type="button" className="authSecondaryButton" onClick={previousStep}>
              ← Terug
            </button>

            <button type="button" className="authPrimaryButton" onClick={nextStep}>
              {step === 6 ? "Afronden" : "Volgende"} →
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default OnboardingPage;