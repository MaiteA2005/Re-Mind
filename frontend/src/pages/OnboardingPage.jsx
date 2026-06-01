import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, saveOnboarding } from "../services/authService";

import oogIcon from "../assets/icons_zwart/oog_zwart.svg";
import oogUitIcon from "../assets/icons_zwart/oog_uit_zwart.svg";

import "./AuthPages.css";

const totalSteps = 6;

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
    <main className="authPage">
      <section className="onboardingCard">
        <div className="onboardingTop">
          <Link to="/welcome" className="authBackLink">
            ← Terug
          </Link>

          <span>
            Stap {step} van {totalSteps}
          </span>
        </div>

        {step === 1 && (
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
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="passwordToggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <img
                      src={showPassword ? oogIcon : oogUitIcon}
                      alt="Toon wachtwoord"
                    />
                  </button>
                </div>
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboardingStep">
            <h1>Wat beschrijft jouw werksituatie het beste?</h1>
            <p>Dit helpt ons om passende suggesties te geven.</p>

            <div className="optionList">
              {[
                "Ik werk voornamelijk op kantoor",
                "Ik werk hybride",
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
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboardingStep">
            <h1>Hoe ervaar je momenteel je werkdruk?</h1>
            <p>Er is geen goed of fout antwoord.</p>

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
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="onboardingStep">
            <h1>Wat wil je bereiken met Re:Mind?</h1>
            <p>Selecteer alles wat op jou van toepassing is.</p>

            <div className="optionGrid">
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
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="onboardingStep">
            <h1>Mogen we je herinneren aan je check-ins?</h1>
            <p>Vriendelijke notificaties helpen je om je balans bij te houden.</p>

            <div className="optionList">
              <button
                type="button"
                className={`optionButton ${
                  formData.notificationsEnabled ? "active" : ""
                }`}
                onClick={() => updateField("notificationsEnabled", true)}
              >
                Ja, stuur me vriendelijke herinneringen
              </button>

              <button
                type="button"
                className={`optionButton ${
                  !formData.notificationsEnabled ? "active" : ""
                }`}
                onClick={() => updateField("notificationsEnabled", false)}
              >
                Nee liever niet
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="onboardingStep center">
            <h1>Je bent klaar, {formData.name || "gebruiker"}!</h1>
            <p>
              Je kunt nu beginnen met het monitoren van je werkbalans.
            </p>

            <div className="tipsList">
              <p>Check regelmatig in</p>
              <p>Neem pauzes serieus</p>
              <p>Bekijk je wekelijkse inzichten</p>
            </div>
          </div>
        )}

        <div className="onboardingActions">
          {step > 1 && (
            <button type="button" className="authSecondaryButton" onClick={previousStep}>
              Terug
            </button>
          )}

          {step < totalSteps ? (
            <button type="button" className="authPrimaryButton" onClick={nextStep}>
              Volgende
            </button>
          ) : (
            <button
              type="button"
              className="authPrimaryButton"
              onClick={finishOnboarding}
            >
              Naar mijn dashboard
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

export default OnboardingPage;