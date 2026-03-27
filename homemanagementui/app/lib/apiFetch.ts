const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Wrapper around fetch for API calls that:
 * - Adds Accept: application/json so the backend returns 401 instead of redirecting to OAuth
 * - On 401: clears stored auth and redirects to login gracefully
 * - On network error: throws a user-friendly message instead of raw "Failed to fetch"
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers: HeadersInit = {
    "Accept": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  try {
    const response = await fetch(url, {
      credentials: "include",
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("auth_user");
      window.location.href = `${BASE_PATH}/login?reason=session_expired`;
      // Return the response anyway so callers can handle it if needed
      return response;
    }

    return response;
  } catch {
    throw new Error("Unable to connect to the server. Please check your connection and try again.");
  }
}
