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
import * as Service from "./Service";
import * as ServiceTipoVehiculo from "../tipoVehiculo/Service";
import { MenuItem, Select, TextField } from '@mui/material';

const Vehiculo = () => {
  let formVehiculo = {
    idTipoVehiculo: "",
    placa: "",
    marca: "",
    modelo: "",
    color: "",
    descripcion: "",
};

const [vehiculos, setVehiculos] = useState(null);
const [tipoVehiculos, setTipoVehiculos] = useState([]);
const [vehiculoDialog, setVehiculoDialog] = useState(false);
const [deleteVehiculoDialog, setDeleteVehiculoDialog] = useState(false);
const [vehiculo, setVehiculo] = useState(formVehiculo);
const [submitted, setSubmitted] = useState(false);
const [globalFilter, setGlobalFilter] = useState(null);
const toast = useRef(null);
const dt = useRef(null);

useEffect(() => {
    list();
    listTipoVehiculos();
}, []);

const list = async()  => {
    let resp = await Service.list();
    if (resp.valid) {
        setVehiculos(resp.data);
    } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
    }
}

const listTipoVehiculos = async()  => {
  let resp = await ServiceTipoVehiculo.list();
  if (resp.valid) {
      setTipoVehiculos(resp.data);
  } else {
      toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
  }
}


const openNew = () => {
    setVehiculo(formVehiculo);
    setSubmitted(false);
    setVehiculoDialog(true);
}

const hideDialog = () => {
    setSubmitted(false);
    setVehiculoDialog(false);
}

const hideDeleteVehiculoDialog = () => {
    setDeleteVehiculoDialog(false);
}

const submit = () => {
    if (vehiculo.idTipoVehiculo && vehiculo.placa && vehiculo.marca && vehiculo.modelo && vehiculo.color) {
         if (vehiculo.idVehiculo) {
             edit();
         } else {
             save();
         }
    } 
}

const save = async () => {
    let resp = await Service.save(vehiculo);
    if ( resp.valid ){
        list();
        hideDialog();
        toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Agregado Correctamente', life: 3000 });
    } else {
        toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
    }
}

const edit = async () => {
    let resp = await Service.update(vehiculo);
    if ( resp.valid ){
        list();
        hideDialog();
        toast.current.show({ severity: 'success', summary: 'Exitoso!', detail: 'Actualizado Correctamente', life: 3000 });
    } else {
        toast.current.show({ severity: 'error', summary: 'Error!', detail: resp.msg, life: 3000 });
    }
}



const editVehiculo = (vehiculo) => {
    setVehiculo({ ...vehiculo });
    setVehiculoDialog(true);
}

const confirmDeleteVehiculo = (vehiculo) => {
    setVehiculo(vehiculo);
    setDeleteVehiculoDialog(true);
}

const deleteVehiculo = async () => {
    let resp = await Service.deleteById(vehiculo);
    if ( resp.valid ) {
        list();
        setDeleteVehiculoDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
    } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
    }

}



const onInputChange = (e) => {
    const { value, name } = e.target;
    if ( name ==='disponible') {
      setVehiculo({
        ...vehiculo,
        [name]: !value,
    });
    } else {
      setVehiculo({
          ...vehiculo,
          [name]: value,
      });
    }
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
            {rowData.idVehiculo}
        </>
    );
}

const tipoVehiculoBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Tipo Vehiculo</span>
            {rowData.tipoVehiculo}
        </>
    );
}

const placaBodyTemplate = (rowData) => {
  return (
      <>
          <span className="p-column-title">Placa</span>
          {rowData.placa}
      </>
  );
}

const marcaBodyTemplate = (rowData) => {
  return (
      <>
          <span className="p-column-title">Marca</span>
          {rowData.marca}
      </>
  );
}

const modeloBodyTemplate = (rowData) => {
  return (
      <>
          <span className="p-column-title">Modelo</span>
          {rowData.modelo}
      </>
  );
}

const colorBodyTemplate = (rowData) => {
  return (
      <>
          <span className="p-column-title">Color</span>
          {rowData.color}
      </>
  );
}

const disponibleBodyTemplate = (rowData) => {
  return (
      <>
          <span className="p-column-title">Disponible</span>
          {rowData.disponible ? "DISPONIBLE" : "NO DISPONIBLE"}
      </>
  );
}



const actionBodyTemplate = (rowData) => {
    return (
        <div className="actions">
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editVehiculo(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteVehiculo(rowData)} />
        </div>
    );
}

const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Vehiculos</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </span>
    </div>
);

