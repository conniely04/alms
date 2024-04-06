import React, { useState } from "react";
import "./Prompt.css";
const Prompt = ({ chatGPTWrapper }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    // Add user message to the chat
    const newMessages = [...messages, { text: inputText, sender: "user" }];
    setMessages(newMessages);
    setInputText("");

    // Call your ChatGPT wrapper to get a response
    const response = await chatGPTWrapper.sendMessage(inputText);
    if (response) {
      // Add ChatGPT response to the chat
      setMessages([...newMessages, { text: response, sender: "bot" }]);
    }
  };

  return (
    <div>
      <div id="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        className="prompt-input"
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Prompt;
