import "./Styles/login.css";
import React from 'react';
import Img from './img/result.svg';
import { TextField } from '@mui/material';


const Login = (props) => {
    return (
    <div className="body">
        <div className="left-login">
          <img src={Img} alt="Pessoas olhando gráficos" className="chart" />
  
        </div>
  
        <div className="right-login">
          <div className="card">
           
            <h1>LOGIN</h1>
              <div className="card">
                <div className="field">
                     <label htmlFor="price">Usuario</label>
                    <TextField
                        type="email"
                        id="usuario"
                        name="usuario"
                       /*  value={ producto.precio }
                        onChange={onInputChange} */
                        variant="outlined"
                        fullWidth
                        required
                    />
                </div>
  
  
                <div className="field">
                    <label htmlFor="price">Password</label>
                    <TextField
                        type="password"
                        id="password"
                        name="password"
                       /*  value={ producto.precio }
                        onChange={onInputChange} */
                        variant="outlined"
                        fullWidth
                        required
                    />
                </div>
  
                <button 
                    className="button" 
                    type="submit"
                    onClick={()=> props.setAutenticado(true)}
                >
                  INGRESAR
                </button>
              </div>
          </div>
          
        </div>
      </div>
    )
}

export default Login;