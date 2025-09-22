import { User, UserUpdateRequest } from '../types/user';
import { apiService } from '../services/api'; // ✅ Changed from apiService to ApiService

export const userService = {
  // GET /api/users/{id}
  async getUserById(id: string): Promise<User> {
    return apiService.get<User>(`/users/${id}`); // ✅ Changed to ApiService
  },

  // GET /api/users/
  async getAllUsers(): Promise<User[]> {
    return apiService.get<User[]>('/users'); // ✅ Changed to ApiService
  },

  // PUT /api/users/{id}
  async updateUser(id: string, updates: UserUpdateRequest): Promise<User> {
    return apiService.put<User>(`/users/${id}`, updates); // ✅ Changed to ApiService
  },

  // DELETE /api/users/{id}
  async deleteUser(id: string): Promise<void> {
    return apiService.delete<void>(`/users/${id}`); // ✅ Changed to ApiService
  }
};