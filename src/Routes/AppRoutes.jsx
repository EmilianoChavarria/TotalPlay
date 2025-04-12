import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { Dashboard } from '../components/dashboard/sections/dashboard/Dashboard';
import { Packages } from '../components/dashboard/sections/packages/Packages';
import { Channels } from '../components/dashboard/sections/channels/Channels';
import { Contracts } from '../components/dashboard/sections/contracts/Contracts';
import { Reports } from '../components/dashboard/sections/reports/Reports';
import { Users } from '../components/dashboard/sections/users/Users';
import { SalesPackage } from '../components/dashboard/sections/packages/SalesPackage/SalesPackage';
import { ChannelPackage } from '../components/dashboard/sections/packages/ChannelPackage/ChannelPackage';
import { Login } from '../pages/auth/login/Login';
import { Page404 } from '../pages/Page404';
import { ProtectedRoute } from './ProtectedRoute';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { NewPassword } from '../pages/auth/NewPassword';

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/new-password" element={<NewPassword />} />
                <Route path="/not-found" element={<Page404 />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="home" index element={<Dashboard />} />
                    <Route
                        path="packages"
                        element={
                            <ProtectedRoute>
                                <Packages />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="salesPackages" element={
                            <ProtectedRoute>
                                <SalesPackage />
                            </ProtectedRoute>
                        }
                        />
                        <Route
                            path="channelPackages"
                            element={
                                <ProtectedRoute requiredRoles={['ADMIN']}>
                                    <ChannelPackage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                    <Route
                        path="channels"
                        element={
                            <ProtectedRoute requiredRoles={['ADMIN']}>
                                <Channels />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="users"
                        element={
                            <ProtectedRoute requiredRoles={['ADMIN']}>
                                <Users />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="contracts" element={<Contracts />} />
                    <Route
                        path="reports"
                        element={
                            <ProtectedRoute requiredRoles={['ADMIN']}>
                                <Reports />
                            </ProtectedRoute>
                        }
                    />
                </Route>
                <Route path="*" element={<Navigate to="/not-found" replace />} />
            </Routes>
        </Router>
    );
};