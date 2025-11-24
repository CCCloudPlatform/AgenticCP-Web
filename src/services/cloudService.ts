import { CloudProvider, Resource, PagedResponse, PaginationParams } from '@/types';
import { mockApiResponses, mockProviders } from '@/data/mockData';

/**
 * Cloud Management Service
 */
export const cloudService = {
  /**
   * Get cloud providers
   */
  getProviders: async (_params?: PaginationParams): Promise<PagedResponse<CloudProvider>> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return Promise.resolve(mockApiResponses.getProviders);
  },

  /**
   * Get provider by ID
   */
  getProviderById: async (id: number): Promise<CloudProvider> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const provider = mockProviders.find(p => p.id === id);
    if (!provider) {
      throw new Error('Provider not found');
    }
    return Promise.resolve(provider);
  },

  /**
   * Create provider
   */
  createProvider: async (data: Partial<CloudProvider>): Promise<CloudProvider> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newProvider: CloudProvider = {
      id: mockProviders.length + 1,
      name: data.name || 'New Provider',
      type: data.type || 'AWS',
      status: data.status || 'ACTIVE',
      region: data.region || 'us-east-1',
      credentials: data.credentials,
      resources: [],
      cost: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockProviders.push(newProvider);
    return Promise.resolve(newProvider);
  },

  /**
   * Get resources
   */
  getResources: async (_params?: PaginationParams): Promise<PagedResponse<Resource>> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Return mock resources data
    return Promise.resolve({
      content: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
      hasNext: false,
      hasPrevious: false,
    });
  },

  /**
   * Get resource by ID
   */
  getResourceById: async (_id: number): Promise<Resource> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    throw new Error('Resource not found');
  },

  /**
   * Update provider
   */
  updateProvider: async (id: number, data: Partial<CloudProvider>): Promise<CloudProvider> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const providerIndex = mockProviders.findIndex(p => p.id === id);
    if (providerIndex === -1) {
      throw new Error('Provider not found');
    }
    
    const updatedProvider = {
      ...mockProviders[providerIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    mockProviders[providerIndex] = updatedProvider;
    return Promise.resolve(updatedProvider);
  },

  /**
   * Delete provider
   */
  deleteProvider: async (id: number): Promise<void> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const providerIndex = mockProviders.findIndex(p => p.id === id);
    if (providerIndex === -1) {
      throw new Error('Provider not found');
    }
    
    mockProviders.splice(providerIndex, 1);
    return Promise.resolve();
  },

  /**
   * Sync provider resources
   */
  syncProvider: async (id: number): Promise<void> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const provider = mockProviders.find(p => p.id === id);
    if (!provider) {
      throw new Error('Provider not found');
    }
    
    // Mock sync success
    return Promise.resolve();
  },

  /**
   * Test provider connection
   */
  testConnection: async (_data: Partial<CloudProvider>): Promise<{ success: boolean; message: string }> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock connection test
    const success = Math.random() > 0.2; // 80% success rate
    return Promise.resolve({
      success,
      message: success ? '연결 테스트 성공' : '연결 테스트 실패',
    });
  },
};