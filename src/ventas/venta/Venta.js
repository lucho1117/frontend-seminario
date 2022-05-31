import React, {useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../../service/ProductService';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import Factura from './Factura';
import * as Service from "./Service";
import * as ServiceCliente from "../../user/clientes/Service";
import * as ServiceEmpleado from "../../user/empleado/Service";
import * as ServiceProducto from "../producto/Service";


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
    const [clientes, setClientes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [tipoPago, setTipoPago] = useState([]);
    const [productos, setProductos] = useState([]);
    const [formFactura, setFormFactura] = useState(factura);
    const [formDetalle, setFormDetalle] = useState(detalle);
    
    const [products, setProducts] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const productService = new ProductService();
    const [globalFilter, setGlobalFilter] = useState(null);


    const toast = useRef(null);

    useEffect(() => {
        listClientes();
        listEmpleados();
        listTipoPago();
        listProductos();
        productService.getProductsWithOrdersSmall().then(data => setProducts(data));
    }, []); 

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
        let resp = await ServiceProducto.list();
        if (resp.valid) {
            setProductos(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }
    


    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Orders for {data.name}</h5>
                <DataTable value={data.orders} responsiveLayout="scroll">
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="customer" header="Customer" sortable></Column>
                    <Column field="date" header="Date" sortable></Column>
                    <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
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

    const searchBodyTemplate = () => {
        return <Button icon="pi pi-search" />;
    }

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

    return (
        <>
            {!flagFactura ? (
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                        <DataTable value={products} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll"
                            rowExpansionTemplate={rowExpansionTemplate} dataKey="id" globalFilter={globalFilter} header={header} className="datatable-responsive">
                            <Column expander style={{ width: '3em' }} />
                            <Column field="name" header="Name" sortable />
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
                />
            ):null}
        </>
    )
}

export default Venta;
