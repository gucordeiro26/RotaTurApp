"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import L, { Icon, LatLngExpression } from 'leaflet'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

// --- Ícones Personalizados (sem alterações) ---
const createIcon = (color: string) => new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const startIcon = createIcon('green');
const endIcon = createIcon('red');
const interestIcon = createIcon('blue');
// --- Fim dos Ícones ---

export type Ponto = { id?: number; lat: number; lng: number; nome?: string; }
export type RotaParaMapa = {
    origem_coords: Ponto | null;
    destino_coords: Ponto | null;
    pontos_interesse: Ponto[];
}

// --- INÍCIO DA CORREÇÃO ---
const Routing = ({ rota }: { rota: RotaParaMapa }) => {
    const map = useMap();
    const [routePolyline, setRoutePolyline] = useState<LatLngExpression[] | null>(null);

    useEffect(() => {
        if (!rota.origem_coords) return;

        const waypoints = [
            rota.origem_coords,
            ...rota.pontos_interesse,
        ];
        if (rota.destino_coords) {
            waypoints.push(rota.destino_coords);
        }

        if (waypoints.length < 2) return;

        // Formata as coordenadas para a API do OSRM
        const coordsString = waypoints.map(p => `${p.lng},${p.lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

        // Faz a chamada direta à API de roteamento
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0].geometry.coordinates;
                    // O OSRM devolve [lng, lat], mas o Leaflet quer [lat, lng], então invertemos
                    const latlngs = route.map((coord: number[]) => [coord[1], coord[0]]);
                    setRoutePolyline(latlngs);
                    // Ajusta o zoom para a nova rota
                    map.fitBounds(latlngs);
                }
            })
            .catch(err => console.error("Erro ao buscar a rota:", err));

    }, [map, rota]);

    // Renderiza o componente Polyline com as coordenadas da rota
    return routePolyline ? <Polyline pathOptions={{ color: '#007BFF', weight: 5, opacity: 0.7 }} positions={routePolyline} /> : null;
}
// --- FIM DA CORREÇÃO ---


type MapProps = { rota: RotaParaMapa; }
const mapStyle = { height: '100%', width: '100%' };

const Map = ({ rota }: MapProps) => {
    if (!rota.origem_coords) {
        return <div className="flex items-center justify-center h-full bg-gray-100"><p>Mapa indisponível.</p></div>;
    }
    return (
        <MapContainer 
            center={[rota.origem_coords.lat, rota.origem_coords.lng]} 
            zoom={13} 
            style={mapStyle}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {rota.origem_coords && <Marker position={[rota.origem_coords.lat, rota.origem_coords.lng]} icon={startIcon}><Popup>{rota.origem_coords.nome || 'Ponto de Início'}</Popup></Marker>}
            {rota.destino_coords && <Marker position={[rota.destino_coords.lat, rota.destino_coords.lng]} icon={endIcon}><Popup>{rota.destino_coords.nome || 'Ponto Final'}</Popup></Marker>}
            
            {rota.pontos_interesse.map((ponto) => (
                <Marker key={ponto.id || `${ponto.lat}-${ponto.lng}`} position={[ponto.lat, ponto.lng]} icon={interestIcon}>
                    <Popup>{ponto.nome || `Ponto de Interesse`}</Popup>
                </Marker>
            ))}
            
            <Routing rota={rota} />
        </MapContainer>
    )
}
export default Map