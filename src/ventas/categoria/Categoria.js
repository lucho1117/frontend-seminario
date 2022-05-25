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


const Categoria = () => {

    let formCategoria = {
        nombre: "",
        descripcion: "",
    };

    const [categorias, setCategorias] = useState(null);
    const [categoriaDialog, setCategoriaDialog] = useState(false);
    const [deleteCategoriaDialog, setDeleteCategoriaDialog] = useState(false);
    const [categoria, setCategoria] = useState(formCategoria);
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
            setCategorias(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }


    const openNew = () => {
        setCategoria(formCategoria);
        setSubmitted(false);
        setCategoriaDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCategoriaDialog(false);
    }

    const hideDeleteCategoriaDialog = () => {
        setDeleteCategoriaDialog(false);
    }

    const submit = () => {
        if (categoria.nombre) {
             if (categoria.idCategoria) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(categoria);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(categoria);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editcategoria = (categoria) => {
        setCategoria({ ...categoria });
        setCategoriaDialog(true);
    }

    const confirmDeletecategoria = (categoria) => {
        setCategoria(categoria);
        setDeleteCategoriaDialog(true);
    }

    const deletecategoria = async () => {
        let resp = await Service.deleteById(categoria);
        if ( resp.valid ) {
            list();
            setDeleteCategoriaDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setCategoria({
            ...categoria,
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
                {rowData.idCategoria}
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editcategoria(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeletecategoria(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Categorias de Producto</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const categoriaDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={categoria.idCategoria ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteCategoriaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCategoriaDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deletecategoria} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={categorias}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categorias"
                        globalFilter={globalFilter} emptyMessage="No categorias found." header={header} responsiveLayout="scroll">

                        <Column field="idCategoria" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: '35%', minWidth: '10rem' }}></Column>
                        <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} sortable headerStyle={{ width: '35%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={categoriaDialog} style={{ width: '450px' }} header={categoria.idCategoria ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={categoriaDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText 
                                id="nombre" 
                                name="nombre"
                                value={categoria.nombre} 
                                onChange={onInputChange} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !categoria.nombre })} 
                            />
                            { submitted &&  !categoria.nombre && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputTextarea 
                                id="descripcion" 
                                name="descripcion"
                                value={categoria.descripcion} 
                                onChange={onInputChange} 
                                required 
                                rows={3} 
                                cols={20} 
                            />
                        </div>

                    </Dialog>

                    <Dialog visible={deleteCategoriaDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteCategoriaDialogFooter} onHide={hideDeleteCategoriaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {categoria && <span>Desea eliminar este item: <b>{categoria.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default Categoria