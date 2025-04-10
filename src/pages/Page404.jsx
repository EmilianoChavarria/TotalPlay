import React from 'react'


export const Page404 = () => {
    return (
        <main className="min-h-screen w-full  flex flex-col items-center justify-center px-4 text-black">
            <div className="animate-float flex flex-col items-center max-w-md text-center space-y-6">
                <h1 className="text-9xl font-bold text-blue-400">404</h1>
                <h2 className="text-2xl font-semibold">¡Ups! Página no encontrada</h2>
                <p className="text-blue-600">
                    Lo sentimos, no pudimos encontrar la página que estás buscando.
                </p>
                <a
                    href="/dashboard/home"
                    className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                    Volver al inicio
                </a>
            </div>
        </main>
    )
}
