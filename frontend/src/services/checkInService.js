const API_URL = "http://localhost:5000/api/check-ins";

export async function createCheckIn(checkInData) {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(checkInData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Check-in opslaan mislukt");
  }

  return data;
}

export async function getMyCheckIns() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Check-ins ophalen mislukt");
  }

  return data;
}