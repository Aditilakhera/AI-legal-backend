import { c as createLucideIcon, r as reactExports, a3 as useIsomorphicLayoutEffect, a4 as frame, a5 as LayoutGroupContext, j as jsxRuntimeExports, a6 as useIsDark, a7 as useMotionValue, A as AnimatePresence, m as motion, a8 as WandSparkles, i as Sparkles, M as logo, X, a9 as Monitor, aa as Smartphone, ab as Rocket, Z as Zap, _ as Check, k as Shield } from "./index-Nt9jGuPD.js";
import { u as useMotionTemplate, P as PromptLibraryModal } from "./PromptLibraryModal-Dz6Dr7SS.js";
import "./rotate-cw-S2QxuxIa.js";
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M9 21V9", key: "1oto5p" }]
];
const PanelsTopLeft = createLucideIcon("PanelsTopLeft", __iconNode);
const DeprecatedLayoutGroupContext = reactExports.createContext(null);
function useIsMounted() {
  const isMounted = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
}
function useForceUpdate() {
  const isMounted = useIsMounted();
  const [forcedRenderCount, setForcedRenderCount] = reactExports.useState(0);
  const forceRender = reactExports.useCallback(() => {
    isMounted.current && setForcedRenderCount(forcedRenderCount + 1);
  }, [forcedRenderCount]);
  const deferredForceRender = reactExports.useCallback(() => frame.postRender(forceRender), [forceRender]);
  return [deferredForceRender, forcedRenderCount];
}
const notify = (node) => !node.isLayoutDirty && node.willUpdate(false);
function nodeGroup() {
  const nodes = /* @__PURE__ */ new Set();
  const subscriptions = /* @__PURE__ */ new WeakMap();
  const dirtyAll = () => nodes.forEach(notify);
  return {
    add: (node) => {
      nodes.add(node);
      subscriptions.set(node, node.addEventListener("willUpdate", dirtyAll));
    },
    remove: (node) => {
      nodes.delete(node);
      const unsubscribe = subscriptions.get(node);
      if (unsubscribe) {
        unsubscribe();
        subscriptions.delete(node);
      }
      dirtyAll();
    },
    dirty: dirtyAll
  };
}
const shouldInheritGroup = (inherit) => inherit === true;
const shouldInheritId = (inherit) => shouldInheritGroup(inherit === true) || inherit === "id";
const LayoutGroup = ({ children, id, inherit = true }) => {
  const layoutGroupContext = reactExports.useContext(LayoutGroupContext);
  const deprecatedLayoutGroupContext = reactExports.useContext(DeprecatedLayoutGroupContext);
  const [forceRender, key] = useForceUpdate();
  const context = reactExports.useRef(null);
  const upstreamId = layoutGroupContext.id || deprecatedLayoutGroupContext;
  if (context.current === null) {
    if (shouldInheritId(inherit) && upstreamId) {
      id = id ? upstreamId + "-" + id : upstreamId;
    }
    context.current = {
      id,
      group: shouldInheritGroup(inherit) ? layoutGroupContext.group || nodeGroup() : nodeGroup()
    };
  }
  const memoizedContext = reactExports.useMemo(() => ({ ...context.current, forceRender }), [key]);
  return jsxRuntimeExports.jsx(LayoutGroupContext.Provider, { value: memoizedContext, children });
};
const ActiveFill = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary z-0 pointer-events-none" });
const MagicToolSettingsCard = ({ isOpen, onClose, toolType, config, onChange, pricing, onContentSelect, referenceImage }) => {
  const [hoveredModel, setHoveredModel] = reactExports.useState(null);
  const [isHovered, setIsHovered] = reactExports.useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = reactExports.useState(false);
  const isDark = useIsDark();
  reactExports.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      const activeModals = document.querySelectorAll(".modal-open-indicator");
      if (activeModals.length <= 1) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen]);
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  useMotionTemplate`
        radial-gradient(
            350px circle at ${mouseX}px ${mouseY}px,
            rgba(0,0,0,0.12),
            transparent 80%
        )
    `;
  const pricingKey = toolType === "edit" ? "image" : ["deepsearch", "websearch", "coding", "chat"].includes(toolType) ? "chat" : toolType;
  const toolPricingBase = pricing[pricingKey] || { models: [], editModels: [] };
  const toolPricing = { models: toolType === "edit" ? toolPricingBase.editModels || [] : toolPricingBase.models || [] };
  const aspectRatios = toolType === "video" ? [
    { id: "16:9", label: "16:9", icon: Monitor, w: 14, h: 8 },
    { id: "9:16", label: "9:16", icon: Smartphone, w: 8, h: 14 },
    { id: "1:1", label: "1:1", icon: PanelsTopLeft, w: 1, h: 1 }
  ] : [
    { id: "1:1", label: "1:1", icon: PanelsTopLeft, w: 1, h: 1 },
    { id: "16:9", label: "16:9", icon: Monitor, w: 14, h: 8 },
    { id: "9:16", label: "9:16", icon: Smartphone, w: 8, h: 14 },
    { id: "4:5", label: "4:5", icon: PanelsTopLeft, w: 4, h: 5 }
  ];
  const isVisualTool = ["image", "video", "edit"].includes(toolType);
  const getToolTitle = () => {
    switch (toolType) {
      case "video":
        return "Video Settings";
      case "edit":
        return "Image Editing";
      case "deepsearch":
        return "Deep Search Settings";
      case "websearch":
        return "Web Search Settings";
      case "coding":
        return "Code Builder Settings";
      case "chat":
        return "Chat Settings";
      default:
        return "Image Generation";
    }
  };
  const modelHoverColors = ["bg-blue-50/90", "bg-indigo-50/90", "bg-violet-50/90", "bg-purple-50/90"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-[6px] sm:backdrop-blur-[8px] overflow-y-auto lg:!left-[280px] modal-open-indicator",
        onClick: (e) => e.target === e.currentTarget && onClose(),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            onMouseMove: handleMouseMove,
            onHoverStart: () => setIsHovered(true),
            onHoverEnd: () => setIsHovered(false),
            initial: { opacity: 0, scale: 0.95, y: 20 },
            animate: {
              opacity: 1,
              scale: isHovered ? 1.005 : [1, 1.01, 1],
              y: 0
            },
            exit: { opacity: 0, scale: 0.95, y: 20 },
            className: "relative w-full max-w-[320px] sm:max-w-[340px] rounded-[28px] shadow-2xl bg-white/95 dark:bg-zinc-900/95 border border-white/20 my-auto",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full h-full rounded-[27px] flex flex-col overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-0 opacity-[0.015] pointer-events-none", style: { backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-20 px-5 sm:px-6 pt-6 pb-4 border-b border-black/[0.04] bg-white/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-8 w-[150px] h-full bg-gradient-to-l from-white/30 to-transparent pointer-events-none blur-xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-[34px] sm:w-[38px] h-[34px] sm:h-[38px] relative z-10 rounded-[10px] sm:rounded-xl bg-gradient-to-br from-primary via-[#4F46E5] to-[#3B82F6] flex items-center justify-center shadow-lg border border-white/30",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "w-[16px] sm:w-[18px] h-[16px] sm:h-[18px] text-white" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[15px] sm:text-[16px] font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1 shadow-sm", children: getToolTitle() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[8.5px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-1 opacity-90", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-2.5 h-2.5 text-primary animate-pulse" }),
                        "Advanced Engine"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 relative z-10", children: [
                    (toolType === "image" || toolType === "edit" || toolType === "video") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.button,
                      {
                        whileHover: { scale: 1.1, backgroundColor: "rgba(var(--primary-rgb), 0.1)" },
                        whileTap: { scale: 0.9 },
                        onClick: () => setIsLibraryOpen(true),
                        className: "px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-1.5 text-primary transition-all hover:shadow-lg hover:shadow-primary/10",
                        title: "Prompt Library",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "AISA", className: "w-3.5 h-3.5 object-contain" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase tracking-wider", children: "Prompt Library" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.button,
                      {
                        whileHover: { scale: 1.1, backgroundColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)", rotate: 90 },
                        whileTap: { scale: 0.9 },
                        onClick: onClose,
                        className: "w-7 h-7 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white hover:shadow-md transition-all shadow-sm border border-white/50 dark:border-white/10 relative z-10",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, strokeWidth: 2.5 })
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-20 px-5 sm:px-6 py-5 space-y-5 sm:space-y-6 max-h-[45dvh] overflow-y-auto scrollbar-hide scroll-smooth will-change-transform", children: [
                config.aspectRatio !== void 0 && isVisualTool && toolType !== "edit" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  toolType === "video" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3 ml-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 rounded-full bg-slate-800 shadow-[0_0_6px_rgba(0,0,0,0.5)]" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-black uppercase tracking-[0.25em] text-slate-800/80 dark:text-white/80 drop-shadow-sm", children: "Aspect Ratio" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `relative grid ${toolType === "video" ? "grid-cols-3" : "grid-cols-4"} gap-1.5 bg-white/50 dark:bg-white/5 p-1.5 rounded-[16px] border border-white/60 dark:border-white/10 shadow-[inset_0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-xl`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGroup, { id: "aspectSwitch", children: aspectRatios.map((ar) => {
                    const isActive = config.aspectRatio === ar.id;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.button,
                      {
                        onClick: () => onChange("aspectRatio", ar.id),
                        whileHover: !isActive ? { scale: 1.05 } : {},
                        whileTap: { scale: 0.95 },
                        className: "relative h-12 rounded-[10px] flex flex-col items-center justify-center transition-colors outline-none overflow-hidden group shadow-sm",
                        children: [
                          isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ActiveFill, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-white/60 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative z-10 flex flex-col items-center transition-all duration-300 ${isActive ? "scale-105" : "scale-100 opacity-70 group-hover:opacity-100"}`, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center mb-1 drop-shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: `border-[1.5px] rounded-[2px] transition-colors ${isActive ? "border-white" : "border-slate-500 group-hover:border-slate-800"}`,
                                style: {
                                  width: ar.w > ar.h ? 12 : ar.w === ar.h ? 9 : 6,
                                  height: ar.h > ar.w ? 12 : ar.h === ar.w ? 9 : 6
                                }
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[9.5px] font-black tracking-tighter ${isActive ? "text-white" : "text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white"}`, children: ar.label })
                          ] })
                        ]
                      },
                      ar.id
                    );
                  }) }) })
                ] }),
                config.modelId !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3 ml-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 rounded-full bg-slate-800 shadow-[0_0_6px_rgba(0,0,0,0.5)]" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-black uppercase tracking-[0.25em] text-slate-800/80 dark:text-white/80 drop-shadow-sm", children: "Synthesis Core" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: toolPricing.models.map((model, idx) => {
                    const isActive = config.modelId === model.id;
                    hoveredModel === model.id;
                    const hoverBaseColor = modelHoverColors[idx % modelHoverColors.length];
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        initial: { opacity: 0, x: -10 },
                        animate: { opacity: 1, x: 0 },
                        transition: { delay: idx * 0.08, type: "spring", stiffness: 300, damping: 25 },
                        className: "relative",
                        children: [
                          isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            motion.div,
                            {
                              layoutId: "activeModelRing",
                              className: "absolute -inset-[1px] rounded-[20px] bg-gradient-to-r from-primary via-[#8b5cf6] to-[#0ea5e9] opacity-[0.35] blur-[5px] z-0"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              onClick: () => onChange("modelId", model.id),
                              className: `w-full relative p-[14px] rounded-[18px] text-left transition-all duration-300 z-10 overflow-hidden ${isActive ? "bg-white dark:bg-zinc-800 shadow-lg border-2 border-primary/40" : `bg-white/60 dark:bg-white/5 border border-white/50 dark:border-white/5 hover:${hoverBaseColor} shadow-sm backdrop-blur-md`}`,
                              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3.5 relative z-10 w-full", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  motion.div,
                                  {
                                    animate: { scale: isActive ? 1.1 : 1 },
                                    className: `w-[36px] h-[36px] rounded-[12px] flex items-center justify-center transition-all duration-500 shadow-inner shrink-0 ${isActive ? "bg-gradient-to-br from-primary to-blue-600 text-white shadow-[0_8px_20px_rgba(var(--primary-rgb),0.4)] border border-primary/50" : "bg-white dark:bg-zinc-700 text-slate-400 dark:text-zinc-400 group-hover:text-primary"}`,
                                    children: model.speed === "Fast" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { size: 18, className: isActive ? "drop-shadow-md" : "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 18, className: isActive ? "drop-shadow-md" : "" })
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[14px] font-black truncate pr-2 transition-colors ${isActive ? isDark ? "text-white" : "text-slate-900" : isDark ? "text-zinc-300" : "text-slate-700"}`, children: model.name }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[8.5px] font-black uppercase tracking-[0.1em] transition-colors ${isActive ? "text-primary" : isDark ? "text-zinc-500" : "text-slate-500"}`, children: model.price === 0 ? "Free" : `${model.price} CR` }),
                                      isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        motion.div,
                                        {
                                          initial: { scale: 0, rotate: -90 },
                                          animate: { scale: 1, rotate: 0 },
                                          transition: { type: "spring", stiffness: 400, damping: 20 },
                                          className: "bg-primary/10 rounded-full p-0.5",
                                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12, className: "text-primary", strokeWidth: 4 })
                                        }
                                      )
                                    ] })
                                  ] }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10.5px] font-medium leading-snug transition-colors line-clamp-2 ${isActive ? isDark ? "text-zinc-400" : "text-slate-500" : isDark ? "text-zinc-500" : "text-slate-400 group-hover:text-slate-600"}`, children: model.description })
                                ] })
                              ] })
                            }
                          )
                        ]
                      },
                      model.id || model.name || idx
                    );
                  }) }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 relative z-20 border-t border-black/[0.04] bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onClose,
                  className: "relative w-full flex items-center justify-center py-2.5 rounded-[12px] bg-primary text-white font-bold shadow-lg hover:opacity-90 transition-opacity",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex items-center justify-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5", strokeWidth: 2.5 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11.5px] font-black uppercase tracking-[0.2em]", children: "Activate Core" })
                  ] })
                }
              ) })
            ] })
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PromptLibraryModal,
      {
        isOpen: isLibraryOpen,
        mode: toolType === "edit" ? "edit" : toolType === "video" ? "video" : "generate",
        referenceImage,
        onClose: () => setIsLibraryOpen(false),
        onSelect: (prompt) => {
          if (onContentSelect) {
            onContentSelect(prompt);
          }
          setIsLibraryOpen(false);
          onClose();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { jsx: true, children: `
                @keyframes shine {
                    100% { background-position: -200% 0, 0 0; }
                }
            ` })
  ] });
};
export {
  MagicToolSettingsCard as default
};
