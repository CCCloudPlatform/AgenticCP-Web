import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import PrivateRoute from './PrivateRoute';
import { ROUTES } from '@/constants';

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const RolesPermissionsPage = lazy(() => import('@/pages/settings/RolesPermissionsPage'));
const PermissionTestPage = lazy(() => import('@/pages/settings/PermissionTestPage'));
const OrganizationPage = lazy(() => import('@/pages/organization/OrganizationPage'));
const NotFoundPage = lazy(() => import('@/pages/error/NotFoundPage'));

// Layout
const MainLayout = lazy(() => import('@/components/layout/MainLayout'));

// Loading component
const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            
            {/* Settings */}
            <Route path={ROUTES.ROLES_PERMISSIONS} element={<RolesPermissionsPage />} />
            <Route path="/settings/permission-test" element={<PermissionTestPage />} />
            
            {/* Organization Management */}
            <Route path={ROUTES.ORGANIZATIONS} element={<OrganizationPage />} />
            
            {/* Add more routes here */}
          </Route>
        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

