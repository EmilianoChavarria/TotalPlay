import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserModal } from './UserModal';

export const Users = () => {

  const [visible, setVisible] = useState(false);



  return (
    <>
      {/* Contenedor del encabezado */}
      <div className='w-full flex flex-col md:flex-row items-center justify-between'>
        <h2 className='text-2xl font font-semibold whitespace-nowrap' >Gestión de Usuarios</h2>
        <button className='w-full mt-4 md:w-fit md:mt-0 bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition ' onClick={() => setVisible(true)}>
          <i className={`pi pi-plus mr-2`}
            style={{ fontSize: '1rem', verticalAlign: 'middle' }}
          />
          Agregar usuario
        </button>
      </div>

      <UserModal visible={visible} setVisible={setVisible} />
    </>
  )
}
