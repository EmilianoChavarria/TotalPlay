import { Dialog } from 'primereact/dialog';
import React from 'react'

export const ClientModal = ({ visible, setVisible }) => {
    return (
        <Dialog header="Agregar paquete de ventas" visible={visible} className='w-full md:w-[30vw] xl:w-[40vw] 2xl:w-[30vw]' onHide={() => { if (!visible) return; setVisible(false); }}>
        </Dialog>
    )
}
