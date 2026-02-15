// add these types if not already declared
export type EventPayload = {
    id?: number;
    Name: string;
    Description: string;
    Location: string;
    DateTime: string; // ISO
};

// existing EventItem type should already be present
// export type EventItem = { id: number; name: string; ... }

// POST /events
export async function createEvent(apiBase: string | undefined, payload: EventPayload) {
    const base = (import.meta as any).env?.VITE_API_BASE_URL || 'https://eventregistration.duckdns.org';
    const token = localStorage.getItem('token');

    const res = await fetch(`${base}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
        // if you switched to cookie-based auth use:
        // credentials: 'include',
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status} ${res.statusText}`);
    }

    // return created event (if backend returns it)
    try {
        return await res.json();
    } catch {
        return null;
    }
}

export async function getEventById(apiBase: string | undefined, id: number) {
    const base = apiBase || (import.meta as any).env?.VITE_API_BASE_URL || 'https://eventregistration.duckdns.org';
    const res = await fetch(`${base}/events/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    console.log(`GET /events/${id} response:`, res);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function updateEvent(apiBase: string | undefined, id: number, payload: any) {
    const base = apiBase || (import.meta as any).env?.VITE_API_BASE_URL || 'https://eventregistration.duckdns.org';
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}