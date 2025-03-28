import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <div className='border-b border-gray-200 h-[4.3rem] flex items-center justify-between px-10'>
      <span>
        Panel de administrador
      </span>
      <div className='flex gap-x-6 font-light'>
        <div>
          <i
            className={`pi pi-user mr-2`}
            style={{ fontSize: '1.2rem' }}
          />
          <span>Admin</span>
        </div>
        <div>
          <Link to='/'>
            <i
              className={`pi pi-sign-out mr-2`}
              style={{ fontSize: '1.2rem' }}
            />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
