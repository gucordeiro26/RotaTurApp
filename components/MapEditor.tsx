"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import L, { LatLng, Icon } from 'leaflet'
import { useEffect } from 'react'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import 'leaflet-routing-machine'

// --- Ícones Personalizados (sem alterações) ---
const createIcon = (color: string) => {
    return new Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
};
const startIcon = createIcon('green');
const endIcon = createIcon('red');
const interestIcon = createIcon('blue');
// --- Fim dos Ícones ---

export type Ponto = {
    lat: number;
    lng: number;
    nome?: string;
}

const SearchField = ({ onSearchResult }: { onSearchResult: (ponto: Ponto) => void }) => {
    const map = useMap();
    useEffect(() => {
        const provider = new OpenStreetMapProvider({
            params: {
                countrycodes: 'br', // Limita a busca ao Brasil
            },
        });
        const searchControl = new (GeoSearchControl as any)({
            provider, style: 'bar', showMarker: false, autoClose: true, keepResult: true,
        });
        const onLocationFound = (result: any) => {
            map.flyTo([result.location.y, result.location.x], 15);
            onSearchResult({ lat: result.location.y, lng: result.location.x, nome: result.location.label });
        };
        map.addControl(searchControl);
        map.on('geosearch/showlocation', onLocationFound);
        return () => {
            map.removeControl(searchControl);
            map.off('geosearch/showlocation', onLocationFound);
        };
    }, [map, onSearchResult]);
    return null;
};

const MapClickHandler = ({ onMapClick }: { onMapClick: (ponto: Ponto) => void }) => {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            const nomeDoLocal = data.display_name || `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            onMapClick({ lat, lng, nome: nomeDoLocal });
        },
    });
    return null;
}

// --- INÍCIO DA CORREÇÃO ---
const Routing = ({ pontoInicio, pontoFim, pontosInteresse }: Omit<MapEditorProps, 'onAddPonto'>) => {
    const map = useMap();

    useEffect(() => {
        // Guarda uma referência ao controlo de roteamento
        let routingControl: L.Routing.Control | null = null;

        if (pontoInicio) {
            const waypoints = [
                L.latLng(pontoInicio.lat, pontoInicio.lng),
                ...pontosInteresse.map(p => L.latLng(p.lat, p.lng)),
            ];
            if (pontoFim) {
                waypoints.push(L.latLng(pontoFim.lat, pontoFim.lng));
            }

            routingControl = L.Routing.control({
                waypoints,
                routeWhileDragging: false,
                addWaypoints: false,
                // Esconde o painel de instruções e os marcadores padrão da biblioteca
                show: false,
                createMarker: () => false,
                // Estiliza a linha da rota
                lineOptions: {
                    styles: [{ color: '#007BFF', opacity: 0.7, weight: 5 }]
                }
            } as any).addTo(map);
        }

        // Função de limpeza que remove o controlo do mapa
        return () => {
            if (routingControl) {
                map.removeControl(routingControl);
            }
        };
    }, [map, pontoInicio, pontoFim, pontosInteresse]);

    return null;
}
// --- FIM DA CORREÇÃO ---

type MapEditorProps = {
    pontoInicio: Ponto | null;
    pontoFim: Ponto | null;
    pontosInteresse: Ponto[];
    onAddPonto: (ponto: Ponto) => void;
}

const mapStyle = { height: '100%', width: '100%', borderRadius: '10px' };

const southWest = L.latLng(-33.75, -73.98);
const northEast = L.latLng(5.27, -32.41);
const bounds = L.latLngBounds(southWest, northEast);

const MapEditor = ({ pontoInicio, pontoFim, pontosInteresse, onAddPonto }: MapEditorProps) => {
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

            <SearchField onSearchResult={onAddPonto} />
            <MapClickHandler onMapClick={onAddPonto} />

            {/* Marcadores */}
            {pontoInicio && <Marker position={[pontoInicio.lat, pontoInicio.lng]} icon={startIcon}><Popup>{pontoInicio.nome || 'Ponto de Início'}</Popup></Marker>}
            {pontoFim && <Marker position={[pontoFim.lat, pontoFim.lng]} icon={endIcon}><Popup>{pontoFim.nome || 'Ponto Final'}</Popup></Marker>}
            {pontosInteresse.map((ponto, index) => (
                <Marker key={index} position={[ponto.lat, ponto.lng]} icon={interestIcon}>
                    <Popup>{ponto.nome || `Ponto de Interesse #${index + 1}`}</Popup>
                </Marker>
            ))}

            {/* Roteamento */}
            <Routing
                pontoInicio={pontoInicio}
                pontoFim={pontoFim}
                pontosInteresse={pontosInteresse}
            />
        </MapContainer>
    )
}

export default MapEditor