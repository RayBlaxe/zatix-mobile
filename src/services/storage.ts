import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants';
import { User } from '../types';

class StorageService {
  // Secure storage for sensitive data
  async setSecureItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  }

  async getSecureItem(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  }

  async removeSecureItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }

  // Regular storage for non-sensitive data
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  // Auth token methods
  async setAuthToken(token: string): Promise<void> {
    await this.setSecureItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async getAuthToken(): Promise<string | null> {
    return await this.getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  async removeAuthToken(): Promise<void> {
    await this.removeSecureItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // User data methods
  async setUserData(user: User): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  async getUserData(): Promise<User | null> {
    const userData = await this.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  async removeUserData(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Clear all auth data
  async clearAuthData(): Promise<void> {
    await Promise.all([
      this.removeAuthToken(),
      this.removeUserData(),
    ]);
  }
}

export const storageService = new StorageService();