import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, ae as TrendingUp, aj as ResponsiveContainer, ak as Tooltip, am as PieChart, an as Pie, ao as Cell, O as Activity } from "./index-HfKBlv-o.js";
import { A as AreaChart, X as XAxis, Y as YAxis, a as Area } from "./AreaChart-D0dRj8hr.js";
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
      d: "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",
      key: "pzmjnu"
    }
  ],
  ["path", { d: "M21.21 15.89A10 10 0 1 1 8 2.83", key: "k2fpak" }]
];
const ChartPie = createLucideIcon("ChartPie", __iconNode$1);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polyline", { points: "22 17 13.5 8.5 8.5 13.5 2 7", key: "1r2t7k" }],
  ["polyline", { points: "16 17 22 17 22 11", key: "11uiuu" }]
];
const TrendingDown = createLucideIcon("TrendingDown", __iconNode);
const COLORS = {
  Bullish: "#10b981",
  // Emerald
  "Somewhat-Bullish": "#34d399",
  Neutral: "#94a3b8",
  // Slate
  "Somewhat-Bearish": "#fb7185",
  Bearish: "#e11d48",
  // Rose
  Positive: "#10b981",
  Negative: "#e11d48"
};
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-subtext mb-1 uppercase opacity-80", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-black text-maintext", children: [
        "$",
        Number(payload[0].value).toFixed(2)
      ] })
    ] });
  }
  return null;
};
const CashFlowChartWidget = ({ data }) => {
  var _a;
  if (!data) return null;
  const { historical = [], news = [], overview = {}, symbol } = data;
  const chartData = reactExports.useMemo(() => {
    let sourceData = historical && historical.length > 0 ? historical : null;
    let isSimulated = false;
    if (!sourceData) {
      isSimulated = true;
      sourceData = [];
      const seed = symbol ? symbol.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 150;
      let basePrice = seed % 300 + 20;
      const trendModifier = seed % 2 === 0 ? 1 : -1;
      for (let i = 30; i >= 1; i--) {
        const d = /* @__PURE__ */ new Date();
        d.setDate(d.getDate() - i);
        const dailyChange = Math.random() * 8 - 4 + trendModifier * Math.random() * 2;
        basePrice = Math.max(1, basePrice + dailyChange);
        sourceData.push({
          date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
          close: basePrice.toFixed(2)
        });
      }
      sourceData.reverse();
    }
    const mapped = [...sourceData].reverse().map((item) => ({
      date: item.date.split("-").slice(1).join("/"),
      price: parseFloat(item.close),
      isSimulated
    }));
    return mapped;
  }, [historical, symbol]);
  const isPositiveTrend = reactExports.useMemo(() => {
    if (chartData.length < 2) return true;
    return chartData[chartData.length - 1].price >= chartData[0].price;
  }, [chartData]);
  const sentimentData = reactExports.useMemo(() => {
    let sourceNews = news && news.length > 0 ? news : null;
    if (!sourceNews) {
      sourceNews = [];
      const sentimentPool = isPositiveTrend ? ["Bullish", "Bullish", "Somewhat-Bullish", "Neutral", "Neutral"] : ["Bearish", "Bearish", "Somewhat-Bearish", "Neutral", "Neutral"];
      for (let i = 0; i < 5; i++) {
        const randomAdd = Math.random() > 0.8 ? isPositiveTrend ? "Somewhat-Bullish" : "Somewhat-Bearish" : sentimentPool[i];
        sourceNews.push({ overall_sentiment_label: randomAdd });
      }
    }
    const counts = {};
    sourceNews.forEach((item) => {
      const label = item.overall_sentiment_label || "Neutral";
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [news]);
  const isSimulation = (_a = chartData[0]) == null ? void 0 : _a.isSimulated;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full mt-4 space-y-4 font-sans select-none relative", children: [
    isSimulation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 z-10 -mt-2 -mr-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse", children: "⚠️ AI Simulated Data (API Limit Hit)" }),
    chartData.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-3xl p-5 overflow-hidden backdrop-blur-xl relative group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-xl ${isPositiveTrend ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`, children: isPositiveTrend ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 18 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-black text-maintext uppercase tracking-wider", children: "30-Day Price Action" })
        ] }),
        (overview == null ? void 0 : overview.marketCap) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-subtext bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg", children: [
          "MCap: $",
          (overview.marketCap / 1e9).toFixed(1),
          "B"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[200px] w-[100%] ml-[-15px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: chartData, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "colorPrice", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: isPositiveTrend ? "#10b981" : "#e11d48", stopOpacity: 0.3 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: isPositiveTrend ? "#10b981" : "#e11d48", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          XAxis,
          {
            dataKey: "date",
            axisLine: false,
            tickLine: false,
            tick: { fontSize: 10, fill: "#94a3b8" },
            dy: 10,
            minTickGap: 20
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          YAxis,
          {
            domain: ["auto", "auto"],
            axisLine: false,
            tickLine: false,
            tick: { fontSize: 10, fill: "#94a3b8" },
            tickFormatter: (val) => `$${val}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Area,
          {
            type: "monotone",
            dataKey: "price",
            stroke: isPositiveTrend ? "#10b981" : "#e11d48",
            strokeWidth: 3,
            fillOpacity: 1,
            fill: "url(#colorPrice)",
            animationDuration: 1500
          }
        )
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      sentimentData.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-3xl p-5 backdrop-blur-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 16, className: "text-blue-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-black text-maintext uppercase tracking-wider", children: "News Sentiment" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[140px] w-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Pie,
            {
              data: sentimentData,
              cx: "50%",
              cy: "50%",
              innerRadius: 45,
              outerRadius: 65,
              paddingAngle: 5,
              dataKey: "value",
              animationDuration: 1500,
              children: sentimentData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[entry.name] || "#3b82f6" }, `cell-${index}`))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tooltip,
            {
              contentStyle: { borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", background: "var(--tw-bg-opacity, #fff)" },
              itemStyle: { fontWeight: "bold" },
              formatter: (value) => [value + " Articles", null]
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-2 mt-2", children: sentimentData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-subtext uppercase", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full", style: { backgroundColor: COLORS[entry.name] || "#3b82f6" } }),
          entry.name,
          " (",
          entry.value,
          ")"
        ] }, index)) })
      ] }),
      overview && Object.keys(overview).length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 16, className: "text-orange-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-black text-maintext uppercase tracking-wider", children: "Key Fundamentals" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-4 gap-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-subtext uppercase tracking-widest opacity-70 mb-0.5", children: "P/E Ratio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black text-maintext", children: overview.peRatio || "N/A" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-subtext uppercase tracking-widest opacity-70 mb-0.5", children: "EPS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-black text-maintext", children: [
              "$",
              overview.eps || "N/A"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-subtext uppercase tracking-widest opacity-70 mb-0.5", children: "52W High" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-black text-emerald-500", children: [
              "$",
              overview.weekHigh52 || "N/A"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-subtext uppercase tracking-widest opacity-70 mb-0.5", children: "52W Low" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-black text-rose-500", children: [
              "$",
              overview.weekLow52 || "N/A"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
export {
  CashFlowChartWidget as default
};
