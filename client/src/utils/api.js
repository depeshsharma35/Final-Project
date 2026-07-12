// IMPORTANT: In production (Vercel), set VITE_API_URL in the Vercel dashboard
// (Project Settings → Environment Variables) to your backend's full URL.
// Example: VITE_API_URL = https://your-backend.vercel.app/api
// Without this, production builds fall back to relative '/api' which only works
// if the frontend and backend are on the same Vercel deployment/domain.
function getBaseUrl() {
  let url = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8000/api');
  url = url.replace(/\/+$/, ''); // remove trailing slash(es)
  if (url && url !== '/api' && !url.endsWith('/api')) {
    url += '/api';
  }
  return url;
}

const BASE_URL = getBaseUrl();

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      credentials: 'include',
      ...options
    });

    // Check if the response is valid and is actually JSON (to prevent parsing Vercel HTML 404/500 error pages)
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      console.warn(`⚠️ Backend API (${endpoint}) returned ${response.status} (${response.statusText || 'Not Found'}). Using local fallback.`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`⚠️ Backend API (${endpoint}) unreachable. Using local fallback.`, error.message);
    return null;
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
