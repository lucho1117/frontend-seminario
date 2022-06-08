import React, { useState, useEffect, useRef} from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MenuItem, Select, TextField } from '@mui/material';
import * as Service from './Service';
const Detalle = (props) => {
    const [submitted, setSubmitted] = useState(false);
    const [submittedMaterial, setSubmittedMaterial] = useState(false);
    const [submittedManoObra, setSubmittedManoObra] = useState(false);

    const [material, setMaterial] = useState("");
    const [manoObra, setManoObra] = useState("");

    const toast = useRef(null);

    useEffect(() => {
        props.setDetalleMaterial({
            ...props.detalleMaterial,
            precio: material.precio,
            material: material.nombre
        });
    }, [material]);

    useEffect(() => {
        props.setManoObra({
            ...props.manoObra,
            empleado: manoObra.nombre + " " + manoObra.apellido
        });
    }, [manoObra]);

    const clearMaterial = () => {
        props.setDetalleMaterial(props.formDetalleMaterial);
        setSubmittedMaterial(false);
    }

    const clearManoObra = () => {
        props.setManoObra(props.formManoObra);
        setSubmittedMaterial(false);
    }

    const clearEncabezado = () => {
        props.setFase(props.formFase);
        setSubmitted(false);
    }

    const back = () => {
        clearMaterial();
        clearEncabezado();
        clearManoObra();
        props.setFlagDetalle(false);
    }

    const onInputChange = (e) => {
        const { value, name } = e.target;
       
        props.setFase({
            ...props.fase,
            [name]: value,
        });
        setSubmitted(true);
    }

    const onInputChangeMaterial = (e) => {
        const { value, name } = e.target;
        if ( name === 'cantidad') {
            props.setDetalleMaterial({
                ...props.detalleMaterial,
                cantidad: value,
                precioTotal: value * props.detalleMaterial.precio
            });

        } else {
            props.setDetalleMaterial({
                ...props.detalleMaterial,
                [name]: value,
            });
        }
        setSubmittedMaterial(true);
    }

    const onInputChangeManoObra = (e) => {
        const { value, name } = e.target;
        
        if ( name === 'costo') {
            props.setManoObra({
                ...props.manoObra,
                [name]: value * 1,
            });
        } else {
            props.setManoObra({
                ...props.manoObra,
                [name]: value,
            });
        }
        setSubmittedManoObra(true);
    }

    const actionMaterialBodyTemplate = (rowData, rowIndex) => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={()=> {deleteMaterial(rowData, rowIndex.rowIndex)}} />
            </div>
        );
    }

    const actionManoObraBodyTemplate = (rowData, rowIndex) => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={()=> {deleteManoObra(rowData, rowIndex.rowIndex)}} />
            </div>
        );
    }

    const addMaterial = () => {
        if ( props.detalleMaterial.idMaterial && props.detalleMaterial.cantidad ) {

            let aux = props.fase.materiales;
            const mismoProducto = aux.filter( item =>{ if (item.idMaterial === props.detalleMaterial.idMaterial) return item });
            
            if (mismoProducto.length > 0 ) {
                toast.current.show({ severity: 'info', summary: 'Info', detail: "No se puede agregar un mismo material más de una vez.", life: 3000 });
            } else {
                    aux.push(props.detalleMaterial);
                    props.setFase({
                        ...props.fase,
                        materiales: aux
                    });
    
                    props.setDetalleMaterial(props.formDetalleMaterial);
                    setSubmittedMaterial(false);
                    conteoTotalMaterial();
            }
        }
    }

    const addManoObra = () => {
        if ( props.manoObra.idEmpleado && props.manoObra.costo ) {

            let aux = props.fase.manoObra;
            const mismoProducto = aux.filter( item =>{ if (item.idEmpleado === props.manoObra.idEmpleado) return item });
            
            if (mismoProducto.length > 0 ) {
                toast.current.show({ severity: 'info', summary: 'Info', detail: "No se puede agregar un mismo empleado más de una vez.", life: 3000 });
            } else {
                    aux.push(props.manoObra);
                    props.setFase({
                        ...props.fase,
                        manoObra: aux
                    });
    
                    props.setManoObra(props.formManoObra);
                    setSubmittedManoObra(false);
                    conteoTotalManoObra();
            }
        }
    }

    const deleteMaterial = (detalle, index) => {
        let aux = props.fase.materiales;
            aux.splice(index, 1);
            props.setFase({
                ...props.fase,
                materiales: aux
            });
        conteoTotalMaterial();
    }

    const deleteManoObra = (detalle, index) => {
        let aux = props.fase.manoObra;
            aux.splice(index, 1);
            props.setFase({
                ...props.fase,
                manoObra: aux
            });
        conteoTotalManoObra();
    }

    const conteoTotalMaterial = () => {
        let aux = props.fase.materiales;  
        let acumulado = 0;
        aux.map(item => {
            acumulado = acumulado + item.precioTotal;
        });     
        props.setFase({
            ...props.fase,
            costoMaterial: acumulado,
            costoTotal: acumulado + props.fase.costoManoObra
        }); 
    }

    const conteoTotalManoObra = () => {
        let aux = props.fase.manoObra;  
        let acumulado = 0;
        aux.map(item => {
            acumulado = acumulado + item.costo;
        });     
        props.setFase({
            ...props.fase,
            costoManoObra: acumulado,
            costoTotal: acumulado + props.fase.costoMaterial 
        }); 
    }

    const addFase = () => {
        if ( props.fase.nombre && props.fase.fechaInicio && props.fase.fechaFin) {
            if (props.fase.materiales.length > 0 && props.fase.manoObra.length > 0) {
                save();
            } else {
                toast.current.show({ severity: 'info', summary: 'Info', detail: "Debe de incluir al menos un material y empleado en la fase.", life: 3000 });
            }
        }
    }

    const save = async () => {
        let resp = await Service.save(props.fase);
        if ( resp.valid ){
            props.list();
            back();
            props.toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            props.toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }
    return (
        <div className="grid crud-demo">
            <Toast ref={toast} />
             <div className="col-12">
                <div className="card">
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-11">
                            <h3>Detalle</h3>
                        </div>
                        <div className="col-12 md:col-1">
                            <Button label="Volver" icon="pi pi-arrow-left" className="p-button-text" onClick={back} />
                        </div>
                        <div className="col-12 md:col-4">
                            <label htmlFor="descripcion">Nombre*</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                                <TextField
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={ props.fase.nombre }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </div>
                            { submitted && !props.fase.nombre && <small className="p-error">Nombre es requerida.</small>}
                        </div>

                        <div className="col-12 md:col-4">
                            <label htmlFor="descripcion">Fecha Inicio</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-credit-card"></i></span>
                                <TextField
                                    type="date"
                                    id="fechaInicio"
                                    name="fechaInicio"
                                    value={ props.fase.fechaInicio }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                               
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <label htmlFor="descripcion">Empleado*</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                                <TextField
                                    type="date"
                                    id="fechaFin"
                                    name="fechaFin"
                                    value={ props.fase.fechaFin }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-8">
                            <label htmlFor="descripcion">Descripción</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-flag"></i></span>
                                <TextField
                                    type="text"
                                    id="descripcion"
                                    name="descripcion"
                                    value={ props.fase.descripcion }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <label htmlFor="descripcion">Total</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon"><i className="pi pi-calendar"></i></span>
                                <TextField
                                    type="number"
                                    id="costoTotal"
                                    name="costoTotal"
                                    value={ props.fase.costoTotal }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                />
                            </div>
                        </div>


                        

                    </div>
                </div>
            </div>

            <div className="col-6">
                <div className="card">
                    <h5>Ingrese Material</h5>
                    <div className="grid p-fluid">

                        <div className="col-12 md:col-6">
                            <label htmlFor="name">Material*</label>
                            <Select 
                                value={props.detalleMaterial.idMaterial} 
                                className="w-full"
                                id="idMaterial" 
                                name="idMaterial" 
                                onChange={onInputChangeMaterial}
                            >
                                {props.materiales.map((item, index) => (
                                    <MenuItem value={item.idMaterial} key={index} onClick={()=>{setMaterial(item)}}>
                                        {item.nombre }
                                    </MenuItem>
                                ))}
                            </Select>
                            {  submittedMaterial && !props.detalleMaterial.idMaterial && <small className="p-error">Producto  es requerido.</small>}
                        </div>
                    
                        <div className="col-12 md:col-6">
                            <label htmlFor="name">Precio</label>
                            <TextField
                                type="number"
                                id="precio"
                                name="precio"
                                value={ props.detalleMaterial.precio }
                                onChange={onInputChangeMaterial}
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
                                value={ props.detalleMaterial.cantidad }
                                onChange={onInputChangeMaterial}
                                variant="outlined"
                                fullWidth
                            />
                            {  submittedMaterial && !props.detalleMaterial.cantidad && <small className="p-error">Cantidad  es requerido.</small>}
                        </div>
                    
                    
                        <div className="col-12 md:col-6">
                            <label htmlFor="name">Total</label>
                            <TextField
                                type="number"
                                id="precioTotal"
                                name="precioTotal"
                                value={ props.detalleMaterial.precioTotal }
                                onChange={onInputChangeMaterial}
                                variant="outlined"
                                fullWidth
                                disabled
                            />
                        </div>

                        <div className="col-12 md:col-6">
                            <Button label="Agregar" className="p-button-outlined mr-2 mb-2" onClick={addMaterial}/>
                        </div>
                        <div className="col-12 md:col-6">
                            <Button label="Cancelar" className="p-button-outlined p-button-danger mr-2 mb-2" onClick={clearMaterial} />
                        </div>
                    </div>

                </div>
                <div className="card" >
                    <h5>Detalle</h5>
                    <DataTable value={props.fase.materiales} scrollable scrollHeight="350px"  scrollDirection="both" className="mt-3">
                        <Column field="material" header="Material" style={{ flexGrow: 1, flexBasis: '125px' }}></Column>
                        <Column field="precio" header="Precio" style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                        <Column field="cantidad" header="Cantidad" style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                        <Column field="precioTotal" header="Total" style={{ flexGrow: 1, flexBasis: '125px' }}></Column>
                        <Column body={actionMaterialBodyTemplate} style={{ flexGrow: 1, flexBasis: '100px' }} ></Column>
                    </DataTable>
                </div>
                <div className='card'>
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                                <InputText
                                    type="number"
                                    id="costoMaterial"
                                    name="costoMaterial"
                                    placeholder="TOTAL"
                                    value={ props.fase.costoMaterial }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                />
                                <span className="p-inputgroup-addon"><i className="pi pi-dollar"></i></span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className="col-6">
                <div className="card">
                    <h5>Ingrese Empleado</h5>
                    <div className="grid p-fluid">

                        <div className="col-12 md:col-6">
                            <label htmlFor="name">Empleado*</label>
                            <Select 
                                value={props.manoObra.idEmpleado} 
                                className="w-full"
                                id="idEmpleado" 
                                name="idEmpleado" 
                                onChange={onInputChangeManoObra}
                            >
                                {props.empleados.map((item, index) => (
                                    <MenuItem value={item.idEmpleado} key={index} onClick={()=>{setManoObra(item)}}>
                                        {item.nombre +" " + item.apellido}
                                    </MenuItem>
                                ))}
                            </Select>
                            {  submittedManoObra && !props.manoObra.idEmpleado && <small className="p-error">Empleado  es requerido.</small>}
                        </div>
                    
                        <div className="col-12 md:col-6">
                            <label htmlFor="name">Costo*</label>
                            <TextField
                                type="number"
                                id="costo"
                                name="costo"
                                value={ props.manoObra.costo }
                                onChange={onInputChangeManoObra}
                                variant="outlined"
                                fullWidth
                            />
                             {  submittedManoObra && !props.manoObra.costo && <small className="p-error">Costo  es requerido.</small>}
                        </div>
                    
                                    

                        <div className="col-12 md:col-6">
                            <Button label="Agregar" className="p-button-outlined mr-2 mb-2" onClick={addManoObra}/>
                        </div>
                        <div className="col-12 md:col-6">
                            <Button label="Cancelar" className="p-button-outlined p-button-danger mr-2 mb-2" onClick={clearManoObra} />
                        </div>
                    </div>

                </div>
                <div className="card" >
                    <h5>Detalle</h5>
                    <DataTable value={props.fase.manoObra} scrollable scrollHeight="350px"  scrollDirection="both" className="mt-3">
                        <Column field="empleado" header="Empleado" style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                        <Column field="costo" header="Costo" style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                        <Column body={actionManoObraBodyTemplate} header="Acción" style={{ flexGrow: 1, flexBasis: '2px' }}></Column>
                    </DataTable>
                </div>
                <div className='card'>
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                                <InputText
                                    type="number"
                                    id="costoManoObra"
                                    name="costoManoObra"
                                    placeholder="TOTAL"
                                    value={ props.fase.costoManoObra }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                />
                                <span className="p-inputgroup-addon"><i className="pi pi-dollar"></i></span>
                            </div>
                        </div>
                       
                    </div>
                </div>

            </div>

            <div className='col-10'></div>
            <div className='col-2'>
                <div className='card'>
                    <div className="p-inputgroup">
                        <Button  label="CREAR FASE" className="p-button-success mr-16 mb-16" onClick={addFase}/>
                    </div>   
                </div>
            </div>

            <div className="col-4">
                <pre>{JSON.stringify(props.fase, null, 2)}</pre>
            </div>
            <div className="col-4">
                <pre>{JSON.stringify(props.detalleMaterial, null, 2)}</pre>
            </div>
            <div className="col-4">
                <pre>{JSON.stringify(props.manoObra, null, 2)}</pre>
            </div>
        </div>
    )
}

export default Detalle