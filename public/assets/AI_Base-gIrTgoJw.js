import { c as createLucideIcon, r as reactExports, a as apiService, j as jsxRuntimeExports, R as RefreshCw, G as Globe, m as motion, E as ExternalLink, C as CircleAlert, L as Layers, b as Clock, d as Calendar, e as ChevronRight, f as Loader, g as CirclePlay, T as Trash2, D as DeleteConfirmModal, z as zt, h as Database, U as Upload, S as Settings, i as Sparkles, k as Shield, Z as Zap } from "./index-HfKBlv-o.js";
import KnowledgeUpload from "./KnowledgeUpload-BnsScriN.js";
import KnowledgeManagement from "./KnowledgeManagement-BuMJ6E3j.js";
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "10", x2: "10", y1: "15", y2: "9", key: "c1nkhi" }],
  ["line", { x1: "14", x2: "14", y1: "15", y2: "9", key: "h65svq" }]
];
const CirclePause = createLucideIcon("CirclePause", __iconNode$1);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 18h.01", key: "1tta3j" }],
  ["path", { d: "M3 6h.01", key: "1rqtza" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 18h13", key: "1lx6n3" }],
  ["path", { d: "M8 6h13", key: "ik3vkj" }]
];
const List = createLucideIcon("List", __iconNode);
const KnowledgeSourceManager = () => {
  const [sources, setSources] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [actionLoading, setActionLoading] = reactExports.useState(null);
  const [deleteModal, setDeleteModal] = reactExports.useState({ isOpen: false, id: null });
  const fetchSources = reactExports.useCallback(async () => {
    try {
      const result = await apiService.getKnowledgeSources();
      if (result.success) setSources(result.data);
    } catch (error) {
      console.error("Failed to fetch sources", error);
    } finally {
      setLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
    fetchSources();
    const interval = setInterval(fetchSources, 3e4);
    return () => clearInterval(interval);
  }, [fetchSources]);
  const handleRecrawl = async (id) => {
    setActionLoading(id);
    try {
      await apiService.recrawlSource(id);
      zt.success("Recrawl triggered in background");
      fetchSources();
    } catch (error) {
      zt.error("Failed to trigger recrawl");
    } finally {
      setActionLoading(null);
    }
  };
  const handleToggleStatus = async (source) => {
    const newStatus = source.status === "active" ? "paused" : "active";
    try {
      await apiService.updateKnowledgeSource(source._id, { status: newStatus });
      zt.success(`Source ${newStatus}`);
      fetchSources();
    } catch (error) {
      zt.error("Failed to update status");
    }
  };
  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await apiService.deleteKnowledgeSource(deleteModal.id);
      zt.success("Source and pages deleted");
      setDeleteModal({ isOpen: false, id: null });
      fetchSources();
    } catch (error) {
      zt.error("Failed to delete source");
      setDeleteModal({ isOpen: false, id: null });
    }
  };
  const getFrequencyLabel = (freq) => {
    return freq.charAt(0).toUpperCase() + freq.slice(1);
  };
  if (loading && sources.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-8 h-8 text-primary animate-spin" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-maintext flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-5 h-5 text-primary" }),
        " Managed Websites (Auto-Crawl)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: fetchSources,
          className: "p-2 hover:bg-white/10 rounded-lg transition-all text-subtext",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 ${loading ? "animate-spin" : ""}` })
        }
      )
    ] }),
    sources.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext", children: "No automated websites added yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext/60 mt-2", children: 'Use the "URL Upload" tab to add a root domain for periodic crawling.' })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: sources.map((source) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        layout: true,
        className: "bg-white/10 dark:bg-black/20 border border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-all group",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${source.status === "error" ? "bg-red-500/10" : "bg-primary/10"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: `w-6 h-6 ${source.status === "error" ? "text-red-400" : "text-primary"}` }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-maintext truncate max-w-md", title: source.url, children: source.domain }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${source.status === "active" ? "bg-emerald-500/10 text-emerald-500" : source.status === "paused" ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"}`, children: source.status }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-white/5 text-subtext px-2 py-0.5 rounded-full font-bold", children: getFrequencyLabel(source.update_frequency) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-subtext truncate mt-1 flex items-center gap-1", children: [
                source.url,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: source.url, target: "_blank", rel: "noreferrer", className: "inline-block hover:text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }) })
              ] }),
              source.last_error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3 text-red-400 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-red-400 font-medium truncate", children: source.last_error })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-4 lg:gap-8 px-4 lg:px-0 lg:border-l lg:border-white/10 lg:pl-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-bold text-subtext uppercase tracking-wider flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-3 h-3" }),
                " Pages"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black text-maintext", children: source.pages_indexed || 0 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-bold text-subtext uppercase tracking-wider flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                " Last Crawl"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black text-maintext", children: source.last_crawled_at ? new Date(source.last_crawled_at).toLocaleDateString() : "Never" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-bold text-subtext uppercase tracking-wider flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                " Next Crawl"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black text-primary", children: source.next_crawl_at ? new Date(source.next_crawl_at).toLocaleDateString() : "Pending" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-bold text-subtext uppercase tracking-wider flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" }),
                " Settings"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-black text-subtext/60", children: [
                "D:",
                source.crawl_depth,
                " P:",
                source.max_pages
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 lg:pl-8 lg:border-l lg:border-white/10 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleRecrawl(source._id),
                disabled: actionLoading === source._id,
                className: "p-3 bg-white/5 hover:bg-primary/10 text-subtext hover:text-primary rounded-xl transition-all",
                title: "Recrawl Now",
                children: actionLoading === source._id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleToggleStatus(source),
                className: "p-3 bg-white/5 hover:bg-amber-500/10 text-subtext hover:text-amber-500 rounded-xl transition-all",
                title: source.status === "active" ? "Pause" : "Resume",
                children: source.status === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePause, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setDeleteModal({ isOpen: true, id: source._id }),
                className: "p-3 bg-white/5 hover:bg-red-500/10 text-subtext hover:text-red-500 rounded-xl transition-all",
                title: "Delete Source",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] })
        ] })
      },
      source._id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmModal,
      {
        isOpen: deleteModal.isOpen,
        onClose: () => setDeleteModal({ isOpen: false, id: null }),
        onConfirm: handleDelete,
        title: "Delete Source?",
        description: "Are you sure? This will delete the source tracking AND all associated knowledge pages. This cannot be undone."
      }
    )
  ] });
};
const AiBase = () => {
  const [activeTab, setActiveTab] = reactExports.useState("manage");
  const [refreshTrigger, setRefreshTrigger] = reactExports.useState(0);
  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab("manage");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4 bg-white/40 dark:bg-black/20 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 40, className: "stroke-[1.5]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-black text-maintext tracking-tight uppercase italic", children: [
              "AISA ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary italic", children: "BASE" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20", children: "RAG Engine V2.0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext text-sm font-bold mt-1 max-w-md", children: "The core intelligence center of AISA. Upload documents and crawl websites to power your custom AI knowledge base." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/5 dark:border-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("manage"),
            className: `flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "manage" ? "bg-white dark:bg-primary text-primary dark:text-white shadow-lg" : "text-subtext hover:text-maintext"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(List, { size: 14 }),
              " Assets Library"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("upload"),
            className: `flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "upload" ? "bg-white dark:bg-primary text-primary dark:text-white shadow-lg" : "text-subtext hover:text-maintext"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 14 }),
              " Ingest Data"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("sources"),
            className: `flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "sources" ? "bg-white dark:bg-primary text-primary dark:text-white shadow-lg" : "text-subtext hover:text-maintext"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 14 }),
              " Source Manager"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
        children: activeTab === "upload" ? /* @__PURE__ */ jsxRuntimeExports.jsx(KnowledgeUpload, { onUploadSuccess: handleUploadSuccess }) : activeTab === "manage" ? /* @__PURE__ */ jsxRuntimeExports.jsx(KnowledgeManagement, {}, refreshTrigger) : /* @__PURE__ */ jsxRuntimeExports.jsx(KnowledgeSourceManager, {})
      },
      activeTab
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-subtext uppercase tracking-widest", children: "Embedding Quality" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-black text-maintext italic uppercase", children: "Lossless Hybrid" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-subtext uppercase tracking-widest", children: "Storage Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-black text-maintext italic uppercase", children: "Secure GCS" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-subtext uppercase tracking-widest", children: "Indexing Speed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-black text-maintext italic uppercase", children: "Turbo-Sync" })
        ] })
      ] })
    ] })
  ] });
};
export {
  AiBase as default
};
