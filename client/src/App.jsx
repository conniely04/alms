import Web from "./views/Web";
import Mobile from "./views/Mobile";
import { useEffect, useState } from "react";
import lodash from "lodash";

export default function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();

  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are a smart assistant AI. Your task is to take user input, determine what they need, and provide assistance. If they need help with parking, determine the time they need parking. If they are not talking about parking, determine what type of service you think would suit them best. DO NOT inquiry about location.",
      // You must determine the day of the week, the start hour (in 4 digit 24 hour time), and the end hour (in 4 digit 24 hour time) of their parking.
      // If you are unsure, make sure to ask clarifying questions. You are NOT to determine any information about the parking itself.
      // You are not done until you know all of the following: Day of the week, start hour, end hour. If you are clarifying, set your response property to clarify.
      // If you are done, set your response property to done. Do not repeat yourself. Respond in JSON.```
    },
  ]);

  const debouncedHandleResize = lodash.throttle((size) => {
    setWindowWidth(size);
  }, 250);

  useEffect(() => {
    window.addEventListener("resize", () => {
      debouncedHandleResize(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        debouncedHandleResize(window.innerWidth);
      });
    };
  }, []);

  return (
    <>
      {windowWidth > 768 ? (
        <Web
          messages={messages}
          setMessages={setMessages}
          longitude={longitude}
          setLongitude={setLongitude}
          latitude={latitude}
          setLatitude={setLatitude}
        />
      ) : (
        <Mobile
          messages={messages}
          setMessages={setMessages}
          longitude={longitude}
          setLongitude={setLongitude}
          latitude={latitude}
          setLatitude={setLatitude}
        />
      )}
    </>
  );
}