const vehiculoDialogFooter = (
    <>
        <Button label="CANCELAR" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={hideDialog} />
        <Button label={vehiculo.idVehiculo ? "EDITAR" : "GUARDAR"} icon="pi pi-check" className="p-button-rounded p-button-info p-button-text" onClick={submit} />
    </>
);
const deleteVehiculoDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteVehiculoDialog} />
        <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deleteVehiculo} />
    </>
);

return (
    <div className="grid crud-demo">
        <div className="col-12">
            <div className="card">
                <Toast ref={toast} />
                <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={vehiculos}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} vehiculos"
                    globalFilter={globalFilter} emptyMessage="No vehiculos found." header={header} responsiveLayout="scroll">

                    <Column field="idVehiculo" header="ID" sortable body={idBodyTemplate} headerStyle={{ width: '10%', minWidth: '10rem' }}></Column>
                    <Column field="tipoVehiculo" header="Tipo Vehiculo" sortable body={tipoVehiculoBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                    <Column field="placa" header="Placa" body={placaBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                    <Column field="marca" header="Marca" body={marcaBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                    <Column field="modelo" header="Modelo" body={modeloBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                    <Column field="color" header="Color" body={colorBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                    <Column field="disponible" header="Disponibilidad" body={disponibleBodyTemplate} sortable headerStyle={{ width: '15%', minWidth: '8rem' }}></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>

                <Dialog visible={vehiculoDialog} style={{ width: '450px' }} header={vehiculo.idVehiculo ? "EDITAR" : "NUEVO"} modal className="p-fluid" footer={vehiculoDialogFooter} onHide={hideDialog}>
                    
                    <div className="formgrid grid">
                      <div className="field col">
                        <label htmlFor="descripcion">Tipo Vehiculo*</label>
                        <Select 
                            value={vehiculo.idTipoVehiculo} 
                            className="w-full"
                            id="idTipoVehiculo" 
                            name="idTipoVehiculo" 
                            onChange={onInputChange}>
                            {tipoVehiculos.map((item, index) => (
                                <MenuItem value={item.idTipoVehiculo} key={index}>
                                    {item.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                        { submitted &&  !vehiculo.idTipoVehiculo && <small className="p-invalid">Tipo de Vehiculo es requerida.</small>}
                      </div>
                      <div className="field col">
                        <label htmlFor="nombre">Placa*</label>
                          <TextField 
                              id="placa" 
                              name="placa"
                              value={vehiculo.placa} 
                              onChange={onInputChange} 
                              required 
                              className={classNames({ 'p-invalid': submitted && !vehiculo.placa })} 
                          />
                          { submitted &&  !vehiculo.placa && <small className="p-invalid">Placa es requerido.</small>}
                      </div>
                    </div>

                    <div className="formgrid grid">
                      <div className="field col">
                        <label htmlFor="marca">Marca*</label>
                        <TextField 
                              id="marca" 
                              name="marca"
                              value={vehiculo.marca} 
                              onChange={onInputChange} 
                              required 
                              fullWidth
                              className={classNames({ 'p-invalid': submitted && !vehiculo.marca })} 
                        />
                        { submitted &&  !vehiculo.marca && <small className="p-invalid">Marca es requerido.</small>}
                      </div>
                      <div className="field col">
                        <label htmlFor="nombre">Modelo*</label>
                          <TextField 
                              id="modelo" 
                              name="modelo"
                              type="number"
                              value={vehiculo.modelo} 
                              onChange={onInputChange} 
                              required 
                              autoFocus 
                              className={classNames({ 'p-invalid': submitted && !vehiculo.modelo })} 
                          />
                          { submitted &&  !vehiculo.modelo && <small className="p-invalid">Modelo es requerido.</small>}
                      </div>
                    </div>


                    <div className="field">
                        <label htmlFor="color">Color*</label>
                        <TextField 
                              id="color" 
                              name="color"
                              value={vehiculo.color} 
                              onChange={onInputChange} 
                              required 
                              autoFocus 
                              fullWidth
                              className={classNames({ 'p-invalid': submitted && !vehiculo.color })} 
                        />
                        { submitted &&  !vehiculo.color && <small className="p-invalid">Color es requerido.</small>}
                      
                    </div>




                    <div className="field">
                        <label htmlFor="descripcion">Descripción</label>
                        <InputTextarea 
                            id="descripcion" 
                            name="descripcion"
                            value={vehiculo.descripcion} 
                            onChange={onInputChange} 
                            required 
                            rows={3} 
                            cols={20} 
                        />
                    </div>
                </Dialog>

                <Dialog visible={deleteVehiculoDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteVehiculoDialogFooter} onHide={hideDeleteVehiculoDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {vehiculo && <span>Desea eliminar este item: <b>{vehiculo.nombre}</b>?</span>}
                    </div>
                </Dialog>

            </div>
        </div>
    </div>
)
}

export default Vehiculo;