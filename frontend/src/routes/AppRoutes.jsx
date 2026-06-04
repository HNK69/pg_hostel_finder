import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import Spinner from '../components/Spinner';

// Lazy loading pages for optimized performance
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const HostelList = lazy(() => import('../pages/HostelList'));
const HostelDetails = lazy(() => import('../pages/HostelDetails'));
const Search = lazy(() => import('../pages/Search'));
const Profile = lazy(() => import('../pages/Profile'));

const DashboardOverview = lazy(() => import('../pages/DashboardOverview'));
const DashboardHostels = lazy(() => import('../pages/DashboardHostels'));
const DashboardRooms = lazy(() => import('../pages/DashboardRooms'));
const DashboardReviews = lazy(() => import('../pages/DashboardReviews'));

function LazyFallback() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LazyFallback />}>
      <Routes>
        {/* Main Website routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="hostels" element={<HostelList />} />
          <Route path="hostels/:id" element={<HostelDetails />} />
          <Route path="search" element={<Search />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Dashboard routes (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['owner', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="hostels" element={<DashboardHostels />} />
          <Route path="rooms" element={<DashboardRooms />} />
          <Route path="reviews" element={<DashboardReviews />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
