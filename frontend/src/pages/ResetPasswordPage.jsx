import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API_URL from "../services/api";

import oogIcon from "../assets/icons_zwart/oog_zwart.svg";
import oogUitIcon from "../assets/icons_zwart/oog_uit_zwart.svg";

import "./AuthPages.css";

function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (password !== confirmPassword) {
        setError("Wachtwoorden komen niet overeen");
        return;
        }

        setLoading(true);

        try {
        const response = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Wachtwoord aanpassen mislukt");
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
            <h1>Stel een nieuw wachtwoord in</h1>
            <p>
                Vul je nieuwe wachtwoord in. Daarna kan je opnieuw inloggen met je
                nieuwe gegevens.
            </p>

            {error && <p className="authError">{error}</p>}

            <form className="authResetForm" onSubmit={handleSubmit}>
                <label>
                Nieuw wachtwoord
                <div className="passwordInputWrapper">
                    <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nieuw wachtwoord"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    />

                    <button
                    type="button"
                    className="passwordToggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    >
                    <img src={showPassword ? oogIcon : oogUitIcon} alt="" />
                    </button>
                </div>
                </label>

                <label>
                Bevestig wachtwoord
                <div className="passwordInputWrapper">
                    <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Bevestig wachtwoord"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    />

                    <button
                    type="button"
                    className="passwordToggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                    <img src={showConfirmPassword ? oogIcon : oogUitIcon} alt="" />
                    </button>
                </div>
                </label>

                <button type="submit" className="authPrimaryButton" disabled={loading}>
                {loading ? "Opslaan..." : "Wachtwoord opslaan"}
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
            <div className="authModal authModalCenter">
                <h2>Gelukt!</h2>
                <p>Je wachtwoord is succesvol aangepast.</p>

                <button
                type="button"
                className="authPrimaryButton"
                onClick={() => navigate("/login")}
                >
                Ga naar inloggen
                </button>
            </div>
            </div>
        )}
        </main>
    );
}

export default ResetPasswordPage;