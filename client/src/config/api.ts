// API Configuration
// Change this URL when deploying to production
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to build API endpoints
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  SUMMARY: {
    GET_ALL: buildApiUrl('/summary'),
    UPLOAD: buildApiUrl('/summary/upload'),
    UPDATE: buildApiUrl('/summary/update'),
    DELETE: (id: string) => buildApiUrl(`/summary/delete/${id}`),
    SHARE: buildApiUrl('/summary/share'),
  },
};
