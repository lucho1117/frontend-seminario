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
import * as ServiceCliente from "../../user/clientes/Service";
import * as ServiceEmpleado from "../../user/empleado/Service";
import * as ServiceProducto from "../producto/Service";
import * as ServiceTipoAlquiler from "../tipoAlquiler/Service";
import moment from 'moment';
import ReportAlquiler from './ReportAlquiler';
import { PDFViewer } from '@react-pdf/renderer';

const Alquiler = (props) => {
  let formAlquiler = {
    idCliente: "",
    idTipoPago: "",
    idEmpleado: "",
    fecha: "",
    direccion: "",
    total: "",

    idProducto:"",
    idTipoAlquiler:"",
    cantidad: 1,
    totalDetalle:"",
    fechaProxima: "",

    precio: ""
};

const [alquiler, setalquiler] = useState(formAlquiler);
const [alquileres, setAlquileres] = useState(null);
const [tipoAlquileres, setTipoAlquileres] = useState([]);
const [clientes, setClientes] = useState([]);
const [empleados, setEmpleados] = useState([]);
const [tipoPago, setTipoPago] = useState([]);
const [productos, setProductos] = useState([]);
const [alquilerDialog, setAlquilerDialog] = useState(false);
const [deleteAlquilerDialog, setDeleteAlquilerDialog] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [globalFilter, setGlobalFilter] = useState(null);
const toast = useRef(null);
const dt = useRef(null);

const [producto, setProducto] = useState("");
const [tipo, setTipo] = useState("");

const [facturaDialog, setFacturaDialog] = useState(false);
const [reporteFactura, setReporteFactura] = useState("");

useEffect(() => {
    list();
    listClientes();
    listEmpleados();
    listTipoPago();
    listProductos();
    listTipoAlquiler();
}, []);

useEffect(() => {
  
   
        setalquiler({
            ...alquiler,
            precio: producto.precio
        });
    
  
}, [producto]);

useEffect(() => {
  
    if (tipo.idTipoAlquiler) {

        setalquiler({
            ...alquiler,
            total: (tipo.tasaAlquiler * producto.precio) / 100,
            totalDetalle: (tipo.tasaAlquiler * producto.precio) / 100,
            fechaProxima: 
                tipo.idTipoAlquiler === 1 ? moment( sumarDias(new Date(), 30)).format("YYYY-MM-DD") :
                tipo.idTipoAlquiler === 2 ? moment( sumarDias(new Date(), 7)).format("YYYY-MM-DD") :
                moment( sumarDias(new Date(), 1)).format("YYYY-MM-DD")
        });
    }
  
}, [tipo]);



const list = async()  => {
    let aux = {alquiler: 1}
    let resp = await Service.list(aux);
    if (resp.valid) {
        setAlquileres(resp.data);
    } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
    }
}
const listClientes = async()  => {
    let aux = {idNegocio: 3};
    let resp = await ServiceCliente.listByNegocio(aux);
    if (resp.valid) {
        setClientes(resp.data);
    } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
    }
}

const listEmpleados = async()  => {
    let aux = {idRol: 7, idAreaNegocio: 1};
    let resp = await ServiceEmpleado.listByRolByArea(aux);
    if (resp.valid) {
        setEmpleados(resp.data);
    } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
    }
}

const listTipoPago = async()  => {
    let resp = await Service.listTipoPago();
    if (resp.valid) {
        setTipoPago(resp.data);
    } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
    }
}

const listProductos = async()  => {
    let aux = {venta: 0}
    let resp = await ServiceProducto.list(aux);
    if (resp.valid) {
        setProductos(resp.data);
    } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
    }
}

const listTipoAlquiler = async()  => {
    let resp = await ServiceTipoAlquiler.list();
    if (resp.valid) {
        setTipoAlquileres(resp.data);
    } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
    }
}



const openNew = () => {
    setalquiler(formAlquiler);
    setSubmitted(false);
    setAlquilerDialog(true);
}

const hideDialog = () => {
    setSubmitted(false);
    setAlquilerDialog(false);
}

const hideDeleteAlquilerDialog = () => {
    setDeleteAlquilerDialog(false);
}

