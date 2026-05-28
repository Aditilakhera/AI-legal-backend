import { c as createLucideIcon, a7 as useMotionValue, a3 as useIsomorphicLayoutEffect, bZ as cancelFrame, a4 as frame, b_ as isMotionValue, r as reactExports, G as Globe, ab as Rocket, k as Shield, b$ as Megaphone, bU as Video, i as Sparkles, c0 as User, c1 as Flame, c2 as ImagePlus, a8 as WandSparkles, c3 as Palette, bQ as Brain, Z as Zap, c4 as Camera, a9 as Monitor, j as jsxRuntimeExports, A as AnimatePresence, m as motion, X, u as Search, e as ChevronRight } from "./index-Bp7AJyAc.js";
import { R as RotateCw } from "./rotate-cw-Buqyjvnh.js";
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  ["path", { d: "M3 7.5h4", key: "zfgn84" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }],
  ["path", { d: "M3 16.5h4", key: "1230mu" }],
  ["path", { d: "M17 3v18", key: "in4fa5" }],
  ["path", { d: "M17 7.5h4", key: "myr1c1" }],
  ["path", { d: "M17 16.5h4", key: "go4c1d" }]
];
const Film = createLucideIcon("Film", __iconNode$4);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M9 10h.01", key: "qbtxuw" }],
  ["path", { d: "M15 10h.01", key: "1qmjsl" }],
  [
    "path",
    {
      d: "M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z",
      key: "uwwb07"
    }
  ]
];
const Ghost = createLucideIcon("Ghost", __iconNode$3);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("Heart", __iconNode$2);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
      key: "1v9wt8"
    }
  ]
];
const Plane = createLucideIcon("Plane", __iconNode$1);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z", key: "1l6gj6" }],
  ["path", { d: "M7 16v6", key: "1a82de" }],
  ["path", { d: "M13 19v3", key: "13sx9i" }],
  [
    "path",
    {
      d: "M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5",
      key: "1sj9kv"
    }
  ]
];
const Trees = createLucideIcon("Trees", __iconNode);
function useCombineMotionValues(values, combineValues) {
  const value = useMotionValue(combineValues());
  const updateValue = () => value.set(combineValues());
  updateValue();
  useIsomorphicLayoutEffect(() => {
    const scheduleUpdate = () => frame.preRender(updateValue, false, true);
    const subscriptions = values.map((v) => v.on("change", scheduleUpdate));
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelFrame(updateValue);
    };
  });
  return value;
}
function useMotionTemplate(fragments, ...values) {
  const numFragments = fragments.length;
  function buildValue() {
    let output = ``;
    for (let i = 0; i < numFragments; i++) {
      output += fragments[i];
      const value = values[i];
      if (value) {
        output += isMotionValue(value) ? value.get() : value;
      }
    }
    return output;
  }
  return useCombineMotionValues(values.filter(isMotionValue), buildValue);
}
const GENERATE_CATEGORIES = [
  { id: "All", icon: Globe },
  { id: "Realistic", icon: Camera },
  { id: "Fantasy / Sci-fi", icon: Sparkles },
  { id: "Portraits", icon: User },
  { id: "Social Media", icon: Rocket },
  { id: "Product / Branding", icon: Shield },
  { id: "Cinematic", icon: Monitor }
];
const EDIT_CATEGORIES = [
  { id: "All", icon: Globe },
  { id: "Background Change", icon: ImagePlus },
  { id: "Object Removal", icon: WandSparkles },
  { id: "Lighting", icon: Sparkles },
  { id: "Style", icon: Palette },
  { id: "Face", icon: Brain },
  { id: "Color Grading", icon: Zap }
];
const VIDEO_CATEGORIES = [
  { id: "All", icon: Globe },
  { id: "Cinematic", icon: Film },
  { id: "Social Media", icon: Rocket },
  { id: "Product", icon: Shield },
  { id: "Nature", icon: Trees },
  { id: "Travel", icon: Plane },
  { id: "Sci-fi / Fantasy", icon: Ghost },
  { id: "Marketing", icon: Megaphone }
];
const I2V_CATEGORIES = [
  { id: "All", icon: Globe },
  { id: "Cinematic Motion", icon: Rocket },
  { id: "Camera Movement", icon: Video },
  { id: "Environment", icon: Sparkles },
  { id: "Character", icon: User },
  { id: "Fantasy", icon: Ghost },
  { id: "Loop", icon: RotateCw },
  { id: "Dramatic", icon: Flame }
];
const GENERATE_DATA = {
  Realistic: {
    styles: ["Photorealistic", "Hyperrealistic", "8K Resolution", "Unreal Engine 5", "Street Photography", "National Geographic Style"],
    subjects: ["Mountain Peaks at Dawn", "Rainy NYC Streets", "Ancient Grecian Temple", "Volcanic Eruption", "Modern Skyscraper", "Luxury Sports Car", "Dew Drop on Leaf"]
  },
  "Fantasy / Sci-fi": {
    styles: ["Epic Fantasy", "Cyberpunk", "Surrealism", "Vaporwave", "Dark Fantasy", "Studio Ghibli style", "Steampunk"],
    subjects: ["Dragon Horde", "Cyber Cityscape", "Neon Samurai", "Flying Castle", "Cosmic Whale", "Hidden Cave of Jewels", "Robot Soldier"]
  },
  Portraits: {
    styles: ["Cinematic Portrait", "Black and White", "Macro Facials", "Renaissance Style", "Bokeh Background", "Soft Studio Lighting"],
    subjects: ["Elderly Person with Wisdom", "Nordic Warrior", "Cybernetic Humanoid", "Fashion Model in Neon", "Historical Knight", "Astronaut in Helmet"]
  },
  "Social Media": {
    styles: ["Instagram aesthetic", "Influencer style", "Aesthetic Flatlay", "Moody Teal/Orange", "Bright and Airy", "TikTok Viral Style"],
    subjects: ["Morning Coffee Setup", "Luxury Travel Gear", "Sunset Beach Picnic", "Minimalist Desk Workspace", "Himalayan Hotel View"]
  },
  "Product / Branding": {
    styles: ["Commercial Photography", "Studio Lighting", "Minimalist Product Shot", "Floating Presentation", "Clean Glossy Look"],
    subjects: ["Sleek Smartphone", "Premium Sneaker", "Designer Watch", "Cosmetic Bottle with Splash", "High-end Headphones"]
  },
  Cinematic: {
    styles: ["Movie Scene Lighting", "Widescreen Panavision", "Film Grain", "Dramatic Action Shot", "Volumetric Fog", "Cinema 4D"],
    subjects: ["Action Hero Escape", "Noir Mystery Alley", "Epic Space Battle", "Interstellar Voyager", "Desert Oasis Discovery"]
  }
};
const EDIT_DATA = {
  "Background Change": {
    styles: ["Modern Office", "Tropical Beach", "Futuristic City", "Minimalist Studio", "Mountain View", "Outer Space"],
    actions: ["Remove the background and replace with", "Swap the current background for", "Change the scene behind the subject to", "Set the backdrop as a"]
  },
  "Object Removal": {
    styles: ["clean plate", "flawless repair", "natural fill", "seamless removal"],
    actions: ["Remove the unwanted objects from", "Clean up the background and remove people from", "Delete the distracting elements in", "Erase the foreground objects and fill with"]
  },
  Lighting: {
    styles: ["Cinematic Glow", "Golden Hour", "Neon Atmosphere", "Dramatic Shadows", "Soft Ambient", "Volumetric Light"],
    actions: ["Enhance the lighting for a", "Add a dramatic lighting effect like", "Change the entire mood to", "Relight the scene with"]
  },
  Style: {
    styles: ["Oil Painting", "Anime Sketch", "Cyberpunk Art", "Pop Art", "Vintage Film", "Watercolor"],
    actions: ["Transform this image into a", "Apply a professional style like", "Convert the look to", "Redraw the image in the style of"]
  },
  Face: {
    styles: ["HD Detail", "Skin Smoothing", "Studio Glamour", "Natural Retouch", "Cybernetic Augmentation"],
    actions: ["Improve facial details and add", "Retouch the face for", "Enhance features and apply", "Make the face look more like"]
  },
  "Color Grading": {
    styles: ["Moody Teal/Orange", "Vintage Sepia", "Cool Winter Blue", "Vibrant HDR", "Cinematic Film Grade"],
    actions: ["Apply professional color grading for", "Modify the color palette to", "Enhance the saturation and add", "Apply a high-end film look like"]
  }
};
const VIDEO_DATA = {
  Cinematic: {
    styles: ["Epic Slow Motion", "Aerial 4K Drone View", "Dramatic Low Angle", "Handheld Action Motion", "Cinematic Pan Right", "Steady Cam Chase"],
    subjects: ["Warrior standing on cliff", "Steam train through forest", "Samurai duel in rain", "Falcon diving from sky", "Ship sailing through storm", "Ancient ruins at sunset"]
  },
  "Social Media": {
    styles: ["ASMR Aesthetic", "Rapid Trendy Cuts", "Smooth Motion Blur", "Bright Lifestyle Vibe", "Stop Motion Style", "Vlog Style Panning"],
    subjects: ["Coffee pouring in cup", "Street food cooking", "Skater doing tricks", "Model walking in city", "Sneaker unboxing", "Nature hiking montage"]
  },
  Product: {
    styles: ["Macro Product Rotation", "Floating Studio Lighting", "High Speed Splash", "Exploded View Animation", "Sleek Minimal Pan", "Glitch Tech Showcase"],
    subjects: ["Smartphone with glowing screen", "Luxury watch gears", "Diamond ring shimmering", "Perfume bottle with mist", "Mechanical keyboard typing", "Headphones rotating"]
  },
  Nature: {
    styles: ["National Geographic Vibe", "Vibrant 8K Nature", "Time-lapse Flower Bloom", "Macro Insect Motion", "Wide Landscape Reveal", "Undersea World Exploration"],
    subjects: ["Waterfall in jungle", "Aurora Borealis over ice", "Lion chasing prey", "Volcanic ash rising", "Deep sea bioluminescence", "Eagle soaring mountains"]
  },
  "Sci-fi / Fantasy": {
    styles: ["Interstellar Warp Effect", "Cyberpunk Neon Glow", "Magic Portal Opening", "Holographic Interface", "Epic Space Battle", "Magical Creature Flight"],
    subjects: ["Spaceship docking at station", "Dragon breathing blue fire", "Futuristic Tokyo at night", "Hidden wizard tower", "Alien landscape with two suns", "Teleportation beam down"]
  },
  Marketing: {
    styles: ["Corporate Professional Panning", "High Energy Transitions", "Bold Graphics Overlay", "Clean Product Reveal", "Dynamic Text-focused Motion"],
    subjects: ["Team working in modern office", "Factory robotic precision", "Handshaking business deal", "Global network connection", "Innovation lab experiments", "Sustainable energy park"]
  }
};
const I2V_DATA = {
  "Cinematic Motion": {
    styles: ["Slow Cinematic Zoom", "Soft Depth of Field", "Gentle Lighting Changes", "Subtle Motion"],
    actions: ["Add slow cinematic zoom-in with", "Animate the scene with", "Create a moving cinematic shot using", "Enhance with a soft"]
  },
  "Camera Movement": {
    styles: ["Smooth Camera Pan", "Cinematic Motion Blur", "Depth Animation", "Drone-style Reveal"],
    actions: ["Apply smooth left-to-right camera pan with", "Create a drone-style upward camera movement with", "Add a sweeping orbital camera shot with", "Animate with a professional"]
  },
  Environment: {
    styles: ["Realistic Rain", "Natural Wind motion", "Floating Fog", "Magical Glowing Particles"],
    actions: ["Add realistic environmental effects like", "Enhance the atmosphere with", "Animate the background using", "Apply natural looking"]
  },
  Character: {
    styles: ["Natural Body Motion", "Hair and Cloth Swaying", "Energetic Action", "Facial Retouching"],
    actions: ["Animate the character with", "Add realistic movement to", "Create dynamic life-like motion in", "Enhance the subject with"]
  },
  Loop: {
    styles: ["Seamless Loop", "Continuous Motion", "Infinite Sway", "Cyclic Animation"],
    actions: ["Create a seamless loop animation with", "Apply continuous repeating motion like", "Animate for an infinite loop with", "Enhance as a perfect"]
  }
};
const PromptLibraryModal = ({ isOpen, onClose, onSelect, mode = "generate", referenceImage }) => {
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [activeCategory, setActiveCategory] = reactExports.useState("All");
  const [page, setPage] = reactExports.useState(1);
  reactExports.useRef(null);
  const categories = reactExports.useMemo(() => {
    if (mode === "video") return VIDEO_CATEGORIES;
    if (mode === "i2v") return I2V_CATEGORIES;
    let base = mode === "edit" ? [...EDIT_CATEGORIES] : [...GENERATE_CATEGORIES];
    if (mode === "edit" && referenceImage) {
      base.splice(1, 0, { id: "Smart Edit", icon: Brain });
    }
    return base;
  }, [mode, referenceImage]);
  const itemsPerPage = 20;
  reactExports.useEffect(() => {
    setActiveCategory("All");
    setSearchQuery("");
    setPage((Page) => 1);
  }, [mode]);
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
  const allPrompts = reactExports.useMemo(() => {
    let result = [];
    let id = 1;
    if (mode === "generate") {
      result.push({ id: id++, title: "Cinematic Portrait", prompt: "A cinematic portrait of a man standing in rain, dramatic lighting, 4K, ultra realistic", category: "Realistic" });
      result.push({ id: id++, title: "Instagram Post", prompt: "Aesthetic flat lay with coffee, laptop and sunlight, soft shadows, Instagram style", category: "Social Media" });
    } else if (mode === "edit") {
      result.push({ id: id++, title: "Remove Background", prompt: "Remove the background and replace with a modern office environment", category: "Background Change" });
      result.push({ id: id++, title: "Enhance Quality", prompt: "Increase image sharpness, upscale to HD, improve facial details", category: "Face" });
    } else if (mode === "video") {
      result.push({ id: id++, title: "Cinematic Rain Scene", prompt: "A cinematic video of a man walking alone in heavy rain at night, neon lights reflecting on wet streets, slow motion, dramatic lighting, 4K", category: "Cinematic" });
      result.push({ id: id++, title: "Instagram Reel Aesthetic", prompt: "Aesthetic lifestyle reel with coffee, books and sunlight, soft transitions, smooth camera motion, warm tones", category: "Social Media" });
      result.push({ id: id++, title: "Product Showcase", prompt: "Professional product video of a smartphone rotating with glowing lights, clean background, smooth transitions, studio lighting", category: "Product" });
      result.push({ id: id++, title: "Travel Vlog", prompt: "A travel video showing mountains, waterfalls and drone shots, bright daylight, smooth cinematic transitions", category: "Travel" });
    } else if (mode === "i2v") {
      result.push({ id: id++, title: "Slow Cinematic Zoom", prompt: "Add slow cinematic zoom-in with soft depth of field, gentle lighting changes, and subtle motion", category: "Cinematic Motion" });
      result.push({ id: id++, title: "Wind Effect", prompt: "Add natural wind motion, hair and clothes slightly moving, realistic environmental animation", category: "Environment" });
      result.push({ id: id++, title: "Camera Pan", prompt: "Apply smooth left-to-right camera pan with cinematic motion blur and depth", category: "Camera Movement" });
      result.push({ id: id++, title: "Rain Effect", prompt: "Add realistic rain with water drops, reflections, and dramatic lighting", category: "Environment" });
      result.push({ id: id++, title: "Drone Shot", prompt: "Create a drone-style upward camera movement revealing surroundings with cinematic feel", category: "Camera Movement" });
      result.push({ id: id++, title: "Parallax Effect", prompt: "Add 3D parallax motion separating foreground and background with smooth depth animation", category: "Cinematic Motion" });
      result.push({ id: id++, title: "Cinematic Lighting", prompt: "Animate lighting changes with soft glow, shadows, and dramatic highlights", category: "Cinematic Motion" });
      result.push({ id: id++, title: "Loop Animation", prompt: "Create a seamless loop animation with subtle continuous motion", category: "Loop" });
      result.push({ id: id++, title: "Fantasy Glow", prompt: "Add magical glowing particles, floating lights, and fantasy atmosphere", category: "Fantasy" });
      result.push({ id: id++, title: "Action Movement", prompt: "Add dynamic motion with fast camera movement and energetic scene transitions", category: "Cinematic Motion" });
    }
    const dataInput = mode === "i2v" ? I2V_DATA : mode === "video" ? VIDEO_DATA : mode === "edit" ? { ...EDIT_DATA } : { ...GENERATE_DATA };
    const data = { ...dataInput };
    if (mode === "edit" && referenceImage) {
      data["Smart Edit"] = {
        styles: ["Enhance Lighting", "Upscale Details", "Cinematic Re-touch", "Professional Color Grade", "Studio Retouch"],
        actions: ["Analyze and improve this image with", "Refine the textures and add", "Stylize the existing scene for better", "Polish the current frame using"]
      };
    }
    Object.keys(data).forEach((cat) => {
      var _a, _b, _c, _d;
      const catData = data[cat];
      for (let i = 0; i < 150; i++) {
        const style = ((_a = catData.styles) == null ? void 0 : _a[Math.floor(Math.random() * catData.styles.length)]) || "Professional";
        if (mode === "edit" || mode === "i2v") {
          const action = ((_b = catData.actions) == null ? void 0 : _b[Math.floor(Math.random() * catData.actions.length)]) || "Animate";
          result.push({ id: id++, title: `${cat} - ${style}`, prompt: `${action} ${style} style, ensure high quality and professional output.`, category: cat });
        } else if (mode === "video") {
          const subject = ((_c = catData.subjects) == null ? void 0 : _c[Math.floor(Math.random() * catData.subjects.length)]) || "Scene";
          result.push({ id: id++, title: `${style} ${cat}`, prompt: `${style} of ${subject}, cinematic camera, professional color grading, high bitrate, 4K resolution.`, category: cat });
        } else {
          const subject = ((_d = catData.subjects) == null ? void 0 : _d[Math.floor(Math.random() * catData.subjects.length)]) || "Subject";
          result.push({ id: id++, title: `${style} ${subject}`, prompt: `${style} of ${subject}, cinematic lighting, masterpiece, 8k, professional.`, category: cat });
        }
      }
    });
    return result;
  }, [mode, referenceImage]);
  const [favorites, setFavorites] = reactExports.useState(() => {
    const saved = localStorage.getItem(`aisa_fav_${mode}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [recent, setRecent] = reactExports.useState(() => {
    const saved = localStorage.getItem(`aisa_recent_${mode}`);
    return saved ? JSON.parse(saved) : [];
  });
  const toggleFavorite = (id) => {
    const newFavs = favorites.includes(id) ? favorites.filter((fid) => fid !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem(`aisa_fav_${mode}`, JSON.stringify(newFavs));
  };
  const handleSelect = (prompt, id) => {
    const newRecent = [id, ...recent.filter((rid) => rid !== id)].slice(0, 10);
    setRecent(newRecent);
    localStorage.setItem(`aisa_recent_${mode}`, JSON.stringify(newRecent));
    onSelect(prompt);
  };
  const filteredPrompts = reactExports.useMemo(() => {
    setPage(1);
    return allPrompts.filter((p) => {
      if (activeCategory === "Trending") return recent.includes(p.id) || favorites.slice(0, 5).includes(p.id) || p.id % 40 === 0;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, recent, favorites, allPrompts]);
  reactExports.useMemo(() => {
    return filteredPrompts.slice(0, page * itemsPerPage);
  }, [filteredPrompts, page]);
  const ticking = reactExports.useRef(false);
  const handleScroll = (e) => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
          if (filteredPrompts.length > page * itemsPerPage) {
            setPage((p) => p + 1);
          }
        }
        ticking.current = false;
      });
      ticking.current = true;
    }
  };
  const handleSurprise = () => {
    const random = allPrompts[Math.floor(Math.random() * allPrompts.length)];
    handleSelect(random.prompt, random.id);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[1300] flex items-center justify-center p-2 sm:p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-[6px] sm:backdrop-blur-[8px] overflow-y-auto lg:!left-[280px] modal-open-indicator", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95, y: 30 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 30 },
      className: "relative w-full max-w-4xl h-[90vh] sm:h-[85vh] bg-white/70 rounded-[30px] sm:rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/40 flex flex-col my-auto",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 sm:p-8 bg-white/40 border-b border-black/[0.05] relative space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 shadow-xl shadow-primary/20", children: mode === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { size: 24, className: "text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 24, className: "text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5 flex items-center gap-2", children: [
                  mode === "video" ? "AI Video Showcase" : mode === "edit" ? "Magic Editor Library" : "Dynamic Prompt Library",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-black tracking-widest border border-primary/20", children: mode === "video" ? "Video Mode" : mode === "edit" ? "Edit Mode" : "Image Mode" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] opacity-70", children: mode === "video" ? "High-end Cinematic Video Synthesis" : mode === "edit" ? "Smart Suggestions for Image Modification" : "Procedurally Generated AI Masterpieces" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: handleSurprise,
                  className: "hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 text-orange-600 text-xs font-black uppercase tracking-widest border border-orange-500/20 hover:bg-orange-500 hover:text-white transition-all shadow-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { size: 14 }),
                    "Surprise Me"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors", size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: mode === "video" ? "Search cinematic shots, action scenes, or reels..." : mode === "edit" ? "Search for edit styles, filters, or effects..." : "Search styles, subjects, or keywords...",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-transparent focus:border-primary/20 rounded-[22px] text-sm font-bold placeholder:text-slate-400 focus:outline-none transition-all shadow-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide custom-scrollbar", children: categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setActiveCategory(cat.id),
                  className: `flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${isActive ? "bg-primary text-white border-primary shadow-lg shadow-primary/25" : "bg-white/50 text-slate-600 border-white/80 hover:bg-white/80"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14, className: isActive ? "animate-bounce" : "" }),
                    cat.id
                  ]
                },
                cat.id
              );
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onScroll: handleScroll,
            className: "flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 bg-slate-50/20 scrollbar-hide",
            children: [
              filteredPrompts.slice(0, page * itemsPerPage).length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6", children: filteredPrompts.slice(0, page * itemsPerPage).map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: idx % 20 * 0.02 },
                  className: "group relative bg-white/70 hover:bg-white rounded-[24px] p-5 sm:p-6 border border-white/80 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col min-h-[180px]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-lg border border-primary/5", children: p.category }),
                        recent.includes(p.id) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 bg-green-500/10 text-green-600 text-[8px] font-black uppercase tracking-widest rounded-lg", children: "Recently Used" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => toggleFavorite(p.id),
                          className: `p-2 rounded-xl transition-all ${favorites.includes(p.id) ? "bg-red-50 text-red-500 scale-110 shadow-sm" : "bg-slate-50 text-slate-400 hover:text-slate-600"}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 16, fill: favorites.includes(p.id) ? "currentColor" : "none" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-extrabold text-slate-800 text-[15px] mb-2 leading-tight group-hover:text-primary transition-colors", children: p.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 font-semibold leading-relaxed mb-5 line-clamp-3 opacity-80 group-hover:opacity-100", children: p.prompt }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => handleSelect(p.prompt, p.id),
                        className: "w-full py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-md shadow-primary/25",
                        children: [
                          "Use Prompt",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
                        ]
                      }
                    ) })
                  ]
                },
                `${p.id}-${idx}`
              )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full py-20 opacity-30 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 64, className: "text-slate-400 mb-6" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-black text-slate-900 uppercase tracking-widest", children: "No matching prompts" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-500 mt-1", children: 'Try broadening your search or choosing "All"' })
              ] }),
              filteredPrompts.length > page * itemsPerPage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/40 border border-white/60 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" }),
                "Scanning more masterpieces..."
              ] }) })
            ]
          }
        )
      ]
    }
  ) }) });
};
export {
  PromptLibraryModal as P,
  useMotionTemplate as u
};
