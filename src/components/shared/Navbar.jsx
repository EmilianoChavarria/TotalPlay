import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = ({ toggleCollapse }) => {
  return (
    <div className='border-b border-gray-200 h-[4.3rem] flex items-center justify-between px-4 md:px-10'>
      <div className='flex items-center justify-center'>
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-md hover:bg-gray-200"
        >
          <i className="pi pi-bars align-middle" style={{ fontSize: '1.2rem' }} />
        </button>
        <span>
          Panel de administrador
        </span>
      </div>
      <div className='flex items-center justify-center gap-x-6 font-light'>
        <div className='hidden md:block'>
          <i
            className={`pi pi-user mr-2`}
            style={{ fontSize: '1.2rem' }}
          />
          <span>Admin</span>
        </div>
        <div className='hidden md:block'>
          <Link className='flex items-center border border-white rounded-md p-2 justify-center hover:border-red-600 hover:text-red-700 transition duration-150' to='/'>
            <i
              className={`pi pi-sign-out mr-2 `}
              style={{ fontSize: '1.2rem' }}
            />
            <span className='hidden md:block'>Cerrar sesión</span>
          </Link>
        </div>
      </div>
    </div>
  )
}