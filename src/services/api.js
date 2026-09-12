// Centralized API Service for REGAL Web3 Ecosystem
// Communicates with backend on http://localhost:5001 via Vite /api proxy

const API_BASE = "/api/v1";

const getAuthHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  try {
    const token = localStorage.getItem("regal_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const userStr = localStorage.getItem("regal_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.userId) headers["x-user-id"] = user.userId;
      if (user?.role === "SUPER_ADMIN" || user?.role === "ADMIN") {
        headers["x-admin-key"] = "regal-super-admin-secret-2026";
      }
    }
  } catch (e) {}
  return headers;
};

const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const DIRECT_BACKEND = "http://127.0.0.1:5001/api/v1";

async function doFetch(targetUrl, config) {
  const res = await fetch(targetUrl, config);
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { error: text || `HTTP ${res.status}` };
  }
  return { res, data };
}

async function request(endpoint, options = {}) {
  const proxyUrl = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
  const directUrl = endpoint.startsWith("http") ? endpoint : `${DIRECT_BACKEND}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  };

  try {
    let { res, data } = await doFetch(proxyUrl, config);

    // If local dev returned 502/504 Bad Gateway, retry via direct backend URL
    if (isLocal && (res.status === 502 || res.status === 504 || res.status === 503)) {
      try {
        const direct = await doFetch(directUrl, config);
        if (direct.res.status !== 502 && direct.res.status !== 504) {
          res = direct.res;
          data = direct.data;
        }
      } catch (e) {
        // direct fetch failed, keep proxy response
      }
    }

    if (!res.ok) {
      return { success: false, error: data.error || data.message || `Server error (${res.status})` };
    }
    return data;
  } catch (err) {
    if (isLocal) {
      try {
        const direct = await doFetch(directUrl, config);
        if (direct.res.ok) return direct.data;
        return { success: false, error: direct.data.error || direct.data.message || `Server error (${direct.res.status})` };
      } catch (directErr) {
        console.warn(`[API Error: ${endpoint}]`, err.message);
        return {
          success: false,
          error: "Cannot connect to backend server on port 5001. Please make sure 'npm run server' is running."
        };
      }
    }
    console.warn(`[API Error: ${endpoint}]`, err.message);
    return {
      success: false,
      error: "Unable to communicate with the server. Please check your network and try again."
    };
  }
}

export const api = {
  // Auth
  auth: {
    login: (loginId, password) =>
      request("/auth/login", { method: "POST", body: JSON.stringify({ loginId, password }) }),
    register: (payload) =>
      request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
    demoLogin: () =>
      request("/auth/demo-login", { method: "POST" }),
    getMe: () =>
      request("/auth/me"),
    updateProfile: (data) =>
      request("/auth/profile", { method: "PATCH", body: JSON.stringify(data) })
  },

  // Packages
  packages: {
    getAll: () => request("/packages"),
    getById: (id) => request(`/packages/${id}`),
    update: (id, data) =>
      request(`/packages/${id}`, { method: "PATCH", body: JSON.stringify(data) })
  },

  // Investments
  investments: {
    prepare: (packageId, amount) =>
      request("/investments/prepare", { method: "POST", body: JSON.stringify({ packageId, amount }) }),
    submit: (payload) =>
      request("/investments/submit", { method: "POST", body: JSON.stringify(payload) }),
    getMy: () => request("/investments/my"),
    getAll: () => request("/investments/all"),
    getById: (id) => request(`/investments/${id}`)
  },

  // ROI
  roi: {
    getMyHistory: (status) => request(`/roi/history${status ? `?status=${encodeURIComponent(status)}` : ""}`),
    getAll: () => request("/roi/all", { headers: { "x-admin-key": "regal-super-admin-secret-2026" } }),
    triggerRun: (targetDate) =>
      request("/roi/run", {
        method: "POST",
        headers: { "x-admin-key": "regal-super-admin-secret-2026" },
        body: JSON.stringify({ targetDate })
      })
  },

  // Referrals
  referrals: {
    getMy: () => request("/referrals/my"),
    getAll: () => request("/referrals/all")
  },

  // Wallet
  wallet: {
    getBalances: () => request("/wallet/balances"),
    getNetwork: () => request("/wallet/network")
  },

  // Withdrawals
  withdrawals: {
    requestPayout: (amount, destination) =>
      request("/withdrawals/request", { method: "POST", body: JSON.stringify({ amount, destination }) }),
    getMy: () => request("/withdrawals/my"),
    getAll: () => request("/withdrawals/all"),
    approve: (id) => request(`/withdrawals/${id}/approve`, { method: "POST" }),
    reject: (id, reason) =>
      request(`/withdrawals/${id}/reject`, { method: "POST", body: JSON.stringify({ reason }) })
  },

  // Transactions
  transactions: {
    getMy: (type) => request(`/transactions/my${type && type !== "All" ? `?type=${encodeURIComponent(type)}` : ""}`),
    getAll: (type, search) => {
      const params = new URLSearchParams();
      if (type && type !== "All") params.append("type", type);
      if (search) params.append("search", search);
      const qs = params.toString();
      return request(`/transactions/all${qs ? `?${qs}` : ""}`);
    }
  },

  // Notifications
  notifications: {
    getMy: () => request("/notifications/my"),
    getBroadcasts: () => request("/notifications/broadcasts"),
    markAsRead: (id) => request(`/notifications/${id}/read`, { method: "POST" }),
    markAllRead: () => request("/notifications/read-all", { method: "POST" }),
    broadcast: (payload) =>
      request("/notifications/broadcast", { method: "POST", body: JSON.stringify(payload) })
  },

  // Support
  support: {
    getMyTickets: () => request("/support/tickets"),
    createTicket: (payload) =>
      request("/support/tickets", { method: "POST", body: JSON.stringify(payload) }),
    replyTicket: (ticketId, text, sender) =>
      request(`/support/tickets/${ticketId}/reply`, { method: "POST", body: JSON.stringify({ text, sender }) }),
    getAllTickets: () => request("/support/admin/all")
  },

  // Admin
  admin: {
    getDashboard: () => request("/admin/dashboard"),
    getUsers: (search, status) => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status && status !== "All") params.append("status", status);
      const qs = params.toString();
      return request(`/admin/users${qs ? `?${qs}` : ""}`);
    },
    getUserDetails: (id) => request(`/admin/users/${id}`),
    updateUserStatus: (id, status) =>
      request(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    getAuditLogs: () => request("/admin/audit-logs"),
    getSettings: () => request("/admin/settings"),
    updateSetting: (key, value) =>
      request("/admin/settings", { method: "PATCH", body: JSON.stringify({ key, value }) })
  },

  // Blockchain
  blockchain: {
    getStatus: () => request("/blockchain/status"),
    getContractState: () => request("/blockchain/contract-state"),
    verifyTx: (payload) => request("/blockchain/verify-tx", { method: "POST", body: JSON.stringify(payload) })
  },

  // CMS
  cms: {
    getFaq: (category, search) => {
      const params = new URLSearchParams();
      if (category && category !== "All") params.append("category", category);
      if (search) params.append("search", search);
      const qs = params.toString();
      return request(`/cms/faq${qs ? `?${qs}` : ""}`);
    },
    getRoadmap: () => request("/cms/roadmap"),
    getDocs: () => request("/cms/docs"),
    getToken: () => request("/cms/token"),
    getTokenomics: () => request("/cms/tokenomics"),
    getAll: () => request("/cms/all"),
    save: (payload) =>
      request("/cms/save", { method: "POST", body: JSON.stringify(payload) })
  }
};
