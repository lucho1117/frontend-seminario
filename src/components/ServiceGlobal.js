import axios from 'axios';

//// URL ROOT
const URL = process.env.REACT_APP_BACKEND;

export async function conteoEmpleados() {
    let respuesta = await axios.get(URL + `/global/conteoEmpleados` );
	return respuesta.data;
}

export async function productosMasVendidos() {
    let respuesta = await axios.get(URL + `/global/productosMasVendidos` );
	return respuesta.data;
}

export async function productosMasAlquilados() {
    let respuesta = await axios.get(URL + `/global/productosMasAlquilados` );
	return respuesta.data;
}