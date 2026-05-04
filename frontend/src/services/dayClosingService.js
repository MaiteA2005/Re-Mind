const API_URL = "https://re-mind-dnch.onrender.com/api/day-closings";

export async function createDayClosing(dayClosingData) {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
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

  const response = await fetch(`${API_URL}/me`, {
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

  const response = await fetch(`${API_URL}/tomorrow-focus`, {
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

export async function completeTomorrowFocus(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/${id}/focus-complete`, {
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