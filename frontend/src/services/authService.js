const API_URL = "http://localhost:5000/api/auth";

export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registreren mislukt");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Inloggen mislukt");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export async function saveOnboarding(onboardingData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/onboarding`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(onboardingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Onboarding opslaan mislukt");
  }

  localStorage.setItem("user", JSON.stringify(data));

  return data;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}