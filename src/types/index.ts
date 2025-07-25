// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: 'Bearer';
    user: User;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

// Validation Types
export interface ValidationRequest {
  ticket_code: string;
}

export interface ValidationResponse {
  success: boolean;
  message: string;
  data: {
    ticket_code: string;
    event_id: number;
    event_name: string;
    validated_at: string;
    validated_by: {
      id: number;
      name: string;
    };
  };
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainStackParamList = {
  Scanner: undefined;
  ManualEntry: undefined;
  ValidationResult: { result: ValidationResponse };
  Settings: undefined;
};

// App State Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

export interface ValidationState {
  isScanning: boolean;
  hasPermission: boolean;
  flashEnabled: boolean;
  scannedCodes: string[];
  validationHistory: ValidationResponse[];
}

// Queue Types
export interface QueueItem {
  id: string;
  ticketCode: string;
  timestamp: number;
  attempts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}