import { Dialog } from 'primereact/dialog';
import React from 'react'
import { useState } from 'react';

// Esto es para el formulario
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { ChannelService } from '../../../../../services/ChannelService';
import { use } from 'react';
import { useEffect } from 'react';
import { ChannelPackageService } from '../../../../../services/ChannelPackageService';
import { showErrorAlert, showSuccessAlert } from '../../../../CustomAlerts';
import { Dropdown } from 'primereact/dropdown';
import { CategoryService } from '../../../../../services/CategoryService';


export const ChannelPackageModal = ({ visible, setVisible, onSuccess }) => {

  const [selectedChannels, setSelectedChannels] = useState([]);

  const [channels, setChannels] = useState([]);

  // -----------------------------------------------------------------------------------------------
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const filteredChannels = channels.filter(channel => {
    const matchesCategory =
      !selectedCity || selectedCity.name === 'Todas' || channel.category.name === selectedCity.name;

    const matchesSearch =
      channel.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // -----------------------------------------------------------------------------------------------


  const fetchChannels = async () => {

    try {
      const response = await ChannelService.getAllChannels();
      console.log(response)
      if (response.data && Array.isArray(response.data)) {
        setChannels(response.data);
      } else {
        console.error("Formato de datos inesperado:", response);
        setChannels([]);
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      setChannels([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategories();
      if (response.data && Array.isArray(response.data)) {
        setCategories([{ name: 'Todas' }, ...response.data]);
      } else {
        console.error("Formato de datos inesperado:", response);
        setCategories([{ name: 'Todas' }]);
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      setCategories([{ name: 'Todas' }]);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchChannels();
      fetchCategories();
    }
  }, [visible]);


  // Agrega el canal a la segunda lista
  const addChannel = (channel) => {
    setSelectedChannels([...selectedChannels, channel]);
    setChannels(channels.filter(c => c.id !== channel.id));
  };

  // Remueve el canal de la segunda lista
  const removeChannel = (channel) => {
    setChannels([...channels, channel]);
    setSelectedChannels(selectedChannels.filter(c => c.id !== channel.id));
  };

  // Esto es para el formulario
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("El nombre del paquete es obligatorio")
      .matches(
        /^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/,
        "El nombre del paquete no es válido"
      ),
    description: Yup.string()
      .required("La descripción del paquete es obligatoria")
      .matches(
        /^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/,
        "La descripción del paquete no es válida"
      ),
    amount: Yup.number()
      .typeError('La cantidad del paquete no es válida')
      .required("La cantidad del paquete es obligatoria")
      .min(1, "La cantidad del paquete no es válida"),
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
      const packageData = {
        ...values,
        channels: selectedChannels.map(c => ({ id: c.id }))
      };
      console.log('Package data to submit:', packageData);

      try {
        const response = await ChannelPackageService.saveChannelPackage(packageData);
        console.log("Respuesta del servidor:", response);
        // setVisible(false);

        if (response.status === 'CREATED') {
          setVisible(false);
          formik.resetForm();
          setSelectedChannels([]);
          showSuccessAlert(response.message, () => {
            if (onSuccess) {
              onSuccess();
            }
          });
        } else {
          setVisible(false);
          setSelectedChannels([]);
          showErrorAlert(response.message || 'Ocurrió un error al crear el paquete', () => {
            setVisible(true);
          }

          );
        }

      } catch (error) {
        console.log("Error al crear el paquete:", error);
      }
    },
  });

  // Handler para cambios en los inputs
  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    formik.setFieldTouched(fieldName, true, false);
  };

  return (
    <Dialog header="Agregar paquete de canales" visible={visible} className='w-full  md:w-[60vw] xl:w-[60vw] 2xl:w-[40vw]' onHide={() => { if (!visible) return; setVisible(false); }}>
      <form onSubmit={formik.handleSubmit} className='mt-10'>
        <div className='mt-4 flex flex-col md:flex-row justify-between items-start'>
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
              <label htmlFor="amount">Precio</label>
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

        <div className='flex flex-col mt-4'>
          <div className='flex justify-between items-start mb-2'>
            <span className='text-sm font-semibold'>Seleccionar canales</span>
            <span className='text-sm font-light'>{selectedChannels.length} Canales seleccionados</span>
          </div>
          <div className='flex justify-between items-start'>
            {/* Available Channels */}
            <div className='w-[49%] border border-gray-300 rounded-md'>
              <div className='w-full p-4 flex flex-col items-center justify-start gap-x-6 gap-y-2'>
                <IconField iconPosition="left" className='border border-gray-300 rounded-lg w-full '>
                  <InputIcon className="pi pi-search"> </InputIcon>
                  <InputText
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar canal"
                    className='w-full px-10 h-12'
                  />

                </IconField>

                <div className='w-full flex items-center justify-center'>
                  <i
                    className={`pi pi-filter mr-2`}
                    style={{ fontSize: '1.2rem' }}
                  />
                  <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={categories} optionLabel="name"
                    placeholder="Filtrar por categoría" className="w-full border border-gray-300 md:w-14rem " checkmark={true} highlightOnSelect={false} />
                </div>
              </div>
              <div className='px-4 py-2'>
                <span className='text-sm font-medium text-gray-700'>
                  Canales disponibles
                </span>
                {/* Listado de canales */}
                <div className='py-4 flex flex-col gap-y-2'>
                  {filteredChannels.map(channel => (
                    <div key={channel.id} className='flex justify-between items-center hover:bg-gray-50 py-2 px-1'>
                      <div className='flex items-center justify-start gap-x-4'>
                        <img
                          src={`data:image/jpeg;base64,${channel.logoBean?.image}`}
                          alt={channel.name}
                          className="hidden md:block w-6 h-6 object-contain"
                        />
                        <div>
                          <p className='text-sm font-semibold text-gray-950'>{channel.name}</p>
                          <p className='text-sm font-light'>{channel.category.name}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => addChannel(channel)}>
                        <i
                          className={`pi pi-plus mr-2 text-blue-500`}
                          style={{ fontSize: '0.9rem' }}
                        />
                      </button>
                    </div>
                  ))}
                  {channels.length === 0 && (
                    <div className="text-sm text-gray-500 py-2 text-center">
                      No hay canales disponibles
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selected Channels */}
            <div className='w-[49%] border border-gray-300 rounded-md'>
              <div className='border-b border-gray-300 px-4 py-2 font-semibold text-black'>
                Canales del paquete
              </div>
              <div className='px-4 py-2'>
                {selectedChannels.length > 0 ? (
                  <div className='py-4 flex flex-col gap-y-2'>
                    {selectedChannels.map(channel => (
                      <div key={channel.id} className='flex justify-between items-center hover:bg-gray-50 py-2 px-1'>
                        <div className='flex items-center justify-start gap-x-4'>
                          <img
                            src={`data:image/jpeg;base64,${channel.logoBean?.image}`}
                            alt={channel.name}
                            className="hidden md:block w-6 h-6 object-contain"
                          />
                          <div>
                            <p className='text-sm font-semibold text-gray-950'>{channel.name}</p>
                            <p className='text-sm font-light'>{channel.category.name}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => removeChannel(channel)}>
                          <i
                            className={`pi pi-minus mr-2 text-red-500`}
                            style={{ fontSize: '0.9rem' }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className='text-sm text-gray-500'>
                    No hay canales seleccionados
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8'>
          <button
            type="submit"
            className='w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition duration-200'
            disabled={formik.isSubmitting || !formik.isValid || selectedChannels.length === 0}
          >
            {formik.isSubmitting ? 'Creando paquete...' : 'Crear paquete'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}