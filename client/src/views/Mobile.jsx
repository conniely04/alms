import Prompt from "../components/Prompt";
import Map from "../components/Map";
import { useState } from "react";
import { IoMdMap, IoIosChatboxes } from "react-icons/io";
import Logo from '../assets/map_pin.png'

export default function Web({
  messages,
  setMessages,
  longitude,
  setLongitude,
  latitude,
  setLatitude,
}) {
  const [view, setView] = useState("chat");

  function toggleView() {
    setView(view === "chat" ? "map" : "chat");
  }
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
      <div className="relative flex flex-col h-full w-full p-[5%]">
        <div className="flex justify-between pb-5 border-b-2 border-white">
          <div className="flex">
            <img src={Logo} alt="" width={32} height={32} />
            <div className="my-auto tracking-widest text-xl">ALMS</div>
          </div>
          <div
            className="top-0 right-0 p-2 bg-slate-800 rounded-md"
            onClick={toggleView}
          >
            {view === "chat" ? (
              <IoMdMap size={20} />
            ) : (
              <IoIosChatboxes size={20} />
            )}
          </div>
        </div>{" "}
        {/* TODO: CHANGE FONT */}
        {view === "chat" ? (
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
        ) : (
          <Map
            setLongitude={setLongitude}
            setLatitude={setLatitude}
            parkingData={parkingData}
            bathroomData={bathroomData}
            waterData={waterData}
            narcanData={narcanData}
            reload={reload}
          />
        )}
      </div>
    </>
  );
}
