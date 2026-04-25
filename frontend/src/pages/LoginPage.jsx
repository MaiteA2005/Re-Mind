import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./AuthPages.css";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Login data:", formData);

    navigate("/dashboard");
  };

  return (
    <main className="authPage">
      <section className="authCard">
        <Link to="/welcome" className="authBackLink">
          ← Terug
        </Link>

        <h1>Inloggen</h1>

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

          <button type="submit" className="authPrimaryButton">
            Naar mijn dashboard
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