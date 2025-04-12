import React from 'react';
import { IconField, InputIcon } from 'primereact/iconfield';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

// Creo que este no se usa pero no borrar por si acaso
export const SearchAndFilter = ({
  // Props para el buscador
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar",
  
  // Props para el filtro
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = "Filtrar",
  filterOptionLabel = "name",
  
  // Layout
  className = "",
  searchWidth = "70%",
  filterWidth = "25%"
}) => {
  return (
    <div className={`w-full flex flex-col items-center justify-start gap-x-6 gap-y-2 md:flex-row md:gap-y-0 ${className}`}>
      {/* Buscador */}
      <div style={{ width: searchWidth }}>
        <IconField iconPosition="left" className='border border-gray-300 rounded-lg w-full'>
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className='w-full px-10 h-12'
          />
        </IconField>
      </div>

      {/* Filtro */}
      <div style={{ width: filterWidth }} className='flex items-center justify-center'>
        <i className="pi pi-filter mr-2" style={{ fontSize: '1.2rem' }} />
        <Dropdown 
          value={filterValue} 
          onChange={(e) => onFilterChange(e.value)} 
          options={filterOptions} 
          optionLabel={filterOptionLabel}
          placeholder={filterPlaceholder} 
          className="w-full border border-gray-300" 
          checkmark={true} 
          highlightOnSelect={false} 
        />
      </div>
    </div>
  );
};