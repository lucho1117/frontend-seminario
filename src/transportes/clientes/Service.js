import axios from 'axios';

//// URL ROOT
const URL = process.env.REACT_APP_BACKEND;

export async function list(obj) {
    let respuesta = await axios.post(URL + `/cliente/list`, obj);
	return respuesta.data;
}

export async function listTrasnporte(obj) {
    let respuesta = await axios.post(URL + `/cliente/listCondicion`, obj);
	return respuesta.data;
}

export async function save(obj) {
    let respuesta = await axios.post(URL + `/cliente/save`, obj);
	return respuesta.data;
}

export async function update(obj) {
    let respuesta = await axios.post(URL + `/cliente/update`, obj);
	return respuesta.data;
}

export async function deleteById(obj) {
    let respuesta = await axios.post(URL + `/cliente/delete`, obj);
	return respuesta.data;
}