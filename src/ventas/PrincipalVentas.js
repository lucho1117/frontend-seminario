import React, {useState, useEffect} from 'react';
import Venta from './venta/Venta';
import Alquiler from './alquiler/Alquiler';
import { Chart } from 'primereact/chart';
import * as ServiceGlobal from '../components/ServiceGlobal';



const PrincipalVentas = () => {
    const [flagVenta, setFlagVenta] = useState(false);
    const [flagAlquiler, setFlagAlquiler] = useState(false);

    const [titulos, setTitulos] = useState([]);
    const [total, setTotal] = useState([]);

    const [titulosAlquiler, setTitulosAlquiler] = useState([]);
    const [totalAlquiler, setTotalAlquiler] = useState([]);

    const pieData = {
        labels: titulos,
        datasets: [
            {
                data: total,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#C124F3", 
                    "#F3242D",
                    "#F324CD",
                    "#2424F3",
                    "#24A8F3",
                    "#F324D7",
                    "#F37F24"
                ],
            }
        ]
    };

    const pieDataAlquiler = {
        labels: titulosAlquiler,
        datasets: [
            {
                data: totalAlquiler,
                backgroundColor: [
                    "#F37F24",
                    "#24A8F3",
                    "#F3242D",
                    "#2424F3",
                    "#F324D7",
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#C124F3", 
                    
                    
                ],
            }
        ]
    };

    useEffect(() => {
        productosMasVendidos();
        productosMasAlquilados();
    }, []);
    

    const directVenta = () => {
        setFlagVenta(true);
    }

    const directAlquiler = () => {
        setFlagAlquiler(true);
    }

    const productosMasVendidos = async () => {
        const resp = await ServiceGlobal.productosMasVendidos();
        if (resp.valid) {
            let titulos = [];
            let totales = [];
            resp.data.forEach( item => {
                titulos.push(item.producto);
                totales.push(item.total);
            });
            setTitulos(titulos);
            setTotal(totales);
        }
    }

    const productosMasAlquilados = async () => {
        const resp = await ServiceGlobal.productosMasAlquilados();
        if (resp.valid) {
            let titulos = [];
            let totales = [];
            resp.data.forEach( item => {
                titulos.push(item.producto);
                totales.push(item.total);
            });
            setTitulosAlquiler(titulos);
            setTotalAlquiler(totales);
        }
    }

    return (
        <div className="grid crud-demo">
            {
                !flagVenta && !flagAlquiler ? (
                    <>
                    <div className="col-12 md:col-6">
                        <div className="card card-w-title" onClick={directVenta}>
                            <div className="text-center">
                                <img height="400" alt='' src="assets/demo/images/ventaProducto.jpeg" className="w-9 shadow-2 my-3 mx-0" />
                                <div className="text-2xl font-bold">VENTA</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="card card-w-title">
                            <div className="text-center" onClick={directAlquiler}>
                                <img height="400" alt='' src="assets/demo/images/alquiler.png" className="w-9 shadow-2 my-3 mx-0" />
                                <div className="text-2xl font-bold">ALQUILER</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="card flex flex-column align-items-center">
                            <h4>Productos Más Vendidos</h4>
                            <Chart type="pie" data={pieData} style={{ width: '50%' }} />
                        </div>
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="card flex flex-column align-items-center">
                            <h4>Productos Más Alquilados</h4>
                            <Chart type="pie" data={pieDataAlquiler} style={{ width: '50%' }} />
                        </div>
                    </div>
                    </>
                        
                ): null
            }

            {
                flagVenta ? (
                    <Venta 
                        setFlagVenta={setFlagVenta}
                    />
                ): null
            }

            {
                flagAlquiler ? (
                    <Alquiler
                        setFlagAlquiler={setFlagAlquiler}
                    />
                ): null
            }


        </div>
    )
}

export default PrincipalVentas;