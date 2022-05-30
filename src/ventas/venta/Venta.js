import React, {useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../../service/ProductService';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import Factura from './Factura';

const Venta = (props) => {
    
    const [flagFactura, setFlagFactura] = useState(false);
    
    
    const [products, setProducts] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const productService = new ProductService();
    const [globalFilter, setGlobalFilter] = useState(null);
    

    const toast = useRef(null);

    useEffect(() => {
        productService.getProductsWithOrdersSmall().then(data => setProducts(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Orders for {data.name}</h5>
                <DataTable value={data.orders} responsiveLayout="scroll">
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="customer" header="Customer" sortable></Column>
                    <Column field="date" header="Date" sortable></Column>
                    <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
                    <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
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

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.amount);
    }

    const statusOrderBodyTemplate = (rowData) => {
        return <span className={`order-badge order-${rowData.status.toLowerCase()}`}>{rowData.status}</span>;
    }

    const searchBodyTemplate = () => {
        return <Button icon="pi pi-search" />;
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }


    const imageBodyTemplate = (rowData) => {
        return <img src={`images/product/${rowData.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="shadow-2" width={100} />;
    }

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    }

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    }

    const statusBodyTemplate2 = (rowData) => {
        return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
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
                            <Column header="Image" body={imageBodyTemplate} />
                            <Column field="price" header="Price" sortable body={priceBodyTemplate} />
                            <Column field="category" header="Category" sortable />
                            <Column field="rating" header="Reviews" sortable body={ratingBodyTemplate} />
                            <Column field="inventoryStatus" header="Status" sortable body={statusBodyTemplate2} />
                        </DataTable>
                    </div>
                </div>
            ):null}

            {flagFactura ? (
                <Factura 
                    setFlagFactura={setFlagFactura}
                />
            ):null}
        </>
    )
}

export default Venta;
