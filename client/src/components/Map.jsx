import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29ubmllbHkwNCIsImEiOiJjbG5namJ4NTYwdm82MmtxeDVlbjdlbmp4In0.NWMlrVKbeXYxskBZkpQI0Q";

function Map() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [-122.4147, 37.7856],
      zoom: 12.5,
    });

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    );
    // Clean up on unmount
    return () => map.remove();
  }, []); // Empty dependency array means this effect runs once on mount and clean up on unmount

  return (
    <div ref={mapContainerRef} style={{ width: "700px", height: "700px" }}>
      <h1>alms</h1>
    </div>
  );
}

export default Map;
