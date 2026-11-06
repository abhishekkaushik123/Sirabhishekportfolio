// Every admin request goes through here. "/api" is passed on to the server by Vite.
export async function api(path, { method = "GET", body } = {}) {
  const response = await fetch(`/api${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body && JSON.stringify(body),
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.error ?? `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}