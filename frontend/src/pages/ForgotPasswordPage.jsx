import { useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../services/api";
import "./AuthPages.css";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
        const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || data.message || "Resetlink versturen mislukt"
            );
        }

        setShowModal(true);
        } catch (error) {
        setError(error.message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <main className="authPage authPagePlain">
        <section className="authResetFlow">
            <div className="authLogoText">Re:Mind</div>

            <div className="authResetContent">
            <h1>Wachtwoord vergeten?</h1>
            <p>
                Geen zorgen. Vul je e-mailadres in en we sturen je een link om je
                wachtwoord opnieuw in te stellen.
            </p>

            {error && <p className="authError">{error}</p>}

            <form className="authResetForm" onSubmit={handleSubmit}>
                <label>
                Email
                <input
                    type="email"
                    placeholder="bijv. Anna@gmail.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                </label>

                <button type="submit" className="authPrimaryButton" disabled={loading}>
                {loading ? "Versturen..." : "Stuur reset link"}
                </button>

                <Link to="/login" className="authSmallBackLink">
                ← Terug naar inloggen
                </Link>
            </form>
            </div>

            <div className="authBackgroundSwirl" />
        </section>

        {showModal && (
            <div className="authModalOverlay">
            <div className="authModal">
                <h2>Check je inbox</h2>
                <p>
                We hebben een e-mail gestuurd naar {email} met een link om je
                wachtwoord opnieuw in te stellen.
                </p>

                <div className="authModalActions">
                <button
                    type="button"
                    className="authSecondaryButton"
                    onClick={() => setShowModal(false)}
                >
                    Probeer opnieuw
                </button>

                <Link to="/login" className="authPrimaryButton">
                    Wachtwoord wijzigen
                </Link>
                </div>
            </div>
            </div>
        )}
        </main>
    );
}

export default ForgotPasswordPage;