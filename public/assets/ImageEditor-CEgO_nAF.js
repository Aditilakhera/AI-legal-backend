import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, X, _ as Check, Y as Pen, a2 as SlidersVertical } from "./index-HfKBlv-o.js";
import { R as RotateCw } from "./rotate-cw-BTXAxNHy.js";
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M6 2v14a2 2 0 0 0 2 2h14", key: "ron5a4" }],
  ["path", { d: "M18 22V8a2 2 0 0 0-2-2H2", key: "7s9ehn" }]
];
const Crop = createLucideIcon("Crop", __iconNode$1);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 7v6h6", key: "1v2h90" }],
  ["path", { d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13", key: "1r6uu6" }]
];
const Undo = createLucideIcon("Undo", __iconNode);
const FILTERS = [
  { name: "Normal", filter: "none" },
  { name: "B&W", filter: "grayscale(100%)" },
  { name: "Sepia", filter: "sepia(100%)" },
  { name: "Warm", filter: "sepia(50%) contrast(110%) brightness(110%)" },
  { name: "Cool", filter: "hue-rotate(180deg) opacity(90%)" },
  { name: "Vintage", filter: "sepia(40%) contrast(120%) brightness(90%)" },
  { name: "Cyber", filter: "contrast(150%) hue-rotate(190deg) saturate(200%)" }
];
const BRUSH_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#ffffff", "#000000"];
const ImageEditor = ({ file, onClose, onSave }) => {
  const [image, setImage] = reactExports.useState(null);
  const [activeTool, setActiveTool] = reactExports.useState("draw");
  const [rotation, setRotation] = reactExports.useState(0);
  const [filter, setFilter] = reactExports.useState(FILTERS[0]);
  const [scale, setScale] = reactExports.useState(1);
  const [brushColor, setBrushColor] = reactExports.useState("#ef4444");
  const [brushSize, setBrushSize] = reactExports.useState(4);
  const [isDrawing, setIsDrawing] = reactExports.useState(false);
  const [paths, setPaths] = reactExports.useState([]);
  const [historyStep, setHistoryStep] = reactExports.useState(0);
  const canvasRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage(img);
        if (containerRef.current) ;
      };
    }
  }, [file]);
  reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    const rad = rotation * Math.PI / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const newWidth = image.width * cos + image.height * sin;
    const newHeight = image.width * sin + image.height * cos;
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.save();
    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(rad);
    if (filter.filter !== "none") ctx.filter = filter.filter;
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
    ctx.save();
    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(rad);
    ctx.translate(-image.width / 2, -image.height / 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    paths.forEach((path, i) => {
      if (path.type === "start") {
        ctx.beginPath();
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.size;
        ctx.moveTo(path.x, path.y);
      } else if (path.type === "move") {
        ctx.lineTo(path.x, path.y);
        ctx.stroke();
      } else if (path.type === "end") {
        ctx.closePath();
      }
    });
    ctx.restore();
  }, [image, rotation, filter, paths]);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    const rad = rotation * Math.PI / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const newWidth = image.width * cos + image.height * sin;
    const newHeight = image.width * sin + image.height * cos;
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.save();
    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(rad);
    if (filter.filter !== "none") ctx.filter = filter.filter;
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.translate(-image.width / 2, -image.height / 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 0; i < paths.length; i++) {
      const p = paths[i];
      if (p.type === "start") {
        ctx.beginPath();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.moveTo(p.x, p.y);
      } else if (p.type === "move") {
        ctx.lineTo(p.x, p.y);
        if (i === paths.length - 1 || paths[i + 1].type === "start") {
          ctx.stroke();
        }
      }
    }
    if (paths.length > 0 && paths[paths.length - 1].type === "move") ctx.stroke();
    ctx.restore();
  }, [image, rotation, filter, paths]);
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const rad = rotation * Math.PI / 180;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const unrotX = dx * Math.cos(-rad) - dy * Math.sin(-rad);
    const unrotY = dx * Math.sin(-rad) + dy * Math.cos(-rad);
    const finalX = unrotX + image.width / 2;
    const finalY = unrotY + image.height / 2;
    return { x: finalX, y: finalY };
  };
  const handleStart = (e) => {
    if (activeTool !== "draw") return;
    setIsDrawing(true);
    const { x, y } = getCoords(e);
    setPaths((prev) => [...prev, { x, y, color: brushColor, size: brushSize, type: "start" }]);
  };
  const handleMove = (e) => {
    if (!isDrawing || activeTool !== "draw") return;
    const { x, y } = getCoords(e);
    setPaths((prev) => [...prev, { x, y, type: "move" }]);
  };
  const handleEnd = () => {
    setIsDrawing(false);
  };
  const handleSaveClick = () => {
    canvasRef.current.toBlob((blob) => {
      const newFile = new File([blob], file.name, { type: "image/png" });
      onSave(newFile);
    }, "image/png");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[60] bg-black/95 flex flex-col items-center select-none touch-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex items-center justify-between p-4 bg-black border-b border-white/10 z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-medium", children: "Image Editor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSaveClick, className: "p-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 px-4 shadow-lg shadow-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }),
        " Save"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: containerRef,
        className: "flex-1 w-full flex items-center justify-center p-4 overflow-hidden relative",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            onMouseDown: handleStart,
            onMouseMove: handleMove,
            onMouseUp: handleEnd,
            onMouseLeave: handleEnd,
            onTouchStart: handleStart,
            onTouchMove: handleMove,
            onTouchEnd: handleEnd,
            className: "max-w-full max-h-full object-contain shadow-2xl border border-white/10 bg-[url('https://transparent-textures.patterns.veliovgroup.com/subtle-grey-patterns/subtle_grey_patterns.png')] bg-white/5",
            style: { cursor: activeTool === "draw" ? "crosshair" : "default" }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-black/90 border-t border-white/10 backdrop-blur-xl pb-safe", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-16 flex items-center justify-center border-b border-white/5 px-4 overflow-x-auto custom-scrollbar", children: [
        activeTool === "filter" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4", children: FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setFilter(f),
            className: `flex flex-col items-center gap-1 min-w-[60px] ${filter.name === f.name ? "text-primary" : "text-subtext"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-8 h-8 rounded-full bg-white/10 border-2 overflow-hidden ${filter.name === f.name ? "border-primary" : "border-transparent"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gray-500", style: { filter: f.filter } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] whitespace-nowrap", children: f.name })
            ]
          },
          f.name
        )) }),
        activeTool === "draw" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 bg-white/5 p-1 rounded-lg", children: BRUSH_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setBrushColor(c),
              className: `w-6 h-6 rounded-full border-2 ${brushColor === c ? "border-white scale-110" : "border-transparent hover:scale-110"} transition-transform`,
              style: { backgroundColor: c }
            },
            c
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-px bg-white/10 mx-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: "1",
              max: "20",
              value: brushSize,
              onChange: (e) => setBrushSize(parseInt(e.target.value)),
              className: "w-24 accent-primary"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setPaths([]), className: "p-2 text-white/50 hover:text-red-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Undo, { className: "w-4 h-4" }),
            " "
          ] })
        ] }),
        activeTool === "adjust" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setRotation((r) => (r + 90) % 360), className: "flex flex-col items-center gap-1 hover:text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "w-6 h-6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "Rotate" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-around p-4 max-w-md mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTool("draw"),
            className: `flex flex-col items-center gap-1 transition-colors ${activeTool === "draw" ? "text-primary" : "text-white/50 hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-6 h-6" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Draw" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTool("filter"),
            className: `flex flex-col items-center gap-1 transition-colors ${activeTool === "filter" ? "text-primary" : "text-white/50 hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "w-6 h-6" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Filters" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTool("adjust"),
            className: `flex flex-col items-center gap-1 transition-colors ${activeTool === "adjust" ? "text-primary" : "text-white/50 hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crop, { className: "w-6 h-6" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Adjust" })
            ]
          }
        )
      ] })
    ] })
  ] });
};
export {
  ImageEditor as default
};
