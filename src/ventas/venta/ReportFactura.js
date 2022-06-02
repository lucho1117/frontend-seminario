import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
/* import {Table, TableHeader,TableCell, TableBody, DataTableCell} from "@david.kucsai/react-pdf-table";
 */
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

const ReportFactura = (props) => {

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
                    <Text style={{color: "#3388af"}}>FACTURA</Text>
                </View>    
                <View style={styles.section}>
                    <Text style={styles.body}>Cliente: {props.factura.cliente}</Text>
                    <Text style={styles.body}>Dirección: {props.factura.direccion}</Text>
                    <Text style={styles.body}>Tipo de Pago: {props.factura.tipoPago}</Text>
                    <Text style={styles.body}>Fecha: {moment(props.fecha).format("DD/MM/YYYY")}</Text>
                    <Text style={styles.body}>Empleado: {props.factura.empleado}</Text>
                </View>

                {/* <View style={styles.section}>
                   
                    <Table
                        data={props.factura.detalle}
                    >
                        <TableHeader textAlign={"center"}>
                            <TableCell weighting={0.3}>
                                No.
                            </TableCell >
                            <TableCell>
                                Producto
                            </TableCell>
                            <TableCell>
                                Precio
                            </TableCell>
                            <TableCell>
                                Cantidad
                            </TableCell>
                            <TableCell>
                                Total
                            </TableCell>
                        </TableHeader>
                        <TableBody>
                        
                        
                        <DataTableCell weighting={0.3} getContent={(r) => r.idDetalleVenta}/>
                        <DataTableCell getContent={(r) => r.producto}/>
                        <DataTableCell getContent={(r) => r.precio}/>
                        <DataTableCell getContent={(r) => r.cantidad}/>
                        <DataTableCell getContent={(r) => r.total}/>
                            
                        </TableBody>
                    </Table>
                    
                    <Text style={{
                        color: "black",
                        fontStyle: "italic",
                        fontSize: "12px",
                        marginTop: 15
                        }}>Total: {props.factura.total}
                    </Text>
                </View> */}
                
            </Page>
        </Document>
     
        </>
    )
}

export default ReportFactura;