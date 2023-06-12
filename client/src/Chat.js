import React, { useEffect, useState } from "react";

function Chat({ socket, userName, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: userName,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send-message", messageData);
      setMessageList((oldMessageList) => [...oldMessageList, messageData]);
    }
  };

  // When the 'receive-message' event is emitted from the chat server, re-render the page to display the new message
  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessageList((oldMessageList) => [...oldMessageList, message]); // Add the new message to the array of existing messages
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        {messageList.map((messageObj) => {
          return (
            <div
              className="message"
              id={userName === messageObj.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{messageObj.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageObj.time}</p>
                  <p id="author">{messageObj.author}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Message..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyDown={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
