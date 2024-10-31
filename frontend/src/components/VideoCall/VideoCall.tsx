import React, { useState } from "react";
import { Typography, Button } from "@mui/material";
import "./VideoCall.scss";

interface VideoCallProps {
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ onClose }) => {
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  return (
    <div
      className="video-call-expanded"
      onMouseEnter={() => setIsVideoHovered(true)}
      onMouseLeave={() => setIsVideoHovered(false)}
    >
      <div className="video-call-header">
        <Typography variant="h6">Video Call</Typography>
        <Button onClick={onClose} className="video-call-close-button">
          Close
        </Button>
      </div>
      <div className="video-call-container">
        <div className="video-placeholder">
          <Typography variant="h6" className="placeholder-text">
            Video Call Placeholder
          </Typography>
          {isVideoHovered && (
            <Button variant="contained" className="hangup-button">
              Hang Up
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
