const API_URL = "http://localhost:5000/api/pause-sessions";

export async function getMyPauseSessions() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/me`, {
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