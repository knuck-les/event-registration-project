export async function loginRequest(apiBase: string, identifier: string, password: string) {
  // By default send identifier as email to match this repo's backend; change to username if needed.
  const res = await fetch(`${apiBase}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: identifier, password }),
    credentials: 'include', // important to include cookies in the request
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `${res.status} ${res.statusText}`);
  }
  console.log('Login successful, response:', res);
  return res.json(); // expected to contain token or raw token
}