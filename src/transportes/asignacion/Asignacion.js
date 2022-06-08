import React, { useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import * as Service from "./Service";
import * as ServiceViaje from "../viaje/Service";
import { MenuItem, Select } from '@mui/material';
import * as ServiceVehiculo from "../vehiculo/Service";
import * as ServiceEmpleado from "../../user/empleado/Service";

import ReportAsignacion from './ReportAsignacion';
import { PDFViewer } from '@react-pdf/renderer';


const Asignacion = () => {

    let formAsignacion = {
        idViaje: "",
        idVehiculo: "",
        idEmpleado: ""
    };

    const [asignaciones, setAsignaciones] = useState(null);
    const [asignacionDialog, setAsignacionDialog] = useState(false);
    const [deleteAsigncionDialog, setDeleteAsigncionDialog] = useState(false);
    const [asignacion, setAsignacion] = useState(formAsignacion);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [viajes, setViajes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [empleados, setEmpleados] = useState([]);

    const [viaje, setViaje] = useState("");

    const [asignacionReportDialog, setasignacionReportDialog] = useState(false);
    const [empezarDialog, setEmpezarDialog] = useState(false);
    const [terminarDialog, setTerminarDialog] = useState(false);

    useEffect(() => {
        list();
        listViajes();
    }, []);

    useEffect(() => {
       if (viaje) {
           listVehiculos(viaje.toneladas);

           if (viaje.idCargamento === 1) { 
               listEmpleados(2);
            } else if (viaje.idCargamento === 2) {
                listEmpleados(3);
            }
       }
    }, [viaje]);
    

    const list = async()  => {
        let resp = await Service.list();
        if (resp.valid) {
            setAsignaciones(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listViajes = async()  => {
        let aux = {estado: 1}
        let resp = await ServiceViaje.list(aux);
        if (resp.valid) {
            setViajes(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listVehiculos = async(capacidad)  => {
        let aux = {disponible: 1, toneladas: capacidad }
        let resp = await ServiceVehiculo.list(aux);
        if (resp.valid) {
            setVehiculos(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listEmpleados = async(idArea)  => {
        let aux = {
            idRol: 8,
            idAreaNegocio: idArea
        }
        let resp = await ServiceEmpleado.listByRolByArea(aux);
        if (resp.valid) {
            setEmpleados(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const openNew = () => {
        setAsignacion(formAsignacion);
        setSubmitted(false);
        setAsignacionDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setAsignacionDialog(false);
    }

    const hideDeleteAsigncionDialog = () => {
        setDeleteAsigncionDialog(false);
    }

    const submit = () => {
        if (asignacion.idVehiculo && asignacion.idEmpleado && asignacion.idViaje) {
             if (asignacion.idAsignacion) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(asignacion);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(asignacion);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const confirmDeleteasignacion = (asignacion) => {
        setAsignacion(asignacion);
        setDeleteAsigncionDialog(true);
    }

    const confirmEmpezarAsignacion = (asignacion) => {
        setAsignacion(asignacion);
        setEmpezarDialog(true);
    }

    const confirmFinalizarAsignacion = (asignacion) => {
        setAsignacion(asignacion);
        setTerminarDialog(true);
    }

    

    const deleteasignacion = async () => {
        let resp = await Service.deleteById(asignacion);
        if ( resp.valid ) {
            list();
            setDeleteAsigncionDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }

    const empezarAsignacion = async () => {
        let resp = await Service.empezarRuta(asignacion);
        if ( resp.valid ) {
            list();
            setEmpezarDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Buen Viaje', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }

    const terminarAsignacion = async () => {
        let resp = await Service.terminarRuta(asignacion);
        if ( resp.valid ) {
            list();
            setTerminarDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ha finalizado el viaje con exito', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setAsignacion({
            ...asignacion,
            [name]: value,
        });
        setSubmitted(true);
    }

    const hideEmpezarDialog = () => {
        setEmpezarDialog(false);
    }

    const hideTerminarDialog = () => {
        setTerminarDialog(false);
    }


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="REPORTE" icon="pi pi-file-pdf" className="p-button-info mr-2" onClick={()=>{setasignacionReportDialog(true)}} />
                    <Button label="AGREGAR" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        )
    }

    const estadoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                {rowData.estado === 1 ? "EN ESPERA" : rowData.estado === 2 ? "EN RUTA" : "FINALIZADO"}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                
                {
                    rowData.estado === 2 ? (
                        <Button icon="pi pi-check-circle" className="p-button-rounded p-button-success mr-2" onClick={() => confirmFinalizarAsignacion(rowData)} />
                    ):null
                }
                {
                    rowData.estado === 1 ? (
                        <>
                        <Button icon="pi pi-play" className="p-button-rounded p-button-warning mr-2" onClick={() => confirmEmpezarAsignacion(rowData)} />
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteasignacion(rowData)} />
                        </>
                    ):null
                }
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Asignaciones</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const asignacionDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={asignacion.idAsignacion ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteAsigncionDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAsigncionDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deleteasignacion} />
        </>
    );

    const empezarRutaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideEmpezarDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={empezarAsignacion} />
        </>
    );

    const terminarRutaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideTerminarDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={terminarAsignacion} />
        </>
    );

    const hideDialogReporte = () => {
        setasignacionReportDialog(false);
    }



    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={asignaciones}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} asignaciones"
                        globalFilter={globalFilter} emptyMessage="No asignaciones found." header={header} responsiveLayout="scroll">

                        <Column field="idAsignacion" header="ID" sortable></Column>
                        <Column field="placa" header="Placa Vehiculo" sortable ></Column>
                        <Column field="origen" header="Origen" ></Column>
                        <Column field="destino" header="Destino" ></Column>
                        <Column field="precio" header="Precio" ></Column>
                        <Column field="cliente" header="Cliente" ></Column>
                        <Column field="cargamento" header="Tipo Cargamento" ></Column>
                        <Column field="empleado" header="Piloto" ></Column>
                        <Column field="estado" header="Estado" body={estadoBodyTemplate} ></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={asignacionDialog} style={{ width: '700px' }} header={asignacion.idAsignacion ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={asignacionDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre">Viaje*</label>
                            <Select 
                                value={asignacion.idViaje} 
                                className="w-full"
                                id="idViaje" 
                                name="idViaje" 
                                label="Cliente*"
                                onChange={onInputChange}
                            >
                                {viajes.map((item, index) => (
                                    <MenuItem value={item.idViaje} key={index} onClick={()=>{setViaje(item)}}>
                                        {item.origen +" - "+ item.destino + " Cargamento: " + item.cargamento}
                                    </MenuItem>
                                ))}
                            </Select>
                            { submitted &&  !asignacion.idViaje && <small className="p-error">Viaje es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nombre">Vehiculo*</label>
                            <Select 
                                value={asignacion.idVehiculo} 
                                className="w-full"
                                id="idVehiculo" 
                                name="idVehiculo" 
                                onChange={onInputChange}
                            >
                                {vehiculos.map((item, index) => (
                                    <MenuItem value={item.idVehiculo} key={index}>
                                        {"PLACA: " + item.placa +" - MARCA: "+ item.marca + " - MODELO: " + item.modelo}
                                    </MenuItem>
                                ))}
                            </Select>
                            { submitted &&  !asignacion.idVehiculo && <small className="p-error">Vehiculo es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="nombre">Piloto*</label>
                            <Select 
                                value={asignacion.idEmpleado} 
                                className="w-full"
                                id="idEmpleado" 
                                name="idEmpleado" 
                                onChange={onInputChange}
                            >
                                {empleados.map((item, index) => (
                                    <MenuItem value={item.idEmpleado} key={index}>
                                        {item.nombre +" "+ item.apellido}
                                    </MenuItem>
                                ))}
                            </Select>
                            { submitted &&  !asignacion.idEmpleado && <small className="p-error">Piloto es requerido.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deleteAsigncionDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteAsigncionDialogFooter} onHide={hideDeleteAsigncionDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {asignacion && <span>Desea eliminar este item: <b>{asignacion.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={asignacionReportDialog} style={{ width: '1500px' }} modal className="p-fluid"  onHide={hideDialogReporte}>
                        <PDFViewer style={{width:"100%", height: "90vh"}}>
                            <ReportAsignacion 
                                asignaciones={asignaciones}
                            />
                        </PDFViewer>
                    </Dialog>

                    <Dialog visible={empezarDialog} style={{ width: '450px' }} modal className="p-fluid" footer={empezarRutaDialogFooter} onHide={hideEmpezarDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {<span>Esta seguro de iniciar la Ruta?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={terminarDialog} style={{ width: '450px' }} modal className="p-fluid" footer={terminarRutaDialogFooter} onHide={hideTerminarDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {<span>Esta seguro de finalizar la Ruta?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

export default Asignacion;