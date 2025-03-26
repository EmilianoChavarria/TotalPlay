import React from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./sidebar";
import { Outlet } from "react-router-dom";

export const Layout = ({ userRole = "admin" }) => {
    const sidebarItems = {
        admin: [
            { name: "Dashboard", link: "/dashboard/home", icon: "pi pi-objects-column" },
            { name: "Paquetes", link: "/dashboard/packages", icon: "pi pi-box" },
            { name: "Canales", link: "/dashboard/channels", icon: "pi pi-desktop" },
            { name: "Contratos", link: "/dashboard/contracts", icon: "pi pi-file" },
            { name: "Reportes", link: "/dashboard/reports", icon: "pi pi-chart-bar" }
        ],
        seller: [
            { name: "Dashboard", link: "/dashboard/home", icon: "pi pi-objects-column" },
            { name: "Paquetes", link: "/dashboard/packages", icon: "pi pi-box" },
            { name: "Contratos", link: "/dashboard/contracts", icon: "pi pi-file" }
        ]
    };

    return (
        <div className="flex h-screen overflow-hidden"> 
            <div className="flex-shrink-0">
                <Sidebar items={sidebarItems[userRole]} />
            </div>
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-shrink-0">
                    <Navbar userRole={userRole} />
                </div>
                
                <main className="flex-1 overflow-auto p-6 bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};