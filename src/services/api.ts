import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

const BACKEND_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  headers: {
    'Accept': '*/*'
  }
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Unable to connect to the server. Please check if the backend server is running.');
    }
    if (error.response?.status === 0) {
      throw new Error('CORS error: Unable to access the server. Please check if CORS is enabled on the backend.');
    }
    if (error.response?.data && typeof error.response.data === 'object' && 'error' in error.response.data) {
      throw new Error((error.response.data as any).error);
    }
    throw error;
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  bio: string;
  profile_picture_url: string;
  privacy_level: string;
  created_at: string;
  updated_at: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/profile');
    return response.data;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<void> {
    await api.put('/profile', updates);
  },

  async logout(): Promise<void> {
    await api.post('/profile/logout');
  }
};

export const recipeService = {
  async listRecipes(): Promise<any[]> {
    const response = await api.get('/recipes');
    return response.data.recipes;
  },

  async getRecipe(id: string): Promise<any> {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  async createRecipe(recipe: any): Promise<any> {
    const response = await api.post('/recipes', recipe);
    return response.data;
  },

  async updateRecipe(id: string, recipe: any): Promise<any> {
    const response = await api.put(`/recipes/${id}`, recipe);
    return response.data;
  },

  async deleteRecipe(id: string): Promise<void> {
    await api.delete(`/recipes/${id}`);
  },

  async searchRecipes(query: string, filters?: any): Promise<any> {
    const response = await api.get('/recipes', {
      params: { query, ...filters }
    });
    return response.data;
  },

  async generateRecipe(request: { query: string }): Promise<any> {
    const response = await api.post('/llm/query', {
      query: `Generate a recipe: ${request.query}`,
      intent: 'generate_recipe',
      system_message: 'You are a professional chef. Please provide your response in JSON format.'
    });
    return response.data;
  },

  async saveRecipe(recipe: any): Promise<any> {
    const response = await api.post('/recipes', recipe);
    return response.data;
  },

  async favoriteRecipe(id: string): Promise<void> {
    await api.post(`/recipes/${id}/favorite`);
  },

  async unfavoriteRecipe(id: string): Promise<void> {
    await api.delete(`/recipes/${id}/favorite`);
  }
};

export default api;
