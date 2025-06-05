import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

const BACKEND_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Unable to connect to the server. Please check if the backend server is running.');
    }
    if (error.response?.status === 0) {
      throw new Error('CORS error: Unable to access the server. Please check if CORS is enabled on the backend.');
    }
    if (error.response?.data && typeof error.response.data === 'object' && 'error' in error.response.data) {
      throw new Error((error.response.data as any).error);
    }
    return Promise.reject(error);
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
  username: string;
  dietary_preferences: string[];
  allergies: string[];
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

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  user_id: string;
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
  async listRecipes(): Promise<Recipe[]> {
    const response = await api.get<Recipe[]>('/recipes');
    return response.data;
  },

  async getRecipe(id: string): Promise<Recipe> {
    const response = await api.get<Recipe>(`/recipes/${id}`);
    return response.data;
  },

  async createRecipe(recipe: Omit<Recipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Recipe> {
    const response = await api.post<Recipe>('/recipes', recipe);
    return response.data;
  },

  async updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
    const response = await api.put<Recipe>(`/recipes/${id}`, recipe);
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

  async generateRecipe(query: string): Promise<Recipe> {
    const response = await api.post<Recipe>('/llm/query', { 
      query: query,
      intent: 'generate'
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
