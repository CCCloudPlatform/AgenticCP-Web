import { CloudProvider, Resource, PagedResponse, PaginationParams } from '@/types';
import { mockApiResponses, mockProviders, mockResources } from '@/data/mockData';

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
  getResources: async (params?: PaginationParams): Promise<PagedResponse<Resource>> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const page = params?.page || 0;
    const size = params?.size || 10;
    const start = page * size;
    const end = start + size;
    const paginatedResources = mockResources.slice(start, end);
    
    // Return mock resources data
    return Promise.resolve({
      content: paginatedResources,
      page,
      size,
      totalElements: mockResources.length,
      totalPages: Math.ceil(mockResources.length / size),
      first: page === 0,
      last: end >= mockResources.length,
      hasNext: end < mockResources.length,
      hasPrevious: page > 0,
    });
  },

  /**
   * Get resource by ID
   */
  getResourceById: async (id: number): Promise<Resource> => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const resource = mockResources.find(r => r.id === id);
    if (!resource) {
      throw new Error('Resource not found');
    }
    return Promise.resolve(resource);
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