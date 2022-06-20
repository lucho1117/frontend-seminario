import axios from 'axios';

//// URL ROOT
const URL = process.env.REACT_APP_BACKEND;

export async function list(obj) {
    let respuesta = await axios.post(URL + `/detalleProceso/list`, obj);
	return respuesta.data;
}

export async function save(obj) {
    let respuesta = await axios.post(URL + `/detalleProceso/save`, obj);
	return respuesta.data;
}

export async function update(obj) {
    let respuesta = await axios.post(URL + `/detalleProceso/update`, obj);
	return respuesta.data;
}

export async function deleteById(obj) {
    let respuesta = await axios.post(URL + `/detalleProceso/delete`, obj);
	return respuesta.data;
}

export async function listByObra(obj) {
    let respuesta = await axios.post(URL + `/detalleProceso/listByObra`, obj);
	return respuesta.data;
}