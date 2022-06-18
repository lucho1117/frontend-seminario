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
import { MenuItem, Select, TextField } from '@mui/material';
const bcrypt = require("bcryptjs");
const  Empleado = () => {

    const [flagCrud, setFlagCrud] = useState(false);
    const [idArea, setIdArea] = useState("");

    let formEmpleado = {
        idAreaNegocio: idArea,
        idRol: "",
        nombre: "",
        apellido: "",
        dpi: "",
        nit: "",
        direccion: "",
        email: "",
        fechaNacimiento: "",
        telefono: null,
        fechaIngreso:"",
        sueldo: "",
        idSede: "",
        password: ""
    };

    const [empleados, setEmpleados] = useState(null);
    const [empleadosDialog, setEmpleadosDialog] = useState(false);
    const [deleteEmpleadosDialog, setDeleteEmpleadosDialog] = useState(false);
    const [empleado, setEmpleado] = useState(formEmpleado);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [listRol, setListRol] = useState([]);
    const [listSede, setListSede] = useState([]);
    const [empresa, setEmpresa] = useState("");
  
    useEffect(() => {
        if (idArea) {
            list();
            getListRol();
            getListSede();
        }
      // eslint-disable-next-line
    }, [idArea]);
    

    const list = async()  => {
        let aux = {idAreaNegocio: idArea};
        let resp = await Service.listByArea(aux);
        if (resp.valid) {
            setEmpleados(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const getListRol = async()  => {
        let aux = [];
        let resp = await Service.listRol();
        if (resp.valid) {

            if (idArea === 1)  aux = resp.data.filter(item => item.idRol === 3 || item.idRol === 7);
            if (idArea === 2 || idArea === 3)  aux = resp.data.filter(item => item.idRol === 4 || item.idRol === 8);
            if (idArea === 4)  aux = resp.data.filter(item => item.idRol === 10 || item.idRol === 11);
            if (idArea === 5 || idArea === 6)  aux = resp.data.filter(item => item.idRol === 5 || item.idRol === 9);
            setListRol(aux);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const getListSede = async()  => {
        let aux = [];
        let resp = await Service.listSede();
        if (resp.valid) {
            if (idArea === 2 || idArea === 3 || idArea === 4)  aux = resp.data.filter(item => item.idSede === 8);
            if (idArea === 1)  aux = resp.data.filter(item => item.idSede === 5 || item.idSede === 4 || item.idSede === 3 || item.idSede === 8);
            if (idArea === 5)  aux = resp.data.filter(item => item.idSede === 1 || item.idSede === 2 || item.idSede === 3 || item.idSede === 4);
            if (idArea === 6)  aux = resp.data.filter(item => item.idSede === 5 || item.idSede === 6 || item.idSede === 7);
            setListSede(aux);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }


    const openNew = () => {
        setEmpleado(formEmpleado);
        setSubmitted(false);
        setEmpleadosDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setEmpleadosDialog(false);
    }

    const hideDeleteEmpleadosDialog = () => {
        setDeleteEmpleadosDialog(false);
    }

    const submit = () => {
        
        if (empleado.nombre && empleado.apellido && empleado.dpi && empleado.nit && empleado.direccion && empleado.email) {
             if (empleado.idEmpleado) {
                 edit();
             } else {
                criptPassword();
             }
        } 
    }

    const criptPassword = async () => {
       
        let pasw = "";
        empleado.password = bcrypt.hash(pasw, 10, function (err, data){
            if (data) {
                empleado.password = data
                save(empleado);   
            }
        })
           
    }

    const save = async (empleado) => {
           
        let resp = await Service.save(empleado);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(empleado);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editempleado = (empleado) => {
        setEmpleado({ ...empleado });
        setEmpleadosDialog(true);
    }

    const confirmDeleteempleado = (empleado) => {
        setEmpleado(empleado);
        setDeleteEmpleadosDialog(true);
    }

    const deleteempleado = async () => {
        let resp = await Service.deleteById(empleado);
        if ( resp.valid ) {
            list();
            setDeleteEmpleadosDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setEmpleado({
            ...empleado,
            [name]: value,
        });
        setSubmitted(true);
    }


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="AGREGAR" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="VOLVER" icon="pi pi-plus" className="p-button-warning mr-2" onClick={()=> { setFlagCrud(false)}} />
                </div>
            </React.Fragment>
        )
    }



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editempleado(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteempleado(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{empresa} - Empleados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const empleadosDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={empleado.idEmpleado ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteEmpleadosDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEmpleadosDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deleteempleado} />
        </>
    );

    return (
        <div className="grid crud-demo">

            {
                !flagCrud ? (
                    <>
                    <div className="col-12 md:col-4">
                        <div className="card card-w-title" onClick={() => {setFlagCrud(true); setIdArea(1); setEmpresa("VENTAS")    } } >
                            <div className="text-center">
                                <img height="400" alt='' src="assets/demo/images/ventaProducto.jpeg" className="w-9 shadow-2 my-3 mx-0" />
                                <div className="text-2xl font-bold">VENTAS</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 md:col-4">
                        <div className="card card-w-title">
                            <div className="text-center" onClick={() => {setFlagCrud(true); setIdArea(2); setEmpresa("TRANSPORTE DE MATERIA PRIMA")  }}>
                                <img height="400" alt='' src="assets/demo/images/transporte1.jpeg" className="w-9 shadow-2 my-3 mx-0" />
                                <div className="text-2xl font-bold">TRANSPORTE DE MATERIA PRIMA</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 md:col-4">
                        <div className="card card-w-title">
                            <div className="text-center" onClick={() => {setFlagCrud(true); setIdArea(3); setEmpresa("TRANSPORTE DE PRODUCTOS") }}>
                                <img height="400" alt='' src="assets/demo/images/transporte2.webp" className="w-9 shadow-2 my-3 mx-0" />
                                <div className="text-2xl font-bold">TRANSPORTE DE PRODUCTOS</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 md:col-4">
                        <div className="card card-w-title"onClick={() => {setFlagCrud(true); setIdArea(4); setEmpresa("CONSTRUCCIÓN") }}>
                            <div className="text-center">
                                <img height="400" alt='' src="assets/demo/images/construccion.webp" className="w-9 shadow-2 my-3 mx-0" />
                                <div className="text-2xl font-bold">CONSTRUCCIÓN</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 md:col-4">
                        <div className="card card-w-title">
                            <div className="text-center" onClick={() => {setFlagCrud(true); setIdArea(5); setEmpresa("PLANTAS DE EXTRACCIÓN")}}>
                                <img height="400" alt='' src="assets/demo/images/planta1.webp" className="w-9 shadow-2 my-3 mx-0" />
                                <div className="text-2xl font-bold">PLANTAS DE EXTRACCIÓN</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 md:col-4">
                        <div className="card card-w-title">
                            <div className="text-center" onClick={() => {setFlagCrud(true); setIdArea(6); setEmpresa("PLANTAS DE PROCESO"); }}>
                                <img height="400" alt='' src="assets/demo/images/planta2.jpeg" className="w-9 shadow-2 my-3 mx-0" />
                                <div className="text-2xl font-bold">PLANTAS DE PROCESO</div>
                            </div>
                        </div>
                    </div>
                    </>
                ): null
            }
            

            {
                flagCrud ? (
                    <div className="col-12">
                        <div className="card">
                            <Toast ref={toast} />
                            <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>
        
                            <DataTable ref={dt} value={empleados}
                                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} empleados"
                                globalFilter={globalFilter} emptyMessage="No empleados found." header={header} responsiveLayout="scroll">
        
                                <Column field="idEmpleado" header="ID" sortable ></Column>
                                <Column field="nombre" header="Nombre" sortable></Column>
                                <Column field="nit" header="Nit" sortable></Column>
                                <Column field="telefono" header="Telefono"  sortable></Column>
                                <Column field="email" header="Email"  sortable ></Column>
                                <Column field="rol" header="Rol"  sortable ></Column>
                                <Column field="areaNegocio" header="Area"  sortable ></Column>
                                <Column body={actionBodyTemplate}></Column>
                            </DataTable>
        
                            <Dialog visible={empleadosDialog} style={{ width: '1000px' }} header={empleado.idEmpleado ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={empleadosDialogFooter} onHide={hideDialog}>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="nombre">Nombre</label>
                                        <InputText 
                                            id="nombre" 
                                            name="nombre"
                                            value={empleado.nombre} 
                                            onChange={onInputChange} 
                                            required 
                                            autoFocus 
                                            className={classNames({ 'p-error': submitted && !empleado.nombre })} 
                                        />
                                        { submitted &&  !empleado.nombre && <small className="p-error">Nombre es requerido.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="apellido">Apellido</label>
                                        <InputText 
                                            id="apellido" 
                                            name="apellido"
                                            value={empleado.apellido} 
                                            onChange={onInputChange} 
                                            required 
                                            className={classNames({ 'p-error': submitted && !empleado.apellido })} 
                                        />
                                        { submitted &&  !empleado.apellido && <small className="p-error">Apellido es requerido.</small>}
                                
                                    </div>
                                </div>
        
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="price">DPI</label>
                                        <TextField
                                            type="number"
                                            id="dpi"
                                            name="dpi"
                                            value={ empleado.dpi }
                                            onChange={onInputChange}
                                            variant="outlined"
                                            fullWidth
                                            required
                                            className="w-full"
                                        />
                                        { submitted &&  !empleado.dpi && <small className="p-error">DPI es requerido.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="quantity">NIT</label>
                                        <TextField
                                            type="number"
                                            id="nit"
                                            name="nit"
                                            value={ empleado.nit }
                                            onChange={onInputChange}
                                            variant="outlined"
                                            fullWidth
                                            required
                                            className="w-full"
                                        />
                                        { submitted &&  !empleado.nit && <small className="p-error">Nit es requerido.</small>}
                                    </div>
                                </div>
        
                                <div className="field">
                                    <label htmlFor="nombre">Dirección</label>
                                    <InputText 
                                        id="direccion" 
                                        name="direccion"
                                        value={empleado.direccion} 
                                        onChange={onInputChange} 
                                        required 
                                        className={classNames({ 'p-error': submitted && !empleado.direccion })} 
                                    />
                                    { submitted &&  !empleado.direccion && <small className="p-error">Direccion es requerido.</small>}
                                </div>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="nombre">Email</label>
                                        <TextField
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="w-full"
                                            value={ empleado.email }
                                            onChange={onInputChange}
                                            variant="outlined"
                                            fullWidth
                                            required
                                        />
                                        { submitted &&  !empleado.email && <small className="p-error">Email es requerido.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="nombre">Fecha Nacimiento</label>
                                        <TextField
                                            type="date"
                                            id="fechaNacimiento"
                                            name="fechaNacimiento"
                                            className="w-full"
                                            value={ empleado.fechaNacimiento }
                                            onChange={onInputChange}
                                            variant="outlined"
                                            fullWidth
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="nombre">Telefono</label>
                                        <TextField
                                            type="number"
                                            id="telefono"
                                            name="telefono"
                                            className="w-full"
                                            value={ empleado.telefono }
                                            onChange={onInputChange}
                                            variant="outlined"
                                            fullWidth
                                            required
                                        />
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="nombre">Fecha Ingreso</label>
                                        <TextField
                                            type="date"
                                            id="fechaIngreso"
                                            name="fechaIngreso"
                                            className="w-full"
                                            value={ empleado.fechaIngreso }
                                            onChange={onInputChange}
                                            variant="outlined"
                                            fullWidth
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="descripcion">Rol*</label>
                                        <Select 
                                            value={empleado.idRol} 
                                            className="w-full"
                                            id="idRol" 
                                            name="idRol" 
                                            onChange={onInputChange}
                                        >
                                            {listRol.map((item, index) => (
                                                <MenuItem value={item.idRol} key={index}>
                                                    {item.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        { submitted &&  !empleado.idRol && <small className="p-error">Rol es requerido.</small>}
                                    </div>
                                    <div className="field col">
                                        <label htmlFor="descripcion">Sede*</label>
                                        <Select 
                                            value={empleado.idSede} 
                                            className="w-full"
                                            id="idSede" 
                                            name="idSede" 
                                            onChange={onInputChange}
                                        >
                                            {listSede.map((item, index) => (
                                                <MenuItem value={item.idSede} key={index}>
                                                    {item.departamento}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        { submitted &&  !empleado.idSede && <small className="p-error">Sede es requerida.</small>}
                                    </div>
                                </div>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label htmlFor="nombre">Sueldo</label>
                                        <TextField
                                            type="number"
                                            id="sueldo"
                                            name="sueldo"
                                            className="w-full"
                                            value={ empleado.sueldo }
                                            onChange={onInputChange}
                                            variant="outlined"
                                            fullWidth
                                            required
                                        />
                                    </div>
                                    <div className="field col">
                                        {
                                            empleado.idEmpleado ? null : (
                                                <>
                                                <label htmlFor="nombre">Password</label>
                                                <TextField
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    className="w-full"
                                                    value={ empleado.password }
                                                    onChange={onInputChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    required
                                                />
                                                 { submitted &&  !empleado.password && <small className="p-error">Password es requerida.</small>}
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                            </Dialog>
        
                            <Dialog visible={deleteEmpleadosDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteEmpleadosDialogFooter} onHide={hideDeleteEmpleadosDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {empleado && <span>Desea eliminar este item: <b>{empleado.nombre}</b>?</span>}
                                </div>
                            </Dialog>
        
                        </div>
                    </div>

                ): null
            }
           
        </div>
    )
}

export default Empleado;