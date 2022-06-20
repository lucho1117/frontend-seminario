import React, { useState, useEffect, useRef} from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import * as Service from "./Service";
import {  TextField } from '@mui/material';
import DetalleProceso from "./detalle/DetalleProceso";

const Proceso = () => {

    let formProceso = {
        nombre: "",
        descripcion: "",
        costo: "",
        fechaInicio: "",
        fechaFin: ""
    };

    const [procesos, setProcesos] = useState(null);
    const [procesoDialog, setProcesoDialog] = useState(false);
    const [deleteProcesoDialog, setDeleteProcesoDialog] = useState(false);
    const [proceso, setProceso] = useState(formProceso);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [flagproceso, setFlagProceso] = useState(false);
    useEffect(() => {
        list();
    }, []);

    const list = async()  => {
        let resp = await Service.list();
        if (resp.valid) {
            setProcesos(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const openNew = () => {
        setProceso(formProceso);
        setSubmitted(false);
        setProcesoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProcesoDialog(false);
    }

    const hideDeleteProcesoDialog = () => {
        setDeleteProcesoDialog(false);
    }

    const submit = () => {
        if (proceso.nombre ) {
             if (proceso.idProceso) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(proceso);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(proceso);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editproceso = (proceso) => {
        setProceso({ ...proceso });
        setProcesoDialog(true);
    }

    const Detalleproceso = (proceso) => {
        setProceso({ ...proceso });
        setFlagProceso(true);
    }

    const confirmDeleteproceso = (proceso) => {
        setProceso(proceso);
        setDeleteProcesoDialog(true);
    }

    const deleteproceso = async () => {
        let resp = await Service.deleteById(proceso);
        if ( resp.valid ) {
            list();
            setDeleteProcesoDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setProceso({
            ...proceso,
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
                {rowData.idProceso}
            </>
        );
    }

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre}
            </>
        );
    }

    const fechaInicioBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Inicio</span>
                {rowData.fechaInicio}
            </>
        );
    }

    const fechaFinBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Fin</span>
                {rowData.fechaFin}
            </>
        );
    }

    const descripcionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Descripcion</span>
                {rowData.descripcion}
            </>
        );
    }

    const costoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Costo</span>
                {rowData.costo}
            </>
        );
    }



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editproceso(rowData)} />
                <Button icon="pi pi-sitemap" className="p-button-rounded p-button-success mr-2" onClick={() => Detalleproceso(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteproceso(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Procesos Activos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const procesoDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={proceso.idProceso ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteProcesoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProcesoDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deleteproceso} />
        </>
    );

    return (
        <>
        {
            !flagproceso ? (
                <div className="grid crud-demo">
                    <div className="col-12">
                        <div className="card">
                            <Toast ref={toast} />
                            <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                            <DataTable ref={dt} value={procesos}
                                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} procesos"
                                globalFilter={globalFilter} emptyMessage="No procesos found." header={header} responsiveLayout="scroll">

                                <Column field="idProceso" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '5%', minWidth: '10rem' }}></Column>
                                <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: '25%', minWidth: '10rem' }}></Column>
                                <Column field="fechaInicio" header="Fecha Inicio" body={fechaInicioBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                                <Column field="fechaFin" header="Fecha Fin" body={fechaFinBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                                <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} sortable headerStyle={{ width: '25%', minWidth: '8rem' }}></Column>
                                <Column field="costo" header="Costo" body={costoBodyTemplate} sortable headerStyle={{ width: '25%', minWidth: '8rem' }}></Column>
                                <Column body={actionBodyTemplate}></Column>
                            </DataTable>

                            <Dialog visible={procesoDialog} style={{ width: '1200px' }} header={proceso.idProceso ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={procesoDialogFooter} onHide={hideDialog}>
                               
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="nombre">Nombre*</label>
                                        <InputText 
                                            id="nombre" 
                                            name="nombre"
                                            value={proceso.nombre} 
                                            onChange={onInputChange} 
                                            required 
                                            
                                            className={classNames({ 'p-error': submitted && !proceso.nombre })} 
                                        />
                                        { submitted &&  !proceso.nombre && <small className="p-error">Nombre es requerido.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="nombre">Costo</label>
                                        <InputText 
                                            id="costo" 
                                            name="costo"
                                            type="number"
                                            value={proceso.costo} 
                                            onChange={onInputChange} 
                                            required 
                                            
                                            className={classNames({ 'p-error': submitted && !proceso.costo })} 
                                        />
                                        { submitted &&  !proceso.costo && <small className="p-error">Costo es requerido.</small>}
                                    </div>
                                </div>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="price">Fecha Inicio</label>
                                        <TextField
                                            type="date"
                                            id="fechaInicio"
                                            name="fechaInicio"
                                            value={ proceso.fechaInicio }
                                            onChange={onInputChange}
                                            variant="outlined"
                                            fullWidth
                                            required
                                            className="w-full"
                                        />
                                        { submitted &&  !proceso.fechaInicio && <small className="p-error">Fecha Inicio es requerido.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="quantity">Fecha Fin</label>
                                        <TextField
                                            type="date"
                                            id="fechaFin"
                                            name="fechaFin"
                                            value={ proceso.fechaFin }
                                            onChange={onInputChange}
                                            variant="outlined"
                                            fullWidth
                                            required
                                            className="w-full"
                                        />
                                        { submitted &&  !proceso.fechaFin && <small className="p-error">Fecha Fin es requerido.</small>}
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="descripcion">Descripción</label>
                                    <InputTextarea 
                                        id="descripcion" 
                                        name="descripcion"
                                        value={proceso.descripcion} 
                                        onChange={onInputChange} 
                                        required 
                                        rows={3} 
                                        cols={20} 
                                    />
                                </div>

                            </Dialog>

                            <Dialog visible={deleteProcesoDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteProcesoDialogFooter} onHide={hideDeleteProcesoDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {proceso && <span>Desea eliminar este item: <b>{proceso.nombre}</b>?</span>}
                                </div>
                            </Dialog>

                        </div>
                    </div>
                </div>
            ):null
        }
        
        {
            flagproceso ? (
                <DetalleProceso 
                    proceso={proceso}
                    setFlagProceso={setFlagProceso}
                />
            ):null
        }

        </>
    )
}

export default Proceso;