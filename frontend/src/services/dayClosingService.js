import API_URL from "./api";

const DAY_CLOSINGS_API_URL = `${API_URL}/api/day-closings`;

export async function createDayClosing(dayClosingData) {
  const token = localStorage.getItem("token");

  const response = await fetch(DAY_CLOSINGS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dayClosingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Dagafsluiting opslaan mislukt");
  }

  return data;
}

export async function getMyDayClosings() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${DAY_CLOSINGS_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Dagafsluitingen ophalen mislukt");
  }

  return data;
}

export async function getTomorrowFocus() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${DAY_CLOSINGS_API_URL}/tomorrow-focus`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Focus ophalen mislukt");
  }

  return data;
}

export async function getRecentDayClosings() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/day-closings/recent`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Recente dagafsluitingen ophalen mislukt");
  }

  return data;
}

export async function completeTomorrowFocus(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${DAY_CLOSINGS_API_URL}/${id}/focus-complete`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Focus voltooien mislukt");
  }

  return data;
}