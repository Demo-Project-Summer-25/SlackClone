import { User, UserUpdateRequest } from '../types/user';
import { api } from './api';  // Use named import since we also export named

export const userService = {
  // GET /api/users/{id}
  async getUserById(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
  },

  // GET /api/users/
  async getAllUsers(): Promise<User[]> {
    return api.get<User[]>('/users');
  },

  // PUT /api/users/{id}
  async updateUser(id: string, updates: UserUpdateRequest): Promise<User> {
    return api.put<User>(`/users/${id}`, updates);
  },

  // DELETE /api/users/{id}
  async deleteUser(id: string): Promise<void> {
    return api.delete<void>(`/users/${id}`);
  }
};