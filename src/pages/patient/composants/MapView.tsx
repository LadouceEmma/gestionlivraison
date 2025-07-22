import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Correction Leaflet icônes - SOLUTION AMÉLIORÉE
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Icône personnalisée
const deliveryIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2718/2718224.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Step {
  latitude?: number;
  longitude?: number;
  status: string;
  location: string;
  date: string;
}

interface MapViewProps {
  steps: Step[];
  defaultCenter?: { lat: number; lng: number };
}

const MapView: React.FC<MapViewProps> = ({ steps, defaultCenter }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const DOUALA_COORDS: L.LatLngExpression = [4.0511, 9.7679];

  useEffect(() => {
    try {
      if (!mapContainerRef.current) return;

      // Initialiser la carte UNE SEULE FOIS
      if (!mapRef.current) {
        const map = L.map(mapContainerRef.current).setView(DOUALA_COORDS, 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        markersLayer.current = L.layerGroup().addTo(map);
        mapRef.current = map;
      }

      // Nettoyer les anciens marqueurs
      if (markersLayer.current) {
        try {
          markersLayer.current.clearLayers();
        } catch (clearErr) {
          console.warn('Erreur lors du clearLayers:', clearErr);
        }
      }

      const validSteps = steps.filter(step => 
        step.latitude !== undefined && 
        step.longitude !== undefined &&
        !isNaN(step.latitude) && 
        !isNaN(step.longitude)
      );

      if (validSteps.length > 0) {
        const route: L.LatLngExpression[] = [];

        validSteps.forEach((step, index) => {
          const coords: L.LatLngExpression = [step.latitude!, step.longitude!];
          route.push(coords);

          // FORCER l'utilisation d'une icône valide
          const marker = L.marker(coords, {
            icon: index === validSteps.length - 1 ? deliveryIcon : DefaultIcon
          }).bindPopup(`
            <b>${escapeHtml(step.status)}</b><br/>
            <i>${escapeHtml(step.location)}</i><br/>
            ${new Date(step.date).toLocaleString()}
          `);

          markersLayer.current?.addLayer(marker);
        });

        // Tracer la ligne
        if (route.length > 1) {
          const polyline = L.polyline(route, { color: '#fd7e14', weight: 3 });
          markersLayer.current?.addLayer(polyline);
        }

        // Adapter le zoom
        const bounds = L.latLngBounds(route);
        mapRef.current.fitBounds(bounds.pad(0.2));
      } else if (defaultCenter) {
        mapRef.current.setView([defaultCenter.lat, defaultCenter.lng], 12);
      } else {
        mapRef.current.setView(DOUALA_COORDS, 12);
      }
    } catch (err) {
      console.error("Erreur dans MapView:", err);
    }

    return () => {
      // NE PAS SUPPRIMER mapRef ici pour éviter les conflits
    };
  }, [steps, defaultCenter]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: '400px',
        width: '100%',
        border: '2px solid #fd7e14',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    />
  );
};

// Sécuriser le HTML
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default MapView;