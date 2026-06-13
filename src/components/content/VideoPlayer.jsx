import { useRef, useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
} from "@mui/icons-material";

const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL;

const formatTime = (time) => {
  if (!time) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const VideoPlayer = ({ video }) => {
  const videoRef = useRef(null);
  const hideTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  if (!video?.file_url) return null;

  const videoUrl = `${FILE_BASE_URL}${video.file_url}`;

  // ▶️ Play / Pause
  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.play();
      setPlaying(true);
    } else {
      vid.pause();
      setPlaying(false);
    }
  };

  // ⏱ Update progress + time
  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid?.duration) return;

    setProgress((vid.currentTime / vid.duration) * 100);
    setCurrentTime(vid.currentTime);
  };

  // ⏳ Load metadata (duration)
  const handleLoadedMetadata = () => {
    const vid = videoRef.current;
    setDuration(vid.duration || 0);
  };

  // ⏩ Seek
  const handleSeek = (_, value) => {
    const vid = videoRef.current;
    vid.currentTime = (value / 100) * vid.duration;
    setProgress(value);
  };

  // 🔊 Volume
  const handleVolume = (_, value) => {
    const vid = videoRef.current;
    vid.volume = value;
    setVolume(value);
    setMuted(value === 0);
  };

  // 🔇 Mute
  const toggleMute = () => {
    const vid = videoRef.current;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  };

  // ⛶ Fullscreen
  const handleFullscreen = () => {
    const vid = videoRef.current;
    if (vid.requestFullscreen) vid.requestFullscreen();
  };

  // 👁 Show controls on activity
  const handleMouseMove = () => {
    setShowControls(true);

    if (hideTimer.current) clearTimeout(hideTimer.current);

    hideTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 2000); // hide after 2s
  };

  // cleanup timer
  useEffect(() => {
    return () => clearTimeout(hideTimer.current);
  }, []);

  return (
    <Box display="flex" justifyContent="center">
      <Box
        onMouseMove={handleMouseMove}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "black",
          position: "relative",
          boxShadow: 4,
        }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={videoUrl}
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          style={{
            width: "100%",
            display: "block",
            cursor: "pointer",
          }}
        />

        {/* Center Play Button */}
        {!playing && (
          <IconButton
            onClick={togglePlay}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
            }}
          >
            <PlayArrow fontSize="large" />
          </IconButton>
        )}

        {/* Controls */}
        <Box
          sx={{
            position: "absolute",
            bottom: 6,
            left: 6,
            right: 6,
            px: 1,
            py: 0.5,
            borderRadius: 2,
            opacity: showControls ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          {/* Progress */}
          <Slider
            size="small"
            value={progress}
            onChange={handleSeek}
            sx={{
              color: "#fff",
              height: 3,
              p: 0,
              "& .MuiSlider-thumb": { width: 8, height: 8 },
            }}
          />

          {/* Controls Row */}
          <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mt: 0.5 }}>

            {/* Play */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "50%",
                bgcolor: "rgba(0,0,0,0.4)",
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.7)",
                },
              }}
            >
              <IconButton size="small" onClick={togglePlay} sx={{ color: "white" }}>
                {playing ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
              </IconButton>
            </Box>

            {/* Volume (Hover Expand) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 5,
                bgcolor: "rgba(0,0,0,0.4)",
                px: 0.5,
                transition: "0.3s",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.7)",
                },
                "&:hover .volume-slider": {
                  width: 70,
                  opacity: 1,
                  ml: 1,
                  mr:1
                },
              }}
            >
              <IconButton size="small" onClick={toggleMute} sx={{ color: "white" }}>
                {muted ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
              </IconButton>

              {/* Hidden slider */}
              <Slider
                className="volume-slider"
                size="small"
                value={muted ? 0 : volume}
                onChange={handleVolume}
                min={0}
                max={1}
                step={0.01}
                sx={{
                  width: 0,
                  opacity: 0,
                  transition: "all 0.3s",
                  color: "white",
                }}
              />
            </Box>

            {/* Time */}
            <Box
              sx={{
                bgcolor: "rgba(0,0,0,0.4)",
                borderRadius: 2,
                px: 1,
                py: 0.3,
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.7)",
                },
              }}
            >
              <Typography variant="caption" sx={{ color: "#eee", fontSize: 11 }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
            </Box>

            <Box flexGrow={1} />

            {/* Fullscreen */}
            <Box
              sx={{
                borderRadius: "50%",
                bgcolor: "rgba(0,0,0,0.4)",
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.7)",
                },
              }}
            >
              <IconButton onClick={handleFullscreen} sx={{ color: "white" }} size="small">
                <Fullscreen fontSize="small" />
              </IconButton>
            </Box>

          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoPlayer;