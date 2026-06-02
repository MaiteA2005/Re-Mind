import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import Button from "../components/base/Button";

import logoGroen from "../assets/logo_groen.svg";
import oogIcon from "../assets/icons_zwart/oog_zwart.svg";
import oogUitIcon from "../assets/icons_zwart/oog_uit_zwart.svg";
import pijlLinks from "../assets/icons_zwart/pijl_links_zwart.svg";
import pijlRechts from "../assets/icons_zwart/pijl_rechts_zwart.svg";

import "./AuthPages.css";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);
      login(data.user);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="authPage loginPage">
      <img src={logoGroen} alt="Re:Mind" className="authCornerLogo" />

      <Link to="/welcome" className="authBackButton">
        <img src={pijlLinks} alt="" className="backIcon" />
        Terug
      </Link>

      <section className="authCard loginCard">
        <h1>Inloggen</h1>

        {error && <p className="authError">{error}</p>}

        <form className="authForm" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="bijv. Anna@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Wachtwoord
            <div className="passwordInputWrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Wachtwoord"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="passwordToggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"
                }
              >
                <img src={showPassword ? oogIcon : oogUitIcon} alt="" />
              </button>
            </div>
          </label>
        </form>

        <div className="loginActions"> 
          <Button variant="secondary" to="/onboarding">
            Nog geen account? <span className="loginBtnLink"> Meld je aan </span>
          </Button>

          <Button variant="primary" disabled={loading} onClick={handleSubmit}>
            {loading ? "Bezig..." : "Naar mijn dashboard"}
          </Button>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;