import React from 'react'
import { DashboardCard } from '../../../cards/DashboardCard'
import { useAuth } from '../../../../context/AuthContext';

export const Dashboard = () => {

  const { hasRole } = useAuth();

  return (
    <section className='flex flex-col gap-y-2 md:flex-row md:justify-start md:items-center md:gap-x-8'>
      <div className='w-full md:w-[23%]'>
        <DashboardCard name='Paquetes' quantity={10} icon='pi pi-box' />
      </div>
      <div className='w-full md:w-[23%]'>
        <DashboardCard name='Contratos activos' quantity={10} icon='pi pi-file' />
      </div>
      {hasRole('ADMIN') && (
      <div className='w-full md:w-[23%]'>
        <DashboardCard name='Total de canales' quantity={10} icon='pi pi-desktop' />
      </div>
      )}
      <div className='w-full md:w-[23%]'>
        <DashboardCard name='Clientes' quantity={10} icon='pi pi-box' />
      </div>
      

    </section>
  )
}
