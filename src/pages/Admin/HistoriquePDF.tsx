// src/pages/admin/HistoriquePDF.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  textHeader: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 10,
  },
});

interface HistoriquePDFProps {
  colis: any[];
}

const HistoriquePDF: React.FC<HistoriquePDFProps> = ({ colis }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Historique des Colis</Text>
        <Text style={{ fontSize: 12, marginTop: 5 }}>
          Généré le {new Date().toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.table}>
        {/* En-tête */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Code</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Destinataire</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Agence Départ</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Agence Arrivée</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Statut</Text>
          </View>
        </View>
        
        {/* Données */}
        {colis.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{item.code_suivi}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{item.destinataire_nom}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{item.agence_depart}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{item.agence_arrivee}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{item.statut}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default HistoriquePDF;