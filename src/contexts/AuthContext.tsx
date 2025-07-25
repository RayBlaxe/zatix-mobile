import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { AuthState, User, LoginRequest } from '../types';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      console.log('AuthContext: Attempting login with API:', {
        baseURL: 'https://api.zatix.id/api',
        endpoint: '/login'
      });
      
      const response = await apiService.login(credentials);
      
      console.log('AuthContext: Login response received:', {
        success: response.success,
        hasToken: !!response.data?.access_token,
        hasUser: !!response.data?.user
      });
      
      if (response.success) {
        const { access_token, user } = response.data;
        
        // Store auth data
        await storageService.setAuthToken(access_token);
        await storageService.setUserData(user);
        
        // Set API token
        apiService.setAuthToken(access_token);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token: access_token },
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('AuthContext: Login error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      
      dispatch({ type: 'AUTH_FAILURE' });
      
      // Re-throw with more specific error information
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        if (status === 401) {
          throw new Error('Invalid email or password');
        } else if (status === 404) {
          throw new Error('Login service not found');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later');
        } else {
          throw new Error(error.response.data?.message || `Server error (${status})`);
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error. Please check your internet connection');
      } else {
        // Something else happened
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      // Clear stored data
      await storageService.clearAuthData();
      
      // Clear API token
      apiService.clearAuthToken();
      
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [token, user] = await Promise.all([
        storageService.getAuthToken(),
        storageService.getUserData(),
      ]);
      
      if (token && user) {
        apiService.setAuthToken(token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      dispatch({ type: 'AUTH_FAILURE' });
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}