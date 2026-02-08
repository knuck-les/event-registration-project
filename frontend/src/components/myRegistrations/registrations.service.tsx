export async function getMyRegistrations(apiBase: string) {
    const res = await fetch(`${apiBase}/my-registrations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status} ${res.statusText}`);
    }

    console.log('GET /my-registrations response:', res);
    return res.json();
}