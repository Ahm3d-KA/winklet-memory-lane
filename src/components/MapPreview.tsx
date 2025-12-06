import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Loader2 } from 'lucide-react';

interface MapPreviewProps {
  radius: number;
  onLocationChange?: (lat: number, lng: number) => void;
}

const MapPreview: React.FC<MapPreviewProps> = ({ radius, onLocationChange }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);
  
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get user's GPS location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        onLocationChange?.(latitude, longitude);
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Unable to get location');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [onLocationChange]);

  // Initialize map when location is available
  useEffect(() => {
    if (!mapContainer.current || !location || mapRef.current) return;

    mapRef.current = L.map(mapContainer.current, {
      center: [location.lat, location.lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    });

    // Stealth Mode dark map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      opacity: 0.4,
    }).addTo(mapRef.current);

    circleRef.current = L.circle([location.lat, location.lng], {
      radius: radius,
      color: 'hsl(270, 80%, 60%)',
      fillColor: 'hsl(270, 80%, 60%)',
      fillOpacity: 0.15,
      weight: 2,
    }).addTo(mapRef.current);

    markerRef.current = L.circleMarker([location.lat, location.lng], {
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
  }, [location, radius]);

  // Update circle radius when it changes
  useEffect(() => {
    if (circleRef.current && mapRef.current && location) {
      circleRef.current.setRadius(radius);
      const zoom = radius <= 100 ? 17 : radius <= 200 ? 16 : radius <= 300 ? 15.5 : radius <= 400 ? 15 : 14.5;
      mapRef.current.setView([location.lat, location.lng], zoom);
    }
  }, [radius, location]);

  if (isLoading) {
    return (
      <div className="relative h-40 rounded-2xl overflow-hidden border border-border bg-muted flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Getting your location...</span>
        </div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="relative h-40 rounded-2xl overflow-hidden border border-border bg-muted flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Navigation className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <span className="text-sm">{locationError}</span>
        </div>
      </div>
    );
  }

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
