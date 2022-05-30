import React, {useState, useEffect} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


import { CustomerService } from '../../service/CustomerService';

const Factura = (props) => {

    const [customers2, setCustomers2] = useState([]);
    const customerService = new CustomerService();
    useEffect(() => {
        customerService.getCustomersLarge().then(data => { setCustomers2(getCustomers(data));});
    }, []);
    const getCustomers = (data) => {
        return [...data || []].map(d => {
            d.date = new Date(d.date);
            return d;
        });
    }

    const representativeBodyTemplate = (rowData) => {
        const representative = rowData.representative;
        return (
            <React.Fragment>
                <img alt={representative.name} src={`images/avatar/${representative.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={32} style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{representative.name}</span>
            </React.Fragment>
        );
    }


    return (
            <>
            <div className="col-12">
                <div className="card">
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-11">
                            <h3>Factura</h3>
                        </div>
                        <div className="col-12 md:col-1">
                            <Button label="Volver" icon="pi pi-arrow-left" className="p-button-text" onClick={()=>{props.setFlagFactura(false)}} />
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                                <InputText placeholder="Cliente" />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-credit-card"></i></span>
                                <InputText placeholder="Tipo de Pago" />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                                <InputText placeholder="Empleado" />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-calendar"></i></span>
                                <InputText placeholder="Fecha" />
                            </div>
                        </div>

                        <div className="col-12 md:col-8">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-flag"></i></span>
                                <InputText placeholder="Direccion" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="col-8">
                <div className="card" >
                    <h5>Detalle</h5>
                    <DataTable value={customers2} scrollable scrollHeight="350px"  scrollDirection="both" className="mt-3">
                        <Column field="name" header="Name" style={{ flexGrow: 1, flexBasis: '160px' }} frozen></Column>
                        <Column field="name" header="Name" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="company" header="Company" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="activity" header="Activity" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="representative.name" header="Representative" style={{ flexGrow: 1, flexBasis: '200px' }} body={representativeBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>

            <div className="col-4">
                <div className="card">
                    <h5>Ingrese Producto</h5>
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-12">
                            <label htmlFor="name">Producto</label>
                            <InputText id="name"  />
                        </div>
                    
                        <div className="col-12 md:col-12">
                            <label htmlFor="name">Precio</label>
                            <InputText id="name"  />
                        </div>
                    
                    
                        <div className="col-12 md:col-12">
                            <label htmlFor="name">Cantidad</label>
                            <InputText id="name"  />
                        </div>
                    
                    
                        <div className="col-12 md:col-12">
                            <label htmlFor="name">Total</label>
                            <InputText id="name"  />
                        </div>

                        <div className="col-12 md:col-6">
                            <Button label="Agregar" className="p-button-outlined mr-2 mb-2" />
                        </div>
                        <div className="col-12 md:col-6">
                            <Button label="Cancelar" className="p-button-outlined p-button-danger mr-2 mb-2" />
                        </div>
                    </div>

                </div>
            </div>

            <div className="col-12">
                <div className="grid p-fluid">
                    <div className="col-12 md:col-4">
                        <div className="p-inputgroup">
                            <b>TOTAL   . </b>
                            <InputText placeholder="Total" />
                            <span className="p-inputgroup-addon"><i className="pi pi-dollar"></i></span>
                        </div>
                    </div>
                    <div className="col-12 md:col-5"></div>
                    <div className="col-12 md:col-3">
                        <div className="p-inputgroup">
                            <Button label="REALIZAR VENTA" className="p-button-success mr-2 mb-2" />
                        </div>
                    </div>
                </div>
            </div>
            </>


    )
}

export default Factura;