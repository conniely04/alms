import React, { useState } from "react";

export default function Prompt({
  messages,
  setMessages,
  longitude,
  latitude,
  onDataAvailable,
  bathroomavailable,
  wateravailable,
  narcanavailable,
  reloadavailable,
}) {
  const [inputText, setInputText] = useState("");

  function sendMessage() {
    if (inputText === "") {
      return;
    }

    const newMessages = [...messages, { role: "user", content: inputText }];
    setMessages(newMessages);
    setInputText("");

    fetch("http://localhost:8000/api/v1/chat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: newMessages,
        longitude: longitude, // TO BE CHANGed
        latitude: latitude, // TO BE CHANGED
        radius: 0.005, // TO BE CHANGED
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setMessages([
          ...newMessages,
          { role: "assistant", content: data.message },
        ]);
        if (Object.keys(data).length > 1) {
          // Call a function to change the reload prop in Map.jsx
          reloadavailable(true);
        }

        if ("parking" in data) {
          onDataAvailable(data.parking);
        } else if ("bathrooms" in data) {
          bathroomavailable(data.bathrooms);
        } else if ("fountains" in data) {
          wateravailable(data.fountains);
        } else {
          narcanavailable(data.narcan);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col overflow-y-scroll flex-1 gap-3 py-5 px-3 no-scrollbar">
        <div className="flex">
          <div className="flex flex-col flex-1 gap-2">
            <div className="text-slate-400 px-1">alms</div>
            <div className="bg-slate-800 px-3 py-2 rounded-lg max-w-[80%] w-fit break-words">
              Welcome to alms!
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col flex-1 gap-2">
            <div className="bg-slate-800 px-3 py-2 rounded-lg max-w-[80%] w-fit break-words">
              We provide services for parking, bathrooms, water fountains, and
              narcan. Please let me know how I can assist you.
            </div>
          </div>
        </div>
        {messages.slice(1).map((message) => {
          return message.role === "assistant" ? (
            <div className="flex">
              <div className="flex flex-col flex-1 gap-2">
                <div className="text-slate-400 px-1">alms</div>
                <div className="bg-slate-800 px-3 py-2 rounded-lg max-w-[80%] w-fit break-words">
                  {message.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-row-reverse">
              <div className="flex flex-col max-w-[80%] gap-2">
                <div className="text-slate-400 text-right px-1">you</div>
                <div className="bg-orange-600 px-3 py-2 rounded-lg w-fit break-words">
                  {message.content}
                </div>
              </div>
            </div>
          );
        })}{" "}
      </div>
      <div className="flex flex-row gap-5 border-t-2 pt-5">
        <input
          className="flex-1 h-12 rounded-lg p-3 bg-transparent border-2 border-white bg-slate-800"
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <div
          className="m-auto bg-orange-600 px-3 py-2 rounded-md"
          onClick={sendMessage}
        >
          Send
        </div>
      </div>
    </div>
  );
}
