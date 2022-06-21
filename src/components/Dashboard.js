import React, { useState, useEffect } from 'react';
import * as ServiceGlobal from "./ServiceGlobal";

const Dashboard = (props) => {
    const [conteoEmpleados, setConteoEmpleados] = useState([]);


    useEffect(() => {
        getConteoEmpleados();
    }, []);


    const getConteoEmpleados = async () => {
        const resp = await ServiceGlobal.conteoEmpleados();
        if (resp.valid) setConteoEmpleados(resp.data);
    }



    return (
        <div className="grid">
             <div className="col-12">
                 <div className="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
                     style={{borderRadius: '1rem', background: 'linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)'}}>
                    <div>
                        <div className="text-blue-100 font-medium text-xl mt-2 mb-3">Bienvenido!!!</div>
                        <div className="text-white font-medium text-5xl">TransPort S.A</div>
                    </div>
                    
                </div>
             </div>

             {
                conteoEmpleados.map((item, index) => {
                    return (
                        <div className="col-12 lg:col-6 xl:col-4" key={index}>
                            <div className="card mb-0">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Empleados</span>
                                        <div className="text-900 font-medium text-xl">{item.numeroEmpleados}</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                                        <i className="pi pi-users text-orange-500 text-xl"/>
                                    </div>
                                </div>
                                <span className="text-500">{item.area} </span>
                            </div>
                        </div>

                    )
                })
             }

           

          


        </div>
    );
}



export default Dashboard;
