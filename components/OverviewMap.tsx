"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Button } from './ui/button'
import Link from 'next/link'

// Correção do ícone
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl.src,
    iconUrl: iconUrl.src,
    shadowUrl: shadowUrl.src,
});

// --- INÍCIO DA CORREÇÃO ---
// Adicionada a palavra-chave 'export' para tornar o tipo importável
export type RotaComCoordenadas = {
    id: number;
    nome: string;
    origem_coords: { lat: number; lng: number };
}
// --- FIM DA CORREÇÃO ---

type OverviewMapProps = {
    rotas: RotaComCoordenadas[];
}

const mapStyle = { height: '100%', width: '100%' };

const southWest = L.latLng(-33.75, -73.98);
const northEast = L.latLng(5.27, -32.41);
const bounds = L.latLngBounds(southWest, northEast);

const OverviewMap = ({ rotas }: OverviewMapProps) => {
    const initialPosition: L.LatLngExpression = [-14.235, -51.9253];

    return (
        <MapContainer 
            center={initialPosition} 
            zoom={4} 
            style={mapStyle}
            maxBounds={bounds}
            minZoom={4}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {rotas.map((rota) => (
                rota.origem_coords && (
                    <Marker 
                        key={rota.id} 
                        position={[rota.origem_coords.lat, rota.origem_coords.lng]}
                    >
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold">{rota.nome}</p>
                                <Link href={`/route-details/${rota.id}`}>
                                    <Button size="sm" className="mt-2">Ver Detalhes</Button>
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    )
}

export default OverviewMap