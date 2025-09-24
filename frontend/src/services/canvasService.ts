import { apiService } from './api';  

// Fix the interface to match your backend CanvasDto
export interface Canvas {
  id: string;                   
  title: string;               
  description?: string;
  canvasData?: any;              
  createdTimestamp: string;      
  updatedTimestamp: string;      
}

export interface CreateCanvasRequest {
  title: string;               
  description?: string;
  canvasData?: any;              
}

export interface UpdateCanvasRequest {
  title?: string;             
  canvasData?: any;              
}

export const canvasService = {
  // Get all canvases
  getCanvases: async (): Promise<Canvas[]> => {
    return apiService.get<Canvas[]>('/api/canvases');  
  },

  // Get a specific canvas
  getCanvas: async (id: string): Promise<Canvas> => {
    return apiService.get<Canvas>(`/api/canvases/${id}`);  
  },

  // Create a new canvas
  createCanvas: async (data: CreateCanvasRequest, userId: string): Promise<Canvas> => {
   
    return apiService.post<Canvas>(`/api/canvases?createdByUserId=${userId}`, data);  
  },

  // Update a canvas
  updateCanvas: async (id: string, canvas: UpdateCanvasRequest): Promise<Canvas> => {
    return apiService.put<Canvas>(`/api/canvases/${id}`, canvas);  
  },

  // Delete a canvas
  deleteCanvas: async (id: string): Promise<void> => {
    return apiService.delete<void>(`/api/canvases/${id}`);
  },
};