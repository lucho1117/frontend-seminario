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
import { MenuItem, Select, TextField } from '@mui/material';
import * as Service from "./Service";
import * as ServiceCategoria from "../categoria/Service";
import * as ServiceProveedor from "../../user/proveedores/Service"

const Producto = () => {

    let formProducto = {
        idCategoria: "",
        idProveedor: "",
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        fechaIngreso:"",
        venta:"",
    };

    const [productos, setProductos] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [productoDialog, setProductoDialog] = useState(false);
    const [deleteProductoDialog, setDeleteProductoDialog] = useState(false);
    const [producto, setProducto] = useState(formProducto);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [tipoVenta] = useState([
        {
            id: true,
            nombre: "VENTA"
        },
        {
            id: false,
            nombre: "ALQUILER"
        }
    ]);
  
    useEffect(() => {
        list();
        listCategorias();
        listProveedores();
    }, []);

    const list = async()  => {
        let resp = await Service.list();
        if (resp.valid) {
            setProductos(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listCategorias = async()  => {
        let resp = await ServiceCategoria.list();
        if (resp.valid) {
            setCategorias(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listProveedores = async()  => {
        let resp = await ServiceProveedor.list();
        if (resp.valid) {
            setProveedores(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }


    const openNew = () => {
        setProducto(formProducto);
        setSubmitted(false);
        setProductoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductoDialog(false);
    }

    const hideDeleteProductoDialog = () => {
        setDeleteProductoDialog(false);
    }

    const submit = () => {
        if (producto.nombre && producto.idCategoria && producto.nombre && producto.precio && producto.stock) {
             if (producto.idProducto) {
                 edit();
             } else {
                 save();
             }
        } 
    }

    const save = async () => {
        let resp = await Service.save(producto);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }

    const edit = async () => {
        let resp = await Service.update(producto);
        if ( resp.valid ){
            list();
            hideDialog();
            toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
        }
    }



    const editProducto = (producto) => {
        setProducto({ ...producto });
        setProductoDialog(true);
    }

    const confirmDeleteproducto = (producto) => {
        setProducto(producto);
        setDeleteProductoDialog(true);
    }

    const deleteproducto = async () => {
        let resp = await Service.deleteById(producto);
        if ( resp.valid ) {
            list();
            setDeleteProductoDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }



    const onInputChange = (e) => {
        const { value, name } = e.target;
        setProducto({
            ...producto,
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
                {rowData.idProducto}
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

    const categoriaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Categoria</span>
                {rowData.categoria}
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

    const precioBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio</span>
                {formatCurrency(rowData.precio)}
            </>
        );
    }

    const stockBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Stock</span>
                {rowData.stock}
            </>
        );
    }

    const ventaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Proposito</span>
                {rowData.venta ? "VENTA": "ALQUILER"}
            </>
        );
    }


    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editProducto(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteproducto(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0"> Productos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productoDialogFooter = (
        <>
            <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
            <Button label={producto.idProducto ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
        </>
    );
    const deleteProductoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductoDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deleteproducto} />
        </>
    );

    
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={productos}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} productos"
                        globalFilter={globalFilter} emptyMessage="No productos found." header={header} responsiveLayout="scroll">

                        <Column field="idProducto" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '10%', minWidth: '10rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="categoria" header="Categoria" sortable body={categoriaBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                        <Column field="price" header="Precio" body={precioBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                        <Column field="stock" header="Stock" body={stockBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                        <Column field="proposito" header="Proposito" body={ventaBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productoDialog} style={{ width: '600px' }} header={producto.idProducto ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={productoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText 
                                id="nombre" 
                                name="nombre"
                                value={producto.nombre} 
                                onChange={onInputChange} 
                                required 
                                autoFocus 
                                className={classNames({ 'p-invalid': submitted && !producto.nombre })} 
                            />
                            { submitted &&  !producto.nombre && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputTextarea 
                                id="descripcion" 
                                name="descripcion"
                                value={producto.descripcion} 
                                onChange={onInputChange} 
                                required 
                                rows={3} 
                                cols={20} 
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="descripcion">Categoria</label>
                            <Select 
                                value={producto.idCategoria} 
                                className="w-full"
                                id="idCategoria" 
                                name="idCategoria" 
                                onChange={onInputChange}>
                                {categorias.map((item, index) => (
                                    <MenuItem value={item.idCategoria} key={index}>
                                        {item.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                            { submitted &&  !producto.idCategoria && <small className="p-invalid">Categoria es requerida.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="descripcion">Proveedor</label>
                            <Select 
                                value={producto.idProveedor} 
                                className="w-full"
                                id="idProveedor" 
                                name="idProveedor" 
                                onChange={onInputChange}
                            >
                                {proveedores.map((item, index) => (
                                    <MenuItem value={item.idProveedor} key={index}>
                                        {item.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Precio</label>
                                <TextField
                                    type="number"
                                    id="precio"
                                    name="precio"
                                    value={ producto.precio }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    className={classNames({ 'p-invalid': submitted && !producto.precio })} 
                                />
                                { submitted &&  !producto.precio && <small className="p-invalid">Precio es requerido.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Stock</label>
                                <TextField
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={ producto.stock }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    className={classNames({ 'p-invalid': submitted && !producto.stock })} 
                                />
                                { submitted &&  !producto.stock && <small className="p-invalid">Stock es requerido.</small>}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">fecha</label>
                                <TextField
                                    type="date"
                                    id="fechaIngreso"
                                    name="fechaIngreso"
                                    value={ producto.fechaIngreso }
                                    onChange={onInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Venta/Alquiler</label>
                                <Select 
                                    value={producto.venta} 
                                    className="w-full"
                                    id="venta" 
                                    name="venta" 
                                    onChange={onInputChange}
                                >
                                    {tipoVenta.map((item, index) => (
                                        <MenuItem value={item.id} key={index}>
                                            {item.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </div>

                    </Dialog>

                    <Dialog visible={deleteProductoDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteProductoDialogFooter} onHide={hideDeleteProductoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {producto && <span>Desea eliminar este item: <b>{producto.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}

export default Producto;