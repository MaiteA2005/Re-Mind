import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import "./AuthPages.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <main className="authPage">
      <section className="authCard">
        <Link to="/welcome" className="authBackLink">
          ← Terug
        </Link>

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
            <input
              type="password"
              name="password"
              placeholder="Wachtwoord"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="authPrimaryButton" disabled={loading}>
            {loading ? "Bezig..." : "Naar mijn dashboard"}
          </button>
        </form>

        <Link to="/onboarding" className="authTextLink">
          Nog geen account? Meld je aan
        </Link>
      </section>
    </main>
  );
}

export default LoginPage;