import React, { useState, useEffect } from 'react';
import { UserModal } from './UserModal';
import { ClientService } from '../../../../services/ClientService';
import { showErrorAlert, showConfirmAlert, showSuccessAlert } from '../../../CustomAlerts';

export const Users = () => {
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showingActive, setShowingActive] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await ClientService.findAllUsers();
      console.log("Respuesta del servidor:", response);

      const filteredUsers = (response.data.body.data || []).filter(user =>
        user.roleBeans && user.roleBeans[0] && user.roleBeans[0].name === 'USER'
      );

      setUsers(filteredUsers);
    } catch (error) {
      console.log("Error al obtener los usuarios:", error);
      showErrorAlert('Ocurrió un error al obtener los usuarios');
    } finally {
      setLoading(false);
    }
  };

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

    const filtered = users.filter(user => user.status === showingActive); // 👉 Filtrado por estado

    if (filtered.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-6 text-gray-500">
            No se encontraron usuarios {showingActive ? 'activos' : 'inactivos'}.
          </td>
        </tr>
      );
    }

    return filtered.map((user) => (
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
        </td>
      </tr>
    ));
  };

  return (
    <>
      <div className='w-full flex flex-col md:flex-row items-center justify-between'>
        <h2 className='text-2xl font-semibold whitespace-nowrap'>Gestión de Usuarios</h2>
        
        <div className='flex flex-col md:flex-row gap-2 mt-4 md:mt-0'>
          <button
            className='bg-gray-500 text-white rounded-lg py-2 px-4 hover:bg-gray-600 transition'
            onClick={() => setShowingActive(!showingActive)} // 👉 Cambia entre activos e inactivos
          >
            {showingActive ? 'Mostrar inactivos' : 'Mostrar activos'}
          </button>

          <button
            className='bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition'
            onClick={() => {
              setSelectedUser(null);
              setVisible(true);
            }}
          >
            <i className={`pi pi-plus mr-2`} style={{ fontSize: '1rem', verticalAlign: 'middle' }} />
            Agregar usuario
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto w-full bg-white p-2 rounded lg">
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
        setVisible={(v) => {
          setVisible(v);
          if (!v) setSelectedUser(null);
        }}
        onSuccess={handleSuccess}
        userToEdit={selectedUser}
      />
    </>
  );
};
