import React, { useState } from "react";
import Prompt from "../components/Prompt";
import Map from "../components/Map";
import Logo from '../assets/map_pin.png'


export default function Web({
  messages,
  setMessages,
  longitude,
  setLongitude,
  latitude,
  setLatitude,
}) {
  const [parkingData, setParkingData] = useState([]);
  const handleDataAvailable = (data) => {
    console.log("web.jsx:", data);
    setParkingData([...parkingData, ...data]);
  };
  return (
    <>
      <div className="flex flex-col relative h-full w-full">
        <div className="flex justify-between p-3 border-b-2 border-white">
          <div className="flex">
            <img src={Logo} alt="" width={48} height={48} />
            <div className="my-auto tracking-widest text-xl">ALMS</div>
          </div>
        </div>
        <div className="absolute z-10 p-5 left-[5%] bottom-[10%] bg-slate-900 overflow-hidden rounded-2xl border-2 h-[50%] max-h-96 w-[30%] max-w-[35rem] min-w-[24rem]">
          <Prompt
            messages={messages}
            setMessages={setMessages}
            longitude={longitude}
            latitude={latitude}
            onDataAvailable={handleDataAvailable}
          />
        </div>
        <div className="flex-1">
          <Map
            setLongitude={setLongitude}
            setLatitude={setLatitude}
            parkingData={parkingData}
          />
        </div>
      </div>
    </>
  );
}
