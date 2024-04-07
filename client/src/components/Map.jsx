import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29ubmllbHkwNCIsImEiOiJjbG5namJ4NTYwdm82MmtxeDVlbjdlbmp4In0.NWMlrVKbeXYxskBZkpQI0Q";

export default function Map({ setLongitude, setLatitude, parkingData }) {
  let dragmarker;
  const mapContainerRef = useRef(null);

  console.log("parkingData:", parkingData);
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [-122.4147, 37.7856],
      zoom: 12.5,
    });
    map.on("load", () => {
      geolocate.trigger();
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    geolocate.on("geolocate", async (e) => {
      console.log("Geolocated:", e.coords.longitude, e.coords.latitude);
      const latitude = e.coords.latitude;
      const longitude = e.coords.longitude;

      if (dragmarker) {
        dragmarker.remove();
      }
      if (latitude && longitude) {
        dragmarker = new mapboxgl.Marker({ offset: [0, -50 / 2] })
          .setLngLat([parseFloat(e.coords.longitude), parseFloat(latitude)])
          .setDraggable(true)
          .addTo(map);
        setLongitude(e.coords.longitude);
        setLatitude(e.coords.latitude);

        dragmarker.on("dragend", function () {
          const lngLat = dragmarker.getLngLat();
          setLongitude(lngLat.lng);
          setLatitude(lngLat.lat);
          console.log(
            `New longitude: ${lngLat.lng}, New latitude: ${lngLat.lat}`
          );
        });
      }
    });

    map.addControl(geolocate);

    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainerRef} className="w-full h-full">
      <div ref={mapContainerRef} className="mapContainer" />
    </div>
  );
}
