import { config } from '../config/environment';


// Make sure your API_BASE_URL is correct

class ApiService {
  private static readonly API_BASE_URL = 'http://localhost:8080/api';

  // Build query string from params object
  static buildQueryString(params: Record<string, any>): string {
    const filtered = Object.entries(params).filter(([_, value]) => value !== undefined && value !== null);
    
    if (filtered.length === 0) {
      return '';
    }

    const searchParams = new URLSearchParams();
    filtered.forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    return `?${searchParams.toString()}`;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${ApiService.API_BASE_URL}${endpoint}`;
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(' Making request to:', url);
    console.log(' Request options:', options);
    
    const response = await fetch(url, {
      headers,
      ...options,
    });

    console.log(' Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(' API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log(' Response data:', data);
    return data;
  }

  // Make all methods instance methods for consistency
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export { ApiService };
export const api = apiService;