const submit = () => {
    if (alquiler.idCliente && alquiler.idTipoPago && alquiler.idEmpleado && alquiler.fecha && alquiler.direccion && alquiler.total && alquiler.idProducto && alquiler.idTipoAlquiler && alquiler.fechaProxima) {
        save()
    } 
}

const save = async () => {
    let resp = await Service.save(alquiler);
    if ( resp.valid ){
        list();
        hideDialog();
        toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
    } else {
        toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
    }
}


const confirmDeletealquiler = (alquiler) => {
    setalquiler(alquiler);
    setDeleteAlquilerDialog(true);
}

const deletealquiler = async () => {
    let resp = await Service.deleteById(alquiler);
    if ( resp.valid ) {
        list();
        setDeleteAlquilerDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
    } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
    }

}



const onInputChange = (e) => {
    const { value, name } = e.target;

    if ( name ==='venta') {
        setalquiler({
            ...alquiler,
            [name]: !value,
        });
    } else {
        setalquiler({
            ...alquiler,
            [name]: value,
        });
    }
   
    setSubmitted(true);
}


const rightToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="m2">
                <Button label="AGREGAR" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="VOLVER" icon="pi pi-plus" className="p-button-warning mr-2" onClick={()=> { props.setFlagAlquiler(false)}} />
            </div>
        </React.Fragment>
    )
}




const actionBodyTemplate = (rowData) => {
    return (
        <div className="actions">
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeletealquiler(rowData)} />
            <Button 
                    icon="pi pi-file-pdf" 
                    className="p-button-rounded p-button-info mr-2" 
                    onClick={()=>{
                        setFacturaDialog(true);
                        setReporteFactura(rowData);
                    }}     
                />
        </div>
    );
}

const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0"> Alquileres</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </span>
    </div>
);

const alquilerDialogFooter = (
    <>
        
        <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
        <Button label={alquiler.idalquiler ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
    </>
);
const deleteAlquilerDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAlquilerDialog} />
        <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deletealquiler} />
    </>
);

