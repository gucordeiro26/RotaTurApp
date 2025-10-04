"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import L, { Icon } from 'leaflet'
import { useEffect } from 'react'
import 'leaflet-routing-machine'
import { Button } from './ui/button'
import Link from 'next/link'

const createIcon = (color: string) => new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const startIcon = createIcon('green');
const endIcon = createIcon('red');
const interestIcon = createIcon('blue');

export type Ponto = { id?: number; lat: number; lng: number; nome?: string; }
export type RotaParaMapa = {
    origem_coords: Ponto | null;
    destino_coords: Ponto | null;
    pontos_interesse: Ponto[];
}

const Routing = ({ rota }: { rota: RotaParaMapa }) => {
    const map = useMap();
    useEffect(() => {
        if (!rota.origem_coords) return;
        const waypoints = [L.latLng(rota.origem_coords.lat, rota.origem_coords.lng)];
        rota.pontos_interesse.forEach(p => waypoints.push(L.latLng(p.lat, p.lng)));
        if (rota.destino_coords) {
            waypoints.push(L.latLng(rota.destino_coords.lat, rota.destino_coords.lng));
        }
        if (waypoints.length < 2) return;

        const routingControl = L.Routing.control({
            waypoints,
            show: false,
            addWaypoints: false,
            createMarker: () => false,
            lineOptions: { styles: [{ color: '#007BFF', opacity: 0.7, weight: 5 }] }
        } as any).addTo(map);

        routingControl.on('routesfound', (e) => {
            const routes = e.routes;
            if (routes.length > 0) map.fitBounds(routes[0].bounds, { padding: [50, 50] });
        });

        return () => { if (map && routingControl) map.removeControl(routingControl); };
    }, [map, rota]);
    return null;
}

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