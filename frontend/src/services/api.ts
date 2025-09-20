import { config } from '../config/environment';



const BASE_URL = 'http://localhost:8080/api';

// Make sure your API_BASE_URL is correct

const API_BASE_URL = 'http://localhost:8080/api';

// And ensure all endpoints are properly formatted
class ApiService {
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
    const url = `${BASE_URL}${endpoint}`;
    
    console.log(' Making request to:', url);
    console.log(' Request options:', options);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log(' Response status:', response.status);
    console.log(' Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(' API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log(' Response data:', data);
    return data;
  }

  // HTTP method helpers
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
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

  // Special method for file uploads
  static async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary for FormData
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`File upload failed: ${url}`, error);
      throw error;
    }
  }

  // Auth helpers
  static setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  static clearAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  static getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

}

// Create and export the instance
export const api = new ApiService();
export { ApiService };  // Export the class itself
export default new ApiService();  // Export an instance