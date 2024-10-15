import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Peer, { MediaConnection } from "peerjs";
import "./Communication.scss";

interface Message {
  text: string;
  sender: string;
}

interface PeerVideoConnection {
  peerId: string;
  call: MediaConnection;
  stream: MediaStream;
}

const VideoChat: React.FC = () => {
  const [myId, setMyId] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [peerConnections, setPeerConnections] = useState<PeerVideoConnection[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const myStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    peerRef.current = new Peer({
      host: "localhost",
      port: 9000,
      path: "/peerjs",
    });

    peerRef.current.on("open", (id: string) => {
      setMyId(id);
    });

    const setupMyVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
        myStreamRef.current = stream;
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    setupMyVideo();

    socketRef.current.on("user-connected", (userId: string) => {
      console.log("User connected:", userId);
      setUsers((prevUsers) => [...prevUsers, userId]);
      if (myStreamRef.current) {
        connectToNewUser(userId, myStreamRef.current);
      }
    });

    socketRef.current.on("user-disconnected", (userId: string) => {
      console.log("User disconnected:", userId);
      setUsers((prevUsers) => prevUsers.filter((id) => id !== userId));
      setPeerConnections((prevConnections) => prevConnections.filter((connection) => connection.peerId !== userId));
    });

    socketRef.current.on("receive-message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    peerRef.current.on("call", (call: MediaConnection) => {
      call.answer(myStreamRef.current!);
      call.on("stream", (userVideoStream: MediaStream) => {
        setPeerConnections((prevConnections) => [
          ...prevConnections,
          { peerId: call.peer, call, stream: userVideoStream },
        ]);
      });
    });

    return () => {
      socketRef.current?.disconnect();
      peerRef.current?.destroy();
      myStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const connectToNewUser = (userId: string, stream: MediaStream) => {
    const call = peerRef.current!.call(userId, stream);
    call.on("stream", (userVideoStream: MediaStream) => {
      setPeerConnections((prevConnections) => [...prevConnections, { peerId: userId, call, stream: userVideoStream }]);
    });
  };

  const joinRoom = (): void => {
    if (roomId && myId) {
      socketRef.current?.emit("join-room", myId, roomId);
    }
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (message && roomId) {
      const newMessage: Message = { text: message, sender: myId };
      socketRef.current?.emit("send-message", newMessage, roomId);
      setMessage("");
    }
  };

  return (
    <div className="video-chat">
      <h1>Video Chat App</h1>
      <div className="room-join">
        <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Enter Room ID" />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <div className="user-info">
        <h2>Your ID: {myId}</h2>
        <h3>Users in room:</h3>
        <ul>
          {users.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
      <div className="video-grid">
        <div className="video-container">
          <h3>Your Video</h3>
          <video ref={myVideoRef} autoPlay muted></video>
        </div>
        {peerConnections.map((connection) => (
          <div key={connection.peerId} className="video-container">
            <h3>Peer: {connection.peerId}</h3>
            <video
              autoPlay
              ref={(ref) => {
                if (ref) ref.srcObject = connection.stream;
              }}
            ></video>
          </div>
        ))}
      </div>
      <div className="chat">
        <h3>Chat</h3>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.sender === myId ? "You" : msg.sender}:</strong> {msg.text}
            </p>
          ))}
        </div>
        <form onSubmit={sendMessage}>
          <input type="text" value={message} placeholder="Type a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default VideoChat;
