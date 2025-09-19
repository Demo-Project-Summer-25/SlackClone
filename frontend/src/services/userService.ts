import { User, UserUpdateRequest } from '../types/user';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class UserService {
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('authToken');
    
    return fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });
  }

  // GET /api/users/{id}
  async getUserById(id: string): Promise<User> {
    const response = await this.fetchWithAuth(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    
    return response.json();
  }

  // GET /api/users/
  async getAllUsers(): Promise<User[]> {
    const response = await this.fetchWithAuth('/api/users');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    
    return response.json();
  }

  // PUT /api/users/{id}
  async updateUser(id: string, request: UserUpdateRequest): Promise<User> {
    const response = await this.fetchWithAuth(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }
    
    return response.json();
  }
}

export const userService = new UserService();