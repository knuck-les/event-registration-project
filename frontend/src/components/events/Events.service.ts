export type EventItem = {
    ID: number;
    Name: string;
    Description: string;
    Location: string;
    DateTime: string; // ISO string stored by backend
    UserID?: number | null;
};

export async function getEvents(apiBase?: string): Promise<EventItem[]> {
    const base = (import.meta as any).env?.VITE_API_BASE_URL || 'http://100.50.152.104:8080';
    const token = localStorage.getItem('token');

    const res = await fetch(`${base}/events`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: token } : {}),
        },
        // include credentials if you switched to cookie-based auth
        // credentials: 'include' as RequestCredentials,
    } as RequestInit);

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function deleteEvent(apiBase: string, id: number) {
    const res = await fetch(`${apiBase}/events/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status} ${res.statusText}`);
    }
}

export async function registerEvent(apiBase: string, id: number) {
    const res = await fetch(`${apiBase}/events/${id}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status} ${res.statusText}`);
    }
}

export async function unRegisterEvent(apiBase: string, id: number) {
    const res = await fetch(`${apiBase}/events/${id}/register`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status} ${res.statusText}`);
    }
}
