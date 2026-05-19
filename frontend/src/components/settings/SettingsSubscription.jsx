import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateSubscription } from "../../services/premiumService";
import Button from "../base/Button";
import premiumGroen from "../../assets/icons_groen/premium_groen.svg";
import "./SettingsSubscription.css";

function SettingsSubscription() {
  const { user, login } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const plan = user?.subscriptionPlan || "free";
  const billingCycle = user?.billingCycle || "monthly";

  const isPremium = plan === "premium";

  async function handleCancelSubscription() {
    setSaving(true);

    try {
      const updatedUser = await updateSubscription({
        subscriptionPlan: "free",
        billingCycle: "monthly",
      });

      login(updatedUser);
      setShowCancelModal(false);
    } catch (error) {
      console.error("Abonnement annuleren mislukt:", error);
    } finally {
      setSaving(false);
    }
  }

  if (!isPremium) {
    return (
      <div className="settingsCenterPanel">
        <div className="settingsIconCircle">
          <img src={premiumGroen} alt="" />
        </div>

        <h2>Gratis abonnement</h2>
        <p>
          Upgrade naar premium om maandelijkse inzichten en uitgebreide analyses
          te bekijken.
        </p>

        <Button variant="primary" to="/premium">
          Upgrade naar premium
        </Button>
      </div>
    );
  }

  return (
    <>
      <section className="settingsSubscriptionPanel">
        <div className="settingsSubscriptionTitle">
          <h2>Abonnement</h2>
          <img src={premiumGroen} alt="" />
        </div>

        <article className="subscriptionCard">
          <div className="subscriptionCardHeader">
            <div>
              <h3>Re:Mind Premium</h3>
              <p>Je hebt toegang tot alle premium features</p>
            </div>

            <img src={premiumGroen} alt="" />
          </div>

          <div className="subscriptionRows">
            <div>
              <span>Status</span>
              <strong>Actief</strong>
            </div>

            <div>
              <span>Prijs</span>
              <strong>
                {billingCycle === "yearly" ? "€33/jaar" : "€2,99/maand"}
              </strong>
            </div>

            <div>
              <span>Facturatie</span>
              <strong>
                {billingCycle === "yearly" ? "Jaarlijks" : "Maandelijks"}
              </strong>
            </div>
          </div>
        </article>
        <Button variant="secondary" onClick={() => setShowCancelModal(true)} full>
          Abonnement annuleren
        </Button>
      </section>

      {showCancelModal && (
        <div className="subscriptionModalOverlay">
          <div className="subscriptionModal">
            <h3>Weet je het zeker?</h3>
            <p>
              Je verliest toegang tot alle premium features, inclusief
              wekelijkse en maandelijkse rapporten. Je data blijft wel bewaard.
            </p>

            <div className="subscriptionModalActions">
              <Button
                variant="secondary"
                onClick={() => setShowCancelModal(false)}
                disabled={saving}
              >
                Behouden
              </Button>

              <Button
                variant="danger"
                onClick={handleCancelSubscription}
                disabled={saving}
              >
                {saving ? "Annuleren..." : "Ja, annuleren"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsSubscription;