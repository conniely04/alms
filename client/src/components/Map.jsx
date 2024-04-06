import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29ubmllbHkwNCIsImEiOiJjbG5namJ4NTYwdm82MmtxeDVlbjdlbmp4In0.NWMlrVKbeXYxskBZkpQI0Q";

function Map() {
  const [userLocation, setUserLocation] = useState({
    longitude: null,
    latitude: null,
  });
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [-122.4147, 37.7856],
      zoom: 12.5,
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    geolocate.on("geolocate", (e) => {
      const longitude = e.coords.longitude;
      const latitude = e.coords.latitude;
      setUserLocation({ longitude, latitude });
    });

    map.addControl(geolocate);

    // Clean up on unmount
    return () => map.remove();
  }, []);

  const findparking = async () => {
    const { longitude, latitude } = userLocation;
    console.log("findparking parameters:", longitude, latitude);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/parking?parking_day=M&start_time=300&end_time=600&x_coord=${longitude}&y_coord=${latitude}&radius=0.1`
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching parking data:", error);
    }
  };

  findparking().then((data) => console.log(data));

  return (
    <div ref={mapContainerRef} style={{ width: "700px", height: "700px" }}>
      <h1>alms</h1>
    </div>
  );
}

export default Map;
