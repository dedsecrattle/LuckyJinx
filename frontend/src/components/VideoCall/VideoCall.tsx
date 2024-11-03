import React, { useEffect, useRef, useState, useContext } from "react";
import { Typography, Button } from "@mui/material";
import "./VideoCall.scss";
import Peer from "peerjs";
import { Socket } from "socket.io-client";
import { UserContext } from "../../contexts/UserContext";

interface VideoCallProps {
  onClose: () => void;
  communicationSocketRef: React.MutableRefObject<Socket | null>;
  roomNumber: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ onClose, communicationSocketRef, roomNumber }) => {
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{ [peerId: string]: MediaStream }>({});
  const [peerId, setPeerId] = useState<string>("");
  const peerRef = useRef<Peer | null>(null);
  const { user } = useContext(UserContext);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<{ [peerId: string]: HTMLVideoElement }>({});

  useEffect(() => {
    // Initialize PeerJS
    const peer = new Peer('', {
      host: process.env.REACT_APP_PEERJS_SERVER_HOST || "/",
      port: parseInt(process.env.REACT_APP_PEERJS_SERVER_PORT || "9000"),
      path: "/peerjs",
      secure: process.env.REACT_APP_PEERJS_SECURE === "true",
    });
    peerRef.current = peer;

    let currentStream: MediaStream;

    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        currentStream = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        peer.on("call", (call) => {
          call.answer(stream); 

          call.on("stream", (remoteStream) => {
            setRemoteStreams((prev) => ({ ...prev, [call.peer]: remoteStream }));
          });

          call.on("close", () => {
            setRemoteStreams((prev) => {
              const newStreams = { ...prev };
              delete newStreams[call.peer];
              return newStreams;
            });
          });

          call.on("error", (err) => {
            console.error("Peer call error:", err);
          });
        });

        peer.on("open", (id) => {
          setPeerId(id);
          communicationSocketRef.current?.emit("peer-id", id, roomNumber);
        });

        peer.on("error", (err) => {
          console.error("Peer error:", err);
        });
      })
      .catch((err) => {
        console.error("Failed to get local stream:", err);
      });

    communicationSocketRef.current?.on("peer-id", (otherPeerId: string) => {
      if (otherPeerId === peerId) return; 
      if (!localStream) return;

      const call = peer.call(otherPeerId, localStream);

      call.on("stream", (remoteStream) => {
        setRemoteStreams((prev) => ({ ...prev, [call.peer]: remoteStream }));
      });

      call.on("close", () => {
        setRemoteStreams((prev) => {
          const newStreams = { ...prev };
          delete newStreams[call.peer];
          return newStreams;
        });
      });

      call.on("error", (err) => {
        console.error("Peer call error:", err);
      });
    });

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      if (peer) {
        peer.destroy();
      }
      communicationSocketRef.current?.off("peer-id");
    };
  }, [communicationSocketRef, peerId, roomNumber]);

  const handleHangUp = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    setRemoteStreams({});
    onClose();
  };

  return (
    <div
      className="video-call-expanded"
      onMouseEnter={() => setIsVideoHovered(true)}
      onMouseLeave={() => setIsVideoHovered(false)}
    >
      <div className="video-call-header">Hang Up
        <Typography variant="h6">Video Call</Typography>
        <Button className="video-call-close-button" onClick={handleHangUp}>
          Hang Up
        </Button>
      </div>
      <div className="video-call-container">
        <div className="video-streams">
          {localStream && (
            <video
              className="local-video"
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
            />
          )}
          {Object.entries(remoteStreams).map(([peerId, stream]) => (
            <video
              key={peerId}
              className="remote-video"
              ref={(el) => {
                if (el && !remoteVideoRefs.current[peerId]) {
                  remoteVideoRefs.current[peerId] = el;
                  el.srcObject = stream;
                }
              }}
              autoPlay
              playsInline
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
