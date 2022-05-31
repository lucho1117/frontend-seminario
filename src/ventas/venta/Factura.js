import React, {useState, useEffect} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MenuItem, Select, TextField } from '@mui/material';


import { CustomerService } from '../../service/CustomerService';

const Factura = (props) => {

    const [customers2, setCustomers2] = useState([]);
    const customerService = new CustomerService();

    const [submitted, setSubmitted] = useState(false);
    const [submittedDetalle, setSubmittedDetalle] = useState(false);
    const [producto, setProducto] = useState("");

    useEffect(() => {
        customerService.getCustomersLarge().then(data => { setCustomers2(getCustomers(data));});
    }, []);
    
    useEffect(() => {
        props.setFormDetalle({
            ...props.formDetalle,
            precio: producto.precio,
            producto: producto.nombre
        });
    }, [producto])
    
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

    const onInputChange = (e) => {
        const { value, name } = e.target;
       
        props.setFormFactura({
            ...props.formFactura,
            [name]: value,
        });
        setSubmitted(true);
    }

    const onInputChangeDetalle = (e) => {
        const { value, name } = e.target;
        if ( name === 'cantidad') {
            props.setFormDetalle({
                ...props.formDetalle,
                cantidad: value,
                total: value * props.formDetalle.precio
            });

        } else {
            props.setFormDetalle({
                ...props.formDetalle,
                [name]: value,
            });
        }
        setSubmittedDetalle(true);
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
                            <label htmlFor="descripcion">Cliente*</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                                <Select 
                                    value={props.formFactura.idCliente} 
                                    className="w-full"
                                    id="idCliente" 
                                    name="idCliente" 
                                    label="Cliente*"
                                    onChange={onInputChange}
                                >
                                    {props.clientes.map((item, index) => (
                                        <MenuItem value={item.idCliente} key={index}>
                                            {item.nombre +" "+ item.apellido }
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                            { submitted && !props.formFactura.idCliente && <small className="p-error">Cliente  es requerido.</small>}
                        </div>

                        <div className="col-12 md:col-4">
                            <label htmlFor="descripcion">Tipo de pago*</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-credit-card"></i></span>
                                <Select 
                                    value={props.formFactura.idTipoPago} 
                                    className="w-full"
                                    id="idTipoPago" 
                                    name="idTipoPago" 
                                    label="Cliente*"
                                    onChange={onInputChange}
                                >
                                    {props.tipoPago.map((item, index) => (
                                        <MenuItem value={item.idTipoPago} key={index}>
                                            {item.nombre  }
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                            { submitted && !props.formFactura.idTipoPago && <small className="p-error">Tipo de pago  es requerido.</small>}
                        </div>

                        <div className="col-12 md:col-4">
                            <label htmlFor="descripcion">Empleado*</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                                <Select 
                                    value={props.formFactura.idEmpleado} 
                                    className="w-full"
                                    id="idEmpleado" 
                                    name="idEmpleado" 
                                    label="Cliente*"
                                    onChange={onInputChange}
                                >
                                    {props.empleados.map((item, index) => (
                                        <MenuItem value={item.idEmpleado} key={index}>
                                            {item.nombre +" "+ item.apellido }
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                            { submitted && !props.formFactura.idEmpleado && <small className="p-error">Empleado es requerido.</small>}
                        </div>

                        <div className="col-12 md:col-4">
                            <label htmlFor="descripcion">Fecha*</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-calendar"></i></span>
                                <TextField
                                    type="date"
                                    id="fecha"
                                    name="fecha"
                                    value={ props.formFactura.fecha }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </div>
                            { submitted && !props.formFactura.fecha && <small className="p-error">Fecha es requerida.</small>}
                        </div>

                        <div className="col-12 md:col-8">
                            <label htmlFor="descripcion">Dirección*</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-flag"></i></span>
                                <TextField
                                    type="text"
                                    id="direccion"
                                    name="direccion"
                                    value={ props.formFactura.direccion }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </div>
                            { submitted && !props.formFactura.direccion && <small className="p-error">Dirección es requerida.</small>}
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

                        <div className="col-12 md:col-6">
                            <label htmlFor="name">Producto*</label>
                            <Select 
                                value={props.formDetalle.idProducto} 
                                className="w-full"
                                id="idProducto" 
                                name="idProducto" 
                                onChange={onInputChangeDetalle}
                            >
                                {props.productos.map((item, index) => (
                                    <MenuItem value={item.idProducto} key={index} onClick={()=>{setProducto(item)}}>
                                        {item.nombre }
                                    </MenuItem>
                                ))}
                            </Select>
                            {  submittedDetalle && !props.formDetalle.idProducto && <small className="p-error">Producto  es requerido.</small>}
                        </div>
                    
                        <div className="col-12 md:col-6">
                            <label htmlFor="name">Precio</label>
                            <TextField
                                type="number"
                                id="precio"
                                name="precio"
                                value={ props.formDetalle.precio }
                                onChange={onInputChangeDetalle}
                                variant="outlined"
                                fullWidth
                                disabled
                            />
                        </div>
                    
                    
                        <div className="col-12 md:col-6">
                            <label htmlFor="name">Cantidad</label>
                            <TextField
                                type="number"
                                id="cantidad"
                                name="cantidad"
                                value={ props.formDetalle.cantidad }
                                onChange={onInputChangeDetalle}
                                variant="outlined"
                                fullWidth
                            />
                            {  submittedDetalle && !props.formDetalle.cantidad && <small className="p-error">Cantidad  es requerido.</small>}
                        </div>
                    
                    
                        <div className="col-12 md:col-6">
                            <label htmlFor="name">Total</label>
                            <TextField
                                type="number"
                                id="total"
                                name="total"
                                value={ props.formDetalle.total }
                                onChange={onInputChangeDetalle}
                                variant="outlined"
                                fullWidth
                                disabled
                            />
                        </div>

                        <div className="col-12 md:col-6">
                            <Button label="Agregar" className="p-button-outlined mr-2 mb-2" />
                        </div>
                        <div className="col-12 md:col-6">
                            <Button label="Cancelar" className="p-button-outlined p-button-danger mr-2 mb-2" />
                        </div>
                    </div>

                </div>

                <div className='card'>
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                                <InputText
                                    type="number"
                                    id="total"
                                    name="total"
                                    placeholder="TOTAL"
                                    value={ props.formFactura.total }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                />
                                <span className="p-inputgroup-addon"><i className="pi pi-dollar"></i></span>
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                                <Button  label="REALIZAR VENTA" className="p-button-success mr-16 mb-16" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="col-8">
                <div className="grid p-fluid">
                    <div className="col-6">
                        <pre>{JSON.stringify(props.formFactura, null, 2)}</pre>
                    </div>
                    <div className="col-6">
                        <pre>{JSON.stringify(props.formDetalle, null, 2)}</pre>
                    </div>  
                </div>
            </div>

            

            
            </>


    )
}

export default Factura;