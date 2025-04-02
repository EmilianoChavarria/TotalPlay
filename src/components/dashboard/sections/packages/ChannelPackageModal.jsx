import { Dialog } from 'primereact/dialog';
import React from 'react'
import { useState } from 'react';

// Esto es para el formulario
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';


export const ChannelPackageModal = ({ visible, setVisible }) => {

  const [channels, setChannels] = useState([
    {
      id: 1,
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Discovery_Kids_Logo_2021-Presente.webp",
      name: "Discovery Kids",
      category: "Niños",
    },
    {
      id: 2,
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Fox_Broadcasting_Company_logo_%282019%29.svg",
      name: "Fox",
      category: "Comedia",

    },
    {
      id: 3,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Televisa_Deportes_logo.png/1200px-Televisa_Deportes_logo.png",
      name: "Televisa Deportes",
      category: "Deportes",

    },
    {
      id: 4,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Bandamax_2015_Logo.png/200px-Bandamax_2015_Logo.png",
      name: "Bandamax",
      category: "Música",
    },
    {
      id: 5,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Disney_XD_-_2015.svg/640px-Disney_XD_-_2015.svg.png",
      name: "Disney XD",
      category: "Niños",

    }
  ]);

  // Esto es para el formulario
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("El nombre del paquete es obligatorio")
      .matches(
        // Regex de solo letras y números
        /^[a-zA-Z0-9\s]*$/,
        "El nombre del paquete no es válido"
      ),
    description: Yup.string()
      .required("La descripción del paquete es obligatoria")
      .matches(
        // Regex de solo letras y números
        /^[a-zA-Z0-9\s]*$/,
        "La descripción del paquete no es válida"
      ),
    amount: Yup.number()
      .typeError('La cantidad del paquete no es válida')
      .required("La cantidad del paquete es obligatoria")
      .min(1, "La cantidad del paquete no es válida")
    ,
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      amount: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Datos del formulario:', values);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("number", values.number);
      formData.append("category", values.category);
      formData.append("image", values.logo);

      try {
        console.log(formData)
        const response = await ChannelService.saveChannel(formData);
        console.log("Respuesta del servidor:", response);
      } catch (error) {
        console.log("Error al crear el canal:", error);
      }

    },
  });

  // Handler para cambios en los inputs
  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    formik.setFieldTouched(fieldName, true, false);
  };

  return (
    <Dialog header="Agregar paquete de canales" visible={visible} className='w-full md:w-[30vw]' onHide={() => { if (!visible) return; setVisible(false); }}>
      <form onSubmit={formik.handleSubmit} className='mt-4'>
        <div className='mt-4 flex flex-col md:flex-row justify-between items-center'>
          {/* Campo de nombre */}
          <div className='w-full md:w-[49%]'>
            <FloatLabel >
              <InputText
                id="name"
                name="name"
                className={`border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                value={formik.values.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              <label htmlFor="name">Nombre del paquete</label>
            </FloatLabel>
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
            )}
          </div>

          {/* Campo de precio */}
          <div className='w-full md:w-[49%]'>
            <FloatLabel >
              <InputText
                id="amount"
                name="amount"
                className={`border ${formik.touched.amount && formik.errors.amount ? 'border-red-500' : 'border-gray-300'} min-h-10 pl-4 w-full`}
                value={formik.values.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
              />
              <label htmlFor="amount">Precio ($/mes)</label>
            </FloatLabel>
            {formik.touched.amount && formik.errors.amount && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.amount}</div>
            )}
          </div>
        </div>

        {/* Campo description */}
        <div className={`${formik.touched.name && formik.errors.name ? 'mt-8' : 'mt-6'}`}>
          <FloatLabel className='w-full'>
            <InputTextarea
              id="description"
              name="description"
              className={`border ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-gray-300'} pl-4 w-full`}
              value={formik.values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3} cols={30}
            />
            <label htmlFor="description">Descripción del paquete</label>
          </FloatLabel>
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
          )}
        </div>

        <div className='flex flex-col'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm font-semibold'>Seleccionar canales</span>
            <span className='text-sm font-light'>Canales seleccionados</span>
          </div>
          <div className='flex justify-between items-center'>
            <div className='w-[49%] border border-gray-300 rounded-md'>
              {/* Encabezado del cuadrito */}
              <div className='border-b border-gray-300 px-4 py-2'>
                Paquetes del canal
              </div>
              asd
            </div>
            <div className='w-[49%] border border-gray-300 rounded-md'>
              {/* Encabezado del cuadrito */}
              <div className='border-b border-gray-300 px-4 py-2'>
                Paquetes del canal
              </div>
              asd
            </div>
          </div>
        </div>

        <div className='mt-8'>
          <button
            type="submit"
            className='w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition duration-200'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? 'Iniciando sesión...' : 'Login'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
