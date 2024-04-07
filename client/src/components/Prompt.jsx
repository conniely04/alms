import React, { useState } from "react";

export default function Prompt() {

    const [messages, setMessages] = useState([
        { text: "test", sender: "bot" },
        { text: "test", sender: "user" },
        { text: "test", sender: "user" },
        { text: "testtesttesttesttesttesttesttest", sender: "bot" },
        { text: "testtestt esttesttesttesttes ttesttesttesttesttesttesttesttesttest", sender: "user" },
        { text: "testtesttesttesttesttesttesttesttesttest", sender: "bot" }
    ])
    const [inputText, setInputText] = useState("");

    function sendMessage() {
        setMessages([...messages, { text: inputText, sender: "user" }]);
        setInputText("");
    }

    return (
        <>
            <div className="flex flex-col flex-1 overflow-y-scroll gap-3 py-5 px-3">{
                messages.map((message) => {
                    return (
                        message.sender === "bot"
                            ?
                            <div className="flex">
                                <div className="flex flex-col flex-1 gap-2">
                                    <div className="text-slate-400 px-1">alms</div>
                                    <div className="bg-slate-800 px-3 py-2 rounded-lg max-w-[80%] w-fit break-words">{message.text}</div>
                                </div>
                            </div>
                            :
                            <div className="flex flex-row-reverse">
                                <div className="flex flex-col max-w-[80%] gap-2">
                                    <div className="text-slate-400 text-right px-1">you</div>
                                    <div className="bg-orange-600 px-3 py-2 rounded-lg w-fit break-words">{message.text}</div>
                                </div>
                            </div>
                    )
                })
            } </div>
            <div className="flex flex-row gap-5 border-t-2 pt-5">
                <input
                    className="flex-1 h-12 rounded-lg p-3 bg-transparent border-2 border-white bg-slate-800"
                    type="text"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={(e) => { setInputText(e.target.value) }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />
                <div className="m-auto bg-orange-600 px-3 py-2 rounded-md" onClick={sendMessage}>Send</div>
            </div>
        </>
    );
};

