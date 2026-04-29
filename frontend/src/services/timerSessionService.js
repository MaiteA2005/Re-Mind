const API_URL = "http://localhost:5000/api/timer-sessions";

export async function createTimerSession(timerData) {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(timerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Timersessie opslaan mislukt");
  }

  return data;
}

export async function getMyTimerSessions() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Timersessies ophalen mislukt");
  }

  return data;
}