import ApiService from './api';  // ✅ Import the instance, not the class

// Fix the interface to match your backend CanvasDto
export interface Canvas {
  id: string;                   
  title: string;               // ✅ Change 'name' to 'title' to match backend
  description?: string;
  canvasData?: any;              
  createdTimestamp: string;      
  updatedTimestamp: string;      
}

export interface CreateCanvasRequest {
  title: string;               // ✅ Change 'name' to 'title'
  description?: string;
  canvasData?: any;              
}

export interface UpdateCanvasRequest {
  title?: string;              // ✅ Change 'name' to 'title'
  description?: string;
  canvasData?: any;              
}

export const canvasService = {
  // Get all canvases
  getCanvases: async (): Promise<Canvas[]> => {
    return ApiService.get<Canvas[]>('/canvases');  // ✅ Remove /api prefix
  },

  // Get a specific canvas
  getCanvas: async (id: string): Promise<Canvas> => {
    return ApiService.get<Canvas>(`/canvases/${id}`);  
  },

  // Create a new canvas
  createCanvas: async (data: CreateCanvasRequest, userId: string): Promise<Canvas> => {
    // ✅ Add userId parameter that backend expects
    return ApiService.post<Canvas>(`/canvases?createdByUserId=${userId}`, data);  
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