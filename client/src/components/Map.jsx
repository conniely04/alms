import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29ubmllbHkwNCIsImEiOiJjbG5namJ4NTYwdm82MmtxeDVlbjdlbmp4In0.NWMlrVKbeXYxskBZkpQI0Q";

export default function Map({
  setLongitude,
  setLatitude,
  parkingData,
  bathroomData,
  waterData,
  narcanData,
  reload,
}) {
  let dragmarker;
  const mapContainerRef = useRef(null);

  console.log("parkingData:", parkingData);
  console.log("bathroomData:", bathroomData);
  console.log("waterData:", waterData);
  console.log("reload:", reload);

  function convertMilitaryToStandard(time) {
    // Extract hours and minutes from the time str
    const hours = parseInt(time.slice(0, 2), 10);
    const minutes = time.slice(2);

    // Convert hours from 24-hour format to 12-hour format
    const convertedHours = hours % 12 || 12;

    // Determine the suffix
    const suffix = hours < 12 ? "AM" : "PM";

    // Return the converted time
    return `${convertedHours}:${minutes} ${suffix}`;
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
  }, [reload]);
  useEffect(() => {
    if (Array.isArray(parkingData) && parkingData.length) {
      parkingData.forEach((data) => {
        // Split the midpoint string into longitude and latitude

        const [longitude, latitude] = data.midpoint
          .replace("(", "") // Remove the opening parenthesis
          .replace(")", "") // Remove the closing parenthesis
          .split(",") // Split the string into an array
          .map(parseFloat);

        const marker = new mapboxgl.Marker({ color: "#F44F00" })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<p style="color: black;"> Street: ${data.street_name
              }<br>Begin Park: ${convertMilitaryToStandard(
                data.start_time_hr
              )}<br>End Park: ${convertMilitaryToStandard(
                data.end_time_hr
              )} <br>Park Day: ${data.park_day}<br>Sweep Day: ${data.sweep_day
              }</p>`
            )
          )
          .addTo(map);

        marker
          .getElement()
          .addEventListener("click", () => marker.togglePopup());
      });
    }
  }, [parkingData]);

  useEffect(() => {
    if (Array.isArray(bathroomData) && bathroomData.length) {
      bathroomData.forEach((data) => {
        // Split the midpoint string into longitude and latitude

        const [longitude, latitude] = data.location
          .replace("(", "") // Remove the opening parenthesis
          .replace(")", "") // Remove the closing parenthesis
          .split(",") // Split the string into an
          .map(parseFloat);

        const marker = new mapboxgl.Marker({ color: "#F44F00" })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<p style="color: black;"> Public Bathroom: ${data.name}<br>Address: ${data.address}</p>`
            )
          )
          .addTo(map);

        marker
          .getElement()
          .addEventListener("click", () => marker.togglePopup());
      });
    }
  });

  useEffect(() => {
    if (Array.isArray(waterData) && waterData.length) {
      waterData.forEach((data) => {
        // Split the midpoint string into longitude and latitude

        const [longitude, latitude] = data.location
          .replace("(", "") // Remove the opening parenthesis
          .replace(")", "") // Remove the closing parenthesis
          .split(",") // Split the string in
          .map(parseFloat);

        const marker = new mapboxgl.Marker({ color: "#F44F00" })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<p style="color: black;"> Public Water Fountains: ${data.name}<br>Address: ${data.address}</p>`
            )
          )
          .addTo(map);

        marker
          .getElement()
          .addEventListener("click", () => marker.togglePopup());
      });
    }
  });
  useEffect(() => {
    if (Array.isArray(narcanData) && narcanData.length) {
      narcanData.forEach((data) => {
        // Split the midpoint string into longitude and latitude

        const [longitude, latitude] = data.location
          .replace("(", "") // Remove the opening parenthesis
          .replace(")", "") // Remove the closing parenthesis
          .split(",") // Split the stri
          .map(parseFloat);

        const marker = new mapboxgl.Marker({ color: "#F44F00" })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<p style="color: black;"> Narcan Supply: ${data.name}<br>Phone Number: ${data.number}<br>Website: ${data.website}</p>`
            )
          )
          .addTo(map);

        marker
          .getElement()
          .addEventListener("click", () => marker.togglePopup());
      });
    }
  });
  useEffect(() => {
    if (parkingData || bathroomData || waterData || narcanData) {
      console.log("reloading map");
    }
  }, [parkingData, bathroomData, waterData, narcanData]);

  // if (Array.isArray(bathroomData) && bathroomData.length) {
  //   bathroomData.map((data, index) => {
  //     console.log(`name ${index}:`, data.name);
  //     console.log(`street_name ${index}:`, data.address);
  //     // console.log(`start_time ${index}:`, data.start_time_hr);
  //     // console.log(`end_time ${index}:`, data.end_time_hr);
  //   });
  // }

  return (
    <div ref={mapContainerRef} className="w-full h-full">
      <div ref={mapContainerRef} reload={reload} className="mapContainer" />
    </div>
  );
}
