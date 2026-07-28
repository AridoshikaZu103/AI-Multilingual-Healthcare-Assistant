import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout for AI responses
});

// ── Chat API ─────────────────────────────────────────

export const sendChatMessage = async (message, language = 'en', sessionId = null) => {
  const response = await api.post('/chat', {
    message,
    language,
    session_id: sessionId,
  });
  return response.data;
};

export const getChatHistory = async (sessionId, limit = 50) => {
  const response = await api.get('/chat/history', {
    params: { session_id: sessionId, limit },
  });
  return response.data;
};

// ── Healthcare Schemes API ───────────────────────────

export const getSchemes = async (params = {}) => {
  const response = await api.get('/schemes', { params });
  return response.data;
};

export const getSchemeById = async (id) => {
  const response = await api.get(`/schemes/${id}`);
  return response.data;
};

// ── Healthcare Facilities API ────────────────────────

export const getFacilities = async (params = {}) => {
  const response = await api.get('/facilities', { params });
  return response.data;
};

export const getFacilityById = async (id) => {
  const response = await api.get(`/facilities/${id}`);
  return response.data;
};

// ── Languages API ────────────────────────────────────

export const getLanguages = async () => {
  const response = await api.get('/languages');
  return response.data;
};

// ── FAQs API ─────────────────────────────────────────

export const getFAQs = async (language = 'en', category = null) => {
  const params = { language };
  if (category) params.category = category;
  const response = await api.get('/faqs', { params });
  return response.data;
};

// ── Health Check ─────────────────────────────────────

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
