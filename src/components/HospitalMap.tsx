import React, { useEffect, useRef, useState } from "react";

// Type for hospital data
type HospitalData = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  // ... more
};

const HospitalMap = ({
  coords,
  hospitals,
}: {
  coords: { lat: number; lng: number } | null;
  hospitals: HospitalData[];
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const mapboxglRef = useRef<any>(null); // will hold dynamically imported mapboxgl
  const [token, setToken] = useState<string>(() => localStorage.getItem('mapbox_token') || '');
  const [mapboxReady, setMapboxReady] = useState(false);

  // Dynamically import mapbox-gl in client only
  useEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      import("mapbox-gl").then(mod => {
        mapboxglRef.current = mod.default;
        setMapboxReady(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!token || !mapboxReady || !mapContainer.current || !mapboxglRef.current) return;

    const mapboxgl = mapboxglRef.current;
    mapboxgl.accessToken = token;

    // Clean up previous map instance on re-init
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: coords ? [coords.lng, coords.lat] : [72.87, 19.07],
      zoom: 12,
    });

    hospitals.forEach((h) => {
      new mapboxgl.Marker()
        .setLngLat([h.lng, h.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`<b>${h.name}</b>`)
        )
        .addTo(map.current);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  // eslint-disable-next-line
  }, [token, coords, hospitals, mapboxReady]);

  if (!token) {
    return (
      <div className="p-6">
        <div className="mb-2 font-semibold text-center">Enter your Mapbox public token to enable map view:</div>
        <input
          type="text"
          placeholder="Mapbox public token"
          className="w-full border rounded px-3 py-2 mb-2"
          value={token}
          onChange={e => {
            setToken(e.target.value);
            localStorage.setItem('mapbox_token', e.target.value);
          }}
        />
        <div className="text-xs text-gray-400 text-center">Get your public token from <a className="underline text-blue-500" href="https://account.mapbox.com/" target="_blank" rel="noreferrer">mapbox.com</a></div>
      </div>
    );
  }

  // Wait for mapbox-gl to be loaded
  if (!mapboxReady) {
    return (
      <div className="w-full min-h-[300px] rounded-md shadow flex items-center justify-center text-gray-400 text-sm">
        Loading map...
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full min-h-[300px] rounded-md shadow" />;
};

export default HospitalMap;
