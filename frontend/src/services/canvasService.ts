import { apiClient } from './api';

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
  getCanvases: async (): Promise<Canvas[]> => {
    const response = await apiClient.get('/api/canvases');  
    return response.data;
  },
  
  getCanvas: async (id: string): Promise<Canvas> => {        
    const response = await apiClient.get(`/api/canvases/${id}`);
    return response.data;
  },
  
  createCanvas: async (data: CreateCanvasRequest): Promise<Canvas> => {
    const response = await apiClient.post('/api/canvases', data);
    return response.data;
  },
  
  updateCanvas: async (id: string, canvas: UpdateCanvasRequest): Promise<Canvas> => {  
    const response = await apiClient.put(`/api/canvases/${id}`, canvas);
    return response.data;
  },
  
  deleteCanvas: async (id: string): Promise<void> => {       
    await apiClient.delete(`/api/canvases/${id}`);
  }
};