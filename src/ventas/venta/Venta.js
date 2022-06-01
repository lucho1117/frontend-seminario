import React, {useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import Factura from './Factura';
import * as Service from "./Service";
import * as ServiceCliente from "../../user/clientes/Service";
import * as ServiceEmpleado from "../../user/empleado/Service";
import * as ServiceProducto from "../producto/Service";
import ReportFactura from './ReportFactura';
import { PDFViewer } from '@react-pdf/renderer';
import { Dialog } from 'primereact/dialog';



const Venta = (props) => {

    const factura = {
        idCliente: "",
        idTipoPago: "",
        idEmpleado: "",
        fecha: "",
        direccion: "",
        total: "",
        detalle: []
    }

    const detalle = {
        idProducto: "",
        producto: "",
        precio:"",
        cantidad: "",
        total: ""
    }
    
    const [flagFactura, setFlagFactura] = useState(false);
    const [facturas, setFacturas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [tipoPago, setTipoPago] = useState([]);
    const [productos, setProductos] = useState([]);
    const [formFactura, setFormFactura] = useState(factura);
    const [formDetalle, setFormDetalle] = useState(detalle);
    
    const [expandedRows, setExpandedRows] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);

    const [facturaDialog, setFacturaDialog] = useState(false);
    const [reporteFactura, setReporteFactura] = useState("");

    const [deleteFacturaDialog, setDeleteFacturaDialog] = useState(false);
    const [facturaDelete, setFacturaDelete] = useState("");

    useEffect(() => {
        listFacturas();
        listClientes();
        listEmpleados();
        listTipoPago();
        listProductos();
    }, []); 
    

    const listFacturas = async()  => {
        let aux = {alquiler: 0}
        let resp = await Service.list(aux);
        if (resp.valid) {
            setFacturas(resp.data);
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
        let aux = {venta: 1}
        let resp = await ServiceProducto.list(aux);
        if (resp.valid) {
            setProductos(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }
    


    const rowExpansionTemplate = (data) => {

        return (
            <div className="orders-subtable">
                <h5>Detalle de Venta</h5>
                <DataTable value={data.detalle} responsiveLayout="scroll">
                    <Column field="idDetalleVenta" header="No." sortable></Column>
                    <Column field="producto" header="Producto" sortable></Column>
                    <Column field="precio" header="Precio" sortable></Column>
                    <Column field="cantidad" header="Cantidad" sortable></Column>
                    <Column field="total" header="Total" sortable></Column>
                    {/* <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column> */}
                </DataTable>
            </div>
        );
    }
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Ventas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="AGREGAR VENTA" icon="pi pi-plus" className="p-button-success mr-2"  onClick={()=> { setFlagFactura(true)}}  />
                    <Button label="VOLVER" icon="pi pi-plus" className="p-button-warning mr-2" onClick={()=> { props.setFlagVenta(false)}} />
                </div>
            </React.Fragment>
        )
    }

    const actionBody = (rowData) => {
        return(
            <div className="actions">
                <Button 
                    icon="pi pi-file-pdf" 
                    className="p-button-rounded p-button-info mr-2" 
                    onClick={()=>{
                        setFacturaDialog(true);
                        setReporteFactura(rowData);
                    }}     
                />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-danger mt-2" 
                    onClick={() => confirmDeleteFactura(rowData)} 
                />
            </div>
        )
    }

    const confirmDeleteFactura = (factura) => {
        setFacturaDelete(factura);
        setDeleteFacturaDialog(true);
    }

    const deletecategoria = async () => {
        let resp = await Service.deleteById(facturaDelete);
        if ( resp.valid ) {
            listFacturas();
            setDeleteFacturaDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }

    const deleteFacturaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteFacturaDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deletecategoria} />
        </>
    );

    const hideDeleteFacturaDialog = () => {
        setDeleteFacturaDialog(false);
    }
   
    const hideDialog = () => {
        setFacturaDialog(false);
    }
    return (
        <>
            <Toast ref={toast} />
            {!flagFactura ? (
                <div className="col-12">
                    <div className="card">
                        
                        <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                        <DataTable value={facturas} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll"
                            rowExpansionTemplate={rowExpansionTemplate} dataKey="idFactura" globalFilter={globalFilter} header={header} className="datatable-responsive">
                            <Column expander style={{ width: '3em' }} />
                            <Column field="idFactura" header="No" sortable />
                            <Column field="fecha" header="Fecha" sortable />
                            <Column field="cliente" header="Cliente" sortable />
                            <Column field="total" header="Total" sortable />
                            <Column field="accion"  body={actionBody} />
                        </DataTable>
                    </div>
                </div>
            ):null}

            {flagFactura ? (
                <Factura 
                    setFlagFactura={setFlagFactura}
                    clientes={clientes}
                    empleados={empleados}
                    tipoPago={tipoPago}
                    productos={productos}
                    factura={factura}
                    detalle={detalle}
                    formFactura={formFactura}
                    setFormFactura={setFormFactura}
                    formDetalle={formDetalle}
                    setFormDetalle={setFormDetalle}
                    toast={toast}
                    listFacturas={listFacturas}
                />
            ):null}

            <Dialog visible={deleteFacturaDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteFacturaDialogFooter} onHide={hideDeleteFacturaDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    { <span>Desea eliminar la factura No. <b>{facturaDelete.idFactura}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={facturaDialog} style={{ width: '1500px' }} modal className="p-fluid"  onHide={hideDialog}>
                <PDFViewer style={{width:"100%", height: "90vh"}}>
                    <ReportFactura 
                        factura={reporteFactura}
                    />
                </PDFViewer>

            </Dialog>

        </>
    )
}

export default Venta;
