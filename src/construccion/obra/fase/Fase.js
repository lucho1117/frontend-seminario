import React from 'react';
import {Button} from "primereact/button";

const Fase = (props) => {
    return (
        <>
        <h1>Fases</h1>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={()=>{props.setFlagObra(false)}} />
        <pre>{JSON.stringify(props.obra, null, 2)}</pre>
        </>
        
    )
    }

export default Fase;