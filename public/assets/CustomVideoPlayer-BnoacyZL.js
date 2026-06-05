import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, ai as LoaderCircle, M as logo, bV as Download, bW as Pause, bX as Play, bY as Volume2, a as apiService } from "./index--V45kKqF.js";
import { M as Maximize } from "./maximize-C9EpyTC8.js";
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["polygon", { points: "13 19 22 12 13 5 13 19", key: "587y9g" }],
  ["polygon", { points: "2 19 11 12 2 5 2 19", key: "3pweh0" }]
];
const FastForward = createLucideIcon("FastForward", __iconNode$3);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M8 3v3a2 2 0 0 1-2 2H3", key: "hohbtr" }],
  ["path", { d: "M21 8h-3a2 2 0 0 1-2-2V3", key: "5jw1f3" }],
  ["path", { d: "M3 16h3a2 2 0 0 1 2 2v3", key: "198tvr" }],
  ["path", { d: "M16 21v-3a2 2 0 0 1 2-2h3", key: "ph8mxp" }]
];
const Minimize = createLucideIcon("Minimize", __iconNode$2);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["polygon", { points: "11 19 2 12 11 5 11 19", key: "14yba5" }],
  ["polygon", { points: "22 19 13 12 22 5 22 19", key: "1pi1cj" }]
];
const Rewind = createLucideIcon("Rewind", __iconNode$1);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
];
const VolumeX = createLucideIcon("VolumeX", __iconNode);
const CustomVideoPlayer = ({ src, compact = false }) => {
  const videoRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const [isPlaying, setIsPlaying] = reactExports.useState(true);
  const [currentTime, setCurrentTime] = reactExports.useState(0);
  const [duration, setDuration] = reactExports.useState(0);
  const [isMuted, setIsMuted] = reactExports.useState(false);
  const [isFullscreen, setIsFullscreen] = reactExports.useState(false);
  const [showControls, setShowControls] = reactExports.useState(true);
  const [skipAnim, setSkipAnim] = reactExports.useState(null);
  const [aspectRatio, setAspectRatio] = reactExports.useState("aspect-video");
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const fadeTimeoutRef = reactExports.useRef(null);
  const lastTapTimeRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((e) => {
        console.log("Auto-play prevented", e);
        setIsPlaying(false);
      });
    }
  }, [src]);
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  const handleVideoClick = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapTimeRef.current < DOUBLE_TAP_DELAY) {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
      const rect = videoRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width / 2) {
        skipBackward(e);
        setSkipAnim("left");
      } else {
        skipForward(e);
        setSkipAnim("right");
      }
      setTimeout(() => setSkipAnim(null), 500);
      lastTapTimeRef.current = 0;
    } else {
      togglePlay();
      lastTapTimeRef.current = now;
    }
  };
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      if (w && h) {
        if (h > w) {
          setAspectRatio("aspect-[9/16]");
        } else if (h === w) {
          setAspectRatio("aspect-square");
        } else {
          setAspectRatio("aspect-video");
        }
      }
    }
  };
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  const skipForward = (e) => {
    var _a;
    (_a = e == null ? void 0 : e.stopPropagation) == null ? void 0 : _a.call(e);
    if (videoRef.current) {
      const newTime = Math.min(videoRef.current.currentTime + 2, duration);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  const skipBackward = (e) => {
    var _a;
    (_a = e == null ? void 0 : e.stopPropagation) == null ? void 0 : _a.call(e);
    if (videoRef.current) {
      const newTime = Math.max(videoRef.current.currentTime - 2, 0);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  const handleInteraction = () => {
    setShowControls(true);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 1500);
  };
  const handleMouseLeave = () => {
    setShowControls(false);
  };
  reactExports.useEffect(() => {
    if (isPlaying) {
      handleInteraction();
    } else {
      setShowControls(true);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    }
  }, [isPlaying]);
  reactExports.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);
  const [isDownloading, setIsDownloading] = reactExports.useState(false);
  const handleDownload = async (e) => {
    e.stopPropagation();
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const blob = await apiService.downloadVideo(src);
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = "aisa-generated-video.mp4";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed via proxy, falling back to direct link", error);
      const a = document.createElement("a");
      a.href = src;
      a.download = "aisa-generated-video.mp4";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsDownloading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      className: `relative overflow-hidden bg-black/95 rounded-2xl border border-white/5 shadow-2xl group flex flex-col justify-center ${isFullscreen ? "w-full h-full rounded-none border-none" : compact ? `w-full max-w-[500px] max-h-[400px] ${aspectRatio}` : `${aspectRatio} ${aspectRatio.includes("video") ? "w-full max-h-[70vh]" : "w-auto mx-auto max-h-[550px] px-2"}`}`,
      onMouseMove: handleInteraction,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleInteraction,
      onClick: handleInteraction,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            ref: videoRef,
            src,
            className: "w-full h-full object-contain cursor-pointer",
            onTimeUpdate: handleTimeUpdate,
            onLoadedMetadata: handleLoadedMetadata,
            onClick: handleVideoClick,
            onPlay: () => setIsPlaying(true),
            onPause: () => setIsPlaying(false),
            onEnded: () => setIsPlaying(false),
            onWaiting: () => setIsLoading(true),
            onCanPlay: () => setIsLoading(false),
            onLoadedData: () => setIsLoading(false),
            controlsList: "nodownload",
            playsInline: true
          }
        ),
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#2A2B32]/80 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-12 h-12 sm:w-16 sm:h-16 text-primary animate-spin shadow-2xl drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]" }) }),
        skipAnim === "left" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-[25%] top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/40 backdrop-blur-md rounded-full p-2 sm:p-5 mb-0.5 sm:mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Rewind, { className: "w-5 h-5 sm:w-10 sm:h-10 text-white fill-current" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold text-xs sm:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]", children: "-2s" })
        ] }),
        skipAnim === "right" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-[25%] top-1/2 -translate-y-1/2 translate-x-1/2 z-20 pointer-events-none flex flex-col items-center animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/40 backdrop-blur-md rounded-full p-2 sm:p-5 mb-0.5 sm:mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FastForward, { className: "w-5 h-5 sm:w-10 sm:h-10 text-white fill-current" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold text-xs sm:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]", children: "+2s" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: logo,
            alt: "AISA Watermark",
            className: `absolute transition-all duration-300 pointer-events-none z-[15] opacity-60 select-none drop-shadow-2xl ${compact ? `right-2 w-6 ${showControls || !isPlaying ? "bottom-12" : "bottom-2"}` : `right-4 sm:right-6 md:right-8 w-8 sm:w-10 md:w-12 ${showControls || !isPlaying ? "bottom-16 sm:bottom-20 md:bottom-24" : "bottom-2 sm:bottom-4 md:bottom-6"}`}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `absolute transition-all duration-300 transform ${compact ? "bottom-2 left-2 right-2" : "bottom-3 sm:bottom-4 md:bottom-5 left-3 right-3 sm:left-4 sm:right-4 md:left-6 md:right-6"} ${showControls || !isPlaying ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-[#2A2B32]/90 backdrop-blur-xl border border-white/10 ${compact ? "rounded-lg px-2 py-2 flex items-center gap-2" : "rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-4 md:gap-5"} shadow-[0_8px_32px_rgba(0,0,0,0.5)]`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: handleDownload,
                  disabled: isDownloading,
                  className: `flex items-center bg-primary hover:bg-primary/90 transition-all rounded text-white font-bold tracking-wide shrink-0 ${compact ? "gap-1 px-1.5 py-1 text-[9px]" : "gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px]"} ${isDownloading ? "opacity-70 scale-95 cursor-wait animate-pulse" : "active:scale-95"}`,
                  title: isDownloading ? "Downloading..." : "Download Video",
                  children: [
                    isDownloading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `border-2 border-white/30 border-t-white rounded-full animate-spin ${compact ? "w-3 h-3" : "w-3 h-3 sm:w-3.5 sm:h-3.5"}` }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: compact ? "w-3 h-3" : "w-3 h-3 sm:w-3.5 sm:h-3.5" }),
                    !compact && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isDownloading ? "DOWNLOADING..." : "DOWNLOAD" })
                  ]
                }
              ),
              !compact && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: skipBackward,
                  className: "text-white hover:text-[#8C52FF] transition-colors shrink-0 hidden sm:flex items-center gap-0.5",
                  title: "Skip backward 2s",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Rewind, { className: "w-3 h-3 sm:w-4 sm:h-4 fill-current" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] sm:text-[10px] font-bold font-mono", children: "-2s" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: togglePlay,
                  className: `text-white hover:text-[#8C52FF] transition-colors shrink-0 ${compact ? "block" : "hidden sm:block"}`,
                  children: isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: compact ? "w-4 h-4 fill-current" : "w-4 h-4 sm:w-5 sm:h-5 fill-current" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: compact ? "w-4 h-4 fill-current" : "w-4 h-4 sm:w-5 sm:h-5 fill-current" })
                }
              ),
              !compact && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: skipForward,
                  className: "text-white hover:text-[#8C52FF] transition-colors shrink-0 hidden sm:flex items-center gap-0.5",
                  title: "Skip forward 2s",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FastForward, { className: "w-3 h-3 sm:w-4 sm:h-4 fill-current" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] sm:text-[10px] font-bold font-mono", children: "+2s" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center group/progress relative h-6 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: "0",
                    max: duration || 100,
                    value: currentTime,
                    onChange: handleSeek,
                    className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1 bg-white/20 rounded-full relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute top-0 left-0 bottom-0 bg-white group-hover/progress:bg-[#8C52FF] transition-colors rounded-full",
                    style: { width: `${(duration > 0 ? currentTime / duration : 0) * 100}%` }
                  }
                ) })
              ] }),
              !compact && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white/80 text-[10px] sm:text-sm font-medium tracking-wide shrink-0 tabular-nums", children: [
                formatTime(currentTime),
                " / ",
                formatTime(duration)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: toggleMute,
                  className: `text-white/80 hover:text-white transition-colors shrink-0 ${compact ? "block" : "hidden sm:block"}`,
                  children: isMuted ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: compact ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-5 sm:h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: compact ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-5 sm:h-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: toggleFullscreen,
                  className: "text-white/80 hover:text-white transition-colors shrink-0",
                  children: isFullscreen ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize, { className: compact ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-5 sm:h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize, { className: compact ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-5 sm:h-5" })
                }
              )
            ] })
          }
        )
      ]
    }
  );
};
export {
  CustomVideoPlayer as default
};
