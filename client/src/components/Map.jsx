import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29ubmllbHkwNCIsImEiOiJjbG5namJ4NTYwdm82MmtxeDVlbjdlbmp4In0.NWMlrVKbeXYxskBZkpQI0Q";

function Map() {
  const [userLocation, setUserLocation] = useState({
    longitude: null,
    latitude: null,
  });
  let marker;
  const [isLoading, setIsLoading] = useState(false);

  const mapContainerRef = useRef(null);

  //findparking().then((data) => console.log(data));

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [-122.4147, 37.7856],
      zoom: 12.5,
    });

    map.on("load", () => {
      console.log("Map loaded");
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    geolocate.on("geolocate", async (e) => {
      const longitude = e.coords.longitude;
      const latitude = e.coords.latitude;
      setUserLocation({ longitude, latitude });

      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/parking?parking_day=M&start_time=300&end_time=600&x_coord=${longitude}&y_coord=${latitude}&radius=0.1`
        );
        console.log("data:", response.data);
        response.data.forEach((item, index) => {
          if (marker) {
            marker.remove();
          }
          console.log(`Parking Spot ${index} mid Coord:`, item.midpoint);
          const [longitude, latitude] = item.midpoint
            .replace(/[()]/g, "")
            .split(",");

          marker = new mapboxgl.Marker({ offset: [0, -50 / 2] })
            .setLngLat([parseFloat(longitude), parseFloat(latitude)])
            .setDraggable(false)
            .addTo(map);
        });
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    });

    map.addControl(geolocate);

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "700px", height: "700px" }}>
      <h1>alms</h1>
      {isLoading ? (
        <div className="loading">Loading...</div> // Replace this with your actual loading symbol
      ) : (
        <div ref={mapContainerRef} className="mapContainer" />
      )}
    </div>
  );
}

export default Map;
