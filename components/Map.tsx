"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// --- Correção para o ícone do marcador ---
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { Button } from './ui/button';
import Link from 'next/link';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl.src,
    iconUrl: iconUrl.src,
    shadowUrl: shadowUrl.src,
});
// --- Fim da correção ---

// Definimos o tipo de dado que o mapa espera receber para cada rota
type RotaComCoordenadas = {
    id: number;
    nome: string;
    origem_coords: { lat: number; lng: number };
}

type MapProps = {
    rotas: RotaComCoordenadas[]; // O mapa agora recebe uma lista de rotas
}

const mapStyle = {
    height: '100%',
    width: '100%'
};

const Map = ({ rotas }: MapProps) => {
    // Se não houver rotas, centralizamos no Brasil. Se houver, na primeira rota da lista.
    const initialPosition: L.LatLngExpression = rotas.length > 0 
        ? [rotas[0].origem_coords.lat, rotas[0].origem_coords.lng] 
        : [-14.235, -51.9253]; // Coordenadas do centro do Brasil

    const zoomLevel = rotas.length > 0 ? 13 : 4; // Zoom maior se tiver rotas

    return (
        <MapContainer center={initialPosition} zoom={zoomLevel} style={mapStyle}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Criamos um marcador para cada rota na lista */}
            {rotas.map((rota) => (
                // Verificamos se a rota tem coordenadas antes de criar o marcador
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

export default Map