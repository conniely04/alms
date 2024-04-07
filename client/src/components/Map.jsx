import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29ubmllbHkwNCIsImEiOiJjbG5namJ4NTYwdm82MmtxeDVlbjdlbmp4In0.NWMlrVKbeXYxskBZkpQI0Q";

export default function Map({ setLongitude, setLatitude, parkingData }) {
  let dragmarker;
  const mapContainerRef = useRef(null);

  console.log("parkingData:", parkingData);

  async function updateMarkers(map, data) {
    const [longitude, latitude] = await data.midpoint
      .replace("(", "") // Remove the opening parenthesis
      .replace(")", "") // Remove the closing parenthesis
      .split(",") // Split the string into an array
      .map(parseFloat); // Convert the strings to numbers

    const marker = new mapboxgl.Marker({ offset: [0, -50 / 2] }).setLngLat([
      longitude,
      latitude,
    ]);
    console.log(marker);
    marker.addTo(map);

    // If no such marker exists, create a new one and add it to the map and the markers array
  }

  let map;

  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [-122.4147, 37.7856],
      zoom: 12.5,
    });

    map.on("load", function () {
      //remove geolocate trigger
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
  useEffect(() => {
    if (parkingData) {
      parkingData.forEach((data) => {
        updateMarkers(map, data);
      });
    }
  }, [parkingData]);

  // if (Array.isArray(parkingData) && parkingData.length) {
  //   parkingData.map((data, index) => {
  //     console.log(`midpoint ${index}:`, data.midpoint);
  //   });
  // }

  return (
    <div ref={mapContainerRef} className="w-full h-full">
      <div ref={mapContainerRef} className="mapContainer" />
    </div>
  );
}
