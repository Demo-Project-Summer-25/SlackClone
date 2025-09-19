import { User, UserUpdateRequest } from '../types/user';
import { ApiService } from './api';

export class UserService {
  // GET /api/users/{id}
  static async getUserById(id: string): Promise<User> {
    return ApiService.get<User>(`/users/${id}`);
  }

  // GET /api/users/
  static async getAllUsers(): Promise<User[]> {
    return ApiService.get<User[]>(`users`);
  }

  // PUT /api/users/{id}
  static async updateUser(id: string, updates: UserUpdateRequest): Promise<User> {
    return ApiService.put<User>(`users/${id}`, updates);
  }
}
