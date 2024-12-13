import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

const Chat = () => {
  const [text, setText] = useState(""); // Input message
  const [messages, setMessages] = useState([]); // Chat history
  const server = useRef();
  const [user, setUsername] = useState("");

  useEffect(() => {
    server.current = new WebSocket("ws://192.168.29.88:8080");
    const username = ""; /*prompt("Enter username: ");*/
    setUsername(username);

    server.current.onopen = () => {
      server.current.send(username); // Send username to server
    };

    server.current.onmessage = (event) => {
      const message = JSON.parse(event.data); // Parse incoming message
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => server.current.close();
  }, []);

  const addImage = () => {
    console.log("we are in add image");
  };
  const sendMessage = () => {
    const message = {
      sender: user,
      text,
    };

    server.current.send(message.text); // Send only the message text
    // setMessages((prevMessages) => [...prevMessages, message]);
    setText(""); // Clear input field
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-app">
      <h1 className="title">Chat App</h1>

      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index}>
            <div
              className={`message-container ${
                msg.sender === user ? "message right" : "message left"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input type="file" className="add-image" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          autoFocus
          className="message-tag"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
