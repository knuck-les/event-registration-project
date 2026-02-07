export async function signupRequest(apiBase: string, identifier: string, password: string) {
    // By default send identifier as email to match this repo's backend; change to username if needed.
    const res = await fetch(`${apiBase}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status} ${res.statusText}`);
    }

    console.log('Signup successful, response:', res);

    return res.json(); // expected to contain token or raw token
}