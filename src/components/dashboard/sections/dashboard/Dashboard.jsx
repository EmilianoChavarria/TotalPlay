import React from 'react'
import { DashboardCard } from '../../../cards/DashboardCard'

export const Dashboard = () => {
  return (
    <section className='flex justify-start items-center gap-x-8'>
      <div className='w-[23%]'>
        <DashboardCard name='Paquetes' quantity={10} icon='pi pi-box' />
      </div>
      <div className='w-[23%]'>
        <DashboardCard name='Contratos activos' quantity={10} icon='pi pi-file' />
      </div>
      <div className='w-[23%]'>
        <DashboardCard name='Total de canales' quantity={10} icon='pi pi-desktop' />
      </div>
      <div className='w-[23%]'>
        <DashboardCard name='Usuarios' quantity={10} icon='pi pi-box' />
      </div>
      

    </section>
  )
}
