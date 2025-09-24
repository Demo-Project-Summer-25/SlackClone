import ApiService, { ApiService as ApiServiceClass } from './api';
// ApiService is your generic HTTP helper (likely wraps fetch/axios).
// It knows how to send GET, POST, PATCH, DELETE requests to your backend
// and parse responses into typed objects.

import {
  BoardCreatePayload,
  CardAssignmentPayload,
  CardCreatePayload,
  CardUpdatePayload,
  ColumnCreatePayload,
  ColumnUpdatePayload,
  KanbanBoard,
} from '../types/kanban';
// Importing TypeScript types that describe the shapes of request bodies (payloads)
// and the KanbanBoard response model. This ensures type safety in service methods.


// The KanbanService is a collection of static methods (no need to instantiate).
// Each method wraps an HTTP request to your backend API endpoints that manage
// boards, columns, and cards in a Kanban system.
export class KanbanService {

  // Fetch a list of boards belonging to a specific owner (user/workspace/etc.)
  static async listBoards(ownerId: string): Promise<KanbanBoard[]> {
    // buildQueryString adds "?ownerId=..." to the URL
    return ApiService.get<KanbanBoard[]>(`/api/boards?ownerId=${ownerId}`);
  }

  // Fetch a single board by its unique ID
  static async getBoard(boardId: string): Promise<KanbanBoard> {
    return ApiService.get<KanbanBoard>(`/api/boards/${boardId}`);
  }

  // Create a new board by sending payload (name, owner, etc.)
  static async createBoard(payload: BoardCreatePayload): Promise<KanbanBoard> {
    return ApiService.post<KanbanBoard>('/api/boards', payload);
  }

  // Delete a board by ID; no return value expected
  static async deleteBoard(boardId: string): Promise<void> {
    await ApiService.delete(`/api/boards/${boardId}`);
  }

  // Add a new column to a specific board
  static async createColumn(boardId: string, payload: ColumnCreatePayload): Promise<KanbanBoard> {
    // Backend responds with the updated KanbanBoard (board including new column)
    return ApiService.post<KanbanBoard>(`/api/boards/${boardId}/columns`, payload);
  }

  // Update an existing column (e.g., rename it, reorder it, etc.)
  static async updateColumn(columnId: string, payload: ColumnUpdatePayload): Promise<KanbanBoard> {
    return ApiService.patch<KanbanBoard>(`/api/columns/${columnId}`, payload);
  }

  // Delete a column by ID; backend responds with the updated board state
  static async deleteColumn(columnId: string): Promise<KanbanBoard> {
    return ApiService.delete<KanbanBoard>(`/api/columns/${columnId}`);
  }

  // Create a new card inside a column
  static async createCard(columnId: string, payload: CardCreatePayload): Promise<KanbanBoard> {
    return ApiService.post<KanbanBoard>(`/api/columns/${columnId}/cards`, payload);
  }

  // Update a card’s details (e.g., title, description, status)
  static async updateCard(cardId: string, payload: CardUpdatePayload): Promise<KanbanBoard> {
    return ApiService.patch<KanbanBoard>(`/api/cards/${cardId}`, payload);
  }

  // Delete a card by ID; backend returns updated board
  static async deleteCard(cardId: string): Promise<KanbanBoard> {
    return ApiService.delete<KanbanBoard>(`/api/cards/${cardId}`);
  }

  // Assign a user to a card (payload likely includes userId)
  static async assignUser(cardId: string, payload: CardAssignmentPayload): Promise<KanbanBoard> {
    return ApiService.post<KanbanBoard>(`/api/cards/${cardId}/assignments`, payload);
  }

  // Remove/unassign a user from a card by userId
  static async unassignUser(cardId: string, userId: string): Promise<KanbanBoard> {
    return ApiService.delete<KanbanBoard>(`/api/cards/${cardId}/assignments/${userId}`);
  }
}

export default KanbanService;
// Exporting the service class as default so other parts of your app
// can import and call KanbanService.listBoards(), createBoard(), etc.
 