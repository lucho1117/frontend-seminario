import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
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
    table: {

    }
});

const ReportAsignacion = (props) => {
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
                <View style={{marginTop:55, alignItems: "center"}}>
                    <Text style={{color: "#3388af"}}>REPORTE DE ASIGNACIONES</Text>
                </View>    
                <View style={styles.section}>
                    <Text style={styles.body}>Listado de asignaciones en sus diversas etapas</Text>
                </View>
                
                <View style={styles.section}>
                   
                    <Table
                        data={props.asignaciones}
                    >
                        <TableHeader textAlign={"center"}>
                            <TableCell weighting={0.3}>
                                No.
                            </TableCell >
                            <TableCell>
                                Vehiculo
                            </TableCell>
                            <TableCell>
                                Ruta
                            </TableCell>
                            <TableCell>
                                Cliente
                            </TableCell>
                            <TableCell>
                                Cargamento
                            </TableCell>
                            <TableCell>
                                Piloto
                            </TableCell>
                            <TableCell>
                                Estado
                            </TableCell>
                        </TableHeader>
                        <TableBody>
                        
                        
                        <DataTableCell weighting={0.3} getContent={(r) => r.idAsignacion}/>
                        <DataTableCell getContent={(r) => r.placa}/>
                        <DataTableCell getContent={(r) => r.destino}/>
                        <DataTableCell getContent={(r) => r.cliente}/>
                        <DataTableCell getContent={(r) => r.cargamento}/>
                        <DataTableCell getContent={(r) => r.empleado}/>
                        <DataTableCell getContent={(r) => r.estado === 1 ? "EN ESPERA": r.estado === 2 ? "EN RUTA" : "FINALIZADO"}/>
                            
                        </TableBody>
                    </Table>
     
                </View>
                
            </Page>
        </Document>
     
        </>
    )
}

export default ReportAsignacion;