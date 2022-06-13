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

const  Empleado = () => {
    let formEmpleado = {
        idAreaNegocio: "",
        idRol: "",
        nombre: "",
        apellido: "",
        dpi: "",
        nit: "",
        direccion: "",
        email: "",
        fechaNacimiento: "",
        telefono: null,
        fechaIngreso:"",
        sueldo: "",
        idSede: "",
        password: ""
    };

    const [empleados, setEmpleados] = useState(null);
    const [empleadosDialog, setEmpleadosDialog] = useState(false);
    const [deleteEmpleadosDialog, setDeleteEmpleadosDialog] = useState(false);
    const [empleado, setEmpleado] = useState(formEmpleado);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
  
    useEffect(() => {
      list();
      // eslint-disable-next-line
    }, []);
    

    const list = async()  => {
        /* let aux = {idAreaNegocio: props.idAreaNegocio};
        let resp = await Service.listByArea(aux); */
        let resp = await Service.list();
        if (resp.valid) {
            setEmpleados(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }


    const openNew = () => {
        setEmpleado(formEmpleado);
        setSubmitted(false);
        setEmpleadosDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setEmpleadosDialog(false);
    }

    const hideDeleteEmpleadosDialog = () => {
        setDeleteEmpleadosDialog(false);
    }

    const submit = () => {
        if (empleado.nombre && empleado.apellido && empleado.dpi && empleado.nit && empleado.direccion && empleado.email) {
             if (empleado.idEmpleado) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(empleado);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(empleado);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editempleado = (empleado) => {
        setEmpleado({ ...empleado });
        setEmpleadosDialog(true);
    }

    const confirmDeleteempleado = (empleado) => {
        setEmpleado(empleado);
        setDeleteEmpleadosDialog(true);
    }

    const deleteempleado = async () => {
        let resp = await Service.deleteById(empleado);
        if ( resp.valid ) {
            list();
            setDeleteEmpleadosDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setEmpleado({
            ...empleado,
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



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editempleado(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteempleado(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Empleados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const empleadosDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={empleado.idEmpleado ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteEmpleadosDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEmpleadosDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deleteempleado} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={empleados}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} empleados"
                        globalFilter={globalFilter} emptyMessage="No empleados found." header={header} responsiveLayout="scroll">

                        <Column field="idEmpleado" header="ID" sortable ></Column>
                        <Column field="nombre" header="Nombre" sortable></Column>
                        <Column field="nit" header="Nit" sortable></Column>
                        <Column field="telefono" header="Telefono"  sortable></Column>
                        <Column field="email" header="Email"  sortable ></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={empleadosDialog} style={{ width: '450px' }} header={empleado.idEmpleado ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={empleadosDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText 
                                id="nombre" 
                                name="nombre"
                                value={empleado.nombre} 
                                onChange={onInputChange} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !empleado.nombre })} 
                            />
                            { submitted &&  !empleado.nombre && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="apellido">Apellido</label>
                            <InputText 
                                id="apellido" 
                                name="apellido"
                                value={empleado.apellido} 
                                onChange={onInputChange} 
                                required 
                                className={classNames({ 'p-invalid': submitted && !empleado.apellido })} 
                            />
                            { submitted &&  !empleado.apellido && <small className="p-invalid">Apellido es requerido.</small>}
                      
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">DPI</label>
                                <TextField
                                    type="number"
                                    id="dpi"
                                    name="dpi"
                                    value={ empleado.dpi }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    className="w-full"
                                />
                                { submitted &&  !empleado.dpi && <small className="p-invalid">DPI es requerido.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">NIT</label>
                                <TextField
                                    type="number"
                                    id="nit"
                                    name="nit"
                                    value={ empleado.nit }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    className="w-full"
                                />
                                { submitted &&  !empleado.nit && <small className="p-invalid">Nit es requerido.</small>}
                            </div>
                        </div>

                        <div className="field">
                                <label htmlFor="nombre">Dirección</label>
                                <InputText 
                                    id="direccion" 
                                    name="direccion"
                                    value={empleado.direccion} 
                                    onChange={onInputChange} 
                                    required 
                                    className={classNames({ 'p-invalid': submitted && !empleado.direccion })} 
                                />
                                { submitted &&  !empleado.direccion && <small className="p-invalid">Direccion es requerido.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="nombre">Email</label>
                                <TextField
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full"
                                    value={ empleado.email }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                                { submitted &&  !empleado.email && <small className="p-invalid">Email es requerido.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="nombre">Telefono</label>
                                <TextField
                                    type="number"
                                    id="telefono"
                                    name="telefono"
                                    className="w-full"
                                    value={ empleado.telefono }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                             </div>
                    </Dialog>

                    <Dialog visible={deleteEmpleadosDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteEmpleadosDialogFooter} onHide={hideDeleteEmpleadosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {empleado && <span>Desea eliminar este item: <b>{empleado.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default Empleado;