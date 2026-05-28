var _a;
import { c as createLucideIcon, r as reactExports, ac as lookup, v as axios, ad as reactDomExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion, ae as TrendingUp, af as Minimize2, ag as Maximize2, X, ah as ChevronDown, _ as Check, ai as LoaderCircle, u as Search, O as Activity, C as CircleAlert, i as Sparkles, B as ChartColumn, aj as ResponsiveContainer, ak as Tooltip, E as ExternalLink, Z as Zap, K as BookOpen, e as ChevronRight, k as Shield, G as Globe, al as Markdown, a as apiService, $ as React } from "./index-HfKBlv-o.js";
import { M as Maximize } from "./maximize-DW9HWk7S.js";
import { A as AreaChart, X as XAxis, Y as YAxis, a as Area } from "./AreaChart-D0dRj8hr.js";
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
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("Award", __iconNode);
const baseURL = ((_a = window._env_) == null ? void 0 : _a.VITE_AISA_BACKEND_API) || "http://localhost:8080/api";
const PRESET_STOCKS = [
  { symbol: "TCS.BSE", name: "Tata Consultancy", region: "IN" },
  { symbol: "RELIANCE.BSE", name: "Reliance Ind.", region: "IN" },
  { symbol: "HDFCBANK.BSE", name: "HDFC Bank", region: "IN" },
  { symbol: "INFY.BSE", name: "Infosys Ltd", region: "IN" },
  { symbol: "ICICIBANK.BSE", name: "ICICI Bank", region: "IN" },
  { symbol: "TCS.NSE", name: "Tata Consultancy", region: "IN" },
  { symbol: "RELIANCE.NSE", name: "Reliance Ind.", region: "IN" },
  { symbol: "HDFCBANK.NSE", name: "HDFC Bank", region: "IN" },
  { symbol: "INFY.NSE", name: "Infosys Ltd", region: "IN" },
  { symbol: "ICICIBANK.NSE", name: "ICICI Bank", region: "IN" }
  //   { symbol: 'AAPL', name: 'Apple Inc.', region: 'US' },
  //   { symbol: 'MSFT', name: 'Microsoft Corp.', region: 'US' },
  //   { symbol: 'NVDA', name: 'NVIDIA Corp.', region: 'US' }
];
const TradingViewWidget = ({ symbol, interval = "D", containerId = "tv_chart_container", isDarkMode = false }) => {
  const containerRef = React.useRef(null);
  reactExports.useEffect(() => {
    let tvSymbol = "BSE:SENSEX";
    if (symbol) {
      const cleanSymbol = symbol.split(".")[0];
      if (symbol.includes(".BSE")) tvSymbol = `BSE:${cleanSymbol}`;
      else if (symbol.includes(".NSE")) tvSymbol = `NSE:${cleanSymbol}`;
      else if (!symbol.includes(".")) tvSymbol = `NASDAQ:${cleanSymbol}`;
      else tvSymbol = symbol;
    }
    const currentContainer = containerRef.current;
    if (!currentContainer) return;
    currentContainer.innerHTML = "";
    let isMounted = true;
    const initWidget = () => {
      if (!isMounted || !containerRef.current || !window.TradingView) return;
      try {
        new window.TradingView.widget({
          "autosize": true,
          "symbol": tvSymbol,
          "interval": interval,
          "timezone": "Asia/Kolkata",
          "theme": isDarkMode ? "dark" : "light",
          "style": "1",
          "locale": "en",
          "backgroundColor": isDarkMode ? "#161B2E" : "#ffffff",
          "toolbar_bg": isDarkMode ? "#161B2E" : "#f1f3f6",
          "enable_publishing": false,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "container_id": containerId,
          "studies": ["Volume@tv-basicstudies"],
          "show_popup_button": true,
          "popup_width": "1000",
          "popup_height": "650"
        });
      } catch (e) {
      }
    };
    if (window.TradingView) {
      initWidget();
    } else {
      const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (existingScript) {
        existingScript.addEventListener("load", initWidget);
      } else {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = initWidget;
        document.head.appendChild(script);
      }
    }
    return () => {
      isMounted = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, interval, containerId, isDarkMode]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: containerRef, id: containerId, className: "w-full h-full" });
};
const COUNTRIES = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" }
];
const CashFlowStockModal = ({ isOpen, onClose, onSelect, isDarkMode, initialStock }) => {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [searchResults, setSearchResults] = reactExports.useState([]);
  const [isSearching, setIsSearching] = reactExports.useState(false);
  const [selectedCountry, setSelectedCountry] = reactExports.useState("IN");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = reactExports.useState(false);
  const [selectedStock, setSelectedStock] = reactExports.useState(PRESET_STOCKS[0]);
  const [activeTab, setActiveTab] = reactExports.useState("Realtime chart");
  const [isStockSelectOpen, setIsStockSelectOpen] = reactExports.useState(false);
  const [chartInterval, setChartInterval] = reactExports.useState("D");
  const [fullScreenChart, setFullScreenChart] = reactExports.useState(null);
  const [chartType, setChartType] = reactExports.useState("tradingview");
  const [cashflowCost, setCashflowCost] = reactExports.useState(5);
  const [isMaximized, setIsMaximized] = reactExports.useState(false);
  const [tabData, setTabData] = reactExports.useState({
    "Realtime chart": null,
    "News": null,
    "Historical chart": null,
    "Advisory": null,
    "Research and recommendation": null
  });
  const [isLoadingTab, setIsLoadingTab] = reactExports.useState(false);
  const [tabError, setTabError] = reactExports.useState(null);
  const [grahamData, setGrahamData] = reactExports.useState(null);
  const [isGrahamLoading, setIsGrahamLoading] = reactExports.useState(false);
  const [showGrahamPanel, setShowGrahamPanel] = reactExports.useState(false);
  const [kiyosakiData, setKiyosakiData] = reactExports.useState(null);
  const [isKiyosakiLoading, setIsKiyosakiLoading] = reactExports.useState(false);
  const [showKiyosakiPanel, setShowKiyosakiPanel] = reactExports.useState(false);
  const [socket, setSocket] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (isOpen && !socket) {
      const wsUrl = baseURL.replace("/api", "");
      const newSocket = lookup(wsUrl, {
        path: "/api/socket.io",
        transports: ["websocket", "polling"]
      });
      setSocket(newSocket);
    }
    if (!isOpen && socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [isOpen]);
  reactExports.useEffect(() => {
    if (isOpen && initialStock) {
      setSelectedStock(initialStock);
    }
  }, [isOpen, initialStock]);
  reactExports.useEffect(() => {
    const fetchCost = async () => {
      try {
        const res = await apiService.getPublicFeatureCosts();
        if (res.success && res.features) {
          const feature = res.features.find((f) => f.featureKey === "ai_cashflow");
          if (feature) setCashflowCost(feature.cost);
        }
      } catch (err) {
        console.error("Failed to load cashflow cost", err);
      }
    };
    if (isOpen) fetchCost();
  }, [isOpen]);
  reactExports.useEffect(() => {
    if (isOpen && selectedStock) {
      setTabData({
        "Realtime chart": null,
        "News": null,
        "Historical chart": null,
        "Advisory": null,
        "Research and recommendation": null
      });
      setActiveTab("Realtime chart");
      setGrahamData(null);
      setShowGrahamPanel(false);
      setKiyosakiData(null);
      setShowKiyosakiPanel(false);
    }
  }, [isOpen, selectedStock]);
  reactExports.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  const handleSearch = async () => {
    var _a3;
    setIsSearching(true);
    try {
      const token = (_a3 = JSON.parse(localStorage.getItem("user") || "{}")) == null ? void 0 : _a3.token;
      const res = await axios.get(`${baseURL}/cashflow/search`, {
        params: { keywords: searchTerm },
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (Array.isArray(res.data)) {
        setSearchResults(res.data);
      }
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setIsSearching(false);
    }
  };
  reactExports.useEffect(() => {
    var _a3, _b2, _c2;
    if (!isOpen || !selectedStock) return;
    const token = (_a3 = JSON.parse(localStorage.getItem("user") || "{}")) == null ? void 0 : _a3.token;
    const headers = { "Authorization": `Bearer ${token}` };
    const params = { symbol: selectedStock.symbol };
    if (!window.hasAICashFlowLoaded) {
      params.isInitialLoad = "true";
      window.hasAICashFlowLoaded = true;
    }
    if (activeTab === "Realtime chart") {
      if ((_b2 = tabData["Realtime chart"]) == null ? void 0 : _b2.intraday) {
        if (socket) {
          socket.emit("subscribe_realtime", { symbol: selectedStock.symbol });
          const handleRealtime = (data) => {
            setTabData((prev) => {
              var _a4;
              return {
                ...prev,
                "Realtime chart": { quote: data.quote, intraday: ((_a4 = prev["Realtime chart"]) == null ? void 0 : _a4.intraday) || [] }
              };
            });
          };
          socket.on("realtime_update", handleRealtime);
          return () => socket.off("realtime_update", handleRealtime);
        }
        return;
      }
      setIsLoadingTab(true);
      setTabError(null);
      axios.get(`${baseURL}/stock/intraday`, { params, headers }).then((res) => {
        setTabData((prev) => {
          var _a4;
          return { ...prev, "Realtime chart": { quote: (_a4 = prev["Realtime chart"]) == null ? void 0 : _a4.quote, intraday: res.data.intraday } };
        });
        setIsLoadingTab(false);
      }).catch((err) => {
        var _a4, _b3, _c3;
        setIsLoadingTab(false);
        if (((_a4 = err.response) == null ? void 0 : _a4.status) === 403 && ((_c3 = (_b3 = err.response) == null ? void 0 : _b3.data) == null ? void 0 : _c3.code) === "OUT_OF_CREDITS") {
          setTabError(`Insufficient Credits (Required: ${cashflowCost})`);
        } else {
          setTabError(`Failed to load intraday data.`);
        }
      });
      if (socket) {
        socket.emit("subscribe_realtime", { symbol: selectedStock.symbol });
        const handleRealtime = (data) => {
          setIsLoadingTab(false);
          setTabData((prev) => {
            var _a4;
            return {
              ...prev,
              "Realtime chart": { quote: data.quote, intraday: ((_a4 = prev["Realtime chart"]) == null ? void 0 : _a4.intraday) || [] }
            };
          });
        };
        socket.on("realtime_update", handleRealtime);
        return () => socket.off("realtime_update", handleRealtime);
      }
    } else if (activeTab === "Historical chart") {
      if ((_c2 = tabData["Historical chart"]) == null ? void 0 : _c2.historical) return;
      if (socket) {
        setIsLoadingTab(true);
        setTabError(null);
        socket.emit("request_historical", { symbol: selectedStock.symbol });
        const handleHistorical = (data) => {
          setIsLoadingTab(false);
          if (data.error) setTabError(data.error);
          else setTabData((prev) => ({ ...prev, "Historical chart": { historical: data.historical } }));
        };
        socket.on("historical_data_response", handleHistorical);
        return () => socket.off("historical_data_response", handleHistorical);
      }
    } else {
      if (tabData[activeTab]) return;
      setIsLoadingTab(true);
      setTabError(null);
      let promise = null;
      if (activeTab === "News") promise = axios.get(`${baseURL}/stock/news`, { params, headers }).then((r) => ({ news: r.data.news }));
      else if (activeTab === "Advisory") promise = axios.get(`${baseURL}/stock/advisory`, { params, headers }).then((r) => ({ advisory: r.data.advisory }));
      else if (activeTab === "Research and recommendation") promise = axios.get(`${baseURL}/stock/research`, { params: { symbol: selectedStock.symbol }, headers }).then((r) => ({ research: r.data.research }));
      if (promise) {
        promise.then((result) => {
          setTabData((prev) => ({ ...prev, [activeTab]: result }));
        }).catch((err) => {
          var _a4, _b3, _c3;
          if (((_a4 = err.response) == null ? void 0 : _a4.status) === 403 && ((_c3 = (_b3 = err.response) == null ? void 0 : _b3.data) == null ? void 0 : _c3.code) === "OUT_OF_CREDITS") {
            setTabError(`Insufficient Credits (Required: ${cashflowCost})`);
          } else {
            setTabError(`Failed to load ${activeTab}.`);
          }
        }).finally(() => setIsLoadingTab(false));
      }
    }
  }, [activeTab, selectedStock, isOpen, socket]);
  const fetchGrahamAnalysis = async () => {
    var _a3, _b2, _c2;
    if (grahamData || isGrahamLoading) return;
    setIsGrahamLoading(true);
    setShowGrahamPanel(true);
    try {
      const token = (_a3 = JSON.parse(localStorage.getItem("user") || "{}")) == null ? void 0 : _a3.token;
      const price = ((_c2 = (_b2 = tabData["Realtime chart"]) == null ? void 0 : _b2.quote) == null ? void 0 : _c2.price) || "";
      const res = await axios.get(`${baseURL}/stock/graham-analysis`, {
        params: { symbol: selectedStock.symbol, name: selectedStock.name, price },
        headers: { "Authorization": `Bearer ${token}` }
      });
      setGrahamData(res.data.graham);
    } catch (err) {
      console.error("[Graham] Analysis failed:", err);
    } finally {
      setIsGrahamLoading(false);
    }
  };
  const fetchKiyosakiAnalysis = async () => {
    var _a3, _b2, _c2;
    if (kiyosakiData || isKiyosakiLoading) return;
    setIsKiyosakiLoading(true);
    setShowKiyosakiPanel(true);
    try {
      const token = (_a3 = JSON.parse(localStorage.getItem("user") || "{}")) == null ? void 0 : _a3.token;
      const price = ((_c2 = (_b2 = tabData["Realtime chart"]) == null ? void 0 : _b2.quote) == null ? void 0 : _c2.price) || "";
      const res = await axios.get(`${baseURL}/stock/kiyosaki-analysis`, {
        params: { symbol: selectedStock.symbol, name: selectedStock.name, price },
        headers: { "Authorization": `Bearer ${token}` }
      });
      setKiyosakiData(res.data.kiyosaki);
    } catch (err) {
      console.error("[Kiyosaki] Analysis failed:", err);
    } finally {
      setIsKiyosakiLoading(false);
    }
  };
  const getRelativeTime = (timeStr) => {
    if (!timeStr) return "";
    try {
      const pubDate = new Date(timeStr);
      const diffInMs = /* @__PURE__ */ new Date() - pubDate;
      const diffInHours = Math.floor(diffInMs / (1e3 * 60 * 60));
      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours}h ago`;
      return `${Math.floor(diffInHours / 24)}d ago`;
    } catch (e) {
      return "";
    }
  };
  const currencySymbol = reactExports.useMemo(() => {
    var _a3, _b2;
    if (((_b2 = (_a3 = tabData["Realtime chart"]) == null ? void 0 : _a3.quote) == null ? void 0 : _b2.currency) === "INR") return "₹";
    if ((selectedStock == null ? void 0 : selectedStock.region) === "IN" || (selectedStock == null ? void 0 : selectedStock.symbol.includes(".BSE")) || (selectedStock == null ? void 0 : selectedStock.symbol.includes(".NSE")) || (selectedStock == null ? void 0 : selectedStock.symbol.endsWith(".BO")) || (selectedStock == null ? void 0 : selectedStock.symbol.endsWith(".NS"))) {
      return "₹";
    }
    return "$";
  }, [selectedStock, tabData["Realtime chart"]]);
  const realtimeLineData = reactExports.useMemo(() => {
    var _a3;
    const data = ((_a3 = tabData["Realtime chart"]) == null ? void 0 : _a3.intraday) || [];
    return data.map((d) => ({
      date: d.date.split(" ")[1] || d.date,
      // Time portion
      price: d.close
    }));
  }, [tabData["Realtime chart"]]);
  const historicalLineData = reactExports.useMemo(() => {
    var _a3;
    const data = ((_a3 = tabData["Historical chart"]) == null ? void 0 : _a3.historical) || [];
    return data.map((d) => ({
      date: d.date.split("-").slice(1).join("/"),
      price: parseFloat(d.close)
    }));
  }, [tabData["Historical chart"]]);
  const isRealtimePositiveTrend = reactExports.useMemo(() => {
    if (realtimeLineData.length < 2) return true;
    return parseFloat(realtimeLineData[realtimeLineData.length - 1].price) >= parseFloat(realtimeLineData[0].price);
  }, [realtimeLineData]);
  const isHistoricalPositiveTrend = reactExports.useMemo(() => {
    if (historicalLineData.length < 2) return true;
    return parseFloat(historicalLineData[historicalLineData.length - 1].price) >= parseFloat(historicalLineData[0].price);
  }, [historicalLineData]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-400 dark:text-zinc-500 mb-1 uppercase tracking-wider", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-black text-[#111] dark:text-white", children: [
          currencySymbol,
          Number(payload[0].value).toLocaleString("en-IN", { minimumFractionDigits: 2 })
        ] })
      ] });
    }
    return null;
  };
  if (!isOpen) return null;
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fixed inset-0 z-[110000] flex items-center justify-center bg-black/40 backdrop-blur-sm ${isMaximized ? "p-0" : "p-0 sm:p-4"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.98 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.98 },
          className: `relative w-full h-full ${isMaximized ? "sm:w-full sm:h-full max-w-none sm:rounded-none" : "sm:w-[95vw] sm:h-[94vh] max-w-7xl sm:rounded-[14px]"} bg-[#fdfaf5] dark:bg-[#161B2E] rounded-none shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col border border-white/10 dark:border-white/5 transition-all duration-300`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-3 sm:px-6 sm:py-5 bg-[#5154ff] flex items-center justify-between shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-4 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/5 shadow-inner shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 sm:w-6 sm:h-6 shadow-sm" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base sm:text-2xl font-black text-white leading-tight font-sans tracking-tight truncate", children: "AI CashFlow Explorer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] sm:text-[10px] text-white/60 font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] mt-0.5 truncate", children: "Market Intelligence Â· Real-time Analytics Â· Strategy" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsMaximized(!isMaximized), className: "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white/90 hover:text-white group transition-transform", title: isMaximized ? "Restore" : "Maximize", children: isMaximized ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize2, { className: "w-5 h-5 sm:w-6 sm:h-6 transition-transform" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white/90 hover:text-white group transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-6 h-6 sm:w-8 sm:h-8 group-hover:rotate-90 transition-transform" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-3 sm:px-8 sm:py-8 border-b border-gray-100 dark:border-white/8 flex flex-col sm:flex-row gap-3 sm:gap-6 bg-[#fdfaf5] dark:bg-[#161B2E] shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 sm:max-w-[320px] relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] sm:text-[11px] font-black text-[#999] uppercase tracking-[0.1em] mb-1.5 sm:mb-2.5 ml-1", children: "Country" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    onClick: () => setIsCountryDropdownOpen(!isCountryDropdownOpen),
                    className: `bg-white dark:bg-[#1E2438] border ${isCountryDropdownOpen ? "border-[#5154ff] ring-4 ring-[#5154ff]/10" : "border-gray-200 dark:border-white/8"} rounded-[10px] sm:rounded-[14px] px-3 py-2.5 sm:px-5 sm:py-4 text-[13px] sm:text-[14px] font-bold flex items-center gap-2 sm:gap-3 shadow-sm cursor-pointer group transition-all min-h-[44px] sm:min-h-[54px] select-none`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[18px] sm:text-[22px] leading-none", children: ((_a2 = COUNTRIES.find((c) => c.code === selectedCountry)) == null ? void 0 : _a2.flag) || "🌐" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#888] dark:text-zinc-500 font-extrabold text-[12px] sm:text-[13px]", children: selectedCountry }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#111] dark:text-white flex-1 text-[13px] sm:text-[14px] truncate", children: ((_b = COUNTRIES.find((c) => c.code === selectedCountry)) == null ? void 0 : _b.name) || "Unknown" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isCountryDropdownOpen ? "rotate-180 text-[#5154ff]" : "text-[#ccc] dark:text-zinc-600 group-hover:text-[#5154ff]"}` })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isCountryDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 10, scale: 0.98 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: 10, scale: 0.98 },
                    className: "absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-[#1E2438] border border-black/5 dark:border-white/8 rounded-[18px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] overflow-hidden z-[110]",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-2 max-h-64 overflow-y-auto custom-scrollbar", children: COUNTRIES.map((country) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => {
                          setSelectedCountry(country.code);
                          setIsCountryDropdownOpen(false);
                          const match = PRESET_STOCKS.find((s) => s.region === country.code);
                          if (match) {
                            setSelectedStock(match);
                            setSearchTerm("");
                          }
                        },
                        className: "w-full text-left px-5 py-3 hover:bg-[#fdfaf5] dark:hover:bg-white/5 transition-colors flex items-center gap-3 group border-b border-gray-50/50 dark:border-white/5 last:border-0",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[20px] leading-none", children: country.flag }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] font-black text-[#888] dark:text-zinc-500 w-8", children: country.code }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[14px] font-bold text-[#111] dark:text-white group-hover:text-[#5154ff] flex-1", children: country.name }),
                          selectedCountry === country.code && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-[#5154ff]" })
                        ]
                      },
                      country.code
                    )) })
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] sm:text-[11px] font-black text-[#999] uppercase tracking-[0.1em] mb-1.5 sm:mb-2.5 ml-1", children: "Stock" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    onClick: () => setIsStockSelectOpen(!isStockSelectOpen),
                    className: `bg-white dark:bg-[#1E2438] border ${isStockSelectOpen ? "border-[#5154ff] ring-4 ring-[#5154ff]/10" : "border-gray-200 dark:border-white/8"} rounded-[10px] sm:rounded-[14px] px-3 py-2.5 sm:px-5 sm:py-4 text-[13px] sm:text-[14px] font-bold flex items-center justify-between shadow-sm cursor-pointer group transition-all min-h-[44px] sm:min-h-[54px]`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#111] dark:text-white truncate text-[12px] sm:text-[14px]", children: [
                        selectedStock == null ? void 0 : selectedStock.symbol,
                        " - ",
                        selectedStock == null ? void 0 : selectedStock.name
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 shrink-0", children: [
                        isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-[#5154ff]" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isStockSelectOpen ? "rotate-180 text-[#5154ff]" : "text-[#ccc] dark:text-zinc-600 group-hover:text-[#5154ff]"}` })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isStockSelectOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 15, scale: 0.98 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: 15, scale: 0.98 },
                    className: "absolute top-[calc(100%+12px)] left-0 right-0 bg-white dark:bg-[#1E2438] border border-black/5 dark:border-white/8 rounded-[18px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] overflow-hidden z-[100] max-h-80 overflow-y-auto",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-gray-50 dark:border-white/5 flex items-center bg-[#fdfaf5]/50 dark:bg-[#161B2E]/80 sticky top-0 backdrop-blur-xl z-10", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-5 h-5 text-[#aaa] dark:text-zinc-500 ml-2" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            value: searchTerm,
                            onChange: (e) => setSearchTerm(e.target.value),
                            placeholder: "Search symbols...",
                            className: "w-full bg-transparent border-0 outline-none px-4 text-sm font-bold text-[#111] dark:text-white",
                            autoFocus: true
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-2", children: (searchTerm.length >= 2 ? searchResults : PRESET_STOCKS).map((stock) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          onClick: () => {
                            setSelectedStock(stock);
                            setIsStockSelectOpen(false);
                            setSearchTerm("");
                          },
                          className: "w-full text-left px-6 py-4 hover:bg-[#fdfaf5] dark:hover:bg-white/5 transition-colors border-b border-gray-50/50 dark:border-white/5 last:border-0 flex items-center justify-between group",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[14px] font-black text-[#111] dark:text-white group-hover:text-[#5154ff]", children: stock.symbol }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-[#888] dark:text-zinc-500 font-bold uppercase tracking-wider", children: stock.name })
                            ] }),
                            (selectedStock == null ? void 0 : selectedStock.symbol) === stock.symbol && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-5 h-5 text-[#5154ff]" })
                          ]
                        },
                        stock.symbol
                      )) })
                    ]
                  }
                ) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 sm:px-8 border-b border-gray-100 dark:border-white/5 flex items-center gap-3 sm:gap-10 overflow-x-auto no-scrollbar bg-white dark:bg-[#161B2E] shrink-0", children: ["Realtime chart", "News", "Historical chart", "Advisory", "Research and recommendation"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setActiveTab(tab),
                className: `py-3 sm:py-5 text-[10px] sm:text-[14px] font-black whitespace-nowrap transition-all border-b-2 tracking-wide uppercase ${activeTab === tab ? "text-[#5154ff] border-[#5154ff]" : "text-gray-400 dark:text-zinc-500 border-transparent hover:text-gray-600 dark:hover:text-zinc-300"}`,
                children: tab
              },
              tab
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-3 py-4 sm:px-8 sm:py-8 bg-white dark:bg-[#1E2438] custom-scrollbar", children: isLoadingTab ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col items-center justify-center gap-6 text-[#999] dark:text-zinc-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-16 h-16 animate-spin text-[#5154ff] opacity-20 dark:opacity-40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#5154ff] animate-pulse" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] font-black uppercase tracking-[0.3em] animate-pulse", children: "Syncing Network Data..." })
            ] }) : tabError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col items-center justify-center gap-4 text-rose-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-12 h-12 opacity-80" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-black uppercase tracking-wider", children: tabError }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-[#888] dark:text-zinc-500 font-bold text-center max-w-sm mt-2", children: "If using AngelOne SmartAPI, ensure your API_KEY and AUTHORIZATION_TOKEN are correctly configured in your Backend .env file." })
            ] }) : !tabData[activeTab] ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col items-center justify-center gap-4 text-[#999] dark:text-zinc-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-12 h-12 opacity-20 dark:opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-black uppercase tracking-wider", children: "No Data Available" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-3 duration-700", children: [
              activeTab === "Realtime chart" && tabData["Realtime chart"] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 sm:space-y-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#fcf8f0] dark:bg-[#1E2438] rounded-[12px] sm:rounded-[20px] p-3 sm:p-6 border border-[#f0ebe0] dark:border-white/8 shadow-sm relative overflow-hidden group hover:shadow-md dark:hover:border-[#5154ff]/30 transition-all", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[8px] sm:text-[11px] font-black text-[#aaa] dark:text-zinc-500 uppercase tracking-widest mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2", children: [
                      "Live Price ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500 animate-pulse" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-4xl font-black text-[#111] dark:text-white tracking-tight", children: ((_c = tabData["Realtime chart"].quote) == null ? void 0 : _c.price) ? `${currencySymbol}${parseFloat(tabData["Realtime chart"].quote.price).toLocaleString()}` : currencySymbol + "---" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-3 text-[10px] sm:text-[13px] font-bold ${parseFloat((_d = tabData["Realtime chart"].quote) == null ? void 0 : _d.change) >= 0 ? "text-emerald-500" : "text-rose-500"}`, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: `w-3 h-3 sm:w-4 sm:h-4 ${parseFloat((_e = tabData["Realtime chart"].quote) == null ? void 0 : _e.change) < 0 ? "rotate-180" : ""}` }),
                      ((_f = tabData["Realtime chart"].quote) == null ? void 0 : _f.changePercent) || "0.00%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#fcf8f0] dark:bg-[#1E2438] rounded-[12px] sm:rounded-[20px] p-3 sm:p-6 border border-[#f0ebe0] dark:border-white/8 shadow-sm relative overflow-hidden group hover:shadow-md dark:hover:border-[#5154ff]/30 transition-all", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] sm:text-[11px] font-black text-[#aaa] dark:text-zinc-500 uppercase tracking-widest mb-1 sm:mb-2", children: "Day high" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-4xl font-black text-[#111] dark:text-white tracking-tight", children: ((_g = tabData["Realtime chart"].quote) == null ? void 0 : _g.high) ? `${currencySymbol}${parseFloat(tabData["Realtime chart"].quote.high).toLocaleString()}` : currencySymbol + "---" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 sm:mt-3 w-full bg-black/5 dark:bg-white/10 h-1 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { width: 0 }, animate: { width: "85%" }, className: "h-full bg-[#5154ff]" }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#fcf8f0] dark:bg-[#1E2438] rounded-[12px] sm:rounded-[20px] p-3 sm:p-6 border border-[#f0ebe0] dark:border-white/8 shadow-sm relative overflow-hidden group hover:shadow-md dark:hover:border-[#5154ff]/30 transition-all", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] sm:text-[11px] font-black text-[#aaa] dark:text-zinc-500 uppercase tracking-widest mb-1 sm:mb-2", children: "Volume (24h)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-4xl font-black text-[#111] dark:text-white tracking-tight", children: ((_h = tabData["Realtime chart"].quote) == null ? void 0 : _h.volume) ? (parseFloat(tabData["Realtime chart"].quote.volume) / 1e3).toFixed(1) + "k" : "---" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[11px] font-black text-[#5154ff] uppercase tracking-wider", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "AngelOne Live Data" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Live" }),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1E2438] rounded-[16px] sm:rounded-[24px] p-3 sm:p-8 border border-gray-100 dark:border-white/8 shadow-sm dark:shadow-[0_0_0_1px_rgba(81,84,255,0.05)] min-h-[350px] sm:min-h-[700px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8 gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm sm:text-lg font-black text-[#111] dark:text-white flex items-center gap-2", children: [
                        "Advanced Market Dynamics ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 sm:w-5 sm:h-5 text-[#5154ff]" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] sm:text-[11px] font-bold text-[#aaa] dark:text-zinc-500 uppercase tracking-[0.15em] mt-1 mb-2 sm:mb-3", children: "Professional Dynamic Chart" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex bg-gray-100/80 dark:bg-white/5 p-0.5 sm:p-1 rounded-lg sm:rounded-xl gap-0.5 sm:gap-1 w-fit border border-black/5 dark:border-white/8", children: [{ label: "15m", val: "15" }, { label: "1H", val: "60" }, { label: "1D", val: "D" }, { label: "1W", val: "W" }, { label: "1M", val: "M" }].map((intv) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => setChartInterval(intv.val),
                          className: `px-2 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[11px] font-black uppercase tracking-wider rounded-md sm:rounded-lg transition-all 
                                               ${chartInterval === intv.val ? "bg-white dark:bg-zinc-700 text-[#5154ff] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] border border-black/5 dark:border-white/5" : "text-[#888] dark:text-zinc-500 hover:text-[#555] dark:hover:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"}`,
                          children: intv.label
                        },
                        intv.val
                      )) })
                    ] }),
                    ((_i = tabData["Realtime chart"].quote) == null ? void 0 : _i.price) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          onClick: () => setChartType("standard"),
                          className: `flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-[11px] font-black uppercase tracking-wider rounded-lg transition-colors border shadow-sm
                                                ${chartType === "standard" ? "bg-[#5154ff]/10 text-[#5154ff] border-[#5154ff]/20" : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/8 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700"}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-3 h-3 sm:w-3.5 sm:h-3.5" }),
                            " Standard"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          onClick: () => setChartType("tradingview"),
                          className: `flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-[11px] font-black uppercase tracking-wider rounded-lg transition-colors border shadow-sm
                                                ${chartType === "tradingview" ? "bg-[#5154ff]/10 text-[#5154ff] border-[#5154ff]/20" : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/8 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700"}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: `w-3 h-3 sm:w-3.5 sm:h-3.5 ${chartType === "tradingview" ? "animate-pulse" : ""}` }),
                            " TradingView"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFullScreenChart("realtime"), className: "flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/8 text-gray-700 dark:text-zinc-300 text-[9px] sm:text-[11px] font-black uppercase tracking-wider rounded-lg transition-colors sm:mr-4 border border-gray-200 dark:border-zinc-700 shadow-sm", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize, { className: "w-3 h-3 sm:w-3.5 sm:h-3.5" }),
                        " Pro View"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center px-3 py-1 sm:px-5 sm:py-1.5 bg-[#fffafb] dark:bg-red-500/10 border border-[#f23645] rounded-[6px] min-w-[70px] sm:min-w-[100px] shadow-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[14px] sm:text-[18px] font-semibold text-[#f23645] leading-tight", children: parseFloat(tabData["Realtime chart"].quote.price - 0.25).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-[12px] font-medium text-[#f23645] uppercase tracking-wide", children: "SELL" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] sm:text-[13px] font-medium text-[#333] dark:text-zinc-400", children: "0.50" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center px-3 py-1 sm:px-5 sm:py-1.5 bg-[#f8fbff] dark:bg-blue-500/10 border border-[#2962ff] rounded-[6px] min-w-[70px] sm:min-w-[100px] shadow-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-colors", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[14px] sm:text-[18px] font-semibold text-[#2962ff] leading-tight", children: parseFloat(tabData["Realtime chart"].quote.price + 0.25).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-[12px] font-medium text-[#2962ff] uppercase tracking-wide", children: "BUY" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[280px] sm:h-[550px] w-full pt-2 sm:pt-4 relative rounded-xl overflow-hidden shadow-inner border border-black/5 dark:border-white/5", children: chartType === "tradingview" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TradingViewWidget, { symbol: selectedStock == null ? void 0 : selectedStock.symbol, interval: chartInterval, containerId: "tv_chart_realtime", isDarkMode }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full p-2 sm:p-4 bg-white dark:bg-[#1E2438]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: realtimeLineData, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "colorRealtimePrice", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: isRealtimePositiveTrend ? "#10b981" : "#e11d48", stopOpacity: 0.2 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: isRealtimePositiveTrend ? "#10b981" : "#e11d48", stopOpacity: 0 })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      XAxis,
                      {
                        dataKey: "date",
                        axisLine: false,
                        tickLine: false,
                        tick: { fontSize: 9, fill: isDarkMode ? "#71717a" : "#94a3b8" },
                        dy: 5
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      YAxis,
                      {
                        domain: ["auto", "auto"],
                        axisLine: false,
                        tickLine: false,
                        tick: { fontSize: 9, fill: isDarkMode ? "#71717a" : "#94a3b8" },
                        tickFormatter: (val) => `${currencySymbol}${val}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Area,
                      {
                        type: "monotone",
                        dataKey: "price",
                        stroke: isRealtimePositiveTrend ? "#10b981" : "#e11d48",
                        strokeWidth: 2,
                        fillOpacity: 1,
                        fill: "url(#colorRealtimePrice)"
                      }
                    )
                  ] }) }) }) })
                ] })
              ] }),
              activeTab === "News" && tabData["News"] && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 sm:space-y-6", children: ((_j = tabData["News"].news) == null ? void 0 : _j.length) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 sm:p-12 text-center text-[#aaa] dark:text-zinc-500 font-bold uppercase tracking-widest bg-gray-50 dark:bg-[#1E2438] rounded-2xl border border-dashed border-gray-200 dark:border-white/8 text-xs sm:text-sm", children: "No news detected" }) : (_k = tabData["News"].news) == null ? void 0 : _k.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: -10 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: idx * 0.1 },
                  className: "bg-[#fcf8f0] dark:bg-[#1E2438] rounded-[14px] sm:rounded-[20px] p-3 sm:p-6 border border-[#f0ebe0] dark:border-white/8 group hover:border-[#5154ff]/40 dark:hover:border-[#5154ff]/40 transition-all cursor-pointer shadow-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] sm:text-[10px] font-black text-[#5154ff] bg-white dark:bg-white/5 border border-[#5154ff]/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg uppercase tracking-wider", children: item.source || "Finance" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] sm:text-[10px] font-bold text-[#888] dark:text-zinc-500 uppercase tracking-wider", children: getRelativeTime(item.time_published) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[14px] sm:text-[17px] font-black text-[#111] dark:text-white mb-2 sm:mb-3 group-hover:text-[#5154ff] transition-colors leading-snug", children: item.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] sm:text-[13px] text-[#777] dark:text-zinc-400 mb-3 sm:mb-4 line-clamp-2 leading-relaxed", children: item.summary }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[8px] sm:text-[10px] font-black px-2 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-[0.05em] ${(item.overall_sentiment_label || "Neutral").includes("Bullish") ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600" : (item.overall_sentiment_label || "Neutral").includes("Bearish") ? "bg-rose-50 dark:bg-rose-500/20 text-rose-600" : "bg-white dark:bg-white/5 border border-gray-200 dark:border-zinc-700 text-[#999] dark:text-zinc-500"}`, children: [
                        "Sentiment: ",
                        item.overall_sentiment_label || "Neutral"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: item.url, target: "_blank", rel: "noopener noreferrer", className: "p-2 sm:p-2.5 bg-white dark:bg-white/5 rounded-xl text-[#5154ff] hover:bg-[#5154ff] hover:text-white transition-all shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4" }) })
                    ] })
                  ]
                },
                idx
              )) }),
              activeTab === "Historical chart" && tabData["Historical chart"] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1E2438] rounded-[16px] sm:rounded-[24px] p-3 sm:p-8 border border-gray-100 dark:border-white/8 shadow-sm min-h-[350px] sm:min-h-[700px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm sm:text-xl font-black text-[#111] dark:text-white flex items-center gap-2 sm:gap-3", children: [
                      "Advanced Historical Chart ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4 sm:w-6 sm:h-6 text-[#5154ff]" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] sm:text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1", children: "Interactive TradingView Historical Record" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-4 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => setChartType("standard"),
                        className: `flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-[11px] font-black uppercase tracking-wider rounded-lg transition-colors border shadow-sm
                                          ${chartType === "standard" ? "bg-[#5154ff]/10 text-[#5154ff] border-[#5154ff]/20" : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/8 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-3 h-3 sm:w-3.5 sm:h-3.5" }),
                          " Standard"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => setChartType("tradingview"),
                        className: `flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-[11px] font-black uppercase tracking-wider rounded-lg transition-colors border shadow-sm
                                          ${chartType === "tradingview" ? "bg-[#5154ff]/10 text-[#5154ff] border-[#5154ff]/20" : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/8 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: `w-3 h-3 sm:w-3.5 sm:h-3.5 ${chartType === "tradingview" ? "animate-pulse" : ""}` }),
                          " TradingView"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFullScreenChart("historical"), className: "flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/8 text-gray-700 dark:text-zinc-300 text-[9px] sm:text-[11px] font-black uppercase tracking-wider rounded-lg transition-colors border border-gray-200 dark:border-zinc-700 shadow-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize, { className: "w-3 h-3 sm:w-3.5 sm:h-3.5" }),
                      " Pro View"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[280px] sm:h-[550px] w-full pt-2 sm:pt-4 relative rounded-xl overflow-hidden shadow-inner border border-black/5 dark:border-white/5", children: chartType === "tradingview" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TradingViewWidget, { symbol: selectedStock == null ? void 0 : selectedStock.symbol, interval: "D", containerId: "tv_chart_historical", isDarkMode }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full p-2 sm:p-4 bg-white dark:bg-[#1E2438]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: historicalLineData, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "colorHistoricalPrice", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: isHistoricalPositiveTrend ? "#10b981" : "#e11d48", stopOpacity: 0.2 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: isHistoricalPositiveTrend ? "#10b981" : "#e11d48", stopOpacity: 0 })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    XAxis,
                    {
                      dataKey: "date",
                      axisLine: false,
                      tickLine: false,
                      tick: { fontSize: 9, fill: isDarkMode ? "#71717a" : "#94a3b8" },
                      dy: 5
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    YAxis,
                    {
                      domain: ["auto", "auto"],
                      axisLine: false,
                      tickLine: false,
                      tick: { fontSize: 9, fill: isDarkMode ? "#71717a" : "#94a3b8" },
                      tickFormatter: (val) => `${currencySymbol}${val}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Area,
                    {
                      type: "monotone",
                      dataKey: "price",
                      stroke: isHistoricalPositiveTrend ? "#10b981" : "#e11d48",
                      strokeWidth: 2,
                      fillOpacity: 1,
                      fill: "url(#colorHistoricalPrice)"
                    }
                  )
                ] }) }) }) })
              ] }),
              activeTab === "Advisory" && tabData["Advisory"] && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center py-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.96 },
                  animate: { opacity: 1, scale: 1 },
                  className: `w-full max-w-3xl border border-black/5 dark:border-white/5 rounded-[18px] sm:rounded-[28px] p-4 sm:p-6 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center gap-4 sm:gap-6
                                     ${tabData["Advisory"].advisory.verdict === "BUY" ? "bg-gradient-to-br from-emerald-50/70 to-teal-50/70 dark:from-emerald-900/20 dark:to-teal-900/20" : tabData["Advisory"].advisory.verdict === "SELL" ? "bg-gradient-to-br from-rose-50/70 to-orange-50/70 dark:from-rose-900/20 dark:to-orange-900/20" : "bg-gradient-to-br from-[#fcf8f0] to-[#f5f0e1] dark:from-zinc-900 dark:to-zinc-800"}
                                 `,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-center space-y-1 sm:space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-3 sm:p-4 rounded-full bg-white/60 dark:bg-black/20 shadow-sm 
                                        ${tabData["Advisory"].advisory.verdict === "BUY" ? "text-emerald-500" : tabData["Advisory"].advisory.verdict === "SELL" ? "text-rose-500" : "text-yellow-500"}
                                    `, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { fill: "currentColor", className: "w-8 h-8 sm:w-12 sm:h-12" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] sm:text-[12px] font-black text-[#888] uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-0.5", children: "System Signal" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-4xl sm:text-6xl font-black uppercase tracking-tighter
                                             ${tabData["Advisory"].advisory.verdict === "BUY" ? "text-emerald-600" : tabData["Advisory"].advisory.verdict === "SELL" ? "text-rose-600" : "text-yellow-600"}
                                       `, children: tabData["Advisory"].advisory.verdict })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full md:w-[320px] grid grid-cols-2 gap-2 sm:gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/80 dark:bg-[#1E2438]/80 p-2.5 sm:p-3.5 rounded-[14px] sm:rounded-[20px] border border-white dark:border-white/8 shadow-sm hover:shadow-md transition-shadow", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#aaa] dark:text-zinc-500 mb-0.5", children: "RSI" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base sm:text-xl font-black text-[#111] dark:text-white", children: (_l = tabData["Advisory"].advisory.indicators) == null ? void 0 : _l.RSI })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/80 dark:bg-[#1E2438]/80 p-2.5 sm:p-3.5 rounded-[14px] sm:rounded-[20px] border border-white dark:border-white/8 shadow-sm hover:shadow-md transition-shadow", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#aaa] dark:text-zinc-500 mb-0.5", children: "MACD" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base sm:text-xl font-black text-[#111] dark:text-white", children: (_m = tabData["Advisory"].advisory.indicators) == null ? void 0 : _m.MACD })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/80 dark:bg-[#1E2438]/80 p-2.5 sm:p-3.5 rounded-[14px] sm:rounded-[20px] border border-white dark:border-white/8 shadow-sm hover:shadow-md transition-shadow", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#aaa] dark:text-zinc-500 mb-0.5", children: "Ichimoku" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs sm:text-sm font-black ${((_n = tabData["Advisory"].advisory.indicators) == null ? void 0 : _n.Ichimoku) === "Bullish" ? "text-emerald-600" : ((_o = tabData["Advisory"].advisory.indicators) == null ? void 0 : _o.Ichimoku) === "Bearish" ? "text-rose-600" : "text-[#111] dark:text-white"}`, children: ((_p = tabData["Advisory"].advisory.indicators) == null ? void 0 : _p.Ichimoku) || "Neutral" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/80 dark:bg-[#1E2438]/80 p-2.5 sm:p-3.5 rounded-[14px] sm:rounded-[20px] border border-white dark:border-white/8 shadow-sm hover:shadow-md transition-shadow", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#aaa] dark:text-zinc-500 mb-0.5", children: "SMA20" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base sm:text-xl font-black text-[#111] dark:text-white", children: (_q = tabData["Advisory"].advisory.indicators) == null ? void 0 : _q.SMA })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 bg-white/80 dark:bg-[#1E2438]/80 p-2.5 sm:p-3 rounded-[14px] sm:rounded-[20px] border border-white dark:border-white/8 shadow-sm flex justify-between items-center px-4 sm:px-6", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#aaa] dark:text-zinc-500", children: "Fibonacci Level" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base sm:text-xl font-black text-[#5154ff]", children: [
                          "₹",
                          ((_r = tabData["Advisory"].advisory.indicators) == null ? void 0 : _r.Fibonacci) || "---"
                        ] })
                      ] })
                    ] })
                  ]
                }
              ) }),
              activeTab === "Research and recommendation" && selectedStock && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.1 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          id: "graham-analysis-btn",
                          onClick: () => showGrahamPanel ? setShowGrahamPanel(false) : fetchGrahamAnalysis(),
                          className: `group relative w-full flex items-center justify-between px-4 py-3 sm:px-8 sm:py-5 rounded-[14px] sm:rounded-[20px] border-2 transition-all duration-300 overflow-hidden
                                       ${showGrahamPanel ? "bg-amber-950 border-amber-800" : "bg-gradient-to-r from-amber-950 to-stone-900 border-amber-800/60 hover:border-amber-600 hover:shadow-xl hover:shadow-amber-900/30"}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:gap-4 min-w-0", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-700/40 border border-amber-600/30 flex items-center justify-center shadow-inner shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 sm:w-6 sm:h-6 text-amber-300" }) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left min-w-0", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] text-amber-400/70 mb-0.5 truncate", children: "Value Investing Analysis" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm sm:text-lg font-black text-amber-100 truncate", children: [
                                  "Benjamin Graham ",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-400", children: "Perspective" })
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] sm:text-[11px] text-amber-300/60 font-semibold mt-0.5 truncate", children: 'Based on "The Intelligent Investor"' })
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 sm:gap-3 shrink-0", children: isGrahamLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 sm:w-5 sm:h-5 animate-spin text-amber-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: `w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transition-transform duration-300 group-hover:translate-x-1 ${showGrahamPanel ? "rotate-90" : ""}` }) })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showGrahamPanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.div,
                        {
                          initial: { opacity: 0, height: 0 },
                          animate: { opacity: 1, height: "auto" },
                          exit: { opacity: 0, height: 0 },
                          transition: { duration: 0.4 },
                          className: "overflow-hidden",
                          children: isGrahamLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-col items-center justify-center gap-4 py-16 bg-amber-950/30 rounded-[20px] border border-amber-900/40", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-10 h-10 animate-spin text-amber-500" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black text-amber-400 uppercase tracking-widest animate-pulse", children: "Consulting The Intelligent Investor..." })
                          ] }) : grahamData ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-gradient-to-br from-amber-950/20 to-stone-900/10 border border-amber-900/30 rounded-[16px] sm:rounded-[24px] p-4 sm:p-8 space-y-4 sm:space-y-6", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-5 border-b border-amber-900/30 gap-3", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-700/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-4 h-4 sm:w-5 sm:h-5 text-amber-400" }) }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm sm:text-lg font-black text-stone-800 dark:text-white", children: "Graham's Verdict" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] sm:text-[11px] text-stone-500 dark:text-zinc-500 font-bold uppercase tracking-wider", children: grahamData.source })
                                ] })
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest w-fit
                                                      ${grahamData.graham_verdict === "BUY" ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" : grahamData.graham_verdict === "AVOID" ? "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800" : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"}
                                                   `, children: grahamData.graham_verdict === "AVOID" ? "â›” AVOID" : grahamData.graham_verdict === "BUY" ? "âœ… BUY" : "â¸ HOLD" })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "relative pl-6 border-l-4 border-amber-400 italic text-stone-700 dark:text-zinc-300 text-[13px] sm:text-[15px] font-semibold leading-relaxed", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -left-3 -top-2 text-4xl sm:text-5xl text-amber-300/50 font-serif leading-none", children: "“" }),
                              grahamData.graham_quote
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-[16px] p-4 flex items-center gap-3", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-amber-500 mb-0.5", children: "Key Principle Applied" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-amber-900 dark:text-amber-100", children: grahamData.key_principle_applied })
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                              { label: "Margin of Safety", value: grahamData.margin_of_safety, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900" },
                              { label: "Intrinsic Value", value: grahamData.intrinsic_value_note, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900" },
                              { label: "For Defensive Investor", value: grahamData.defensive_investor, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900" },
                              { label: "For Enterprising Investor", value: grahamData.enterprising_investor, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900" }
                            ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-[16px] border p-4 sm:p-5 ${item.color.split(" ").slice(1).join(" ")}`, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] font-black uppercase tracking-widest mb-2 ${item.color.split(" ")[0]}`, children: item.label }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-stone-700 dark:text-zinc-300 leading-relaxed", children: item.value })
                            ] }, i)) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-stone-100 dark:bg-white/5/50 border border-stone-200 dark:border-zinc-700 rounded-[16px] p-5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-stone-500 dark:text-zinc-500 mb-2", children: "Graham Number & Valuation" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-stone-700 dark:text-zinc-300 leading-relaxed", children: grahamData.graham_number_note })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-amber-900/10 to-stone-800/5 dark:from-amber-900/20 dark:to-zinc-900/20 border border-amber-800/20 dark:border-amber-900 rounded-[20px] p-6", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-3", children: "Graham's Final Advice" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] font-semibold text-stone-800 dark:text-white leading-relaxed", children: grahamData.final_advice })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px] text-stone-400 dark:text-zinc-600 font-bold pt-2 border-t border-stone-200 dark:border-white/8", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4" }),
                              "Source: ",
                              grahamData.source,
                              " · ",
                              grahamData.rag_used ? "ðŸ“š Knowledge Base Retrieved" : "ðŸ¤– AI Generated"
                            ] })
                          ] }) : null
                        }
                      ) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.2 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          id: "kiyosaki-analysis-btn",
                          onClick: () => showKiyosakiPanel ? setShowKiyosakiPanel(false) : fetchKiyosakiAnalysis(),
                          className: `group relative w-full flex items-center justify-between px-4 py-3 sm:px-8 sm:py-5 rounded-[14px] sm:rounded-[20px] border-2 transition-all duration-300 overflow-hidden
                                       ${showKiyosakiPanel ? "bg-blue-950 border-blue-800" : "bg-gradient-to-r from-blue-950 to-indigo-950 border-blue-800/60 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-900/30"}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:gap-4 min-w-0", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-700/40 border border-blue-600/30 flex items-center justify-center shadow-inner shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4 sm:w-6 sm:h-6 text-blue-300" }) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left min-w-0", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] text-blue-400/70 mb-0.5 truncate", children: "Finance IQ & Cashflow" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm sm:text-lg font-black text-blue-100 truncate", children: [
                                  "Robert Kiyosaki ",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400", children: "Perspective" })
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] sm:text-[11px] text-blue-300/60 font-semibold mt-0.5 truncate", children: 'Based on "Rich Dad Poor Dad"' })
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 sm:gap-3 shrink-0", children: isKiyosakiLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: `w-4 h-4 sm:w-5 sm:h-5 text-blue-400 transition-transform duration-300 group-hover:translate-x-1 ${showKiyosakiPanel ? "rotate-90" : ""}` }) })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showKiyosakiPanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.div,
                        {
                          initial: { opacity: 0, height: 0 },
                          animate: { opacity: 1, height: "auto" },
                          exit: { opacity: 0, height: 0 },
                          transition: { duration: 0.4 },
                          className: "overflow-hidden",
                          children: isKiyosakiLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-col items-center justify-center gap-4 py-16 bg-blue-950/30 rounded-[20px] border border-blue-900/40", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-10 h-10 animate-spin text-blue-500" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black text-blue-400 uppercase tracking-widest animate-pulse", children: "Building Financial IQ with Rich Dad..." })
                          ] }) : kiyosakiData ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-gradient-to-br from-blue-950/20 to-indigo-900/10 border border-blue-900/30 rounded-[16px] sm:rounded-[24px] p-4 sm:p-8 space-y-4 sm:space-y-6", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-5 border-b border-blue-900/30 gap-3", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-700/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 sm:w-5 sm:h-5 text-blue-400" }) }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm sm:text-lg font-black text-stone-800 dark:text-white", children: "Rich Dad's Verdict" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] sm:text-[11px] text-stone-500 dark:text-zinc-500 font-bold uppercase tracking-wider", children: kiyosakiData.source })
                                ] })
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest w-fit
                                                      ${kiyosakiData.kiyosaki_verdict === "BUY" ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" : kiyosakiData.kiyosaki_verdict === "AVOID" ? "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800" : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"}
                                                   `, children: kiyosakiData.kiyosaki_verdict === "AVOID" ? "â›” AVOID" : kiyosakiData.kiyosaki_verdict === "BUY" ? "âœ… BUY" : "â¸ HOLD" })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "relative pl-6 border-l-4 border-blue-400 italic text-stone-700 dark:text-zinc-300 text-[13px] sm:text-[15px] font-semibold leading-relaxed", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -left-3 -top-2 text-4xl sm:text-5xl text-blue-300/50 font-serif leading-none", children: "“" }),
                              kiyosakiData.kiyosaki_quote
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-[16px] p-4 flex items-center gap-3", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-blue-500 mb-0.5", children: "Financial Literacy Tip" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-blue-900 dark:text-blue-100", children: kiyosakiData.financial_literacy_tip })
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                              { label: "Cashflow Perspective", value: kiyosakiData.cashflow_perspective, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900" },
                              { label: "Asset vs Liability", value: kiyosakiData.asset_vs_liability, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900" },
                              { label: "Risk Assessment", value: kiyosakiData.risk_assessment, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900" },
                              { label: "Rich Dad Advice", value: kiyosakiData.rich_dad_advice, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900" }
                            ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-[16px] border p-5 ${item.color.split(" ").slice(1).join(" ")}`, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] font-black uppercase tracking-widest mb-2 ${item.color.split(" ")[0]}`, children: item.label }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-stone-700 dark:text-zinc-300 leading-relaxed", children: item.value })
                            ] }, i)) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-900/10 to-indigo-800/5 dark:from-blue-900/20 dark:to-zinc-900/20 border border-blue-800/20 dark:border-blue-900 rounded-[20px] p-6", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-3", children: "Wealth Building Summary" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] font-semibold text-stone-800 dark:text-white leading-relaxed", children: kiyosakiData.final_summary })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px] text-stone-400 dark:text-zinc-600 font-bold pt-2 border-t border-blue-200 dark:border-white/8", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4" }),
                              "Source: ",
                              kiyosakiData.source,
                              " · ",
                              kiyosakiData.rag_used ? "ðŸ“š Knowledge Base Retrieved" : "ðŸ¤– AI Generated"
                            ] })
                          ] }) : null
                        }
                      ) })
                    ]
                  }
                ),
                ((_t = (_s = tabData["Research and recommendation"]) == null ? void 0 : _s.research) == null ? void 0 : _t.analyst_estimates) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    className: "bg-white dark:bg-[#1E2438] border-2 border-[#5154ff]/5 dark:border-white/8 rounded-[20px] sm:rounded-[32px] p-4 sm:p-8 shadow-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100 dark:border-white/8 gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm sm:text-xl font-black text-[#111] dark:text-white flex items-center gap-2 sm:gap-3", children: "Analyst Estimates & Target Price" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2 py-0.5 sm:px-3 sm:py-1 bg-black/5 dark:bg-white/5 rounded-lg text-[8px] sm:text-[10px] font-bold text-[#555] dark:text-zinc-500 uppercase tracking-wider w-fit", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-2.5 h-2.5 sm:w-3 sm:h-3" }),
                          " Live Analysis ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-[#5154ff] text-white px-1 py-0.5 sm:px-1.5 rounded-[4px] ml-1", children: "+4" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 sm:space-y-4", children: [
                        { label: "Average Target Price", value: tabData["Research and recommendation"].research.analyst_estimates.average_target_price },
                        { label: "High Estimate", value: tabData["Research and recommendation"].research.analyst_estimates.high_estimate },
                        { label: "Low Estimate", value: tabData["Research and recommendation"].research.analyst_estimates.low_estimate },
                        { label: "Analyst Sentiment", value: tabData["Research and recommendation"].research.analyst_estimates.analyst_sentiment },
                        { label: "Context", value: tabData["Research and recommendation"].research.analyst_estimates.context }
                      ].map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-[12px] sm:text-[16px] text-[#333] dark:text-zinc-300 leading-relaxed relative pl-5 sm:pl-6 before:content-[''] before:absolute before:left-0 before:top-[8px] sm:before:top-[10px] before:w-1.5 before:h-1.5 before:bg-[#111] dark:before:bg-white before:rounded-full", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#111] dark:text-white", children: [
                          item.label,
                          ":"
                        ] }),
                        " ",
                        item.value
                      ] }, idx)) })
                    ]
                  }
                ),
                ((_v = (_u = tabData["Advisory"]) == null ? void 0 : _u.advisory) == null ? void 0 : _v.report) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    className: "bg-white dark:bg-[#1E2438] border-2 border-[#5154ff]/5 dark:border-white/8 rounded-[20px] sm:rounded-[32px] p-4 sm:p-8 shadow-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-gray-100 dark:border-white/8 gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base sm:text-2xl font-black text-[#111] dark:text-white flex items-center gap-2 sm:gap-3", children: [
                            "Detailed Stock Analysis ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 sm:w-6 sm:h-6 text-[#5154ff]" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] sm:text-[12px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1", children: [
                            "AI-Powered Research & Recommendation for ",
                            selectedStock == null ? void 0 : selectedStock.name
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest w-fit
                                           ${tabData["Advisory"].advisory.verdict === "BUY" ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"}
                                       `, children: [
                          "Signal: ",
                          tabData["Advisory"].advisory.verdict
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose prose-slate dark:prose-invert max-w-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Markdown, { components: {
                        p: ({ node, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] sm:text-[16px] text-[#333] dark:text-zinc-300 font-semibold mb-3 sm:mb-4 leading-relaxed", ...props }),
                        li: ({ node, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-[13px] sm:text-[16px] font-bold text-[#111] dark:text-white mb-2 sm:mb-3 list-none pl-6 sm:pl-8 relative before:content-[''] before:absolute before:left-0 before:top-[10px] sm:before:top-[12px] before:w-2 before:h-2 sm:before:w-2.5 sm:before:h-2.5 before:bg-[#5154ff] before:rounded-full before:opacity-20", ...props })
                      }, children: tabData["Advisory"].advisory.report }) })
                    ]
                  }
                )
              ] })
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: fullScreenChart && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 50, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 20, scale: 0.95 },
          transition: { type: "spring", stiffness: 300, damping: 25 },
          className: "fixed inset-0 z-[2000] bg-[#fdfaf5] dark:bg-[#161B2E] flex flex-col",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 sm:px-6 sm:py-4 bg-white dark:bg-[#161B2E] border-b border-gray-100 dark:border-white/8 shadow-sm shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm sm:text-xl font-black text-[#111] dark:text-white flex items-center gap-2 sm:gap-3 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 sm:w-5 sm:h-5 text-[#5154ff] animate-pulse shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                  selectedStock == null ? void 0 : selectedStock.symbol,
                  " - ",
                  selectedStock == null ? void 0 : selectedStock.name
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] sm:text-[12px] text-[#5154ff] font-black uppercase tracking-widest bg-[#5154ff]/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[#5154ff]/20 ml-1 sm:ml-4 shadow-inner whitespace-nowrap shrink-0 hidden xs:inline", children: fullScreenChart === "realtime" ? "Realtime Pro View" : "Historical Pro View" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFullScreenChart(null), className: "p-2 sm:p-2.5 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-rose-500 hover:text-white text-gray-500 dark:text-zinc-400 transition-all shadow-sm active:scale-95 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5 sm:w-6 sm:h-6" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-white dark:bg-[#161B2E] relative p-2 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-inner border border-black/5 dark:border-white/5 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TradingViewWidget,
              {
                symbol: selectedStock == null ? void 0 : selectedStock.symbol,
                interval: fullScreenChart === "realtime" ? chartInterval : "D",
                containerId: `tv_chart_fullscreen_${fullScreenChart}`,
                isDarkMode
              }
            ) }) })
          ]
        }
      ) })
    ] }) }),
    document.body
  );
};
export {
  CashFlowStockModal as default
};
