import React, { useContext, useState } from "react";
import { Button, Typography } from "@mui/material";
import Peer, { MediaConnection } from "peerjs";
import "./VideoCall.scss";
import { UserContext } from "../../contexts/UserContext";

interface VideoCallProps {
  onClose: () => void;
  peerInstanceRef: React.MutableRefObject<Peer | undefined>;
  mediaConnectionRef: React.MutableRefObject<MediaConnection | undefined>;
  myVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  myStreamRef: React.MutableRefObject<MediaStream | null>;
}

const VideoCall: React.FC<VideoCallProps> = ({
  onClose,
  mediaConnectionRef,
  myVideoRef,
  remoteVideoRef,
  myStreamRef,
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [otherUser, setOtherUser] = useState<string | null>("Waiting for connection...");

  const { user } = useContext(UserContext);

  const toggleVideo = () => {
    if (myStreamRef.current) {
      myStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (myStreamRef.current) {
      myStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const handleEndCall = () => {
    mediaConnectionRef.current?.close();
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
            <video ref={myVideoRef} muted autoPlay playsInline className="video-stream" />
            <Typography variant="subtitle2" className="video-label">
              {user?.username} (You)
            </Typography>
          </div>
          <div className="video-box">
            <video ref={remoteVideoRef} autoPlay playsInline className="video-stream" />
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
