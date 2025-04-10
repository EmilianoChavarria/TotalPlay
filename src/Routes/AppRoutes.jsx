import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Layout } from '../components/shared/Layout'
import { Dashboard } from '../components/dashboard/sections/dashboard/Dashboard'
import { Packages } from '../components/dashboard/sections/packages/Packages'
import { Channels } from '../components/dashboard/sections/channels/Channels'
import { Contracts } from '../components/dashboard/sections/contracts/Contracts'
import { Reports } from '../components/dashboard/sections/reports/Reports'
import { SalesPackage } from '../components/dashboard/sections/packages/SalesPackage/SalesPackage'
import { ChannelPackage } from '../components/dashboard/sections/packages/ChannelPackage/ChannelPackage'
import ProtectedRoute from './ProtectedRoutes'
import { Login } from '../pages/auth/login/Login'
import { Page404 } from '../pages/Page404'



export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/not-found" element={<Page404 />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout />}>
            <Route path="home" index element={<Dashboard />} />
            <Route path="packages" element={<Packages />} >
              <Route path="salesPackages" element={<SalesPackage />} />
              <Route path="channelPackages" element={<ChannelPackage />} />
            </Route>
            <Route path="channels" element={<Channels />} />
            <Route path="contracts" element={<Contracts />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Router>
  )
}
