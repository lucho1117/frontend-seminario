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


const TipoVehiculo = () => {

    let formTipoVehiculo = {
        nombre: "",
        descripcion: "",
        ejes: "",
        toneladas: ""
    };

    const [tipoVehiculos, setTipoVehiculos] = useState(null);
    const [tipoVehiculoDialog, setTipoVehiculoDialog] = useState(false);
    const [deleteTipoVehiculoDialog, setDeleteTipoVehiculoDialog] = useState(false);
    const [tipoVehiculo, setTipoVehiculo] = useState(formTipoVehiculo);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
  
    useEffect(() => {
        list();
    }, []);

    const list = async()  => {
        let resp = await Service.list();
        if (resp.valid) {
            setTipoVehiculos(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }


    const openNew = () => {
        setTipoVehiculo(formTipoVehiculo);
        setSubmitted(false);
        setTipoVehiculoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setTipoVehiculoDialog(false);
    }

    const hideDeleteTipoVehiculoDialog = () => {
        setDeleteTipoVehiculoDialog(false);
    }

    const submit = () => {
        if (tipoVehiculo.nombre) {
             if (tipoVehiculo.idTipoVehiculo) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(tipoVehiculo);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(tipoVehiculo);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const edittipoVehiculo = (tipoVehiculo) => {
        setTipoVehiculo({ ...tipoVehiculo });
        setTipoVehiculoDialog(true);
    }

    const confirmDeletetipoVehiculo = (tipoVehiculo) => {
        setTipoVehiculo(tipoVehiculo);
        setDeleteTipoVehiculoDialog(true);
    }

    const deletetipoVehiculo = async () => {
        let resp = await Service.deleteById(tipoVehiculo);
        if ( resp.valid ) {
            list();
            setDeleteTipoVehiculoDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setTipoVehiculo({
            ...tipoVehiculo,
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
                {rowData.idTipoVehiculo}
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

    const ejesBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Ejes</span>
                {rowData.ejes}
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => edittipoVehiculo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeletetipoVehiculo(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tipo de Vehiculos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const tipoVehiculoDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={tipoVehiculo.idTipoVehiculo ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteTipoVehiculoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTipoVehiculoDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deletetipoVehiculo} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={tipoVehiculos}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} tipoVehiculos"
                        globalFilter={globalFilter} emptyMessage="No tipoVehiculos found." header={header} responsiveLayout="scroll">

                        <Column field="idTipoVehiculo" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: '25%', minWidth: '10rem' }}></Column>
                        <Column field="ejes" header="Ejes" sortable body={ejesBodyTemplate} headerStyle={{ width: '10%', minWidth: '10rem' }}></Column>
                        <Column field="toneladas" header="Toneladas" sortable body={toneladasBodyTemplate} headerStyle={{ width: '10%', minWidth: '10rem' }}></Column>
                        <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} sortable headerStyle={{ width: '35%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={tipoVehiculoDialog} style={{ width: '450px' }} header={tipoVehiculo.idTipoVehiculo ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={tipoVehiculoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre">Nombre*</label>
                            <InputText 
                                id="nombre" 
                                name="nombre"
                                value={tipoVehiculo.nombre} 
                                onChange={onInputChange} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !tipoVehiculo.nombre })} 
                            />
                            { submitted &&  !tipoVehiculo.nombre && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="ejes">Ejes</label>
                            <InputText 
                                id="ejes" 
                                name="ejes"
                                type="number"
                                value={tipoVehiculo.ejes} 
                                onChange={onInputChange} 
                                required 
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="toneladas">Toneladas</label>
                            <InputText 
                                id="toneladas" 
                                name="toneladas"
                                type="number"
                                value={tipoVehiculo.toneladas} 
                                onChange={onInputChange} 
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputTextarea 
                                id="descripcion" 
                                name="descripcion"
                                value={tipoVehiculo.descripcion} 
                                onChange={onInputChange} 
                                required 
                                rows={3} 
                                cols={20} 
                            />
                        </div>

                    </Dialog>

                    <Dialog visible={deleteTipoVehiculoDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteTipoVehiculoDialogFooter} onHide={hideDeleteTipoVehiculoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {tipoVehiculo && <span>Desea eliminar este item: <b>{tipoVehiculo.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default TipoVehiculo