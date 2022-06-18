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


const TipoObra = () => {

    let formTipoObra = {
        nombre: "",
        descripcion: "",
    };

    const [tipoObras, setTipoObras] = useState(null);
    const [tipoObraDialog, setTipoObraDialog] = useState(false);
    const [deletetipoTipoObraDialog, setDeletetipoTipoObraDialog] = useState(false);
    const [tipoObra, setTipoObra] = useState(formTipoObra);
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
            setTipoObras(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }


    const openNew = () => {
        setTipoObra(formTipoObra);
        setSubmitted(false);
        setTipoObraDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setTipoObraDialog(false);
    }

    const hideDeletetipoTipoObraDialog = () => {
        setDeletetipoTipoObraDialog(false);
    }

    const submit = () => {
        if (tipoObra.nombre) {
             if (tipoObra.idTipoObra) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(tipoObra);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(tipoObra);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const edittipoObra = (tipoObra) => {
        setTipoObra({ ...tipoObra });
        setTipoObraDialog(true);
    }

    const confirmDeletetipoObra = (tipoObra) => {
        setTipoObra(tipoObra);
        setDeletetipoTipoObraDialog(true);
    }

    const deletetipoObra = async () => {
        let resp = await Service.deleteById(tipoObra);
        if ( resp.valid ) {
            list();
            setDeletetipoTipoObraDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setTipoObra({
            ...tipoObra,
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
                {rowData.idTipoObra}
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => edittipoObra(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeletetipoObra(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tipo de obras</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const tipoObraDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={tipoObra.idTipoObra ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deletetipoTipoObraDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletetipoTipoObraDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deletetipoObra} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={tipoObras}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} tipoObras"
                        globalFilter={globalFilter} emptyMessage="No tipoObras found." header={header} responsiveLayout="scroll">

                        <Column field="idTipoObra" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: '35%', minWidth: '10rem' }}></Column>
                        <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} sortable headerStyle={{ width: '35%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={tipoObraDialog} style={{ width: '450px' }} header={tipoObra.idTipoObra ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={tipoObraDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText 
                                id="nombre" 
                                name="nombre"
                                value={tipoObra.nombre} 
                                onChange={onInputChange} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-error': submitted && !tipoObra.nombre })} 
                            />
                            { submitted &&  !tipoObra.nombre && <small className="p-error">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputTextarea 
                                id="descripcion" 
                                name="descripcion"
                                value={tipoObra.descripcion} 
                                onChange={onInputChange} 
                                required 
                                rows={3} 
                                cols={20} 
                            />
                        </div>

                    </Dialog>

                    <Dialog visible={deletetipoTipoObraDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deletetipoTipoObraDialogFooter} onHide={hideDeletetipoTipoObraDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {tipoObra && <span>Desea eliminar este item: <b>{tipoObra.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default TipoObra;