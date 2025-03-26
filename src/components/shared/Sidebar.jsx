import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from 'primereact/tooltip';

export const Sidebar = ({ items }) => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // Función para determinar si un ítem está activo
    const isActive = (link) => {
        return location.pathname === link ||
            location.pathname.startsWith(`${link}/`);
    };

    // Función para alternar el estado colapsado
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`${collapsed ? 'w-20' : 'w-64'} bg-white py-4 border-r border-gray-200 transition-all duration-300`}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 mb-6">
                    {!collapsed && <h2 className="text-xl font-bold">TotalSex</h2>}
                    <button
                        onClick={toggleCollapse}
                        className="p-2 rounded-md hover:bg-gray-200"
                    >
                        <i className="pi pi-bars" style={{ fontSize: '1.2rem' }} />
                    </button>
                </div>

                {items.map((item, index) => (
                    
                    <Link
                        key={index}
                        to={item.link}
                        className={`flex items-center font-light text-base py-3 px-4 hover:bg-gray-100 transition ${isActive(item.link)
                            ? 'bg-gray-100 border-r-4 border-blue-500 '
                            : 'hover:border-r-4 hover:border-blue-500'
                            }`}
                        tooltip={item.name} // Tooltip para cuando está colapsado
                    >
                        {item.icon && (
                            <i
                                className={`${item.icon} ${collapsed ? 'mx-auto' : 'mr-4'}`}
                                style={{ fontSize: '1.2rem' }}
                            />
                        )}
                        {!collapsed && item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};