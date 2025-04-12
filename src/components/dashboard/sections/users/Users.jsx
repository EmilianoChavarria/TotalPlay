import React, { useState, useEffect } from 'react';
import { UserModal } from './UserModal';
import { ClientService } from '../../../../services/ClientService';
import { showErrorAlert, showConfirmAlert, showSuccessAlert } from '../../../CustomAlerts';

export const Users = () => {
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await ClientService.findAllUsers();
      console.log("Respuesta del servidor:", response);
      setUsers(response.data.body.data || []);
    } catch (error) {
      console.log("Error al obtener los usuarios:", error);
      showErrorAlert('Ocurrió un error al obtener los usuarios');
    } finally {
      setLoading(false);
    }
  }

  const handleSuccess = () => {
    fetchUsers();
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId) => {
    showConfirmAlert(
      '¿Estás seguro de que deseas eliminar este usuario?',
      async () => {
        try {
          const response = await ClientService.deleteUser(userId);
          if (response.status === 'OK' || response.success) {
            showSuccessAlert(response.message || 'Usuario eliminado exitosamente', () => {
              fetchUsers();
            });
          } else {
            showErrorAlert(response.message || 'Error al eliminar el usuario');
          }
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          showErrorAlert('Ocurrió un error al eliminar el usuario');
        }
      }
    );
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-6">
            Cargando usuarios...
          </td>
        </tr>
      );
    }

    if (users.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-6 text-gray-500">
            No se encontraron usuarios.
          </td>
        </tr>
      );
    }

    return users.map((user) => (
      <tr key={user.id} className="border-b border-gray-200">
        <td className="px-6 py-4">{user.firstName}</td>
        <td className="px-6 py-4">{user.lastName} {user.surname}</td>
        <td className="px-6 py-4">{user.email}</td>
        <td className="px-6 py-4">{user.phone}</td>
        <td className="px-6 py-4">{user.rfc}</td>
        <td className="px-6 py-4 flex gap-x-2">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => {
              setSelectedUser(user);
              setVisible(true);
            }}
          >
            Editar
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDeleteUser(user.id)}
          >
            Eliminar
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <div className='w-full flex flex-col md:flex-row items-center justify-between'>
        <h2 className='text-2xl font-semibold whitespace-nowrap'>Gestión de Usuarios</h2>
        <button
          className='w-full mt-4 md:w-fit md:mt-0 bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition'
          onClick={() => {
            setSelectedUser(null);
            setVisible(true);
          }}
        >
          <i className={`pi pi-plus mr-2`} style={{ fontSize: '1rem', verticalAlign: 'middle' }} />
          Agregar usuario
        </button>
      </div>

      <div className="mt-6 overflow-x-auto w-full">
        <table className="min-w-full w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Apellidos</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Teléfono</th>
              <th scope="col" className="px-6 py-3">RFC</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {renderTableBody()}
          </tbody>
        </table>
      </div>

      <UserModal
        visible={visible}
        setVisible={setVisible}
        onSuccess={handleSuccess}
        userToEdit={selectedUser}
      />
    </>
  );
};