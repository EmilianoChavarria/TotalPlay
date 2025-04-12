import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/icons.jpg";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = ({ items, collapsed, toggleCollapse, closeSidebarMobile }) => {
    const location = useLocation();

    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const isActive = (link) => {
        return location.pathname === link ||
            location.pathname.startsWith(`${link}/`);
    };

    // Función que maneja el clic en los links
    const handleLinkClick = () => {
        closeSidebarMobile();
    };

    return (
        <div className={`
            ${collapsed ? 'w-20' : 'w-64'} 
            bg-white py-4 border-r border-gray-200 transition-all duration-300
            h-full shadow-lg z-50
        `}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4 px-5 mb-6">
                    <div className="flex items-center justify-center max-h-10">
                        <img src={logo} alt="logo" className="h-10" />
                        {!collapsed && <Link to={"/dashboard/home"} className="text-xl font-bold ml-2">UltraNet</Link>}
                    </div>
                </div>

                {items.map((item) => (
                    <Link
                        key={item.link}
                        to={item.link}
                        onClick={handleLinkClick}
                        className={`flex items-center font-light text-base py-3 px-4 hover:bg-gray-100 transition ${isActive(item.link)
                            ? 'bg-gray-100 border-r-4 border-blue-500 '
                            : 'hover:border-r-4 hover:border-blue-500'
                            }`}
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

                <Link
                    to="/"
                    onClick={handleLogout}
                    className="flex md:hidden items-center text-base py-3 px-4 hover:bg-gray-100 transition text-red-800 font-medium whitespace-nowrap"
                >
                    <i className={`pi pi-sign-out mr-4 ${collapsed ? 'mx-auto' : 'mr-4'}`} style={{ fontSize: '1.2rem' }} />
                    {!collapsed && "Cerrar sesión"}
                </Link>
            </div>
        </div>
    );
};