"use client"

import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import L from 'leaflet'
import { useEffect } from 'react'

// --- Configuração dos Ícones ---
const createIcon = (color: string) => {
    if (typeof window === 'undefined') return null;
    
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

if (typeof window !== 'undefined') {
    require('leaflet-routing-machine');
}

export type Ponto = {
    lat: number;
    lng: number;
    nome?: string;
}

export type OverviewMapProps = {
    pontoInicio: Ponto | null;
    pontoFim: Ponto | null;
    pontosInteresse: Ponto[];
}

const Routing = ({ pontoInicio, pontoFim, pontosInteresse }: OverviewMapProps) => {
    const map = useMap();

    useEffect(() => {
        if (!map || typeof window === 'undefined' || !pontoInicio) return;

        const waypoints = [
            L.latLng(pontoInicio.lat, pontoInicio.lng),
            ...pontosInteresse.map(p => L.latLng(p.lat, p.lng))
        ];

        if (pontoFim) {
            waypoints.push(L.latLng(pontoFim.lat, pontoFim.lng));
        }

        const routingControl = L.Routing.control({
            waypoints,
            routeWhileDragging: false,
            draggableWaypoints: false,
            addWaypoints: false,
            show: false,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{ color: '#2563eb', opacity: 0.8, weight: 6 }],
                extendToWaypoints: true,
                missingRouteTolerance: 0
            },
            // --- INÍCIO DA CORREÇÃO ---
            // Adicionámos os tipos explícitos: i (number), wp (any), nWps (number)
            createMarker: function(i: number, wp: any, nWps: number) {
            // --- FIM DA CORREÇÃO ---
                let iconColor = 'blue';
                let title = 'Ponto de Interesse';

                if (i === 0) {
                    iconColor = 'green';
                    title = 'Início';
                } else if (i === nWps - 1 && pontoFim) { 
                    iconColor = 'red';
                    title = 'Fim';
                }

                const icon = createIcon(iconColor);
                
                if (!icon) return null;

                // O return aqui precisa ser compatível com o que o Leaflet espera,
                // usamos 'any' para evitar conflitos de tipos internos da biblioteca
                return L.marker(wp.latLng, {
                    icon: icon,
                    draggable: false
                }).bindPopup(title) as any;
            }
        } as any).addTo(map);

        return () => {
            try {
                map.removeControl(routingControl);
            } catch (e) {
                console.warn("Erro ao limpar rota", e);
            }
        };
    }, [map, pontoInicio, pontoFim, pontosInteresse]);

    return null;
};

export default function OverviewMap({ pontoInicio, pontoFim, pontosInteresse }: OverviewMapProps) {
    const defaultCenter = { lat: -23.3557, lng: -47.8569 };
    const center = pontoInicio || defaultCenter;

    return (
        <MapContainer
            center={[center.lat, center.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {pontoInicio && (
                <Routing 
                    pontoInicio={pontoInicio} 
                    pontoFim={pontoFim} 
                    pontosInteresse={pontosInteresse} 
                />
            )}
        </MapContainer>
    )
}