import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29ubmllbHkwNCIsImEiOiJjbG5namJ4NTYwdm82MmtxeDVlbjdlbmp4In0.NWMlrVKbeXYxskBZkpQI0Q";

function Map() {
  // const [userLocation, setUserLocation] = useState({
  //   longitude: null,
  //   latitude: null,
  // });
  // const [userlatitude, setLatitude] = useState(null);
  // const [userlongitude, setLongitude] = useState(null);

  let dragmarker;

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
      console.log("Geolocated:", longitude, latitude);
      // setLongitude(e.coords.longitude);
      // setLatitude(e.coords.latitude);
      if (dragmarker) {
        dragmarker.remove();
      }
      if (latitude && longitude) {
        dragmarker = new mapboxgl.Marker({ offset: [0, -50 / 2] })
          .setLngLat([parseFloat(longitude), parseFloat(latitude)])
          .setDraggable(true)
          .addTo(map);

        dragmarker.on("dragend", function () {
          const lngLat = dragmarker.getLngLat();
          console.log(
            `New longitude: ${lngLat.lng}, New latitude: ${lngLat.lat}`
          );
        });
      }

      //delete
      //setUserLocation({ longitude, latitude });

      // try {
      //   const response = await axios.get(
      //     `http://localhost:8000/api/v1/parking?parking_day=M&start_time=300&end_time=600&x_coord=${longitude}&y_coord=${latitude}&radius=0.1`
      //   );
      //   console.log("data:", response.data);
      //   response.data.forEach((item, index) => {
      //     console.log(`Parking Spot ${index} mid Coord:`, item.midpoint);
      //     const [longitude, latitude] = item.midpoint
      //       .replace(/[()]/g, "")
      //       .split(",");
      //   });
      // } catch (error) {
      //   console.error("Error fetching parking data:", error);
      // }
    });

    map.addControl(geolocate);

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainerRef} className="w-full h-full">
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
