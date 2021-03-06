import axios from 'axios';

//// URL ROOT
const URL = process.env.REACT_APP_BACKEND;

export async function list(obj) {
    let respuesta = await axios.post(URL + `/empleado/list`, obj);
	return respuesta.data;
}

export async function listByRolByArea(obj) {
    let respuesta = await axios.post(URL + `/empleado/listByRolByArea`, obj);
	return respuesta.data;
}

export async function save(obj) {
    let respuesta = await axios.post(URL + `/empleado/save`, obj);
	return respuesta.data;
}

export async function update(obj) {
    let respuesta = await axios.post(URL + `/empleado/update`, obj);
	return respuesta.data;
}

export async function deleteById(obj) {
    let respuesta = await axios.post(URL + `/empleado/delete`, obj);
	return respuesta.data;
}

export async function listByArea(obj) {
    let respuesta = await axios.post(URL + `/empleado/listByArea`, obj);
	return respuesta.data;
}

export async function listRol(obj) {
    let respuesta = await axios.post(URL + `/rol/list`, obj);
	return respuesta.data;
}

export async function listSede(obj) {
    let respuesta = await axios.post(URL + `/sede/list`, obj);
	return respuesta.data;
}

export async function listPlantas(obj) {
    let respuesta = await axios.post(URL + `/empleado/plantas`, obj);
	return respuesta.data;
}