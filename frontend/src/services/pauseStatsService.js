import API_URL from "./api";

const PAUSE_SESSIONS_API_URL = `${API_URL}/api/pause-sessions`;

export async function getMyPauseSessions() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${PAUSE_SESSIONS_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Pauzedata ophalen mislukt");
  }

  return data;
}