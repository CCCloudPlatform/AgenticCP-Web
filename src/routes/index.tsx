import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import PrivateRoute from './PrivateRoute';
import { ROUTES } from '@/constants';

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const ProjectsPage = lazy(() => import('@/pages/projects/ProjectsPage'));
const ProjectSelectionPage = lazy(() => import('@/pages/cloud/ProjectSelectionPage'));
const ProjectResourcesPage = lazy(() => import('@/pages/cloud/ProjectResourcesPage'));
const ResourcesPage = lazy(() => import('@/pages/cloud/ResourcesPage'));
const EC2CreatePage = lazy(() => import('@/pages/cloud/EC2CreatePage'));
const GCPVMCreatePage = lazy(() => import('@/pages/cloud/GCPVMCreatePage'));
const AzureVMCreatePage = lazy(() => import('@/pages/cloud/AzureVMCreatePage'));
const VPCCreatePage = lazy(() => import('@/pages/cloud/VPCCreatePage'));
const S3CreatePage = lazy(() => import('@/pages/cloud/S3CreatePage'));
const GCPStorageCreatePage = lazy(() => import('@/pages/cloud/GCPStorageCreatePage'));
const AzureStorageCreatePage = lazy(() => import('@/pages/cloud/AzureStorageCreatePage'));
const GCPVPCCreatePage = lazy(() => import('@/pages/cloud/GCPVPCCreatePage'));
const AzureVNetCreatePage = lazy(() => import('@/pages/cloud/AzureVNetCreatePage'));
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

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

            {/* Project Management Routes */}
            <Route path={ROUTES.PROJECT} element={<ProjectsPage />} />

            {/* Cloud Resources Routes */}
            <Route path={ROUTES.RESOURCES} element={<ResourcesPage />} />
            <Route path="/cloud/project-selection" element={<ProjectSelectionPage />} />
            <Route path="/cloud/project-resources" element={<ProjectResourcesPage />} />
            <Route path="/cloud/ec2/create" element={<EC2CreatePage />} />
            <Route path="/cloud/gcp-vm/create" element={<GCPVMCreatePage />} />
            <Route path="/cloud/azure-vm/create" element={<AzureVMCreatePage />} />
            <Route path="/cloud/vpc/create" element={<VPCCreatePage />} />
            <Route path="/cloud/s3/create" element={<S3CreatePage />} />
            <Route path="/cloud/gcp-storage/create" element={<GCPStorageCreatePage />} />
            <Route path="/cloud/azure-blob/create" element={<AzureStorageCreatePage />} />
            <Route path="/cloud/gcp-vpc/create" element={<GCPVPCCreatePage />} />
            <Route path="/cloud/azure-vnet/create" element={<AzureVNetCreatePage />} />

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
