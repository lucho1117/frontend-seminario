import React, { useState, useEffect, useRef} from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import * as Service from "./Service";
import {  TextField } from '@mui/material';

const Cliente = (props) => {
  
    let formCliente = {
        idNegocio: props.idNegocio,
        nombre: "",
        apellido: "",
        dpi: "",
        nit: "",
        direccion: "",
        email: "",
        telefono: null
    };

    const [clientes, setClientes] = useState(null);
    const [clienteDialog, setClienteDialog] = useState(false);
    const [deleteClienteDialog, setDeleteClienteDialog] = useState(false);
    const [cliente, setCliente] = useState(formCliente);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
  
    useEffect(() => {
      list();
      // eslint-disable-next-line
    }, []);
    

    const list = async()  => {
        let aux = {idNegocio: props.idNegocio};
        let resp = await Service.listByNegocio(aux);
        if (resp.valid) {
            setClientes(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }


    const openNew = () => {
        setCliente(formCliente);
        setSubmitted(false);
        setClienteDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setClienteDialog(false);
    }

    const hideDeleteClienteDialog = () => {
        setDeleteClienteDialog(false);
    }

    const submit = () => {
        if (cliente.nombre && cliente.apellido && cliente.dpi && cliente.nit && cliente.direccion && cliente.email) {
             if (cliente.idCliente) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(cliente);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(cliente);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editCliente = (cliente) => {
        setCliente({ ...cliente });
        setClienteDialog(true);
    }

    const confirmDeleteCliente = (cliente) => {
        setCliente(cliente);
        setDeleteClienteDialog(true);
    }

    const deleteCliente = async () => {
        let resp = await Service.deleteById(cliente);
        if ( resp.valid ) {
            list();
            setDeleteClienteDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setCliente({
            ...cliente,
            [name]: value,
        });
        setSubmitted(true);
    }


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="AGREGAR" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        )
    }

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.idCliente}
            </>
        );
    }

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre} {rowData.apellido}
            </>
        );
    }


    const nitBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nit</span>
                {rowData.dpi}
            </>
        );
    }

    const telefonoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Telefono</span>
                {rowData.telefono}
            </>
        );
    }

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    }



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editCliente(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteCliente(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Clientes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const clienteDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={cliente.idCliente ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteClienteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteClienteDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deleteCliente} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={clientes}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} clientes"
                        globalFilter={globalFilter} emptyMessage="No clientes found." header={header} responsiveLayout="scroll">

                        <Column field="idCliente" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: '25%', minWidth: '10rem' }}></Column>
                        <Column field="nit" header="Nit" body={nitBodyTemplate} sortable headerStyle={{ width: '20%', minWidth: '8rem' }}></Column>
                        <Column field="telefono" header="Telefono" body={telefonoBodyTemplate} sortable headerStyle={{ width: '20%', minWidth: '8rem' }}></Column>
                        <Column field="email" header="Email" body={emailBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={clienteDialog} style={{ width: '450px' }} header={cliente.idCliente ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={clienteDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText 
                                id="nombre" 
                                name="nombre"
                                value={cliente.nombre} 
                                onChange={onInputChange} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !cliente.nombre })} 
                            />
                            { submitted &&  !cliente.nombre && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="apellido">Apellido</label>
                            <InputText 
                                id="apellido" 
                                name="apellido"
                                value={cliente.apellido} 
                                onChange={onInputChange} 
                                required 
                                className={classNames({ 'p-invalid': submitted && !cliente.apellido })} 
                            />
                            { submitted &&  !cliente.apellido && <small className="p-invalid">Apellido es requerido.</small>}
                      
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">DPI</label>
                                <TextField
                                    type="number"
                                    id="dpi"
                                    name="dpi"
                                    value={ cliente.dpi }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    className="w-full"
                                />
                                { submitted &&  !cliente.dpi && <small className="p-invalid">DPI es requerido.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">NIT</label>
                                <TextField
                                    type="number"
                                    id="nit"
                                    name="nit"
                                    value={ cliente.nit }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    className="w-full"
                                />
                                { submitted &&  !cliente.nit && <small className="p-invalid">Nit es requerido.</small>}
                            </div>
                        </div>

                        <div className="field">
                                <label htmlFor="nombre">Dirección</label>
                                <InputText 
                                    id="direccion" 
                                    name="direccion"
                                    value={cliente.direccion} 
                                    onChange={onInputChange} 
                                    required 
                                    className={classNames({ 'p-invalid': submitted && !cliente.direccion })} 
                                />
                                { submitted &&  !cliente.direccion && <small className="p-invalid">Direccion es requerido.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="nombre">Email</label>
                                <TextField
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full"
                                    value={ cliente.email }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                                { submitted &&  !cliente.email && <small className="p-invalid">Email es requerido.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="nombre">Telefono</label>
                                <TextField
                                    type="number"
                                    id="telefono"
                                    name="telefono"
                                    className="w-full"
                                    value={ cliente.telefono }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                             </div>
                    </Dialog>

                    <Dialog visible={deleteClienteDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteClienteDialogFooter} onHide={hideDeleteClienteDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {cliente && <span>Desea eliminar este item: <b>{cliente.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default Cliente;