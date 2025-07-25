// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.zatix.id',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Test Credentials
export const TEST_CREDENTIALS = {
  email: 'crew.keren@zatix.id',
  password: 'password123',
};

// App Constants
export const APP_CONFIG = {
  name: 'ZaTix Crew',
  version: '1.0.0',
  supportedFormats: ['QR_CODE', 'CODE_128', 'CODE_39'],
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'zatix_auth_token',
  USER_DATA: 'zatix_user_data',
  VALIDATION_QUEUE: 'zatix_validation_queue',
  APP_SETTINGS: 'zatix_app_settings',
};

// Color Palette
export const COLORS = {
  primary: '#1e40af',
  primaryDark: '#1e3a8a',
  secondary: '#f59e0b',
  success: '#16a34a',
  error: '#dc2626',
  warning: '#f59e0b',
  info: '#0ea5e9',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography
export const TYPOGRAPHY = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};