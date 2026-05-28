import API_URL from "./api";

const FAVORITE_PAUSE_API_URL = `${API_URL}/api/favorite-pauses`;

function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getFavoritePauses() {
    const response = await fetch(FAVORITE_PAUSE_API_URL, {
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Favorieten ophalen mislukt");
    }

    return data;
}

export async function addFavoritePause(pauseId) {
    const response = await fetch(`${FAVORITE_PAUSE_API_URL}/${pauseId}`, {
        method: "POST",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Favoriet toevoegen mislukt");
    }

    return data;
}

export async function removeFavoritePause(pauseId) {
    const response = await fetch(`${FAVORITE_PAUSE_API_URL}/${pauseId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Favoriet verwijderen mislukt");
    }

    return data;
}