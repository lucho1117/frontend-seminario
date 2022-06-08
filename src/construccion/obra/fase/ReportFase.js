import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
import {Table, TableHeader,TableCell, TableBody, DataTableCell} from "@david.kucsai/react-pdf-table";

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
    bodyTitulo: {
        fontSize: 13, 
        marginTop:10
    },
});

const ReportFase = (props) => {
   
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
                <View style={{marginTop:35, alignItems: "center" , formSize: 18}}>
                    <Text style={{color: "#3388af"}}>FASE</Text>
                </View>    

                <View style={styles.section}>
                    <Text style={styles.body}>Nombre: {props.fase.nombre}</Text>
                    <Text style={styles.body}>Fecha Inicio: {moment(props.fechaInicio).format("DD/MM/YYYY")}</Text>
                    <Text style={styles.body}>Fecha Fin: {moment(props.fechaFin).format("DD/MM/YYYY")}</Text>
                    <Text style={styles.body}>Descripción: {props.fase.descripcion}</Text>
                    <Text style={styles.body}>Costo Total: {props.fase.costoTotal}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.bodyTitulo}>DETALLE DE MATERIALES</Text>
                    <Table
                        data={props.fase.materiales}
                    >
                        <TableHeader textAlign={"center"}>
                            <TableCell weighting={0.3}>
                                No.
                            </TableCell >
                            <TableCell>
                                Material
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
                        
                        
                        <DataTableCell weighting={0.3} getContent={(r) => r.idMaterial}/>
                        <DataTableCell getContent={(r) => r.material}/>
                        <DataTableCell getContent={(r) => r.precioMaterial}/>
                        <DataTableCell getContent={(r) => r.cantidad}/>
                        <DataTableCell getContent={(r) => r.precioTotal}/>
                            
                        </TableBody>
                    </Table>
                    
                    <Text style={{
                        color: "black",
                        fontStyle: "italic",
                        fontSize: "12px",
                        marginTop: 15
                        }}>Total Material: {props.fase.costoMaterial}
                    </Text>

                    <Text style={styles.bodyTitulo}>DETALLE DE MANO DE OBRA</Text>
                    <Table
                        data={props.fase.manoObra}
                    >
                        <TableHeader textAlign={"center"}>
                            <TableCell weighting={0.3}>
                                No.
                            </TableCell >
                            <TableCell>
                                Empleado
                            </TableCell>
                            <TableCell>
                                Costo
                            </TableCell>
                        </TableHeader>
                        <TableBody>
                        
                        
                        <DataTableCell weighting={0.3} getContent={(r) => r.idManoObra}/>
                        <DataTableCell getContent={(r) => r.nombreEmpleado + " " + r.apellidoEmpleado}/>
                        <DataTableCell getContent={(r) => r.costo}/>
                            
                        </TableBody>
                    </Table>
                    
                    <Text style={{
                        color: "black",
                        fontStyle: "italic",
                        fontSize: "12px",
                        marginTop: 15
                        }}>Total Mano Obra: {props.fase.costoManoObra}
                    </Text>

                </View> 
                
            </Page>
        </Document>
     
        </>
    )
}

export default ReportFase;