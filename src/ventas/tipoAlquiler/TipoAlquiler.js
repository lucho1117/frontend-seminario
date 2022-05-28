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


const TipoAlquiler = () => {

    let formTipoAlquiler = {
        descripcion: "",
        tasaAlquiler:""
    };

    const [tipoAlquileres, setTipoAlquileres] = useState(null);
    const [tipoAlquilerDialog, setTipoAlquilerDialog] = useState(false);
    const [deleteTipoAlquilerDialog, setDeleteTipoAlquilerDialog] = useState(false);
    const [tipoAlquiler, setTipoAlquiler] = useState(formTipoAlquiler);
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
            setTipoAlquileres(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }


    const openNew = () => {
        setTipoAlquiler(formTipoAlquiler);
        setSubmitted(false);
        setTipoAlquilerDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setTipoAlquilerDialog(false);
    }

    const hideDeleteTipoAlquilerDialog = () => {
        setDeleteTipoAlquilerDialog(false);
    }

    const submit = () => {
        if (tipoAlquiler.descripcion && tipoAlquiler.tasaAlquiler) {
             if (tipoAlquiler.idTipoAlquiler) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(tipoAlquiler);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(tipoAlquiler);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editTipoAlquiler = (tipoAlquiler) => {
        setTipoAlquiler({ ...tipoAlquiler });
        setTipoAlquilerDialog(true);
    }

    const confirmDeleteTipoAlquiler = (tipoAlquiler) => {
        setTipoAlquiler(tipoAlquiler);
        setDeleteTipoAlquilerDialog(true);
    }

    const deleteTipoAlquiler = async () => {
        let resp = await Service.deleteById(tipoAlquiler);
        if ( resp.valid ) {
            list();
            setDeleteTipoAlquilerDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setTipoAlquiler({
            ...tipoAlquiler,
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
                {rowData.idTipoAlquiler}
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

    const tasaAlquilerBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tasa Alquiler</span>
                {rowData.tasaAlquiler}%
            </>
        );
    }



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editTipoAlquiler(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteTipoAlquiler(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tipo Alquiler</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const tipoAlquilerDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={tipoAlquiler.idTipoAlquiler ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteTipoAlquilerDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTipoAlquilerDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deleteTipoAlquiler} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={tipoAlquileres}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} tipoAlquileres"
                        globalFilter={globalFilter} emptyMessage="No tipoAlquileres found." header={header} responsiveLayout="scroll">

                        <Column field="idTipoAlquiler" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} sortable headerStyle={{ width: '35%', minWidth: '8rem' }}></Column>
                        <Column field="tasaAlquiler" header="Tasa Alquiler" sortable body={tasaAlquilerBodyTemplate} headerStyle={{ width: '35%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={tipoAlquilerDialog} style={{ width: '450px' }} header={tipoAlquiler.idTipoAlquiler ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={tipoAlquilerDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre">Descripción</label>
                            <InputText 
                                id="descripcion" 
                                name="descripcion"
                                value={tipoAlquiler.descripcion} 
                                onChange={onInputChange} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !tipoAlquiler.descripcion })} 
                            />
                            { submitted &&  !tipoAlquiler.descripcion && <small className="p-invalid">Descripcion es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcion">Tasa Alquiler</label>
                            <InputText
                                type="number"
                                id="tasaAlquiler" 
                                name="tasaAlquiler"
                                value={tipoAlquiler.tasaAlquiler} 
                                onChange={onInputChange} 
                                required 
                            />
                        </div>

                    </Dialog>

                    <Dialog visible={deleteTipoAlquilerDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteTipoAlquilerDialogFooter} onHide={hideDeleteTipoAlquilerDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {tipoAlquiler && <span>Desea eliminar este item: <b>{tipoAlquiler.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default TipoAlquiler