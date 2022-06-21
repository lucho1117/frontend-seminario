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
import { MenuItem, Select } from '@mui/material';
import * as ServiceTipoMaquinaria from '../tipoMaquinaria/Service';


const Maquinaria = () => {

    let formMaquinaria = {
        idTipoMaquinaria: "",
        nombre: "",
        descripcion: "",
    };

    const [maquinarias, setMaquinarias] = useState(null);
    const [maquinariaDialog, setMaquinariaDialog] = useState(false);
    const [deleteMaquinariaDialog, setDeleteMaquinariaDialog] = useState(false);
    const [maquinaria, setMaquinaria] = useState(formMaquinaria);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [tiposMaquinarias, setTiposMaquinarias] = useState([]);
  
    useEffect(() => {
        list();
        listTipoMaquinaria();
    }, []);

    const list = async()  => {
        let resp = await Service.list();
        if (resp.valid) {
            setMaquinarias(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listTipoMaquinaria = async () => {
        let resp = await ServiceTipoMaquinaria.list();
        if (resp.valid) {
            setTiposMaquinarias(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const openNew = () => {
        setMaquinaria(formMaquinaria);
        setSubmitted(false);
        setMaquinariaDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setMaquinariaDialog(false);
    }

    const hideDeleteMaquinariaDialog = () => {
        setDeleteMaquinariaDialog(false);
    }

    const submit = () => {
        if (maquinaria.nombre) {
             if (maquinaria.idMaquinaria) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(maquinaria);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(maquinaria);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editmaquinaria = (maquinaria) => {
        setMaquinaria({ ...maquinaria });
        setMaquinariaDialog(true);
    }

    const confirmDeletemaquinaria = (maquinaria) => {
        setMaquinaria(maquinaria);
        setDeleteMaquinariaDialog(true);
    }

    const deletemaquinaria = async () => {
        let resp = await Service.deleteById(maquinaria);
        if ( resp.valid ) {
            list();
            setDeleteMaquinariaDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setMaquinaria({
            ...maquinaria,
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
                {rowData.idMaquinaria}
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editmaquinaria(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeletemaquinaria(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Maquinarias</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const maquinariaDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={maquinaria.idMaquinaria ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteMaquinariaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMaquinariaDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deletemaquinaria} />
        </>
    );

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    Cada vehiculo se encuentra monitoreado por GPS-inversiones
                </div>
            </React.Fragment>
        )
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={maquinarias}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} maquinarias"
                        globalFilter={globalFilter} emptyMessage="No maquinarias found." header={header} responsiveLayout="scroll">

                        <Column field="idMaquinaria" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '5%', minWidth: '10rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: '25%', minWidth: '10rem' }}></Column>
                        <Column field="tipoMaquinaria" header="Tipo maquinaria" sortable headerStyle={{ width: '25%', minWidth: '8rem' }}></Column>
                        <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} sortable headerStyle={{ width: '25%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={maquinariaDialog} style={{ width: '450px' }} header={maquinaria.idMaquinaria ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={maquinariaDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="price">Tipo Maquinaria*</label>
                            <Select 
                                value={maquinaria.idTipoMaquinaria} 
                                className="w-full"
                                id="idTipoMaquinaria" 
                                name="idTipoMaquinaria" 
                                onChange={onInputChange}
                                autoFocus 
                            >
                                {tiposMaquinarias.map((item, index) => (
                                    <MenuItem value={item.idTipoMaquinaria} key={index}>
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
                                value={maquinaria.nombre} 
                                onChange={onInputChange} 
                                required 
                                className={classNames({ 'p-error': submitted && !maquinaria.nombre })} 
                            />
                            { submitted &&  !maquinaria.nombre && <small className="p-error">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputTextarea 
                                id="descripcion" 
                                name="descripcion"
                                value={maquinaria.descripcion} 
                                onChange={onInputChange} 
                                required 
                                rows={3} 
                                cols={20} 
                            />
                        </div>

                    </Dialog>

                    <Dialog visible={deleteMaquinariaDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteMaquinariaDialogFooter} onHide={hideDeleteMaquinariaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {maquinaria && <span>Desea eliminar este item: <b>{maquinaria.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default Maquinaria;