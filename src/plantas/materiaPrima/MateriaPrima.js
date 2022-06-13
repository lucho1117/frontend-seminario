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
import { MenuItem, Select, TextField } from '@mui/material';
import * as ServiceTipoMateriaPrima from '../tipoMateriaPrima/Service';


const MateriaPrima = () => {

    let formMateriaPrima = {
        idTipoMateriaPrima: "",
        nombre: "",
        descripcion: "",
        fechaIngreso: "",
        stock:""
    };

    const [materiaPrimas, setMateriaPrimas] = useState(null);
    const [materiaPrimaDialog, setMateriaPrimaDialog] = useState(false);
    const [deleteMateriaPrimaDialog, setDeleteMateriaPrimaDialog] = useState(false);
    const [materiaPrima, setMateriaPrima] = useState(formMateriaPrima);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [tiposMateriasPrimas, setTiposMateriasPrimas] = useState([]);
  
    useEffect(() => {
        list();
        listTipoMateriaPrima();
    }, []);

    const list = async()  => {
        let resp = await Service.list();
        if (resp.valid) {
            setMateriaPrimas(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listTipoMateriaPrima = async () => {
        let resp = await ServiceTipoMateriaPrima.list();
        if (resp.valid) {
            setTiposMateriasPrimas(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const openNew = () => {
        setMateriaPrima(formMateriaPrima);
        setSubmitted(false);
        setMateriaPrimaDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setMateriaPrimaDialog(false);
    }

    const hideDeleteMateriaPrimaDialog = () => {
        setDeleteMateriaPrimaDialog(false);
    }

    const submit = () => {
        if (materiaPrima.nombre) {
             if (materiaPrima.idMateriaPrima) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(materiaPrima);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(materiaPrima);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editmateriaPrima = (materiaPrima) => {
        setMateriaPrima({ ...materiaPrima });
        setMateriaPrimaDialog(true);
    }

    const confirmDeletemateriaPrima = (materiaPrima) => {
        setMateriaPrima(materiaPrima);
        setDeleteMateriaPrimaDialog(true);
    }

    const deletemateriaPrima = async () => {
        let resp = await Service.deleteById(materiaPrima);
        if ( resp.valid ) {
            list();
            setDeleteMateriaPrimaDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setMateriaPrima({
            ...materiaPrima,
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
                {rowData.idMateriaPrima}
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


    const descripcionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Descripcion</span>
                {rowData.descripcion}
            </>
        );
    }



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editmateriaPrima(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeletemateriaPrima(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Materias Primas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const materiaPrimaDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={materiaPrima.idMateriaPrima ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteMateriaPrimaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMateriaPrimaDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deletemateriaPrima} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={materiaPrimas}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} materiaPrimas"
                        globalFilter={globalFilter} emptyMessage="No materiaPrimas found." header={header} responsiveLayout="scroll">

                        <Column field="idMateriaPrima" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '5%', minWidth: '10rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="tipoMateriaPrima" header="Tipo Materia Prima" sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                        <Column field="fechaIngreso" header="Fecha Ingreso" sortable headerStyle={{ width: '25%', minWidth: '8rem' }}></Column>
                        <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} sortable headerStyle={{ width: '25%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={materiaPrimaDialog} style={{ width: '450px' }} header={materiaPrima.idMateriaPrima ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={materiaPrimaDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="price">Tipo Materia Prima*</label>
                            <Select 
                                value={materiaPrima.idTipoMateriaPrima} 
                                className="w-full"
                                id="idTipoMateriaPrima" 
                                name="idTipoMateriaPrima" 
                                onChange={onInputChange}
                                autoFocus 
                            >
                                {tiposMateriasPrimas.map((item, index) => (
                                    <MenuItem value={item.idTipoMateriaPrima} key={index}>
                                        {item.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        <div className="field">
                            <label htmlFor="nombre">Nombre*</label>
                            <InputText 
                                id="nombre" 
                                name="nombre"
                                value={materiaPrima.nombre} 
                                onChange={onInputChange} 
                                required 
                                className={classNames({ 'p-error': submitted && !materiaPrima.nombre })} 
                            />
                            { submitted &&  !materiaPrima.nombre && <small className="p-error">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputTextarea 
                                id="descripcion" 
                                name="descripcion"
                                value={materiaPrima.descripcion} 
                                onChange={onInputChange} 
                                required 
                                rows={3} 
                                cols={20} 
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="price">Fecha Ingreso</label>
                            <TextField
                                type="date"
                                id="fechaIngreso"
                                name="fechaIngreso"
                                value={ materiaPrima.fechaIngreso }
                                onChange={onInputChange}
                                variant="outlined"
                                fullWidth
                                required
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="price">Existencia</label>
                            <TextField
                                type="number"
                                id="stock"
                                name="stock"
                                value={ materiaPrima.stock }
                                onChange={onInputChange}
                                variant="outlined"
                                fullWidth
                                required
                            />
                        </div>

                    </Dialog>

                    <Dialog visible={deleteMateriaPrimaDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteMateriaPrimaDialogFooter} onHide={hideDeleteMateriaPrimaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {materiaPrima && <span>Desea eliminar este item: <b>{materiaPrima.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default MateriaPrima;