function sumarDias(fecha, dias){
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  const hideDialogReport = () => {
    setFacturaDialog(false);
}

return (
    
    <div className="col-12">
        <div className="card">
            <Toast ref={toast} />
            <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

            <DataTable ref={dt} value={alquileres}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} alquileres"
                globalFilter={globalFilter} emptyMessage="No alquileres found." header={header} responsiveLayout="scroll">

                <Column field="idFactura" header="ID" sortable ></Column>
                <Column field="producto" header="Producto" sortable></Column>
                <Column field="tipoPago" header="Tipo de Pago"sortable></Column>
                <Column field="nombreCliente" header="Cliente"sortable></Column>
                <Column field="fechaProximaFacturacion" header="Proxima Facturacioón"sortable></Column>
                <Column body={actionBodyTemplate} ></Column>
            </DataTable>

            <Dialog visible={alquilerDialog} style={{ width: '1000px' }} header={alquiler.idalquiler ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={alquilerDialogFooter} onHide={hideDialog}>
                
                <div className="formgrid grid">
                    <div className="field col">
                    <label htmlFor="descripcion">Cliente*</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                            <Select 
                                value={alquiler.idCliente} 
                                className="w-full"
                                id="idCliente" 
                                name="idCliente" 
                                label="Cliente*"
                                onChange={onInputChange}
                            >
                                {clientes.map((item, index) => (
                                    <MenuItem value={item.idCliente} key={index}>
                                        {item.nombre +" "+ item.apellido }
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        { submitted && !alquiler.idCliente && <small className="p-error">Cliente  es requerido.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="descripcion">Tipo de pago*</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon"><i className="pi pi-credit-card"></i></span>
                            <Select 
                                value={alquiler.idTipoPago} 
                                className="w-full"
                                id="idTipoPago" 
                                name="idTipoPago" 
                                onChange={onInputChange}
                            >
                                {tipoPago.map((item, index) => (
                                    <MenuItem value={item.idTipoPago} key={index}>
                                        {item.nombre  }
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        { submitted && !alquiler.idTipoPago && <small className="p-error">Tipo de pago  es requerido.</small>}
                        
                    </div>
                    <div className="field col">
                        <label htmlFor="descripcion">Empleado*</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                            <Select 
                                value={alquiler.idEmpleado} 
                                className="w-full"
                                id="idEmpleado" 
                                name="idEmpleado" 
                                label="Cliente*"
                                onChange={onInputChange}
                            >
                                {empleados.map((item, index) => (
                                    <MenuItem value={item.idEmpleado} key={index}>
                                        {item.nombre +" "+ item.apellido }
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        { submitted && !alquiler.idEmpleado && <small className="p-error">Empleado es requerido.</small>}
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="descripcion">Fecha*</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon"><i className="pi pi-calendar"></i></span>
                            <TextField
                                type="date"
                                id="fecha"
                                name="fecha"
                                value={ alquiler.fecha }
                                onChange={onInputChange}
                                variant="outlined"
                                fullWidth
                                required
                            />
                        </div>
                        { submitted && !alquiler.fecha && <small className="p-error">Fecha es requerida.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="descripcion">Dirección*</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon"><i className="pi pi-flag"></i></span>
                            <TextField
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={alquiler.direccion }
                                onChange={onInputChange}
                                variant="outlined"
                                fullWidth
                                required
                            />
                        </div>
                        { submitted && !alquiler.direccion && <small className="p-error">Dirección es requerida.</small>}
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="name">Producto*</label>
                        <Select 
                            value={alquiler.idProducto} 
                            className="w-full"
                            id="idProducto" 
                            name="idProducto" 
                            onChange={onInputChange}
                        >
                            {productos.map((item, index) => (
                                <MenuItem value={item.idProducto} key={index} onClick={()=>{setProducto(item)}}>
                                    {item.nombre }
                                </MenuItem>
                            ))}
                        </Select>
                        {  submitted && !alquiler.idProducto && <small className="p-error">Producto  es requerido.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="descripcion">Precio</label>
                        <TextField
                            type="number"
                            id="precio"
                            name="precio"
                            value={ alquiler.precio}
                            onChange={onInputChange}
                            variant="outlined"
                            fullWidth
                            disabled
                        />
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="name">Tipo Alquiler*</label>
                        <Select 
                            value={alquiler.idTipoAlquiler} 
                            className="w-full"
                            id="idTipoAlquiler" 
                            name="idTipoAlquiler" 
                            onChange={onInputChange}
                        >
                            {tipoAlquileres.map((item, index) => (
                                <MenuItem value={item.idTipoAlquiler} key={index} onClick={()=>{setTipo(item)}}>
                                    {item.descripcion }
                                </MenuItem>
                            ))}
                        </Select>
                        {  submitted && !alquiler.idTipoAlquiler && <small className="p-error">Tipo Alquiler  es requerido.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="descripcion">Total a pagar</label>
                        <TextField
                            type="number"
                            id="total"
                            name="total"
                            value={ alquiler.total}
                            onChange={onInputChange}
                            variant="outlined"
                            fullWidth
                            disabled
                        />
                      
                    </div>
                    <div className="field col">
                        <label htmlFor="descripcion">Fecha Proxima Facturación</label>
                        <TextField
                            type="date"
                            id="fechaProxima"
                            name="fechaProxima"
                            value={ alquiler.fechaProxima}
                            onChange={onInputChange}
                            variant="outlined"
                            fullWidth
                            disabled
                        />
                    </div>
                </div>

              
               

                
               
            </Dialog>

            <Dialog visible={deleteAlquilerDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteAlquilerDialogFooter} onHide={hideDeleteAlquilerDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    { <span>Desea cancelar el alquiler No. <b>{alquiler.idFactura}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={facturaDialog} style={{ width: '1500px' }} modal className="p-fluid"  onHide={hideDialogReport}>
                <PDFViewer style={{width:"100%", height: "90vh"}}>
                    <ReportAlquiler
                        factura={reporteFactura}
                    />
                </PDFViewer>

            </Dialog>

        </div>
    </div>
  
)
}

export default Alquiler;