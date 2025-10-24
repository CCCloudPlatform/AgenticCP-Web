/**
 * Application Constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AgenticCP';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

/**
 * API Constants
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  TOKEN: import.meta.env.VITE_TOKEN_KEY || 'agenticcp_token',
  REFRESH_TOKEN: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'agenticcp_refresh_token',
  USER_INFO: 'agenticcp_user_info',
  THEME: 'agenticcp_theme',
} as const;

/**
 * Route Paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  
  // Platform Management
  PLATFORM: '/platform',
  PLATFORM_CONFIG: '/platform/config',
  FEATURE_FLAGS: '/platform/features',
  
  // Tenant Management
  TENANTS: '/tenants',
  TENANT_DETAIL: '/tenants/:id',
  
  // Cloud Management
  CLOUD: '/cloud',
  PROVIDERS: '/cloud/providers',
  RESOURCES: '/cloud/resources',
  INVENTORY: '/cloud/inventory',
  
  // Security & Compliance
  SECURITY: '/security',
  USERS: '/security/users',
  ROLES: '/security/roles',
  PERMISSIONS: '/security/permissions',
  POLICIES: '/security/policies',
  
  // Monitoring & Analytics
  MONITORING: '/monitoring',
  METRICS: '/monitoring/metrics',
  LOGS: '/monitoring/logs',
  ALERTS: '/monitoring/alerts',
  
  // Cost Management
  COST: '/cost',
  COST_TRACKING: '/cost/tracking',
  BUDGETS: '/cost/budgets',
  OPTIMIZATION: '/cost/optimization',
  
  // Resource Orchestration
  ORCHESTRATION: '/orchestration',
  DEPLOYMENTS: '/orchestration/deployments',
  SCALING: '/orchestration/scaling',
  
  // Infrastructure as Code
  IAC: '/iac',
  TEMPLATES: '/iac/templates',
  PIPELINES: '/iac/pipelines',
  
  // Integration & API
  INTEGRATION: '/integration',
  API_MANAGEMENT: '/integration/api',
  WEBHOOKS: '/integration/webhooks',
  
  // Notification
  NOTIFICATIONS: '/notifications',
  
  // Settings
  SETTINGS: '/settings',
  PROFILE: '/settings/profile',
  
  // Agent
  AGENT_CHAT: '/agent/chat',
} as const;

/**
 * User Roles
 */
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TENANT_ADMIN: 'TENANT_ADMIN',
  CLOUD_ADMIN: 'CLOUD_ADMIN',
  DEVELOPER: 'DEVELOPER',
  VIEWER: 'VIEWER',
  AUDITOR: 'AUDITOR',
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

