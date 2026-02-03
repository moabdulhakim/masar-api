// API client for the Masar backend

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Standard API response types
interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message?: string;
  errors?: unknown;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      credentials: 'include', // Include cookies for auth
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    // Handle 401 - try to refresh token
    if (response.status === 401 && !skipAuth) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry the original request
        const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, config);
        return this.parseResponse<T>(retryResponse);
      }
      // Redirect to login if refresh failed
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw { message: 'Session expired', errors: null };
    }

    return this.parseResponse<T>(response);
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const text = await response.text();

    // Handle empty responses
    if (!text) {
      return null as T;
    }

    const json = JSON.parse(text) as ApiResponse<T>;

    // Handle standard API response format
    if (typeof json === 'object' && json !== null && 'success' in json) {
      if (!json.success) {
        throw {
          message: json.message || 'An error occurred',
          errors: json.errors || null,
        };
      }
      return json.data;
    }

    // Handle non-standard responses (legacy support)
    if (!response.ok) {
      throw {
        message: (json as { message?: string }).message || 'Request failed',
        errors: null,
      };
    }

    return json as T;
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh-tokens`, {
        method: 'POST',
        credentials: 'include',
      });
      const json = await response.json();
      return json.success === true || response.ok;
    } catch {
      return false;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ id: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
  }

  async register(name: string, phone: string, email: string, password: string) {
    return this.request<{ id: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, phone, email, password }),
      skipAuth: true,
    });
  }

  async logout() {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  // Driver endpoints
  async createDriver(data: {
    name: string;
    vehicleType: string;
    phone: string;
    email: string;
    password: string;
    driverLicenseId: string;
  }) {
    return this.request('/drivers', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    });
  }

  // Ride endpoints
  async getRides() {
    return this.request<
      Array<{
        id: string;
        startLocation: { lat: number; lng: number };
        endLocation: { lat: number; lng: number };
        cost: number;
        status: string;
        driver?: { id: string };
      }>
    >('/rides', {
      skipAuth: true,
    });
  }

  async createRide(data: {
    startLocation: { lat: number; lng: number };
    endLocation: { lat: number; lng: number };
    cost: number;
  }) {
    return this.request('/rides', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    });
  }

  async acceptRide(rideId: string) {
    return this.request(`/rides/${rideId}/accept`, {
      method: 'POST',
    });
  }

  // Session endpoints
  async getUserSessions() {
    return this.request<
      Array<{
        id: string;
        userAgent: string;
        ipAddress: string;
        location?: string;
        createdAt: string;
      }>
    >('/sessions/user');
  }

  // Admin endpoints
  async deleteAllUsers() {
    return this.request('/users', {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
