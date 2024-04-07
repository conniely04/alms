import React, { useState } from "react";
import Prompt from "../components/Prompt";
import Map from "../components/Map";

export default function Web({
  messages,
  setMessages,
  longitude,
  setLongitude,
  latitude,
  setLatitude,
  onDataAvailable,
  bathroomavailable,
}) {
  const [parkingData, setParkingData] = useState([]);
  const [bathroomData, setBathroomData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [narcanData, setNarcanData] = useState([]);
  const [reload, setReload] = useState(false);

  const handleDataAvailable = (data) => {
    // console.log("web.jsx:", data);
    setParkingData([...parkingData, ...data]);
  };
  const handlebathroomabAvailable = (data) => {
    //console.log("web.jsx:", data);
    setBathroomData([...bathroomData, ...data]);
  };
  const handlefountainAvailable = (data) => {
    // console.log("web.jsx:", data);
    setWaterData([...waterData, ...data]);
  };
  const handlenarcanAvailable = (data) => {
    // console.log("web.jsx:", data);
    setNarcanData([...narcanData, ...data]);
  };

  const handlereloadavailable = () => {
    // console.log("reload??");
    setReload(true);
  };

  return (
    <>
      <div className="flex flex-col relative h-full w-full">
        <div className="flex justify-between p-5 border-b-2 border-white">
          <div className="my-auto">alms</div>
        </div>
        <div className="absolute z-10 p-5 left-[5%] bottom-[10%] bg-slate-900 overflow-hidden rounded-2xl border-2 h-[50%] max-h-96 w-[30%] max-w-[35rem] min-w-[24rem]">
          <Prompt
            messages={messages}
            setMessages={setMessages}
            longitude={longitude}
            latitude={latitude}
            onDataAvailable={handleDataAvailable}
            bathroomavailable={handlebathroomabAvailable}
            wateravailable={handlefountainAvailable}
            narcanavailable={handlenarcanAvailable}
            reloadavailable={handlereloadavailable}
          />
        </div>
        <div className="flex-1">
          <Map
            setLongitude={setLongitude}
            setLatitude={setLatitude}
            parkingData={parkingData}
            bathroomData={bathroomData}
            waterData={waterData}
            narcanData={narcanData}
            reload={reload}
          />
        </div>
      </div>
    </>
  );
}
