const AUTH_API_URL = "http://localhost:5000/api/auth";
const BUSINESS_API_URL = "http://localhost:5000/api/business-requests";

export async function updateSubscription(subscriptionData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${AUTH_API_URL}/subscription`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subscriptionData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Abonnement aanpassen mislukt");
  }

  localStorage.setItem("user", JSON.stringify(data));

  return data;
}

export async function createBusinessRequest(formData) {
  const token = localStorage.getItem("token");

  const response = await fetch(BUSINESS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Aanvraag versturen mislukt");
  }

  localStorage.setItem("user", JSON.stringify(data));

  return data;
}