import API_URL from "./api";

const PAUSE_REMINDER_API_URL = `${API_URL}/api/pause-reminders`;

export async function createPauseReminder(reminderData) {
  const token = localStorage.getItem("token");

  const response = await fetch(PAUSE_REMINDER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reminderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Pauzeherinnering opslaan mislukt");
  }

  return data;
}

export async function updatePauseReminder(id, reminderData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${PAUSE_REMINDER_API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reminderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Pauzeherinnering aanpassen mislukt");
  }

  return data;
}

export async function getMyPauseReminders() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${PAUSE_REMINDER_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Pauzeherinneringen ophalen mislukt");
  }

  return data;
}