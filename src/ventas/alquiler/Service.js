import axios from 'axios';

//// URL ROOT
const URL = process.env.REACT_APP_BACKEND;

export async function list(obj) {
    let respuesta = await axios.post(URL + `/factura/listAlquiler`, obj);
	return respuesta.data;
}

export async function save(obj) {
    let respuesta = await axios.post(URL + `/factura/saveAlquiler`, obj);
	return respuesta.data;
}

export async function update(obj) {
    let respuesta = await axios.post(URL + `/factura/update`, obj);
	return respuesta.data;
}

export async function deleteById(obj) {
    let respuesta = await axios.post(URL + `/factura/delete`, obj);
	return respuesta.data;
}

export async function listTipoPago(obj) {
    let respuesta = await axios.post(URL + `/tipoPago/list`, obj);
	return respuesta.data;
}