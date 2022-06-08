import axios from 'axios';

//// URL ROOT
const URL = process.env.REACT_APP_BACKEND;

export async function list(obj) {
    let respuesta = await axios.post(URL + `/tipoMaquinaria/list`, obj);
	return respuesta.data;
}

export async function save(obj) {
    let respuesta = await axios.post(URL + `/tipoMaquinaria/save`, obj);
	return respuesta.data;
}

export async function update(obj) {
    let respuesta = await axios.post(URL + `/tipoMaquinaria/update`, obj);
	return respuesta.data;
}

export async function deleteById(obj) {
    let respuesta = await axios.post(URL + `/tipoMaquinaria/delete`, obj);
	return respuesta.data;
}