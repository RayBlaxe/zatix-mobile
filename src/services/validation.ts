import { apiService } from './api';
import { storageService } from './storage';
import { ValidationRequest, ValidationResponse, TicketValidation } from '../types';

export interface ValidationQueueItem {
  id: string;
  ticketCode: string;
  timestamp: number;
  attempts: number;
  status: 'pending' | 'success' | 'failed';
  result?: TicketValidation;
  error?: string;
}

class ValidationService {
  private offlineQueue: ValidationQueueItem[] = [];
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly QUEUE_STORAGE_KEY = 'validation_queue';

  constructor() {
    this.loadOfflineQueue();
  }

  async validateTicket(ticketCode: string): Promise<TicketValidation> {
    try {
      const request: ValidationRequest = { ticket_code: ticketCode };
      const response: ValidationResponse = await apiService.validateTicket(request);
      
      if (response.success) {
        // Store successful validation for statistics
        await this.storeValidationResult(ticketCode, response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Validation failed');
      }
    } catch (error: any) {
      // Add to offline queue if network error
      if (this.isNetworkError(error)) {
        await this.addToOfflineQueue(ticketCode);
        throw new Error('Network unavailable. Added to offline queue.');
      }
      throw error;
    }
  }

  async addToOfflineQueue(ticketCode: string): Promise<void> {
    const queueItem: ValidationQueueItem = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ticketCode,
      timestamp: Date.now(),
      attempts: 0,
      status: 'pending',
    };

    this.offlineQueue.push(queueItem);
    await this.saveOfflineQueue();
  }

  async processOfflineQueue(): Promise<void> {
    const pendingItems = this.offlineQueue.filter(item => 
      item.status === 'pending' && item.attempts < this.MAX_RETRY_ATTEMPTS
    );

    for (const item of pendingItems) {
      try {
        item.attempts++;
        const result = await this.validateTicket(item.ticketCode);
        
        // Update item as successful
        item.status = 'success';
        item.result = result;
        
        await this.saveOfflineQueue();
      } catch (error: any) {
        if (item.attempts >= this.MAX_RETRY_ATTEMPTS) {
          item.status = 'failed';
          item.error = error.message;
        }
        await this.saveOfflineQueue();
      }
    }
  }

  getOfflineQueueStats(): { pending: number; failed: number; total: number } {
    return {
      pending: this.offlineQueue.filter(item => item.status === 'pending').length,
      failed: this.offlineQueue.filter(item => item.status === 'failed').length,
      total: this.offlineQueue.length,
    };
  }

  async clearOfflineQueue(): Promise<void> {
    this.offlineQueue = [];
    await storageService.removeItem(this.QUEUE_STORAGE_KEY);
  }

  async getValidationHistory(): Promise<TicketValidation[]> {
    try {
      const historyData = await storageService.getItem('validation_history');
      return historyData ? JSON.parse(historyData) : [];
    } catch (error) {
      console.error('Error loading validation history:', error);
      return [];
    }
  }

  async getValidationStats(): Promise<{
    totalValidations: number;
    successfulValidations: number;
    failedValidations: number;
    todayValidations: number;
  }> {
    try {
      const history = await this.getValidationHistory();
      const today = new Date().toDateString();
      
      const todayValidations = history.filter(item => {
        const itemDate = new Date(item.validated_at || 0).toDateString();
        return itemDate === today;
      }).length;

      return {
        totalValidations: history.length,
        successfulValidations: history.filter(item => item.status === 'valid').length,
        failedValidations: history.filter(item => item.status === 'invalid').length,
        todayValidations,
      };
    } catch (error) {
      console.error('Error calculating validation stats:', error);
      return {
        totalValidations: 0,
        successfulValidations: 0,
        failedValidations: 0,
        todayValidations: 0,
      };
    }
  }

  private async storeValidationResult(ticketCode: string, result: TicketValidation): Promise<void> {
    try {
      const history = await this.getValidationHistory();
      const newEntry = {
        ...result,
        ticket_code: ticketCode,
        validated_at: Date.now(),
      };
      
      // Keep only last 100 validations to prevent storage bloat
      const updatedHistory = [newEntry, ...history].slice(0, 100);
      
      await storageService.setItem('validation_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error storing validation result:', error);
    }
  }

  private async loadOfflineQueue(): Promise<void> {
    try {
      const queueData = await storageService.getItem(this.QUEUE_STORAGE_KEY);
      this.offlineQueue = queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.error('Error loading offline queue:', error);
      this.offlineQueue = [];
    }
  }

  private async saveOfflineQueue(): Promise<void> {
    try {
      await storageService.setItem(this.QUEUE_STORAGE_KEY, JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  private isNetworkError(error: any): boolean {
    return (
      error.code === 'NETWORK_ERROR' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('timeout') ||
      !error.response
    );
  }
}

export const validationService = new ValidationService();