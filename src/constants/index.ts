// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.zatix.id/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Development mode - set to false to use real API
  DEV_MODE: false,
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
  primary: '#002547', // HSL(209 100% 14%) - Deep blue
  primaryDark: '#002547', // Darker variant
  primaryLight: '#1e5fa3', // Lighter variant
  secondary: '#E19A3C', // Complementary cyan
  accent: '#f72585', // Accent pink for highlights
  success: '#06d6a0', // Success green
  error: '#ef476f', // Error red
  warning: '#ffd166', // Warning yellow
  info: '#118ab2', // Info blue
  background: '#f8fafc', // Light background
  backgroundDark: '#0a1628', // Dark variant of primary
  surface: '#ffffff', // White surface
  surfaceDark: '#1a2332', // Dark surface
  text: '#003d7a', // Primary color for text
  textSecondary: '#4a6fa5', // Secondary text
  textLight: '#ffffff', // Light text for dark backgrounds
  border: '#e1e8ed', // Light border
  borderDark: '#2d3748', // Dark border
  shadow: 'rgba(0, 61, 122, 0.1)', // Shadow with primary color
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