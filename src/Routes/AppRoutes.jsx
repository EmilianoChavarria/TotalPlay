import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Login } from '../Pages/auth/login/Login'
import { Layout } from '../components/shared/Layout'
import { Dashboard } from '../components/dashboard/sections/Dashboard'
import { Packages } from '../components/dashboard/sections/Packages'
import { Channels } from '../components/dashboard/sections/Channels'
import { Contracts } from '../components/dashboard/sections/Contracts'
import { Reports } from '../components/dashboard/sections/Reports'


export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route path="home" index element={<Dashboard />} />
          <Route path="packages" element={<Packages />} />
          <Route path="channels" element={<Channels />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  )
}
