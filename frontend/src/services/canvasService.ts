import { ApiService } from './api';  // ✅ Use your existing ApiService

export interface Canvas {
  id: string;                   
  name: string;
  description?: string;
  canvasData?: any;              
  createdTimestamp: string;      
  updatedTimestamp: string;      
}

export interface CreateCanvasRequest {
  name: string;
  description?: string;
  canvasData?: any;              
}

export interface UpdateCanvasRequest {
  name?: string;
  description?: string;
  canvasData?: any;              
}

export const canvasService = {
  // Get all canvases
  getCanvases: async (): Promise<Canvas[]> => {
    return ApiService.get<Canvas[]>('/canvases');  
  },

  // Get a specific canvas
  getCanvas: async (id: string): Promise<Canvas> => {
    return ApiService.get<Canvas>(`/canvases/${id}`);  
  },

  // Create a new canvas
  createCanvas: async (data: CreateCanvasRequest): Promise<Canvas> => {
    return ApiService.post<Canvas>('/canvases', data);  
  },

  // Update a canvas
  updateCanvas: async (id: string, canvas: UpdateCanvasRequest): Promise<Canvas> => {
    return ApiService.put<Canvas>(`/canvases/${id}`, canvas);  
  },

  // Delete a canvas
  deleteCanvas: async (id: string): Promise<void> => {
    return ApiService.delete<void>(`/canvases/${id}`);
  },
};