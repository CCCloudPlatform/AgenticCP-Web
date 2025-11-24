import { Project, PagedResponse, PaginationParams } from '@/types';
import { mockApiResponses, mockProjects, mockProviders, mockOrganizations } from '@/data/mockData';

/**
 * Project Management Service
 */
export const projectService = {
  /**
   * Get all projects
   */
  getProjects: async (_params?: PaginationParams): Promise<PagedResponse<Project>> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock data
    return Promise.resolve(mockApiResponses.getProjects);
  },

  /**
   * Get project by ID
   */
  getProjectById: async (id: number): Promise<Project> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const project = mockProjects.find((p) => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return Promise.resolve(project);
  },

  /**
   * Create project
   */
  createProject: async (data: Partial<Project>): Promise<Project> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Find the provider and organization by ID
    const provider = mockProviders.find((p) => p.id === data.providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    const organization = mockOrganizations.find((o) => o.id === data.organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }

    const newProject: Project = {
      id: mockProjects.length + 1,
      name: data.name || 'New Project',
      description: data.description || '',
      organizationId: data.organizationId || 1,
      organization: organization,
      providerId: data.providerId || 1,
      provider: provider,
      status: data.status || 'ACTIVE',
      environment: data.environment || 'DEVELOPMENT',
      resources: [],
      cost: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockProjects.push(newProject);
    return Promise.resolve(newProject);
  },

  /**
   * Update project
   */
  updateProject: async (id: number, data: Partial<Project>): Promise<Project> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const projectIndex = mockProjects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    const updatedProject = {
      ...mockProjects[projectIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockProjects[projectIndex] = updatedProject;
    return Promise.resolve(updatedProject);
  },

  /**
   * Delete project
   */
  deleteProject: async (id: number): Promise<void> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const projectIndex = mockProjects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    mockProjects.splice(projectIndex, 1);
    return Promise.resolve();
  },

  /**
   * Get projects by provider
   */
  getProjectsByProvider: async (providerId: number): Promise<Project[]> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const projects = mockProjects.filter((p) => p.providerId === providerId);
    return Promise.resolve(projects);
  },

  /**
   * Archive project
   */
  archiveProject: async (id: number): Promise<void> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const projectIndex = mockProjects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    mockProjects[projectIndex].status = 'ARCHIVED';
    mockProjects[projectIndex].updatedAt = new Date().toISOString();
    return Promise.resolve();
  },

  /**
   * Restore project
   */
  restoreProject: async (id: number): Promise<void> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const projectIndex = mockProjects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    mockProjects[projectIndex].status = 'ACTIVE';
    mockProjects[projectIndex].updatedAt = new Date().toISOString();
    return Promise.resolve();
  },
};
