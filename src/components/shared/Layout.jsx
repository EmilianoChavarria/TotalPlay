import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { hasRole } = useAuth();

    const getSidebarItems = () => {
        const baseItems = [
            { name: "Dashboard", link: "/dashboard/home", icon: "pi pi-objects-column" },
            { name: "Paquetes", link: "/dashboard/packages/salesPackages", icon: "pi pi-box" },
            { name: "Contratos", link: "/dashboard/contracts", icon: "pi pi-file" }
        ];

        if (hasRole('ADMIN')) {
            return [
                ...baseItems,
                { name: "Canales", link: "/dashboard/channels", icon: "pi pi-desktop" },
                { name: "Reportes", link: "/dashboard/reports", icon: "pi pi-chart-bar" }
            ];
        }

        return baseItems;
    };

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

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
            <div className={`
                ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform' : 'flex-shrink-0'} 
                ${collapsed && isMobile ? '-translate-x-full' : 'translate-x-0'}
                transition-transform duration-300 ease-in-out
            `}>
                <Sidebar
                    items={getSidebarItems()}
                    collapsed={collapsed}
                    toggleCollapse={toggleCollapse}
                    closeSidebarMobile={closeSidebarMobile}
                />
            </div>

            {isMobile && !collapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={closeSidebarMobile}
                />
            )}

            <div className={`
                flex-1 flex flex-col overflow-hidden
                ${isMobile && !collapsed ? 'transform translate-x-64' : 'translate-x-0'}
                transition-transform duration-300 ease-in-out
            `}>
                <Navbar
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