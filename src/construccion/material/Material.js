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
import * as ServiceTipoMaterial from "../tipoMaterial/Service";
import { MenuItem, Select } from '@mui/material';

const Material = () => {

    let formMaterial = {
        idTipoMaterial: "",
        nombre: "",
        descripcion: "",
        precio: ""
    };

    const [materiales, setMateriales] = useState(null);
    const [materialDialog, setMaterialDialog] = useState(false);
    const [deleteMaterialDialog, setDeleteMaterialDialog] = useState(false);
    const [material, setMaterial] = useState(formMaterial);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [tipoMateriales, setTipoMateriales] = useState([]);
  
    useEffect(() => {
        list();
        listTipoMateriales();
    }, []);

    const list = async()  => {
        let resp = await Service.list();
        if (resp.valid) {
            setMateriales(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listTipoMateriales = async()  => {
        let resp = await ServiceTipoMaterial.list();
        if (resp.valid) {
            setTipoMateriales(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }


    const openNew = () => {
        setMaterial(formMaterial);
        setSubmitted(false);
        setMaterialDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setMaterialDialog(false);
    }

    const hideDeleteMaterialDialog = () => {
        setDeleteMaterialDialog(false);
    }

    const submit = () => {
        if (material.nombre && material.idTipoMaterial && material.precio) {
             if (material.idMaterial) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(material);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(material);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editmaterial = (material) => {
        setMaterial({ ...material });
        setMaterialDialog(true);
    }

    const confirmDeletematerial = (material) => {
        setMaterial(material);
        setDeleteMaterialDialog(true);
    }

    const deletematerial = async () => {
        let resp = await Service.deleteById(material);
        if ( resp.valid ) {
            list();
            setDeleteMaterialDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setMaterial({
            ...material,
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
                {rowData.idMaterial}
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

    const tipoMaterialBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tipo Material</span>
                {rowData.tipoMaterial}
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editmaterial(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeletematerial(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Materiales</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const materialDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={material.idMaterial ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteMaterialDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMaterialDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deletematerial} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={materiales}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} materiales"
                        globalFilter={globalFilter} emptyMessage="No materiales found." header={header} responsiveLayout="scroll">

                        <Column field="idMaterial" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '5%', minWidth: '10rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: '25%', minWidth: '10rem' }}></Column>
                        <Column field="idTipoMaterial" header="Tipo Material" body={tipoMaterialBodyTemplate} sortable headerStyle={{ width: '25%', minWidth: '8rem' }}></Column>
                        <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} sortable headerStyle={{ width: '25%', minWidth: '8rem' }}></Column>
                        <Column field="precio" header="Precio" body={precioBodyTemplate} sortable headerStyle={{ width: '25%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={materialDialog} style={{ width: '450px' }} header={material.idMaterial ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={materialDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="descripcion">Tipo Material*</label>
                            <Select 
                                value={material.idTipoMaterial} 
                                className="w-full"
                                id="idTipoMaterial" 
                                name="idTipoMaterial" 
                                autoFocus 
                                onChange={onInputChange}>
                                {tipoMateriales.map((item, index) => (
                                    <MenuItem value={item.idTipoMaterial} key={index}>
                                        {item.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                            { submitted &&  !material.idTipoMaterial && <small className="p-invalid">Tipo Material es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nombre">Nombre*</label>
                            <InputText 
                                id="nombre" 
                                name="nombre"
                                value={material.nombre} 
                                onChange={onInputChange} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-error': submitted && !material.nombre })} 
                            />
                            { submitted &&  !material.nombre && <small className="p-error">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nombre">Precio*</label>
                            <InputText 
                                id="precio" 
                                name="precio"
                                type="number"
                                value={material.precio} 
                                onChange={onInputChange} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-error': submitted && !material.precio })} 
                            />
                            { submitted &&  !material.precio && <small className="p-error">Precio es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputTextarea 
                                id="descripcion" 
                                name="descripcion"
                                value={material.descripcion} 
                                onChange={onInputChange} 
                                required 
                                rows={3} 
                                cols={20} 
                            />
                        </div>

                    </Dialog>

                    <Dialog visible={deleteMaterialDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteMaterialDialogFooter} onHide={hideDeleteMaterialDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {material && <span>Desea eliminar este item: <b>{material.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default Material;