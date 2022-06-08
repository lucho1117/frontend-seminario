import React, { useState, useEffect, useRef} from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import * as Service from "./Service";
import Detalle from "./Detalle";
import * as ServiceMaterial from "../../material/Service";
import * as ServiceEmpleado from "../../../user/empleado/Service";
import ReportFase from './ReportFase';
import { PDFViewer } from '@react-pdf/renderer';
import { Dialog } from 'primereact/dialog';


const Fase = (props) => {
    let formFase = {
        idObra: props.obra.idObra,
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        costoMaterial: "",
        costoManoObra: "",
        costoTotal: "",
        materiales: [],
        manoObra: []
    };

    let formDetalleMaterial = {
        idMaterial: "",
        descripcion: "",
        cantidad: "",
        unidad: "",
        precioTotal: "",
        precio: ""
    }

    let formManoObra = {
        idEmpleado: "",
        empleado: "",
        costo: ""
    }

    const [fases, setFases] = useState(null);
    const [fase, setFase] = useState(formFase);
    const [detalleMaterial, setDetalleMaterial] = useState(formDetalleMaterial);
    const [manoObra, setManoObra] = useState(formManoObra);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [flagDetalle, setFlagDetalle] = useState(false);

    const [empleados, setEmpleados] = useState([]);
    const [materiales, setMateriales] = useState([]);

    const [faseDialog, setFaseDialog] = useState(false);
    const [deleteFaseDialog, setDeleteFaseDialog] = useState(false);
  
    useEffect(() => {
        list();
        listMateriales();
        listEmpleados();
    }, []);

    const list = async()  => {
        const aux = { idObra: props.obra.idObra}
        let resp = await Service.listByObra(aux);
        if (resp.valid) {
            setFases(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listMateriales = async()  => {
        let resp = await ServiceMaterial.list();
        if (resp.valid) {
            setMateriales(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const listEmpleados = async()  => {
        let aux = { idAreaNegocio: 4};
        let resp = await ServiceEmpleado.listByArea(aux);
        if (resp.valid) {
            setEmpleados(resp.data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }
    }

    const openNew = () => {
        setFase(formFase);
        setFlagDetalle(true);
    }


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="VOLVER" icon="pi pi-arrow-left" className="p-button-text" onClick={()=>{ props.setFlagObra(false);}} />
                    <Button label="AGREGAR" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button 
                    icon="pi pi-file-pdf" 
                    className="p-button-rounded p-button-info mr-2" 
                    onClick={()=>{
                        setFaseDialog(true);
                        setFase(rowData);
                    }}     
                />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-danger mt-2" 
                    onClick={() => confirmDeleteFase(rowData)} 
                />
            </div>
        );
    }

    const confirmDeleteFase = (fase) => {
        setFase(fase);
        setDeleteFaseDialog(true);
    }

    const deleteFase = async () => {
        let resp = await Service.deleteById(fase);
        if ( resp.valid ) {
            list();
            setDeleteFaseDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Eliminado correctamente', life: 3000 });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: resp.msg, life: 3000 });
        }

    }

    const deleteFaseDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteFaseDialog} />
            <Button label="SI" icon="pi pi-check" className="p-button-text" onClick={deleteFase} />
        </>
    );

    const hideDeleteFaseDialog = () => {
        setDeleteFaseDialog(false);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Fases</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const hideDialog = () => {
        setFaseDialog(false);
    }

    return (
        <>
        {
            !flagDetalle ?(
                <div className="grid crud-demo">
                    <div className="col-12">
                        <div className="card">
                            <Toast ref={toast} />
                            <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>
        
                            <DataTable ref={dt} value={fases}
                                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} fases"
                                globalFilter={globalFilter} emptyMessage="No fases found." header={header} responsiveLayout="scroll">
        
                                <Column field="idFase" header="ID" sortable ></Column>
                                <Column field="nombre" header="Nombre" sortable ></Column>
                                <Column field="descripcion" header="Descripción" ></Column>
                                <Column field="fechaInicio" header="Fecha Inicio" ></Column>
                                <Column field="fechaFin" header="Fecha Fin" ></Column>
                                <Column field="costoTotal" header="Costo Total" ></Column>
                                <Column body={actionBodyTemplate}></Column>
                            </DataTable>
        
                           
        
                        </div>
                    </div>
                </div>
            ):null
        }

        {
            flagDetalle ? (
                <Detalle 
                    setFlagDetalle={setFlagDetalle}
                    formFase={formFase}
                    formDetalleMaterial={formDetalleMaterial}
                    formManoObra={formManoObra}
                    setFase={setFase}
                    setDetalleMaterial={setDetalleMaterial}
                    setManoObra={setManoObra}
                    fase={fase}
                    detalleMaterial={detalleMaterial}
                    manoObra={manoObra}

                    empleados={empleados}
                    materiales={materiales}

                    toast={toast}
                    list={list}
                />
            ):null
        }

            <Dialog visible={deleteFaseDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteFaseDialogFooter} onHide={hideDeleteFaseDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    { <span>Desea eliminar la fase No. <b>{fase.idFase}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={faseDialog} style={{ width: '1500px' }} modal className="p-fluid"  onHide={hideDialog}>
                <PDFViewer style={{width:"100%", height: "90vh"}}>
                    <ReportFase 
                        fase={fase}
                    />
                </PDFViewer>

            </Dialog>
        </>
    )
}

export default Fase;