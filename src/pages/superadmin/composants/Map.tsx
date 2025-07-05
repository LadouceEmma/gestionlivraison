// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Corrige les icônes par défaut pour éviter les marqueurs invisibles
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

// const Map = ({ agences, colis }) => {
//   return (
//     <MapContainer center={[5.6037, 10.1591]} zoom={6} style={{ height: '400px', width: '100%' }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution="&copy; OpenStreetMap contributors"
//       />
//       {agences.map((agence) => (
//         <Marker key={`agence-${agence.id}`} position={[agence.latitude, agence.longitude]}>
//           <Popup>{agence.nom}</Popup>
//         </Marker>
//       ))}
//       {colis.map((c) => (
//         <Marker key={`colis-${c.id}`} position={[c.latitude, c.longitude]}>
//           <Popup>{`${c.code_suivi} - ${c.statut}`}</Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default Map;
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useMemo } from 'react';

// Config icône par défaut Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Icône personnalisée pour agences
const agenceIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -30],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

interface Agence {
  id: number;
  nom: string;
  latitude: number;
  longitude: number;
}

interface Colis {
  id: number;
  code_suivi: string;
  statut: string;
  latitude?: number;
  longitude?: number;
}

interface MapProps {
  agences: Agence[];
  colis: Colis[];
}

const Map = ({ agences, colis }: MapProps) => {
  const agencesValides = agences.filter(
    (a) => a.latitude && a.longitude && a.latitude !== 0 && a.longitude !== 0
  );

  // Seulement colis avec coords valides sur la carte
  const colisValides = colis.filter(
    (c) => c.latitude && c.longitude && c.latitude !== 0 && c.longitude !== 0
  );

  const center = useMemo(() => {
    if (agencesValides.length > 0) {
      return [agencesValides[0].latitude, agencesValides[0].longitude] as [number, number];
    }
    return [5.6037, 10.1591];
  }, [agencesValides]);

  return (
    <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false} dragging={false} zoomControl={false} doubleClickZoom={false} touchZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Marqueurs agences */}
      {agencesValides.map((agence) => (
        <Marker
          key={`agence-${agence.id}`}
          position={[agence.latitude, agence.longitude]}
          icon={agenceIcon}
        >
          <Popup>
            <strong>Agence :</strong> {agence.nom}
          </Popup>
        </Marker>
      ))}

      {/* Marqueurs colis valides */}
      {colisValides.map((c) => (
        <Marker
          key={`colis-${c.id}`}
          position={[c.latitude!, c.longitude!]}
        >
          <Popup>
            <strong>Colis :</strong> {c.code_suivi}<br />
            <strong>Statut :</strong> {c.statut}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
