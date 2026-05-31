import API_URL from "./api";

const FOCUS_TASKS_API_URL = `${API_URL}/api/focus-tasks`;

function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getMyFocusTasks() {
    const response = await fetch(`${FOCUS_TASKS_API_URL}/me`, {
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Focus taken ophalen mislukt");
    }

    return data;
}

export async function createFocusTask(taskData) {
    const response = await fetch(FOCUS_TASKS_API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Focus taak toevoegen mislukt");
    }

    return data;
}

export async function updateFocusTask(id, taskData) {
    const response = await fetch(`${FOCUS_TASKS_API_URL}/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Focus taak aanpassen mislukt");
    }

    return data;
}

export async function deleteFocusTask(id) {
    const response = await fetch(`${FOCUS_TASKS_API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Focus taak verwijderen mislukt");
    }

    return data;
}