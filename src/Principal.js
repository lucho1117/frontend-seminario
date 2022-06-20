import React, {useState} from 'react';
import App from './App';
import Login from './login/Login';




const Principal = () => {

    const [autenticado, setAutenticado] = useState(false);

    return (
        <>
        {
            autenticado ? (
                <App
                    setAutenticado={setAutenticado}
                />
            ): (
                <Login
                    setAutenticado={setAutenticado}
                />
            )
        }
       
        </>
    )
}

export default Principal;