import axios from 'axios';

//// URL ROOT
const URL = process.env.REACT_APP_BACKEND;

export async function list(obj) {
    let respuesta = await axios.post(URL + `/asignacion/list`, obj);
	return respuesta.data;
}

export async function save(obj) {
    let respuesta = await axios.post(URL + `/asignacion/save`, obj);
	return respuesta.data;
}

export async function update(obj) {
    let respuesta = await axios.post(URL + `/asignacion/update`, obj);
	return respuesta.data;
}

export async function deleteById(obj) {
    let respuesta = await axios.post(URL + `/asignacion/delete`, obj);
	return respuesta.data;
}

export async function empezarRuta(obj) {
    let respuesta = await axios.post(URL + `/asignacion/empezarRuta`, obj);
	return respuesta.data;
}

export async function terminarRuta(obj) {
    let respuesta = await axios.post(URL + `/asignacion/terminarRuta`, obj);
	return respuesta.data;
}