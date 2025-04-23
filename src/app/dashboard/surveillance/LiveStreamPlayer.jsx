import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const LiveStreamPlayer = ({ streamUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);

      return () => {
        hls.destroy(); // Clean up when component unmounts
      };
    } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
      // some browsers natively support HLS
      videoRef.current.src = streamUrl;
    }
  }, [streamUrl]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      style={{ width: '90%', height: '90%', borderRadius: '12px' }}
    />
  );
};

export default LiveStreamPlayer;