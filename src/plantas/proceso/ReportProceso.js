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

const ReportProceso = (props) => {
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
                    <Text style={{color: "#3388af"}}>REPORTE DE OPERACIONES</Text>
                </View>    
                <View style={styles.section}>
                    <Text style={styles.body}>Listado de procesos que se encuentren activos </Text>
                </View>
                
                <View style={styles.section}>
                   
                    <Table
                        data={props.procesos}
                    >
                        <TableHeader textAlign={"center"}>
                            <TableCell weighting={0.3}>
                                No.
                            </TableCell >
                            <TableCell>
                                Nombre
                            </TableCell>
                            <TableCell>
                                Fecha Inicio
                            </TableCell>
                            <TableCell>
                                Fecha Fin
                            </TableCell>
                            <TableCell>
                                Descripcion
                            </TableCell>
                            <TableCell>
                                Costo
                            </TableCell>
                        </TableHeader>
                        <TableBody>
                        
                        
                        <DataTableCell weighting={0.3} getContent={(r) => r.idProceso}/>
                        <DataTableCell getContent={(r) => r.nombre}/>
                        <DataTableCell getContent={(r) => r.fechaInicio}/>
                        <DataTableCell getContent={(r) => r.fechaFin}/>
                        <DataTableCell getContent={(r) => r.descripcion}/>
                        <DataTableCell getContent={(r) => "Q. " + r.costo}/>
                            
                        </TableBody>
                    </Table>
     
                </View>
                
            </Page>
        </Document>
     
        </>
    )
}

export default ReportProceso;