import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, c9 as Link, A as AnimatePresence, m as motion, ca as File, X, f as Loader, G as Globe, o as CircleCheckBig, a as apiService } from "./index-HfKBlv-o.js";
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 13v8", key: "1l5pq0" }],
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", key: "1pljnt" }],
  ["path", { d: "m8 17 4-4 4 4", key: "1quai1" }]
];
const CloudUpload = createLucideIcon("CloudUpload", __iconNode);
const KnowledgeUpload = ({ onUploadSuccess }) => {
  const [activeTab, setActiveTab] = reactExports.useState("file");
  const [file, setFile] = reactExports.useState(null);
  const [url, setUrl] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("LEGAL");
  const [isDragActive, setIsDragActive] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [uploadStatus, setUploadStatus] = reactExports.useState(null);
  const [errorMessage, setErrorMessage] = reactExports.useState("");
  const handleDragEnter = reactExports.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);
  const handleDragLeave = reactExports.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);
  const handleDrop = reactExports.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setUploadStatus(null);
    }
  }, []);
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadStatus(null);
    }
  };
  const handleUpload = async () => {
    var _a, _b;
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
    setErrorMessage("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    try {
      const data = await apiService.uploadKnowledgeDocument(formData, (percent) => {
        setUploadProgress(percent);
      });
      if (data.success) {
        setUploadStatus("success");
        if (onUploadSuccess) onUploadSuccess(data.data);
      }
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  };
  const [crawlDepth, setCrawlDepth] = reactExports.useState(2);
  const [maxPages, setMaxPages] = reactExports.useState(20);
  const [frequency, setFrequency] = reactExports.useState("daily");
  const handleUrlUpload = async () => {
    var _a, _b;
    if (!url) return;
    setIsUploading(true);
    setUploadStatus(null);
    setErrorMessage("");
    try {
      const data = await apiService.uploadKnowledgeUrl({
        url,
        category,
        depth: crawlDepth,
        maxPages,
        frequency
      });
      if (data.success) {
        setUploadStatus("success");
        setUrl("");
        if (onUploadSuccess) onUploadSuccess(data.data);
      }
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Failed to process URL.");
    } finally {
      setIsUploading(false);
    }
  };
  const resetUpload = () => {
    setFile(null);
    setUrl("");
    setUploadStatus(null);
    setUploadProgress(0);
    setErrorMessage("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl p-5 transition-all", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center gap-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-maintext", children: "AISA RAG Knowledge Base" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext text-sm mt-2", children: "Add knowledge to your chatbot by uploading documents or submitted website links." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-white/10 p-1.5 rounded-xl border border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-subtext ml-2", children: "Target Category:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: category,
              onChange: (e) => setCategory(e.target.value),
              className: "bg-primary/20 text-primary border border-primary/30 rounded-lg px-3 py-1.5 text-xs font-bold outline-none hover:bg-primary/30 transition-all cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "LEGAL", children: "LEGAL (Law/Pro)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "FINANCE", children: "FINANCE (Markets/Books)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "GENERAL", children: "GENERAL (Public)" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-white/10 p-1 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setActiveTab("file");
                resetUpload();
              },
              className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "file" ? "bg-primary text-white shadow-lg" : "text-subtext hover:text-maintext"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "w-4 h-4" }),
                " File Upload"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setActiveTab("url");
                resetUpload();
              },
              className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "url" ? "bg-primary text-white shadow-lg" : "text-subtext hover:text-maintext"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "w-4 h-4" }),
                " URL Upload"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
      !uploadStatus && activeTab === "file" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 },
          children: [
            !file && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ease-out cursor-pointer group hover:bg-slate-800/50 ${isDragActive ? "border-primary bg-slate-800/80" : "border-slate-600 bg-slate-800/30"}`,
                onDragEnter: handleDragEnter,
                onDragOver: handleDragEnter,
                onDragLeave: handleDragLeave,
                onDrop: handleDrop,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "file",
                      className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10",
                      onChange: handleFileChange,
                      accept: ".pdf,.docx,.xlsx,.pptx,.txt,.csv,image/*"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      animate: { y: isDragActive ? -10 : 0, scale: isDragActive ? 1.1 : 1 },
                      className: "w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/30 transition-all",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "w-8 h-8 text-primary" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-200 font-medium text-lg", children: isDragActive ? "Drop document here" : "Drag & drop document" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-sm mt-2 font-medium", children: "or click to browse from device" })
                ]
              }
            ),
            file && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "w-6 h-6 text-blue-400" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-200 font-medium truncate max-w-[200px] sm:max-w-xs", children: file.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 text-xs", children: [
                      (file.size / (1024 * 1024)).toFixed(2),
                      " MB"
                    ] })
                  ] })
                ] }),
                !isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: resetUpload,
                    className: "p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
                  }
                )
              ] }),
              isUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs font-medium text-slate-400 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Uploading to Google Cloud Storage..." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    uploadProgress,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { width: 0 },
                    animate: { width: `${uploadProgress}%` },
                    className: "h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleUpload,
                  disabled: isUploading,
                  className: `w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${isUploading ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-primary hover:opacity-90 text-white shadow-lg shadow-primary/25"}`,
                  children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "w-5 h-5 animate-spin" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Processing..." })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Upload to Knowledge Base" })
                }
              )
            ] })
          ]
        },
        "file-tab"
      ),
      !uploadStatus && activeTab === "url" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
          className: "space-y-4",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Website URL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "url",
                    placeholder: "https://example.com/article",
                    value: url,
                    onChange: (e) => setUrl(e.target.value),
                    className: "w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 pl-12 pr-4 text-slate-200 outline-none focus:border-primary transition-colors"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-500 mt-2", children: "Tip: Provide a root domain (e.g., https://example.com) to automatically crawl up to 20 internal pages." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2", children: "Update Frequency" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: frequency,
                    onChange: (e) => setFrequency(e.target.value),
                    className: "w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 outline-none focus:border-primary transition-colors text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "daily", children: "Daily" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "weekly", children: "Weekly" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "monthly", children: "Monthly" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "manual", children: "Manual Only" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2", children: "Crawl Depth" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: crawlDepth,
                    onChange: (e) => setCrawlDepth(Number(e.target.value)),
                    className: "w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 outline-none focus:border-primary transition-colors text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 1, children: "1 (This link only)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 2, children: "2 (Follow internal links)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 3, children: "3 (Deep crawl)" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleUrlUpload,
                disabled: isUploading || !url,
                className: `w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${isUploading || !url ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-primary hover:opacity-90 text-white shadow-lg shadow-primary/25"}`,
                children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "w-5 h-5 animate-spin" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Scraping & Ingesting..." })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add to Knowledge Base" })
              }
            )
          ] })
        },
        "url-tab"
      ),
      uploadStatus === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          className: "bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl flex flex-col items-center justify-center text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { scale: 0 },
                animate: { scale: 1 },
                transition: { type: "spring", stiffness: 200, delay: 0.1 },
                className: "w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-8 h-8 text-emerald-400" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-emerald-400 mb-2", children: "Success!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-300 mb-6 font-medium", children: "Knowledge has been added and indexed successfully." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: resetUpload,
                className: "px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium border border-slate-700",
                children: "Add More"
              }
            )
          ]
        },
        "success-msg"
      ),
      uploadStatus === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          className: "bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-6 h-6 text-red-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-red-400 mb-2", children: "Ingestion Failed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-300 text-sm mb-6", children: errorMessage }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: resetUpload,
                className: "px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium border border-slate-700",
                children: "Try Again"
              }
            )
          ]
        },
        "error-msg"
      )
    ] }) })
  ] });
};
export {
  KnowledgeUpload as default
};
