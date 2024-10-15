import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
const peer = new Peer({
  host: "/",
  port: 5000,
  path: "/peerjs",
});

const Communication: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);

  // Video stream
  useEffect(() => {
    const getMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      peer.on("call", (call) => {
        call.answer(stream); // Answer the call with the user's stream
        call.on("stream", (userStream) => {
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = userStream;
          }
        });
      });

      socket.on("user-connected", (userId: string) => {
        const call = peer.call(userId, stream);
        call.on("stream", (userStream) => {
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = userStream;
          }
        });
      });
    };
    getMedia();
  }, []);

  // Handle messaging
  useEffect(() => {
    socket.on("receive-message", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const joinRoom = () => {
    peer.on("open", (userId) => {
      socket.emit("join-room", userId, roomId);
    });
  };

  const sendMessage = () => {
    socket.emit("send-message", inputMessage, roomId);
    setInputMessage("");
  };

  return (
    <div>
      <h1>Video Call + Messaging</h1>

      <div>
        <label>Room ID: </label>
        <input value={roomId} onChange={(e) => setRoomId(e.target.value)} />
        <button onClick={joinRoom}>Join Room</button>
      </div>

      <div>
        <video ref={myVideoRef} autoPlay playsInline />
        <video ref={userVideoRef} autoPlay playsInline />
      </div>

      <div>
        <h2>Chat</h2>
        <div>
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </div>
  );
};

export default Communication;
