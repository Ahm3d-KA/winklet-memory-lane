import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';

interface MapPreviewProps {
  radius: number;
  lat?: number;
  lng?: number;
}

const MapPreview: React.FC<MapPreviewProps> = ({ 
  radius, 
  lat = 51.5074, 
  lng = -0.1278 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainer.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    });

    // Add OpenStreetMap tiles with a nice style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Add radius circle
    circleRef.current = L.circle([lat, lng], {
      radius: radius,
      color: 'hsl(270, 80%, 60%)',
      fillColor: 'hsl(270, 80%, 60%)',
      fillOpacity: 0.15,
      weight: 2,
    }).addTo(mapRef.current);

    // Add center marker
    markerRef.current = L.circleMarker([lat, lng], {
      radius: 8,
      color: 'hsl(270, 80%, 60%)',
      fillColor: 'hsl(270, 80%, 50%)',
      fillOpacity: 1,
      weight: 2,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng]);

  // Update circle radius when it changes
  useEffect(() => {
    if (circleRef.current && mapRef.current) {
      circleRef.current.setRadius(radius);
      
      // Adjust zoom based on radius
      const zoom = radius <= 100 ? 17 : radius <= 200 ? 16 : radius <= 300 ? 15.5 : radius <= 400 ? 15 : 14.5;
      mapRef.current.setView([lat, lng], zoom);
    }
  }, [radius, lat, lng]);

  return (
    <div className="relative h-40 rounded-2xl overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-2 left-2 glass rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 z-[1000]">
        <Navigation className="w-3 h-3 text-primary" />
        <span>Your location</span>
      </div>
    </div>
  );
};

export default MapPreview;
