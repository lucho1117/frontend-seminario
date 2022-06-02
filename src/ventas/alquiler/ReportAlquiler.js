import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

// Create styles
const styles = StyleSheet.create({
    section: {
        marginLeft: 10,
        padding: 10,
    },
    body: {
        fontSize: 11, 
        marginTop:5
    },
    table: {

    }
});

const ReportAlquiler = (props) => {
    return (
        <>
        <Document>
            <Page size="A4" 
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "left",
                    alignItems: "left",
                    backgroundColor: "#E4E4E4",
                }}
            >
                <View style={{marginTop:35, alignItems: "center"}}>
                    <Text style={{color: "#3388af"}}>ALQUILER</Text>
                </View>    
                <View style={styles.section}>
                    <Text style={styles.body}>Producto: {props.factura.producto}</Text>
                    <Text style={styles.body}>Cliente: {props.factura.nombreCliente}</Text>
                    <Text style={styles.body}>Dirección: {props.factura.direccion}</Text>
                    <Text style={styles.body}>Tipo de Pago: {props.factura.tipoPago}</Text>
                    <Text style={styles.body}>Total a pagar: {props.factura.total}</Text>
                    <Text style={styles.body}>Fecha: {moment(props.fechaProximaFacturacion).format("DD/MM/YYYY")}</Text>
                    <Text style={styles.body}>Empleado: {props.factura.nombreEmpleado}</Text>
                </View>

                
            </Page>
        </Document>
     
        </>
    )
}

export default ReportAlquiler;