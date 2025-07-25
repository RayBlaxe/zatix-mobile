import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from '../constants';
import { LoginRequest, LoginResponse, ValidationRequest, ValidationResponse } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.clearStoredToken();
        }
        return Promise.reject(error);
      }
    );
  }

  private async getStoredToken(): Promise<string | null> {
    const { storageService } = await import('./storage');
    return await storageService.getAuthToken();
  }

  private async clearStoredToken(): Promise<void> {
    const { storageService } = await import('./storage');
    await storageService.removeAuthToken();
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/login', credentials);
    return response.data;
  }

  async validateTicket(request: ValidationRequest): Promise<ValidationResponse> {
    const response: AxiosResponse<ValidationResponse> = await this.api.post('/e-tickets/validate', request);
    return response.data;
  }

  setAuthToken(token: string): void {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken(): void {
    delete this.api.defaults.headers.common['Authorization'];
  }
}

export const apiService = new ApiService();