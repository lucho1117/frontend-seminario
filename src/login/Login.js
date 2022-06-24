import "./Styles/login.css";
import React, {useState, useRef} from 'react';
import Img from './img/result.svg';
import { TextField } from '@mui/material';
import { Toast } from 'primereact/toast';


const Login = (props) => {
  const toast = useRef(null);
  const [loginForm, setLoginForm] = useState({
    user: "",
    pass: ""
  });

  const handleLogin = () => {
    if ( loginForm.user && loginForm.pass) {
      if (loginForm.user === 'lucio@gmail.com' && loginForm.pass === '1234') {
        props.setAutenticado(true)
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: "Credenciales incorrectas", life: 3000 });
      }
      
    } else {
      toast.current.show({ severity: 'info', summary: 'Error', detail: "Ingrese las credenciales", life: 3000 });
    }
  }

  const onInputChange = (e) => {
    const { value, name } = e.target;
    setLoginForm({
        ...loginForm,
        [name]: value,
    });
}


    return (
    <div className="body">
      <Toast ref={toast} />
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
                        id="user"
                        name="user"
                        value={ loginForm.user }
                        onChange={onInputChange}
                        variant="outlined"
                        fullWidth
                        required
                    />
                </div>
  
  
                <div className="field">
                    <label htmlFor="price">Password</label>
                    <TextField
                        type="password"
                        id="pass"
                        name="pass"
                        value={ loginForm.pass }
                        onChange={onInputChange}
                        variant="outlined"
                        fullWidth
                        required
                    />
                </div>
  
                <button 
                    className="button" 
                    type="submit"
                    onClick={handleLogin }
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