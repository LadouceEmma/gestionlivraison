import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { io } from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const socket = io('http://localhost:5000');

const SuiviColis: React.FC = () => {
  const { id } = useParams();
  const [position, setPosition] = useState<[number, number]>([5.848, 10.1591]); // Coordonnées centrées sur le Cameroun
  const [chemin, setChemin] = useState<[number, number][]>([]);
  const [depart, setDepart] = useState<[number, number] | null>(null);
  const [statut, setStatut] = useState<string>('en cours');
  const [numColis, setNumColis] = useState<string>('');
  const [colisPosition, setColisPosition] = useState<[number, number] | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const livreurIcon = new L.Icon({
    iconUrl: statut === 'livré'
      ? 'https://cdn-icons-png.flaticon.com/512/190/190411.png'
      : 'https://cdn-icons-png.flaticon.com/512/685/685655.png',
    iconSize: [30, 30],
  });

  const departIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [25, 25],
  });

  const colisIcon = new L.Icon({
    iconUrl: 'https://img.icons8.com/color/48/000000/marker.png',
    iconSize: [30, 30],
  });

  // Limites géographiques pour le Cameroun
  const bounds = [
    [2.0, 8.0],  // Sud-Ouest (latitude, longitude)
    [13.5, 16.5], // Nord-Est (latitude, longitude)
  ];

  useEffect(() => {
    socket.emit('join_colis_room', id);

    socket.on('livreur_position', (data: { lat: number; lng: number; statut?: string }) => {
      const newLatLng: [number, number] = [data.lat, data.lng];

      setPosition(newLatLng);
      setChemin((prev) => [...prev, newLatLng]);

      if (!depart) {
        setDepart(newLatLng);
      }

      if (data.statut) {
        setStatut(data.statut);
      }

      if (markerRef.current) {
        markerRef.current.setLatLng(newLatLng);
      }

      if (mapRef.current) {
        mapRef.current.panTo(newLatLng);
      }
    });

    return () => {
      socket.off('livreur_position');
    };
  }, [id, depart]);

  const handleColisSubmit = () => {
    const colisData = { lat: 5.848, lng: 10.1591 }; // Exemple de données de localisation
    if (colisData) {
      const newColisPosition: [number, number] = [colisData.lat, colisData.lng];
      setColisPosition(newColisPosition);
      if (mapRef.current) {
        mapRef.current.panTo(newColisPosition);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Suivi du colis</h2>
      <div className="mb-3">
        <input
          type="text"
          value={numColis}
          onChange={(e) => setNumColis(e.target.value)}
          placeholder="Entrez le numéro de colis"
          className="form-control"
        />
        <button onClick={handleColisSubmit} className="btn btn-primary mt-2">Suivre</button>
      </div>
      <MapContainer
        center={position}
        zoom={6}
        bounds={bounds}
        style={{ height: '500px', width: '100%' }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          mapInstance.setMaxBounds(bounds); // Définir les limites de la carte
        }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {depart && (
          <Marker position={depart} icon={departIcon}>
            <Popup>Point de départ</Popup>
          </Marker>
        )}

        <Marker
          position={position}
          icon={livreurIcon}
          ref={(marker) => {
            if (marker) markerRef.current = marker;
          }}
        >
          <Popup>
            {statut === 'livré' ? 'Colis livré 🎉' : 'Position actuelle du livreur'}
          </Popup>
        </Marker>

        <Polyline positions={chemin} color={statut === 'livré' ? 'green' : 'blue'} />

        {colisPosition && (
          <Marker position={colisPosition} icon={colisIcon}>
            <Popup>Position du colis</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default SuiviColis;