import axios from 'axios';

//// URL ROOT
const URL = process.env.REACT_APP_BACKEND;

export async function list(obj) {
    let respuesta = await axios.post(URL + `/fase/list`, obj);
	return respuesta.data;
}

export async function save(obj) {
    let respuesta = await axios.post(URL + `/fase/save`, obj);
	return respuesta.data;
}

export async function update(obj) {
    let respuesta = await axios.post(URL + `/fase/update`, obj);
	return respuesta.data;
}

export async function deleteById(obj) {
    let respuesta = await axios.post(URL + `/fase/delete`, obj);
	return respuesta.data;
}