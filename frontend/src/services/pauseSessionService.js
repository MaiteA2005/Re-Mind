const API_URL = "http://localhost:5000/api/pause-sessions";

export async function savePauseSession(pause) {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      pauseSlug: pause.slug,
      pauseTitle: pause.title,
      duration: pause.duration,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Pauzesessie opslaan mislukt");
  }

  return data;
}