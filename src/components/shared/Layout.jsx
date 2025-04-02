import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./sidebar";
import { Outlet } from "react-router-dom";

export const Layout = ({ userRole = "admin" }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const sidebarItems = {
        admin: [
            { name: "Dashboard", link: "/dashboard/home", icon: "pi pi-objects-column" },
            { name: "Paquetes", link: "/dashboard/packages/channelPackages", icon: "pi pi-box" },
            { name: "Canales", link: "/dashboard/channels", icon: "pi pi-desktop" },
            { name: "Contratos", link: "/dashboard/contracts", icon: "pi pi-file" },
            { name: "Reportes", link: "/dashboard/reports", icon: "pi pi-chart-bar" }
        ],
        user: [
            { name: "Dashboard", link: "/dashboard/home", icon: "pi pi-objects-column" },
            { name: "Paquetes", link: "/dashboard/packages", icon: "pi pi-box" },
            { name: "Contratos", link: "/dashboard/contracts", icon: "pi pi-file" }
        ]
    };

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    // Función para cerrar la sidebar en móvil
    const closeSidebarMobile = () => {
        if (isMobile) {
            setCollapsed(true);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden relative">
            {/* Sidebar con animación */}
            <div className={`
                ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform' : 'flex-shrink-0'} 
                ${collapsed && isMobile ? '-translate-x-full' : 'translate-x-0'}
                transition-transform duration-300 ease-in-out
            `}>
                <Sidebar
                    items={sidebarItems[userRole]}
                    collapsed={collapsed}
                    toggleCollapse={toggleCollapse}
                    closeSidebarMobile={closeSidebarMobile}
                />
            </div>

            {/* Overlay con animación de opacidad */}
            {isMobile && !collapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={closeSidebarMobile}
                />
            )}

            {/* Contenido principal con animación de desplazamiento */}
            <div className={`
                flex-1 flex flex-col overflow-hidden
                ${isMobile && !collapsed ? 'transform translate-x-64' : 'translate-x-0'}
                transition-transform duration-300 ease-in-out
            `}>
                <Navbar
                    userRole={userRole}
                    toggleCollapse={toggleCollapse}
                    isMobile={isMobile}
                />

                <main className="flex-1 overflow-auto p-6 bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};