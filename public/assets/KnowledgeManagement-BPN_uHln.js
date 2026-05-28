import { c as createLucideIcon, r as reactExports, a as apiService, z as zt, j as jsxRuntimeExports, ai as LoaderCircle, A as AnimatePresence, m as motion, G as Globe, F as FileText, X, R as RefreshCw, u as Search, E as ExternalLink, T as Trash2, K as BookOpen, D as DeleteConfirmModal, b as Clock, C as CircleAlert, o as CircleCheckBig } from "./index-PWHJcNR8.js";
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
];
const EllipsisVertical = createLucideIcon("EllipsisVertical", __iconNode);
const KnowledgeManagement = () => {
  const [loading, setLoading] = reactExports.useState(true);
  const [knowledgeList, setKnowledgeList] = reactExports.useState({ documents: [], sources: [] });
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterType, setFilterType] = reactExports.useState("all");
  const [isRefreshing, setIsRefreshing] = reactExports.useState(false);
  const [viewMode, setViewMode] = reactExports.useState("table");
  const [selectedItem, setSelectedItem] = reactExports.useState(null);
  const [deleteModal, setDeleteModal] = reactExports.useState({ isOpen: false, type: null, id: null });
  const fetchKnowledge = reactExports.useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getKnowledgeList();
      if (data.success) {
        setKnowledgeList(data.data);
      }
    } catch (error) {
      zt.error("Failed to load knowledge assets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchKnowledge();
    setIsRefreshing(false);
    zt.success("Knowledge list updated");
  };
  const handleDeleteDoc = async () => {
    if (!deleteModal.id) return;
    try {
      await apiService.deleteKnowledgeDocument(deleteModal.id);
      zt.success("Document removed");
      setDeleteModal({ isOpen: false, type: null, id: null });
      fetchKnowledge();
    } catch (error) {
      zt.error("Delete failed");
      setDeleteModal({ isOpen: false, type: null, id: null });
    }
  };
  const handleDeleteSource = async () => {
    if (!deleteModal.id) return;
    try {
      await apiService.deleteKnowledgeSource(deleteModal.id);
      zt.success("Source removed");
      setDeleteModal({ isOpen: false, type: null, id: null });
      fetchKnowledge();
    } catch (error) {
      zt.error("Delete failed");
      setDeleteModal({ isOpen: false, type: null, id: null });
    }
  };
  const handleConfirmDelete = () => {
    if (deleteModal.type === "source") handleDeleteSource();
    else handleDeleteDoc();
  };
  const handleReindex = async (id) => {
    try {
      await apiService.reindexDocument(id);
      zt.success("Re-indexing started in background");
      fetchKnowledge();
    } catch (error) {
      zt.error("Process failed to start");
    }
  };
  const handleRecrawl = async (id) => {
    try {
      await apiService.recrawlSource({ id });
      zt.success("Re-crawl triggered");
      fetchKnowledge();
    } catch (error) {
      zt.error("Process failed");
    }
  };
  const allItems = [
    ...knowledgeList.documents.map((doc) => {
      var _a, _b, _c;
      return {
        id: doc._id,
        name: doc.filename,
        type: ((_a = doc.mimetype) == null ? void 0 : _a.includes("pdf")) ? "PDF" : ((_b = doc.mimetype) == null ? void 0 : _b.includes("word")) ? "DOC" : ((_c = doc.mimetype) == null ? void 0 : _c.includes("text")) ? "TXT" : doc.sourceUrl ? "URL_PAGE" : "DOC",
        date: doc.uploadDate,
        chunks: doc.totalChunks || "Auto",
        status: doc.status || "Active",
        category: doc.category,
        raw: doc,
        isSource: false
      };
    }),
    ...knowledgeList.sources.map((src) => ({
      id: src._id,
      name: src.url,
      type: "URL_SOURCE",
      date: src.createdAt,
      chunks: src.pages_indexed || 0,
      status: src.status === "active" ? "Active" : "Paused",
      category: src.category || "GENERAL",
      raw: src,
      isSource: true
    }))
  ];
  const filteredItems = allItems.filter((item) => {
    var _a;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || ((_a = item.category) == null ? void 0 : _a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === "all" || filterType === "document" && !item.isSource || filterType === "website" && item.isSource || item.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5 text-emerald-500" });
      case "indexing":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 text-blue-500 animate-spin" });
      case "pending":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-amber-500" });
      case "error":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 text-red-500" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-slate-500" });
    }
  };
  if (loading && !isRefreshing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 grayscale opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext font-medium", children: "Loading knowledge base..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedItem && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm",
        onClick: () => setSelectedItem(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { scale: 0.95, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.95, opacity: 0 },
            className: "bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary", children: selectedItem.isSource ? /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-6 h-6" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black text-white truncate max-w-[400px]", children: selectedItem.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext text-xs font-bold uppercase tracking-widest", children: selectedItem.type })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedItem(null), className: "p-2 hover:bg-white/5 rounded-full text-subtext transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-6 h-6" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6 mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-subtext uppercase tracking-widest", children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    getStatusIcon(selectedItem.status),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white", children: selectedItem.status })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-subtext uppercase tracking-widest", children: "Date Added" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white", children: new Date(selectedItem.date).toLocaleString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-subtext uppercase tracking-widest", children: "Category" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white", children: selectedItem.category })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-subtext uppercase tracking-widest", children: selectedItem.isSource ? "Pages Indexed" : "Chunks" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white", children: selectedItem.chunks })
                ] })
              ] }),
              selectedItem.raw.gcsUri && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/40 rounded-2xl p-4 border border-white/5 mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-subtext uppercase tracking-widest mb-1", children: "Retrieval URI (GCS)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-primary break-all", children: selectedItem.raw.gcsUri })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => {
                      if (selectedItem.isSource) handleRecrawl(selectedItem.id);
                      else handleReindex(selectedItem.id);
                      setSelectedItem(null);
                    },
                    className: "flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
                      selectedItem.isSource ? "Recrawl Now" : "Re-index Assets"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      if (selectedItem.isSource) setDeleteModal({ isOpen: true, type: "source", id: selectedItem.id });
                      else setDeleteModal({ isOpen: true, type: "doc", id: selectedItem.id });
                      setSelectedItem(null);
                    },
                    className: "px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all",
                    children: "Delete"
                  }
                )
              ] })
            ]
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4 bg-white/30 dark:bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search document name, category, or URL...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full bg-black/10 dark:bg-black/20 border border-white/10 rounded-xl py-2 pl-11 pr-4 text-sm outline-none focus:border-primary/50 transition-all text-maintext"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full md:w-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: filterType,
            onChange: (e) => setFilterType(e.target.value),
            className: "bg-black/10 dark:bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none text-maintext",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Sources" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "document", children: "Documents" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "website", children: "Websites" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pdf", children: "PDF Files" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleRefresh,
            disabled: isRefreshing,
            className: "p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 text-maintext ${isRefreshing ? "animate-spin" : ""}` })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden overflow-x-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse min-w-[800px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-white/5 border-b border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtext", children: "Source Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtext", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtext", children: "Upload Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtext text-center", children: "Chunks/Pages" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtext", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-xs font-bold uppercase tracking-wider text-subtext text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: filteredItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.tr,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "hover:bg-white/5 transition-colors group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.isSource ? "bg-indigo-500/10 text-indigo-400" : "bg-blue-500/10 text-blue-400"}`, children: item.isSource ? /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[250px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-maintext truncate", title: item.name, children: item.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[9px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded ${item.category === "LEGAL" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : item.category === "FINANCE" ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`, children: item.category || "GENERAL" }) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black bg-white/10 px-2 py-0.5 rounded-full text-slate-300", children: item.type }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext font-medium", children: new Date(item.date).toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-maintext", children: item.chunks }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                getStatusIcon(item.status),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-maintext", children: item.status })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1 transition-opacity", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setSelectedItem(item),
                    className: "p-2 text-subtext hover:text-primary hover:bg-primary/10 rounded-md transition-all",
                    title: "View Details",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "w-4 h-4" })
                  }
                ),
                item.isSource ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleRecrawl(item.id),
                    className: "p-2 text-subtext hover:text-indigo-400 hover:bg-indigo-400/10 rounded-md transition-all",
                    title: "Recrawl Website",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" })
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleReindex(item.id),
                    className: "p-2 text-subtext hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-all",
                    title: "Re-index Document",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" })
                  }
                ),
                !item.isSource && item.raw.gcsUri && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      var _a;
                      const user = JSON.parse(localStorage.getItem("user") || "{}");
                      const token = user.token || "";
                      const baseUrl = ((_a = window._env_) == null ? void 0 : _a.VITE_AISA_BACKEND_API) || "http://localhost:8080/api";
                      window.open(`${baseUrl}/aibase/knowledge/download/${item.id}?token=${token}`, "_blank");
                    },
                    className: "p-2 text-subtext hover:text-emerald-400 hover:bg-emerald-400/10 rounded-md transition-all",
                    title: "View Raw",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => item.isSource ? setDeleteModal({ isOpen: true, type: "source", id: item.id }) : setDeleteModal({ isOpen: true, type: "doc", id: item.id }),
                    className: "p-2 text-subtext hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all",
                    title: "Delete Permanently",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] }) })
            ]
          },
          item.id
        )) })
      ] }),
      filteredItems.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 text-white/5 mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext font-medium", children: "No knowledge assets found matches your criteria." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmModal,
      {
        isOpen: deleteModal.isOpen,
        onClose: () => setDeleteModal({ isOpen: false, type: null, id: null }),
        onConfirm: handleConfirmDelete,
        title: deleteModal.type === "source" ? "Delete Source?" : "Delete Document?",
        description: deleteModal.type === "source" ? "Are you sure you want to delete this website source and all crawled pages? This cannot be undone." : "Are you sure you want to delete this document and all its embeddings? This cannot be undone."
      }
    )
  ] });
};
export {
  KnowledgeManagement as default
};
