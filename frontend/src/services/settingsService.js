const API_URL = "http://localhost:5000/api/auth";

export async function getCurrentUser() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gebruiker ophalen mislukt");
  }

  return data;
}

export async function updateSettings(settingsData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/settings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settingsData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Instellingen opslaan mislukt");
  }

  localStorage.setItem("user", JSON.stringify(data));

  return data;
}

export async function updatePassword(passwordData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Wachtwoord aanpassen mislukt");
  }

  return data;
}

export async function exportMyData() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/export`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Data exporteren mislukt");
  }

  return data;
}

export async function deleteMyData() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/data`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Data verwijderen mislukt");
  }

  return data;
}

export async function deleteMyAccount() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/account`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Account verwijderen mislukt");
  }

  return data;
}