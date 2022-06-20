import React, { useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MenuItem, Select, TextField } from '@mui/material';
import * as Service from "./Service";
import * as ServiceMateriaPrima from "../../materiaPrima/Service";
import * as ServiceMaquinaria from "../../maquinaria/Service";
import * as ServiceEmpleado from "../../../user/empleado/Service";

const DetalleProceso = (props) => {
    

    let formDetalleProceso = {
        idProceso: props.proceso.idProceso,
        idMateriaPrima: "",
        idMaquinaria: "",
        idEmpleado: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        costo:"",
    };

    const [detalleProcesos, setDetalleProcesos] = useState(null);
    const [materiaPrimas, setMateriaPrimas] = useState([]);
    const [maquinarias, setMaquinarias] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [detalleProcesoDialog, setDetalleProcesoDialog] = useState(false);
    const [deleteDetalleProcesoDialog, setDeleteDetalleProcesoDialog] = useState(false);
    const [detalleProceso, setDetalleProceso] = useState(formDetalleProceso);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

  
    useEffect(() => {
        list();
        listMateriasPrimas();
        listMaquinarias();
        listEmpleados();
        // eslint-disable-next-line
    }, []);

    const list = async()  => {
        let aux = {idProceso:props.proceso.idProceso }
        let resp = await Service.list(aux);
        if (resp.valid) {
            setDetalleProcesos(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listMateriasPrimas = async()  => {
        let resp = await ServiceMateriaPrima.list();
        if (resp.valid) {
            setMateriaPrimas(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listMaquinarias = async()  => {
        let resp = await ServiceMaquinaria.list();
        if (resp.valid) {
            setMaquinarias(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listEmpleados = async()  => {
        let resp = await ServiceEmpleado.listPlantas();
        if (resp.valid) {
            setEmpleados(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }


    const openNew = () => {
        setDetalleProceso(formDetalleProceso);
        setSubmitted(false);
        setDetalleProcesoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setDetalleProcesoDialog(false);
    }

    const hideDeleteDetalleProcesoDialog = () => {
        setDeleteDetalleProcesoDialog(false);
    }

    const submit = () => {
        if (detalleProceso.idMaquinaria &&  detalleProceso.idMateriaPrima) {
             if (detalleProceso.idDetalleProceso) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(detalleProceso);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(detalleProceso);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editdetalleProceso = (detalleProceso) => {
        setDetalleProceso({ ...detalleProceso });
        setDetalleProcesoDialog(true);
    }

    const confirmDeletedetalleProceso = (detalleProceso) => {
        setDetalleProceso(detalleProceso);
        setDeleteDetalleProcesoDialog(true);
    }

    const deletedetalleProceso = async () => {
        let resp = await Service.deleteById(detalleProceso);
        if ( resp.valid ) {
            list();
            setDeleteDetalleProcesoDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;

        if ( name ==='venta') {
            setDetalleProceso({
                ...detalleProceso,
                [name]: !value,
            });
        } else {
            setDetalleProceso({
                ...detalleProceso,
                [name]: value,
            });
        }
       
        setSubmitted(true);
    }


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="AGREGAR" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="VOLVER" icon="pi pi-plus" className="p-button-warning mr-2" onClick={()=> { props.setFlagProceso(false)}} />
                </div>
            </React.Fragment>
        )
    }

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.idDetalleProceso}
            </>
        );
    }

    const materiaPrimaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Materia Prima</span>
                {rowData.materiaPrima}
            </>
        );
    }

    const maquinariaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Maquinaria</span>
                {rowData.maquinaria}
            </>
        );
    }

    const empleadoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Empleado</span>
                {rowData.empleado}
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



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editdetalleProceso(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeletedetalleProceso(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0"> Detalle</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const detalleProcesoDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={detalleProceso.idDetalleProceso ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteDetalleProcesoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDetalleProcesoDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deletedetalleProceso} />
        </>
    );

    
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={detalleProcesos}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} detalleProcesos"
                        globalFilter={globalFilter} emptyMessage="No detalleProcesos found." header={header} responsiveLayout="scroll">

                        <Column field="idDetalleProceso" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '10%', minWidth: '10rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={materiaPrimaBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="categoria" header="Categoria" sortable body={maquinariaBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="descripcion" header="Descripción" body={empleadoBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                        <Column field="price" header="Precio" body={fechaInicioBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                        <Column field="stock" header="Stock" body={fechaFinBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={detalleProcesoDialog} style={{ width: '600px' }} header={detalleProceso.idDetalleProceso ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={detalleProcesoDialogFooter} onHide={hideDialog}>
                     

                        <div className="field">
                            <label htmlFor="descripcion">Materia Prima*</label>
                            <Select 
                                value={detalleProceso.idMateriaPrima} 
                                className="w-full"
                                id="idMateriaPrima" 
                                name="idMateriaPrima" 
                                onChange={onInputChange}>
                                {materiaPrimas.map((item, index) => (
                                    <MenuItem value={item.idMateriaPrima} key={index}>
                                        {item.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                            { submitted &&  !detalleProceso.idMateriaPrima && <small className="p-invalid">Materia Prima es requerida.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="descripcion">Maquinaria*</label>
                            <Select 
                                value={detalleProceso.idMaquinaria} 
                                className="w-full"
                                id="idMaquinaria" 
                                name="idMaquinaria" 
                                onChange={onInputChange}>
                                {maquinarias.map((item, index) => (
                                    <MenuItem value={item.idMaquinaria} key={index}>
                                        {item.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                            { submitted &&  !detalleProceso.idMaquinaria && <small className="p-invalid">Maquinaria es requerida.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="descripcion">Empleado*</label>
                            <Select 
                                value={detalleProceso.idEmpleado} 
                                className="w-full"
                                id="idEmpleado" 
                                name="idEmpleado" 
                                onChange={onInputChange}>
                                {empleados.map((item, index) => (
                                    <MenuItem value={item.idEmpleado} key={index}>
                                        {item.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                            { submitted &&  !detalleProceso.idEmpleado && <small className="p-invalid">Empleado es requerido.</small>}
                        </div>


                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Fecha Inicio</label>
                                <TextField
                                    type="date"
                                    id="fechaInicio"
                                    name="fechaInicio"
                                    value={ detalleProceso.fechaInicio }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Fecha Fin</label>
                                <TextField
                                    type="date"
                                    id="fechaFin"
                                    name="fechaFin"
                                    value={ detalleProceso.fechaFin }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </div>
                        </div>

                        <div className='field'>
                            <label htmlFor="price">Costo</label>
                            <TextField
                                type="number"
                                id="costo"
                                name="costo"
                                value={ detalleProceso.costo }
                                onChange={onInputChange}
                                variant="outlined"
                                fullWidth
                                required
                            />
                        </div>

                    </Dialog>

                    <Dialog visible={deleteDetalleProcesoDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteDetalleProcesoDialogFooter} onHide={hideDeleteDetalleProcesoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            { <span>Desea eliminar el detalle. <b>{detalleProceso.idDetalleProceso}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default DetalleProceso;