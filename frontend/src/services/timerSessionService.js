import API_URL from "./api";

const TIMER_SESSIONS_API_URL = `${API_URL}/api/timer-sessions`;

export async function createTimerSession(timerData) {
  const token = localStorage.getItem("token");

  const response = await fetch(TIMER_SESSIONS_API_URL, {
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

  const response = await fetch(`${TIMER_SESSIONS_API_URL}/me`, {
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