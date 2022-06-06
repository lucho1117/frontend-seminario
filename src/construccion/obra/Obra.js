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
import * as ServiceTipoObra from "../tipoObra/Service";
import { MenuItem, Select, TextField } from '@mui/material';
import * as ServiceCliente from "../../user/clientes/Service";
import Fase from "./fase/Fase";

const Obra = () => {

    let formObra = {
        idTipoObra: "",
        idCliente: "",
        nombre: "",
        descripcion: "",
        costo: "",
        fechaInicio: "",
        fechaFin: ""
    };

    const [obras, setObras] = useState(null);
    const [obraDialog, setObraDialog] = useState(false);
    const [deleteObraDialog, setDeleteObraDialog] = useState(false);
    const [obra, setObra] = useState(formObra);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [tipoObras, setTipoObras] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [flagObra, setFlagObra] = useState(false);
    useEffect(() => {
        list();
        listTipoObras();
        listClientes();
    }, []);

    const list = async()  => {
        let resp = await Service.list();
        if (resp.valid) {
            setObras(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listTipoObras = async()  => {
        let resp = await ServiceTipoObra.list();
        if (resp.valid) {
            setTipoObras(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listClientes = async()  => {
        let aux = {idNegocio: 6};
        let resp = await ServiceCliente.listByNegocio(aux);
        if (resp.valid) {
            setClientes(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }


    const openNew = () => {
        setObra(formObra);
        setSubmitted(false);
        setObraDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setObraDialog(false);
    }

    const hideDeleteObraDialog = () => {
        setDeleteObraDialog(false);
    }

    const submit = () => {
        if (obra.nombre && obra.idTipoObra && obra.costo && obra.idCliente) {
             if (obra.idObra) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(obra);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(obra);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editobra = (obra) => {
        setObra({ ...obra });
        setObraDialog(true);
    }

    const faseObra = (obra) => {
        setObra({ ...obra });
        setFlagObra(true);
    }

    const confirmDeleteobra = (obra) => {
        setObra(obra);
        setDeleteObraDialog(true);
    }

    const deleteobra = async () => {
        let resp = await Service.deleteById(obra);
        if ( resp.valid ) {
            list();
            setDeleteObraDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setObra({
            ...obra,
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
                {rowData.idObra}
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

    const clienteBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cliente</span>
                {rowData.cliente}
            </>
        );
    }

    const tipoObraBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tipo obra</span>
                {rowData.tipoObra}
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editobra(rowData)} />
                <Button icon="pi pi-sitemap" className="p-button-rounded p-button-success mr-2" onClick={() => faseObra(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteobra(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Obras</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const obraDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={obra.idObra ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteObraDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteObraDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deleteobra} />
        </>
    );

    return (
        <>
        {
            !flagObra ? (
                <div className="grid crud-demo">
                    <div className="col-12">
                        <div className="card">
                            <Toast ref={toast} />
                            <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                            <DataTable ref={dt} value={obras}
                                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} obras"
                                globalFilter={globalFilter} emptyMessage="No obras found." header={header} responsiveLayout="scroll">

                                <Column field="idObra" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '5%', minWidth: '10rem' }}></Column>
                                <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: '25%', minWidth: '10rem' }}></Column>
                                <Column field="cliente" header="Cliente" body={clienteBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                                <Column field="tipoObra" header="Tipo Obra" body={tipoObraBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                                <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} sortable headerStyle={{ width: '25%', minWidth: '8rem' }}></Column>
                                <Column field="costo" header="Costo" body={costoBodyTemplate} sortable headerStyle={{ width: '25%', minWidth: '8rem' }}></Column>
                                <Column body={actionBodyTemplate}></Column>
                            </DataTable>

                            <Dialog visible={obraDialog} style={{ width: '1200px' }} header={obra.idObra ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={obraDialogFooter} onHide={hideDialog}>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="descripcion">Tipo obra*</label>
                                        <Select 
                                            value={obra.idTipoObra} 
                                            className="w-full"
                                            id="idTipoObra" 
                                            name="idTipoObra" 
                                            autoFocus 
                                            onChange={onInputChange}>
                                            {tipoObras.map((item, index) => (
                                                <MenuItem value={item.idTipoObra} key={index}>
                                                    {item.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        { submitted &&  !obra.idTipoObra && <small className="p-error">Tipo obra es requerida.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="descripcion">Cliente*</label>
                                        <Select 
                                            value={obra.idCliente} 
                                            className="w-full"
                                            id="idCliente" 
                                            name="idCliente" 
                                            autoFocus 
                                            onChange={onInputChange}>
                                            {clientes.map((item, index) => (
                                                <MenuItem value={item.idCliente} key={index}>
                                                    {item.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        { submitted &&  !obra.idCliente && <small className="p-error">Cliente es requerida.</small>}
                                    </div>
                                </div>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="nombre">Nombre*</label>
                                        <InputText 
                                            id="nombre" 
                                            name="nombre"
                                            value={obra.nombre} 
                                            onChange={onInputChange} 
                                            required 
                                            
                                            className={classNames({ 'p-error': submitted && !obra.nombre })} 
                                        />
                                        { submitted &&  !obra.nombre && <small className="p-error">Nombre es requerido.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="nombre">Costo</label>
                                        <InputText 
                                            id="costo" 
                                            name="costo"
                                            type="number"
                                            value={obra.costo} 
                                            onChange={onInputChange} 
                                            required 
                                            
                                            className={classNames({ 'p-error': submitted && !obra.costo })} 
                                        />
                                        { submitted &&  !obra.costo && <small className="p-error">costo es requerido.</small>}
                                    </div>
                                </div>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="price">Fecha Inicio</label>
                                        <TextField
                                            type="date"
                                            id="fechaInicio"
                                            name="fechaInicio"
                                            value={ obra.fechaInicio }
                                            onChange={onInputChange}
                                            variant="outlined"
                                            fullWidth
                                            required
                                            className="w-full"
                                        />
                                        { submitted &&  !obra.fechaInicio && <small className="p-error">Fecha Inicio es requerido.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="quantity">Fecha Fin</label>
                                        <TextField
                                            type="date"
                                            id="fechaFin"
                                            name="fechaFin"
                                            value={ obra.fechaFin }
                                            onChange={onInputChange}
                                            variant="outlined"
                                            fullWidth
                                            required
                                            className="w-full"
                                        />
                                        { submitted &&  !obra.fechaFin && <small className="p-error">Fecha Fin es requerido.</small>}
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="descripcion">Descripción</label>
                                    <InputTextarea 
                                        id="descripcion" 
                                        name="descripcion"
                                        value={obra.descripcion} 
                                        onChange={onInputChange} 
                                        required 
                                        rows={3} 
                                        cols={20} 
                                    />
                                </div>

                            </Dialog>

                            <Dialog visible={deleteObraDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteObraDialogFooter} onHide={hideDeleteObraDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {obra && <span>Desea eliminar este item: <b>{obra.nombre}</b>?</span>}
                                </div>
                            </Dialog>

                        </div>
                    </div>
                </div>
            ):null
        }
        
        {
            flagObra ? (
                <Fase 
                    obra={obra}
                    setFlagObra={setFlagObra}
                />
            ):null
        }

        </>
    )
}

export default Obra;