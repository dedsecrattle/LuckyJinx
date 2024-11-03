import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Typography } from "@mui/material";
import { Socket } from "socket.io-client";
import Peer, { MediaConnection } from "peerjs";
import "./VideoCall.scss";
import { UserContext } from "../../contexts/UserContext";

const COMMUNICATION_WEBSOCKET_URL = process.env.REACT_APP_COMMUNICATION_SERVICE_URL as string;

interface VideoCallProps {
  onClose: () => void;
  roomId: string | undefined;
  communicationSocketRef: React.MutableRefObject<Socket | null>;
}

const VideoCall: React.FC<VideoCallProps> = ({ onClose, roomId, communicationSocketRef }) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [otherUser, setOtherUser] = useState<string | null>("Waiting for connection...");

  const { user } = useContext(UserContext);

  const myVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const myStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<MediaConnection>();
  const peerInstance = useRef<Peer>();

  useEffect(() => {
    const initializeCall = async () => {
      try {
        // Get user's media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        myStream.current = stream;

        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }

        const peer = new Peer(user?.username as string, {
          host: "localhost",
          port: Number(process.env.REACT_APP_VIDEO_SERVICE_PORT),
          path: "/peerjs",
        });

        peer.on("open", (id) => {
          console.log("Connected with peer ID:", id);
          communicationSocketRef.current?.emit("join-room", user?.username, roomId);
        });

        peer.on("call", (call) => {
          call.answer(myStream.current!);
          peerConnection.current = call;

          call.on("stream", (remoteStream) => {
            if (remoteVideo.current) {
              remoteVideo.current.srcObject = remoteStream;
              setIsConnected(true);
            }
          });

          call.on("close", () => {
            setIsConnected(false);
          });
        });

        peerInstance.current = peer;

        communicationSocketRef.current?.on("user-connected", (newUserId: string) => {
          connectToNewUser(newUserId, stream);
          setOtherUser(newUserId);
        });

        communicationSocketRef.current?.on("user-disconnected", () => {
          if (peerConnection.current) {
            peerConnection.current.close();
            setIsConnected(false);
          }
        });
      } catch (err) {
        console.error("Failed to initialize call:", err);
      }
    };

    initializeCall();

    return () => {
      myStream.current?.getTracks().forEach((track) => track.stop());
      peerConnection.current?.close();
      peerInstance.current?.destroy();
      communicationSocketRef.current?.off("user-connected");
      communicationSocketRef.current?.off("user-disconnected");
    };
  }, []);

  const connectToNewUser = (userId: string, stream: MediaStream) => {
    const call = peerInstance.current!.call(userId, stream);
    peerConnection.current = call;

    call.on("stream", (remoteStream) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream;
        setIsConnected(true);
      }
    });

    call.on("close", () => {
      setIsConnected(false);
    });
  };

  const toggleVideo = () => {
    if (myStream.current) {
      myStream.current.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (myStream.current) {
      myStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const handleEndCall = () => {
    peerConnection.current?.close();
    onClose();
  };

  return (
    <div className="video-call-expanded">
      <div className="video-call-header">
        <Typography variant="h6">Video Call</Typography>
        <Button onClick={handleEndCall} className="video-call-close-button">
          End Call
        </Button>
      </div>

      <div className="video-call-container">
        <div className="video-grid">
          <div className="video-box">
            <video ref={myVideo} muted autoPlay playsInline className="video-stream" />
            <Typography variant="subtitle2" className="video-label">
              {user?.username} (You)
            </Typography>
          </div>
          <div className="video-box">
            <video ref={remoteVideo} autoPlay playsInline className="video-stream" />
            <Typography variant="subtitle2" className="video-label">
              {otherUser}
            </Typography>
          </div>
        </div>

        <div className="video-controls">
          <Button variant="contained" color={isAudioEnabled ? "primary" : "error"} onClick={toggleAudio}>
            {isAudioEnabled ? "Mute" : "Unmute"}
          </Button>
          <Button variant="contained" color={isVideoEnabled ? "primary" : "error"} onClick={toggleVideo}>
            {isVideoEnabled ? "Stop Video" : "Start Video"}
          </Button>
          <Button variant="contained" color="error" onClick={handleEndCall}>
            End Call
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
