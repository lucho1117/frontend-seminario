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
import * as ServiceCargamento from "../cargamento/Service";
import * as ServiceCliente from "../../user/clientes/Service";
import { MenuItem, Select, TextField } from '@mui/material';

const Viaje = () => {
    let formViaje = {
        idCargamento: "",
        idCliente: "",
        origen:"",
        destino:"",
        fechaInicio:"",
        fechaFin:"",
        kilometros:"",
        toneladas:"",
        precio:""
    };

    const [viajes, setViajes] = useState(null);
    const [cargamentos, setCargamentos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [viajeDialog, setViajeDialog] = useState(false);
    const [deleteViajeDialog, setDeleteViajeDialog] = useState(false);
    const [viaje, setViaje] = useState(formViaje);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
  
    useEffect(() => {
        list();
        listCargamento();
    }, []);

    useEffect(() => {
        if (viaje.idCargamento){
            viaje.idCargamento === 1 ? listCliente(4) : listCliente(5)
        }
    }, [viaje.idCargamento]);
    

    const list = async()  => {
        let resp = await Service.list();
        if (resp.valid) {
            setViajes(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listCargamento = async() => {
        let resp = await ServiceCargamento.list();
        if (resp.valid) {
            setCargamentos(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listCliente = async(id) => {
        let aux = {idNegocio: id}
        let resp = await ServiceCliente.listByNegocio(aux);
        if (resp.valid) {
            setClientes(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }


    const openNew = () => {
        setViaje(formViaje);
        setSubmitted(false);
        setViajeDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setViajeDialog(false);
    }

    const hideDeleteViajeDialog = () => {
        setDeleteViajeDialog(false);
    }

    const submit = () => {
        if (viaje.idCargamento && viaje.idCliente && viaje.origen && viaje.destino && viaje.kilometros && viaje.toneladas ) {
             if (viaje.idViaje) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(viaje);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(viaje);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editViaje = (viaje) => {
        setViaje({ ...viaje });
        setViajeDialog(true);
    }

    const confirmDeleteViaje = (viaje) => {
        setViaje(viaje);
        setDeleteViajeDialog(true);
    }

    const deleteViaje = async () => {
        let resp = await Service.deleteById(viaje);
        if ( resp.valid ) {
            list();
            setDeleteViajeDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setViaje({
            ...viaje,
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
                {rowData.idViaje}
            </>
        );
    }

    const cargamentoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cargamento</span>
                {rowData.cargamento}
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

    const trayectoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Trayecto</span>
                <b>Origen: </b>{rowData.origen}
                <br />
                <b>Destino: </b>{rowData.destino}
            </>
        );
    }

    const fechaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Duración</span>
                <b>Fecha Inicio: </b>{rowData.fechaInicio}
                <br />
                <b>Fecha Fin: </b>{rowData.fechaFin}
            </>
        );
    }

    const kilometrosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Kilometros</span>
                {rowData.kilometros}
            </>
        );
    }

    const toneladasBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Toneladas</span>
                {rowData.toneladas}
            </>
        );
    }

    const precioBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio</span>
                {rowData.precio}
            </>
        );
    }



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editViaje(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteViaje(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Viajes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const viajeDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={viaje.idViaje ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteViajeDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteViajeDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deleteViaje} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={viajes}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} viajes"
                        globalFilter={globalFilter} emptyMessage="No viajes found." header={header} responsiveLayout="scroll">

                        <Column field="idViaje" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '5%', minWidth: '10rem' }}></Column>
                        <Column field="cargamento" header="Cargamento" sortable body={cargamentoBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="cliente" header="Cliente" body={clienteBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                        <Column field="trayecto" header="Trayecto" sortable body={trayectoBodyTemplate} headerStyle={{ width: '20%', minWidth: '10rem' }}></Column>
                        <Column field="duracion" header="Duración" sortable body={fechaBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="kilometros" header="Kilometros" sortable body={kilometrosBodyTemplate} headerStyle={{ width: '5%', minWidth: '10rem' }}></Column>
                        <Column field="toneladas" header="Toneladas" sortable body={toneladasBodyTemplate} headerStyle={{ width: '5%', minWidth: '10rem' }}></Column>
                        <Column field="precio" header="Precio" sortable body={precioBodyTemplate} headerStyle={{ width: '10%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={viajeDialog} style={{ width: '450px' }} header={viaje.idViaje ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={viajeDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="price">Cargamento*</label>
                            <Select 
                                value={viaje.idCargamento} 
                                className="w-full"
                                id="idCargamento" 
                                name="idCargamento" 
                                onChange={onInputChange}
                            >
                                {cargamentos.map((item, index) => (
                                    <MenuItem value={item.idCargamento} key={index}>
                                        {item.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                            { submitted &&  !viaje.idCargamento && <small className="p-invalid">Cargamento es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="quantity">Cliente</label>
                            <Select 
                                value={viaje.idCliente} 
                                className="w-full"
                                id="idCliente" 
                                name="idCliente" 
                                onChange={onInputChange}
                            >
                                {clientes.map((item, index) => (
                                    <MenuItem value={item.idCliente} key={index}>
                                        {item.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                            { submitted &&  !viaje.idCliente && <small className="p-invalid">Cliente es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="origen">Origen*</label>
                            <TextField 
                                id="origen" 
                                name="origen"
                                value={viaje.origen} 
                                onChange={onInputChange} 
                                required 
                                fullWidth
                                className={classNames({ 'p-invalid': submitted && !viaje.origen })} 
                            />
                            { submitted &&  !viaje.origen && <small className="p-invalid">Origen es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="origen">Destino*</label>
                            <TextField 
                                id="destino" 
                                name="destino"
                                value={viaje.destino} 
                                onChange={onInputChange} 
                                required 
                                fullWidth
                                className={classNames({ 'p-invalid': submitted && !viaje.destino })} 
                            />
                            { submitted &&  !viaje.destino && <small className="p-invalid">Destino es requerido.</small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="origen">Fecha Inicio</label>
                                <TextField 
                                    id="fechaInicio" 
                                    name="fechaInicio"
                                    type="date"
                                    value={viaje.fechaInicio} 
                                    onChange={onInputChange} 
                                    required 
                                    fullWidth
                                    className={classNames({ 'p-invalid': submitted && !viaje.fechaInicio })} 
                                />
                            </div>
                            <div className="field col">
                                <label htmlFor="origen">Fecha Fin</label>
                                <TextField 
                                    id="fechaFin" 
                                    name="fechaFin"
                                    type="date"
                                    value={viaje.fechaFin} 
                                    onChange={onInputChange} 
                                    required 
                                    fullWidth
                                    className={classNames({ 'p-invalid': submitted && !viaje.fechaFin })} 
                                />
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="origen">Kilometros aprox</label>
                                <TextField 
                                    id="kilometros" 
                                    name="kilometros"
                                    type="number"
                                    value={viaje.kilometros} 
                                    onChange={onInputChange} 
                                    required 
                                    fullWidth
                                    className={classNames({ 'p-invalid': submitted && !viaje.kilometros })} 
                                />
                                { submitted &&  !viaje.kilometros && <small className="p-invalid">Kilometros es requerido.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="origen">Toneladas</label>
                                <TextField 
                                    id="toneladas" 
                                    name="toneladas"
                                    type="numeber"
                                    value={viaje.toneladas} 
                                    onChange={onInputChange} 
                                    required 
                                    fullWidth
                                    className={classNames({ 'p-invalid': submitted && !viaje.toneladas })} 
                                />
                                { submitted &&  !viaje.toneladas && <small className="p-invalid">Toneladas es requerido.</small>}
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="origen">Precio</label>
                            <TextField 
                                id="precio" 
                                name="precio"
                                value={viaje.precio} 
                                onChange={onInputChange} 
                                required 
                                fullWidth
                                disabled
                                className={classNames({ 'p-invalid': submitted && !viaje.precio })} 
                            />
                        </div>

                        <pre>{JSON.stringify(viaje, null, 2)}</pre>
                    </Dialog>

                    <Dialog visible={deleteViajeDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteViajeDialogFooter} onHide={hideDeleteViajeDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {viaje && <span>Desea eliminar este item: <b>{viaje.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default Viaje;