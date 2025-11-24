"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'

// Função auxiliar para criar ícones de forma segura
const createIcon = (color: string) => {
    if (typeof window === 'undefined') return undefined; // Retorna undefined se não estiver no browser

    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

export type Ponto = {
    lat: number;
    lng: number;
    nome?: string;
}

const SearchField = ({ onSearchResult }: { onSearchResult: (ponto: Ponto) => void }) => {
    const map = useMap();
    useEffect(() => {
        const provider = new OpenStreetMapProvider({ params: { countrycodes: 'br' } });
        const searchControl = new (GeoSearchControl as any)({ provider, style: 'bar', showMarker: false, autoClose: true, keepResult: true });
        const onLocationFound = (result: any) => {
            map.flyTo([result.location.y, result.location.x], 15);
            onSearchResult({ lat: result.location.y, lng: result.location.x, nome: result.location.label });
        };
        map.addControl(searchControl);
        map.on('geosearch/showlocation', onLocationFound);
        return () => { map.removeControl(searchControl); map.off('geosearch/showlocation', onLocationFound); };
    }, [map, onSearchResult]);
    return null;
};

const MapClickHandler = ({ onMapClick }: { onMapClick: (ponto: Ponto) => void }) => {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            // Usamos uma API pública simples para obter o nome do local (Reverse Geocoding)
            // Se falhar, usa as coordenadas como nome
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                const data = await response.json();
                const nomeDoLocal = data.display_name || `Ponto (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
                onMapClick({ lat, lng, nome: nomeDoLocal });
            } catch (error) {
                onMapClick({ lat, lng, nome: `Ponto (${lat.toFixed(3)}, ${lng.toFixed(3)})` });
            }
        },
    });
    return null;
}

export type MapEditorProps = {
    initialCenter: { lat: number; lng: number; };
    pontoInicio: Ponto | null;
    pontoFim: Ponto | null;
    pontosInteresse: Ponto[];
    onAddPonto: (ponto: Ponto) => void;
}

const mapStyle = { height: '100%', width: '100%', borderRadius: '10px' };

// Coordenadas aproximadas para limitar o mapa ao Brasil/América do Sul
const southWest = L.latLng(-33.75, -73.98);
const northEast = L.latLng(5.27, -32.41);
const bounds = L.latLngBounds(southWest, northEast);

const MapEditor = ({ initialCenter, pontoInicio, pontoFim, pontosInteresse, onAddPonto }: MapEditorProps) => {

    // --- CORREÇÃO: Criamos os ícones AQUI DENTRO, usando useMemo para performance ---
    // Isso garante que eles sejam criados apenas no cliente, evitando o erro de "imagem não encontrada".
    const startIcon = useMemo(() => createIcon('green'), []);
    const endIcon = useMemo(() => createIcon('red'), []);
    const interestIcon = useMemo(() => createIcon('blue'), []);

    return (
        <MapContainer
            center={[initialCenter.lat, initialCenter.lng]}
            zoom={13}
            style={mapStyle}
            maxBounds={bounds}
            minZoom={4}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <SearchField onSearchResult={onAddPonto} />
            <MapClickHandler onMapClick={onAddPonto} />

            {/* Renderização dos Marcadores com verificação de ícone */}
            {pontoInicio && startIcon && (
                <Marker position={[pontoInicio.lat, pontoInicio.lng]} icon={startIcon}>
                    <Popup>{pontoInicio.nome || 'Ponto de Início'}</Popup>
                </Marker>
            )}

            {pontoFim && endIcon && (
                <Marker position={[pontoFim.lat, pontoFim.lng]} icon={endIcon}>
                    <Popup>{pontoFim.nome || 'Ponto Final'}</Popup>
                </Marker>
            )}

            {pontosInteresse.map((ponto, index) => (
                interestIcon && (
                    <Marker key={index} position={[ponto.lat, ponto.lng]} icon={interestIcon}>
                        <Popup>{ponto.nome || `Ponto de Interesse #${index + 1}`}</Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    )
}

export default MapEditor