import React from 'react';
import { InputText } from 'primereact/inputtext';

const Factura = () => {
  return (
        <div className="card p-fluid">
            <h5>Factura</h5>
            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor="name2">Name</label>
                    <InputText id="name2" type="text" />
                </div>
                <div className="field col">
                    <label htmlFor="email2">Email</label>
                    <InputText id="email2" type="text" />
                </div>
                <div className="field col">
                    <label htmlFor="email2">Email</label>
                    <InputText id="email2" type="text" />
                </div>
                <div className="field col">
                    <label htmlFor="email2">Email</label>
                    <InputText id="email2" type="text" />
                </div>
                <div className="field col">
                    <label htmlFor="email2">Email</label>
                    <InputText id="email2" type="text" />
                </div>
            </div>
        </div>
  )
}

export default Factura;