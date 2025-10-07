"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Search } from 'lucide-react'
import { useState } from 'react'
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

export type RotaComCoordenadas = {
    id: number;
    nome: string;
    origem_coords: { lat: number; lng: number };
}

type OverviewMapProps = {
    rotas: RotaComCoordenadas[];
}

// Coordenadas de Tatuí
const TATUI_CENTER: L.LatLngExpression = [-23.3487, -47.8579];

// Definindo bounds para o Brasil
const southWest = L.latLng(-33.75, -73.98);
const northEast = L.latLng(5.27, -32.41);
const bounds = L.latLngBounds(southWest, northEast);

const SearchControl = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const map = useMap();

    const handleSearch = async () => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                map.setView([parseFloat(lat), parseFloat(lon)], 13);
            } else {
                alert('Cidade não encontrada');
            }
        } catch (error) {
            console.error('Erro na pesquisa:', error);
            alert('Erro ao pesquisar cidade');
        }
    };

    return (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-2">
            <div className="relative flex gap-2">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Pesquisar cidade..."
                        className="pl-8 pr-4 py-2 w-64"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                </div>
                <Button onClick={handleSearch} variant="default">
                    Buscar
                </Button>
            </div>
        </div>
    );
};

const MapComponent = ({ center, rotas }: { center: L.LatLngExpression, rotas: RotaComCoordenadas[] }) => {
    return (
        <MapContainer
            key={Array.isArray(center) ? `${center[0]}-${center[1]}` : `${center.lat}-${center.lng}`}
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            maxBounds={bounds}
            minZoom={4}
            maxZoom={18}
            boundsOptions={{ padding: [50, 50] }}
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Mantemos a prop rotas mas não renderizamos os marcadores */}
        </MapContainer>
    );
};

const OverviewMap = ({ rotas }: OverviewMapProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [center, setCenter] = useState<L.LatLngExpression>(TATUI_CENTER);

    const handleSearch = async () => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setCenter([parseFloat(lat), parseFloat(lon)]);
            } else {
                alert('Cidade não encontrada');
            }
        } catch (error) {
            console.error('Erro na pesquisa:', error);
            alert('Erro ao pesquisar cidade');
        }
    };

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="w-full p-4 bg-white rounded-lg shadow-sm border flex-shrink-0">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Pesquisar cidade..."
                            className="pl-8 w-full"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                    </div>
                    <Button onClick={handleSearch} variant="default">
                        Buscar
                    </Button>
                </div>
            </div>
            
            <div className="flex-1 w-full border rounded-lg overflow-hidden min-h-0">
                <MapComponent rotas={rotas} center={center} />
            </div>
        </div>
    );
};

export default OverviewMap