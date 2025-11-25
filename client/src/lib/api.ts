import { type Doctor, type InsertAppointment, type Appointment } from "@shared/schema";

// API Configuration
const API_BASE = "/api";

// Helper to get auth token based on endpoint
function getAuthToken(endpoint: string): string | null {
  // Admin endpoints require admin token
  if (endpoint.includes("/admin/")) {
    return localStorage.getItem("admin_token") || localStorage.getItem("staff_token");
  }
  // Auth and staff endpoints use their respective tokens
  if (endpoint.includes("/staff/")) {
    return localStorage.getItem("staff_token");
  }
  // Default: try staff first, then admin
  return localStorage.getItem("staff_token") || localStorage.getItem("admin_token");
}

// Helper to make API calls with automatic token attachment
async function apiCall(
  endpoint: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<Response> {
  const { skipAuth = false, ...fetchOptions } = options;
  
  const headers = new Headers(fetchOptions.headers || {});

  // Add content-type if not already set and there's a body
  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  // Add authorization token if not skipped
  if (!skipAuth) {
    const token = getAuthToken(endpoint);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const url = `${API_BASE}${endpoint}`;
  return fetch(url, { ...fetchOptions, headers });
}

// Main API object with convenience methods
export const api = {
  get: (endpoint: string, options?: RequestInit & { skipAuth?: boolean }) =>
    apiCall(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, body?: any, options?: RequestInit & { skipAuth?: boolean }) =>
    apiCall(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),

  put: (endpoint: string, body?: any, options?: RequestInit & { skipAuth?: boolean }) =>
    apiCall(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),

  delete: (endpoint: string, options?: RequestInit & { skipAuth?: boolean }) =>
    apiCall(endpoint, { ...options, method: "DELETE" }),
};

// Legacy convenience functions
export async function fetchDoctors(): Promise<Doctor[]> {
  const response = await api.get("/doctors", { skipAuth: true });
  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }
  return response.json();
}

export async function checkSlotAvailability(
  doctorId: string,
  date: string,
  timeSlot: string
): Promise<boolean> {
  const params = new URLSearchParams({ doctorId, date, timeSlot });
  const response = await api.get(`/appointments/check-availability?${params}`, { skipAuth: true });
  if (!response.ok) {
    throw new Error("Failed to check availability");
  }
  const data = await response.json();
  return data.available;
}

export async function createAppointment(
  appointment: InsertAppointment
): Promise<Appointment> {
  const response = await api.post("/appointments", appointment, { skipAuth: true });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create appointment");
  }

  return response.json();
}

export async function getBookedSlots(doctorId: string): Promise<Set<string>> {
  const response = await api.get(`/appointments/doctor/${doctorId}`, { skipAuth: true });
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }
  const appointments: Appointment[] = await response.json();
  
  const bookedSlots = new Set<string>();
  appointments.forEach(apt => {
    bookedSlots.add(`${apt.appointmentDate}-${apt.timeSlot}`);
  });
  
  return bookedSlots;
}
