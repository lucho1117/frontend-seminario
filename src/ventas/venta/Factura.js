import React, { useState, useEffect, useRef} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MenuItem, Select, TextField } from '@mui/material';
import { Toast } from 'primereact/toast';
import * as Service from "./Service";



const Factura = (props) => {

    const [submitted, setSubmitted] = useState(false);
    const [submittedDetalle, setSubmittedDetalle] = useState(false);
    const [producto, setProducto] = useState("");
    const toast = useRef(null);

    useEffect(() => {
        
    }, []);
    
    useEffect(() => {
        props.setFormDetalle({
            ...props.formDetalle,
            precio: producto.precio,
            producto: producto.nombre
        });
        // eslint-disable-next-line
    }, [producto]);

    const addFactura = () => {
        
        if ( props.formFactura.idCliente && props.formFactura.idTipoPago && props.formFactura.idEmpleado && props.formFactura.fecha && props.formFactura.direccion) {
            if (props.formFactura.detalle.length > 0) {
                if (props.formFactura.idFactura) {
                    
                } else {
                    saveFactura();
                }
            } else {
                toast.current.show({ severity: 'info', summary: 'Info', detail: "Debe de incluir al menos un producto para la venta.", life: 3000 });
            }
        }
    }

    const saveFactura = async () => {
        let resp = await Service.save(props.formFactura);
        if ( resp.valid ){
            props.listFacturas();
            back();
            props.toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            props.toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
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

    const idBody = (rowData, rowIndex) => {
        return (<>{rowIndex.rowIndex + 1}</>)
    }

    const actionBodyTemplate = (rowData, rowIndex) => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={()=> {deleteDetalle(rowData, rowIndex.rowIndex)}} />
            </div>
        );
    }

    const addDetalle = () => {
        if ( props.formDetalle.idProducto && props.formDetalle.cantidad ) {

            let aux = props.formFactura.detalle;
            const mismoProducto = aux.filter( item => item.idProducto === props.formDetalle.idProducto);
            
            if (mismoProducto.length > 0 ) {
                toast.current.show({ severity: 'info', summary: 'Info', detail: "No se puede agregar un mismo producto más de una vez.", life: 3000 });
            } else {
                if ( props.formFactura.idFactura){
                    
                } else {
                    aux.push(props.formDetalle);
                    props.setFormFactura({
                        ...props.formFactura,
                        detalle: aux
                    });
    
                    props.setFormDetalle(props.detalle);
                    setSubmittedDetalle(false);
                }
                conteoTotal();
            }
        }
    }

    const deleteDetalle = (detalle, index) => {
        if (props.formFactura.idFactura) {
            
        } else {
            let aux = props.formFactura.detalle;
            aux.splice(index, 1);
            props.setFormFactura({
                ...props.formFactura,
                detalle: aux
            });
        }
        conteoTotal();
    }

    const conteoTotal = () => {
        let aux = props.formFactura.detalle;  
        let acumulado = 0;
        aux.forEach(item => {
            acumulado = acumulado + item.total;
        });     
        props.setFormFactura({
            ...props.formFactura,
            total: acumulado
        }); 
    }

    const clearDetalle = () => {
        props.setFormDetalle(props.detalle);
        setSubmittedDetalle(false);
    }

    const clearEncabezado = () => {
        props.setFormFactura(props.factura);
        setSubmitted(false);
    }

    const back = () => {
        clearDetalle();
        clearEncabezado();
        props.setFlagFactura(false);
    }


    return (
            <>
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-11">
                            <h3>Factura</h3>
                        </div>
                        <div className="col-12 md:col-1">
                            <Button label="Volver" icon="pi pi-arrow-left" className="p-button-text" onClick={back} />
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
                    <DataTable value={props.formFactura.detalle} scrollable scrollHeight="350px"  scrollDirection="both" className="mt-3">
                        <Column header="No." style={{ flexGrow: 1, flexBasis: '10px' }} body={idBody} frozen></Column>
                        <Column field="producto" header="Producto" style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                        <Column field="precio" header="Precio" style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                        <Column field="cantidad" header="Cantidad" style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                        <Column field="total" header="Total" style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                        <Column body={actionBodyTemplate} header="Acción" style={{ flexGrow: 1, flexBasis: '2px' }}></Column>
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
                            <Button label="Agregar" className="p-button-outlined mr-2 mb-2" onClick={addDetalle}/>
                        </div>
                        <div className="col-12 md:col-6">
                            <Button label="Cancelar" className="p-button-outlined p-button-danger mr-2 mb-2" onClick={clearDetalle} />
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
                                <Button  label="REALIZAR VENTA" className="p-button-success mr-16 mb-16" onClick={addFactura}/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            

            
            </>


    )
}

export default Factura;