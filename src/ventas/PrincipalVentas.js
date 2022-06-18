import React, {useState} from 'react';
import Venta from './venta/Venta';
import Alquiler from './alquiler/Alquiler';

const PrincipalVentas = () => {
    const [flagVenta, setFlagVenta] = useState(false);
    const [flagAlquiler, setFlagAlquiler] = useState(false);

    const directVenta = () => {
        setFlagVenta(true);
    }

    const directAlquiler = () => {
        setFlagAlquiler(true);
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