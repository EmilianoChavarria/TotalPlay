import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'


export const Packages = () => {

  

  return (
    <>
      <div className='w-full border-b-2 border-gray-200 flex gap-x-2 pt-2'>
        <NavLink
          to="/dashboard/packages/channelPackages"
          className={({ isActive }) =>
            `px-4 border-b-2 pb-2 ${isActive ? 'text-blue-500 border-blue-500' : 'text-black border-b-0'}`
          }
        >
          Paquetes de canales
        </NavLink>
        <NavLink
          to="/dashboard/packages/salesPackages"
          className={({ isActive }) =>
            `px-4 border-b-2 pb-2 ${isActive ? 'text-blue-500 border-blue-500' : 'text-black border-b-0 hover:'}`
          }
        >
          Paquetes de ventas
        </NavLink>
      </div>

      <div className='p-0 md:p-4'>

        <Outlet />
      </div>

    </>
  )
}
