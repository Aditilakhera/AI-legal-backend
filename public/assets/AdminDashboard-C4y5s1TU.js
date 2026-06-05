const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/KnowledgeUpload-D2Q50bxl.js","assets/index--V45kKqF.js","assets/index-B94wH6wK.css","assets/KnowledgeManagement-B3kknZPl.js"])))=>i.map(i=>d[i]);
import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, X, u as Search, R as RefreshCw, t as Eye, A as AnimatePresence, v as axios, w as apis, z as zt, x as useLanguage, y as useNavigate, p as getUserData, B as ChartColumn, H as Users, I as CreditCard, Z as Zap, F as FileText, J as Headphones, K as BookOpen, S as Settings, M as logo, N as ArrowLeft, O as Activity, P as DollarSign, Q as Save, a as apiService, T as Trash2, V as Plus, W as CirclePlus, C as CircleAlert, Y as Pen, D as DeleteConfirmModal, _ as Check, $ as React, a0 as __vitePreload, a1 as API } from "./index--V45kKqF.js";
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m4.9 4.9 14.2 14.2", key: "1m5liu" }]
];
const Ban = createLucideIcon("Ban", __iconNode$2);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M12 12v6", key: "3ahymv" }],
  ["path", { d: "m15 15-3-3-3 3", key: "15xj92" }]
];
const FileUp = createLucideIcon("FileUp", __iconNode$1);
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
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
const Package = createLucideIcon("Package", __iconNode);
const AdminHelpDesk = ({ isOpen, onClose, isEmbedded = false }) => {
  const [tickets, setTickets] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedTicket, setSelectedTicket] = reactExports.useState(null);
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const ticketsRes = await axios.get(`${apis.support}/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[ADMIN HELPDESK] Tickets fetched:", ticketsRes.data.tickets);
      setTickets(ticketsRes.data.tickets || []);
    } catch (error) {
      console.error("[ADMIN] Error fetching tickets:", error);
      if (error.response) {
        console.error("[ADMIN] Error details:", error.response.data);
      }
      zt.error("Failed to fetch support tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (isOpen || isEmbedded) {
      fetchTickets();
      const interval = setInterval(fetchTickets, 1e4);
      return () => clearInterval(interval);
    }
  }, [isOpen, isEmbedded]);
  const filteredTickets = (tickets || []).filter((ticket) => {
    var _a, _b, _c;
    const matchesSearch = ((_a = ticket == null ? void 0 : ticket.name) == null ? void 0 : _a.toLowerCase().includes(searchQuery.toLowerCase())) || ((_b = ticket == null ? void 0 : ticket.email) == null ? void 0 : _b.toLowerCase().includes(searchQuery.toLowerCase())) || ((_c = ticket == null ? void 0 : ticket.message) == null ? void 0 : _c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };
  if (!isOpen && !isEmbedded) return null;
  const modalClasses = "bg-background border border-border rounded-2xl w-[95vw] max-w-7xl h-[90vh] flex flex-col shadow-2xl overflow-hidden";
  const embeddedClasses = "bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl w-full h-[700px] flex flex-col shadow-xl overflow-hidden backdrop-blur-md";
  const content = /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: isEmbedded ? {} : { opacity: 0, scale: 0.95 },
      animate: isEmbedded ? {} : { opacity: 1, scale: 1 },
      exit: isEmbedded ? {} : { opacity: 0, scale: 0.95 },
      className: isEmbedded ? embeddedClasses : modalClasses,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-maintext flex items-center gap-2", children: "🎧 Admin Help Desk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-subtext mt-1", children: "Manage user support queries" })
          ] }),
          !isEmbedded && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onClose,
              className: "p-2 hover:bg-surface rounded-lg transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-6 h-6 text-subtext" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-6 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "Search tickets...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-maintext placeholder-subtext focus:outline-none focus:ring-2 focus:ring-primary"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: fetchTickets,
              className: "px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
                "Refresh"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-6", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" }) }) : filteredTickets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-subtext", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg", children: "No tickets found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-2", children: "Try adjusting your filters" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: filteredTickets.map((ticket) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-surface border border-border rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer",
            onClick: () => setSelectedTicket(ticket),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-maintext", children: ticket.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-1 rounded-full border ${getStatusColor(ticket.status)}`, children: ticket.status }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20", children: ticket.issueType })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-subtext mb-2", children: ticket.email }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-maintext line-clamp-2", children: ticket.message })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-subtext whitespace-nowrap", children: new Date(ticket.createdAt).toLocaleDateString() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      setSelectedTicket(ticket);
                    },
                    className: "p-2 hover:bg-primary/10 rounded-lg transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4 text-primary" })
                  }
                ) })
              ] })
            ] })
          },
          ticket._id
        )) }) })
      ]
    }
  );
  const ticketModal = /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedTicket && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      className: "bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl m-4",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-maintext", children: "Ticket Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSelectedTicket(null),
              className: "p-2 hover:bg-surface rounded-lg transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5 text-subtext" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm text-subtext", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-maintext font-medium", children: selectedTicket.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm text-subtext", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-maintext", children: selectedTicket.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm text-subtext", children: "Issue Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-maintext", children: selectedTicket.issueType })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm text-subtext", children: "Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-maintext bg-surface p-4 rounded-lg border border-border whitespace-pre-wrap", children: selectedTicket.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm text-subtext", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm px-3 py-1 rounded-full border ${getStatusColor(selectedTicket.status)}`, children: selectedTicket.status }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm text-subtext", children: "Created" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-maintext", children: new Date(selectedTicket.createdAt).toLocaleString() })
            ] })
          ] })
        ] })
      ] })
    }
  ) }) });
  if (isEmbedded) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full relative", children: [
      content,
      ticketModal
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm", children: [
    content,
    ticketModal
  ] });
};
const KnowledgeUpload = React.lazy(() => __vitePreload(() => import("./KnowledgeUpload-D2Q50bxl.js"), true ? __vite__mapDeps([0,1,2]) : void 0).catch(() => ({ default: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-subtext", children: "AI Base Module not found." }) })));
const KnowledgeManagement = React.lazy(() => __vitePreload(() => import("./KnowledgeManagement-B3kknZPl.js"), true ? __vite__mapDeps([3,1,2]) : void 0).catch(() => ({ default: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-subtext", children: "AI Base Module not found." }) })));
const ADMIN_EMAIL = "admin@uwo24.com";
const LoadingSpinner = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" }) });
const TabButton = ({ active, icon: Icon, label, onClick }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "button",
  {
    onClick,
    className: `flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${active ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-subtext hover:bg-white/20 dark:hover:bg-white/10 hover:text-maintext"}`,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }),
      label
    ]
  }
);
const StatCard = ({ icon: Icon, label, value, color = "primary", trend }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  motion.div,
  {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    className: "bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-primary/30 transition-all",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 text-${color}` }) }),
          trend && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg", children: trend })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black text-maintext", children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-subtext uppercase tracking-wider mt-1", children: label })
      ] })
    ]
  }
);
const SectionCard = ({ title, children, action }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl overflow-hidden", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-white/20 dark:border-white/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-maintext text-lg", children: title }),
    action
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children })
] });
const OverviewTab = () => {
  const { t } = useLanguage();
  const [stats, setStats] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [refreshing, setRefreshing] = reactExports.useState(false);
  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await apiService.getAdminOverviewStats();
      setStats(data.stats || data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  reactExports.useEffect(() => {
    fetchStats();
    const interval = setInterval(() => fetchStats(), 1e4);
    return () => clearInterval(interval);
  }, []);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-8 h-8 text-primary animate-spin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext text-sm", children: t("loadingRealTimeOverview") })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-bold text-subtext uppercase tracking-widest flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 text-primary" }),
        " ",
        t("livePlatformActivity")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => fetchStats(true),
          disabled: refreshing,
          className: "p-2 rounded-lg hover:bg-primary/10 text-primary transition-all disabled:opacity-50",
          title: "Manual Refresh",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 ${refreshing ? "animate-spin" : ""}` })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Users, label: t("totalUsers"), value: (stats == null ? void 0 : stats.totalUsers) ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Activity, label: t("activeSubscriptions"), value: (stats == null ? void 0 : stats.activeSubscriptions) ?? 0, color: "emerald-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: DollarSign, label: t("totalRevenue"), value: `₹${(stats == null ? void 0 : stats.totalRevenue) ?? 0}`, color: "amber-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Zap, label: t("creditsUsed"), value: (stats == null ? void 0 : stats.totalCreditsUsed) ?? 0, color: "violet-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Headphones, label: t("support"), value: (stats == null ? void 0 : stats.pendingTickets) ?? 0, color: "primary", trend: (stats == null ? void 0 : stats.pendingTickets) > 0 ? "Action Required" : "All Clear" })
    ] }),
    (stats == null ? void 0 : stats.toolUsage) && stats.toolUsage.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: t("toolUsageAnalytics"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: stats.toolUsage.map((tool, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-white/20 dark:bg-white/5 rounded-xl border border-white/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-maintext text-sm", children: tool._id || "Unknown" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-subtext", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          tool.count,
          " uses"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-primary", children: [
          tool.totalCredits,
          " credits"
        ] })
      ] })
    ] }, i)) }) })
  ] });
};
const UsersTab = () => {
  const { t } = useLanguage();
  const [users, setUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const [creditAmount, setCreditAmount] = reactExports.useState("");
  const [upgradeData, setUpgradeData] = reactExports.useState({ planName: "", expiryDate: "" });
  const [deleteModal, setDeleteModal] = reactExports.useState({ isOpen: false, userId: null });
  reactExports.useEffect(() => {
    fetchUsers();
    fetchPlans();
  }, []);
  const [availablePlans, setAvailablePlans] = reactExports.useState([]);
  const fetchPlans = async () => {
    try {
      const data = await apiService.getPlans();
      setAvailablePlans(Array.isArray(data) ? data : data.plans || []);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    }
  };
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleBlockToggle = async (userId, currentStatus) => {
    try {
      await apiService.toggleBlockUser(userId, !currentStatus);
      zt.success(currentStatus ? "User unblocked" : "User blocked");
      fetchUsers();
    } catch (err) {
      zt.error("Failed to update user status");
    }
  };
  const handleDeleteUser = async () => {
    if (!deleteModal.userId) return;
    try {
      await apiService.deleteUser(deleteModal.userId);
      zt.success("User deleted");
      setDeleteModal({ isOpen: false, userId: null });
      fetchUsers();
    } catch (err) {
      zt.error("Failed to delete user");
      setDeleteModal({ isOpen: false, userId: null });
    }
  };
  const handleAdjustCredits = async (userId, amount = null, absoluteCredits = null) => {
    var _a;
    if (amount === null && absoluteCredits === null && !creditAmount) return;
    const payload = { userId };
    if (amount !== null) payload.amount = amount;
    else if (absoluteCredits !== null) payload.credits = absoluteCredits;
    else payload.credits = parseInt(creditAmount);
    try {
      const response = await fetch(`${API}/admin/adjust-credits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(_a = getUserData()) == null ? void 0 : _a.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        zt.success("Credits adjusted successfully!");
        setCreditAmount("");
        fetchUsers();
      } else {
        zt.error(data.message || "Failed");
      }
    } catch (err) {
      zt.error("Failed to adjust credits");
    }
  };
  const [isUpgrading, setIsUpgrading] = reactExports.useState(null);
  const handleManualUpgrade = async (userId) => {
    var _a;
    if (!upgradeData.planName) {
      zt.error("Please select a plan");
      return;
    }
    setIsUpgrading(userId);
    try {
      const response = await fetch(`${API}/admin/manual-upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(_a = getUserData()) == null ? void 0 : _a.token}`
        },
        body: JSON.stringify({ userId, ...upgradeData })
      });
      const data = await response.json();
      if (data.success) {
        zt.success("Plan upgraded successfully");
        setUpgradeData({ planName: "", expiryDate: "" });
        fetchUsers();
      } else {
        zt.error(data.message || "Failed to upgrade plan");
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      zt.error("Failed to upgrade plan");
    } finally {
      setIsUpgrading(null);
    }
  };
  const filteredUsers = users.filter(
    (u) => {
      var _a, _b;
      return ((_a = u.name) == null ? void 0 : _a.toLowerCase().includes(searchQuery.toLowerCase())) || ((_b = u.email) == null ? void 0 : _b.toLowerCase().includes(searchQuery.toLowerCase()));
    }
  );
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: t("searchUsersPlaceholder"),
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: "w-full bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-subtext/50 text-maintext"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      filteredUsers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-subtext py-8 text-sm", children: t("noUsersFound") }),
      filteredUsers.map((user) => {
        var _a, _b, _c, _d, _e;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            layout: true,
            className: "bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl p-4 hover:border-primary/20 transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-white/10 shrink-0", children: user.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.avatar, alt: user.name, className: "w-full h-full object-cover", onError: (e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/account.png";
                  } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-primary text-sm", children: ((_b = (_a = user.name) == null ? void 0 : _a.charAt(0)) == null ? void 0 : _b.toUpperCase()) || "U" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-maintext text-sm truncate", children: user.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext truncate", children: user.email })
                  ] }),
                  user.isBlocked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[10px] font-bold uppercase", children: t("block") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${((_c = user.planName) == null ? void 0 : _c.toLowerCase().includes("pro")) ? "bg-amber-500/10 text-amber-500" : ((_d = user.planName) == null ? void 0 : _d.toLowerCase().includes("founder")) ? "bg-purple-500/10 text-purple-500" : "bg-primary/10 text-primary"}`, children: user.planName || user.role || "Free Plan" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setSelectedUser(selectedUser === (user._id || user.id) ? null : user._id || user.id),
                      className: "p-2 rounded-lg hover:bg-primary/10 text-subtext hover:text-primary transition-all",
                      title: t("manage"),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleBlockToggle(user._id || user.id, user.isBlocked),
                      className: `p-2 rounded-lg transition-all ${user.isBlocked ? "hover:bg-green-500/10 text-green-500" : "hover:bg-amber-500/10 text-amber-500"}`,
                      title: user.isBlocked ? t("unblock") : t("block"),
                      children: user.isBlocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setDeleteModal({ isOpen: true, userId: user._id || user.id }),
                      className: "p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all",
                      title: t("delete"),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedUser === (user._id || user.id) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { height: 0, opacity: 0 },
                  animate: { height: "auto", opacity: 1 },
                  exit: { height: 0, opacity: 0 },
                  className: "overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 dark:bg-black/10 rounded-xl p-4 space-y-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-sm text-maintext flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-amber-500" }),
                        " ",
                        t("transferCredits")
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-subtext", children: [
                        t("userBalance"),
                        ": ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-maintext", children: user.credits ?? 0 })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-maintext font-black text-sm opacity-60", children: "+" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "number",
                            placeholder: t("amountToSend"),
                            value: creditAmount,
                            onChange: (e) => setCreditAmount(e.target.value),
                            className: "w-full bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg py-2 pl-7 pr-3 text-sm outline-none focus:border-amber-500/50 text-maintext font-bold",
                            min: "1"
                          }
                        )
                      ] }),
                      creditAmount && parseInt(creditAmount) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-1 flex items-center gap-2 text-[11px] text-amber-500 font-bold", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3 h-3" }),
                        "New Balance: ",
                        (user.credits ?? 0) + parseInt(creditAmount),
                        " Credits"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => {
                            handleAdjustCredits(user._id || user.id, parseInt(creditAmount));
                          },
                          disabled: !creditAmount || parseInt(creditAmount) <= 0,
                          className: "w-full py-2 bg-amber-500 text-white rounded-lg font-bold text-xs disabled:opacity-40 hover:bg-amber-600 transition-all flex justify-center items-center gap-2",
                          children: t("sendCredits")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 dark:bg-black/10 rounded-xl p-4 space-y-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-sm text-maintext flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-primary" }),
                        " ",
                        t("manualPlanUpgrade")
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "select",
                        {
                          value: upgradeData.planName,
                          onChange: (e) => {
                            var _a2;
                            const selectedPlanName = e.target.value;
                            setUpgradeData((p) => ({ ...p, planName: selectedPlanName }));
                            const planCredits = ((_a2 = availablePlans.find((p) => p.planName === selectedPlanName)) == null ? void 0 : _a2.credits) || 0;
                            setCreditAmount(planCredits.toString());
                          },
                          className: "w-full bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-2 px-3 text-sm outline-none focus:border-primary/50 text-maintext",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, className: "bg-slate-50 dark:bg-zinc-900 text-subtext", children: t("selectPlan") || "Select Plan" }),
                            availablePlans.map((plan) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: plan.planName, className: "bg-slate-50 dark:bg-zinc-900 text-maintext", children: plan.planName }, plan._id))
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "date",
                          value: upgradeData.expiryDate,
                          onChange: (e) => setUpgradeData((p) => ({ ...p, expiryDate: e.target.value })),
                          className: "w-full bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-2 px-3 text-sm outline-none focus:border-primary/50 text-maintext"
                        }
                      ),
                      upgradeData.planName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-1 flex items-center gap-2 text-[11px] text-amber-500 font-bold", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }),
                        "Plan Includes: ",
                        ((_e = availablePlans.find((p) => p.planName === upgradeData.planName)) == null ? void 0 : _e.credits) || 0,
                        " Credits"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => handleManualUpgrade(user._id || user.id),
                          disabled: !upgradeData.planName || isUpgrading === (user._id || user.id),
                          className: "w-full py-2 bg-primary text-white rounded-lg font-bold text-xs disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2",
                          children: isUpgrading === (user._id || user.id) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 animate-spin" }),
                            t("upgrading") || "Upgrading..."
                          ] }) : t("upgradePlan") || "Upgrade Plan"
                        }
                      )
                    ] })
                  ] })
                }
              ) })
            ]
          },
          user._id || user.id
        );
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmModal,
      {
        isOpen: deleteModal.isOpen,
        onClose: () => setDeleteModal({ isOpen: false, userId: null }),
        onConfirm: handleDeleteUser,
        title: t("deleteUserTitle"),
        description: t("deleteUserDesc")
      }
    )
  ] });
};
const PlansTab = () => {
  const { t } = useLanguage();
  const [plans, setPlans] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingPlan, setEditingPlan] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    planId: "",
    planName: "",
    priceMonthly: "",
    priceYearly: "",
    credits: "",
    creditsYearly: "",
    features: ""
  });
  const [deleteModal, setDeleteModal] = reactExports.useState({ isOpen: false, planId: null });
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    fetchPlans();
  }, []);
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPlans();
      setPlans(Array.isArray(data) ? data : data.plans || []);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const body = {
        ...form,
        priceMonthly: Number(form.priceMonthly),
        priceYearly: Number(form.priceYearly),
        credits: Number(form.credits),
        creditsYearly: Number(form.creditsYearly),
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean)
      };
      let data;
      if (editingPlan) {
        data = await apiService.updatePlan(editingPlan._id, body);
      } else {
        data = await apiService.createPlan(body);
      }
      if (data.success) {
        zt.success(editingPlan ? "Plan updated" : "Plan created");
        resetForm();
        fetchPlans();
      } else {
        zt.error(data.message || "Failed");
      }
    } catch (err) {
      zt.error("Failed to save plan");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!deleteModal.planId) return;
    try {
      await apiService.deletePlan(deleteModal.planId);
      zt.success("Plan deleted");
      setDeleteModal({ isOpen: false, planId: null });
      fetchPlans();
    } catch (err) {
      zt.error("Failed to delete plan");
      setDeleteModal({ isOpen: false, planId: null });
    }
  };
  const startEdit = (plan) => {
    var _a, _b, _c, _d;
    setEditingPlan(plan);
    setForm({
      planId: plan.planId || "",
      planName: plan.planName || "",
      priceMonthly: ((_a = plan.priceMonthly) == null ? void 0 : _a.toString()) || "",
      priceYearly: ((_b = plan.priceYearly) == null ? void 0 : _b.toString()) || "",
      credits: ((_c = plan.credits) == null ? void 0 : _c.toString()) || "",
      creditsYearly: ((_d = plan.creditsYearly) == null ? void 0 : _d.toString()) || "",
      features: (plan.features || []).join(", ")
    });
    setShowForm(true);
  };
  const resetForm = () => {
    setForm({ planId: "", planName: "", priceMonthly: "", priceYearly: "", credits: "", creditsYearly: "", features: "" });
    setEditingPlan(null);
    setShowForm(false);
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          resetForm();
          setShowForm(!showForm);
        },
        className: "flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          " New Plan"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        className: "overflow-hidden",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-maintext", children: editingPlan ? "Edit Plan" : "Create New Plan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                placeholder: "Plan ID (e.g. starter-plan)",
                value: form.planId,
                onChange: (e) => setForm((p) => ({ ...p, planId: e.target.value })),
                className: "bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                placeholder: "Plan Name",
                value: form.planName,
                onChange: (e) => setForm((p) => ({ ...p, planName: e.target.value })),
                className: "bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                placeholder: "Price Monthly (₹)",
                type: "number",
                value: form.priceMonthly,
                onChange: (e) => setForm((p) => ({ ...p, priceMonthly: e.target.value })),
                className: "bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext no-spinner"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                placeholder: "Price Yearly (₹)",
                type: "number",
                value: form.priceYearly,
                onChange: (e) => setForm((p) => ({ ...p, priceYearly: e.target.value })),
                className: "bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext no-spinner"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                placeholder: "Credits (Monthly)",
                type: "number",
                value: form.credits,
                onChange: (e) => setForm((p) => ({ ...p, credits: e.target.value })),
                className: "bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext no-spinner"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                placeholder: "Credits (Yearly)",
                type: "number",
                value: form.creditsYearly,
                onChange: (e) => setForm((p) => ({ ...p, creditsYearly: e.target.value })),
                className: "bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext no-spinner"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              placeholder: "Features (comma-separated)",
              value: form.features,
              onChange: (e) => setForm((p) => ({ ...p, features: e.target.value })),
              className: "w-full bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: resetForm, className: "px-4 py-2 rounded-xl text-sm font-bold text-subtext hover:text-maintext hover:bg-white/20 transition-all", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSubmit, className: "px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20", children: editingPlan ? "Update" : "Create" })
          ] })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [
      plans.map((plan) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-5 hover:border-primary/20 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-maintext", children: plan.planName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-black text-primary leading-none", children: [
                "₹",
                plan.priceMonthly,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-subtext font-normal ml-1", children: "/mo" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-subtext", children: [
                "Yearly: ₹",
                plan.priceYearly,
                " (₹",
                Math.round(plan.priceYearly / 12),
                "/mo)"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => startEdit(plan), className: "p-2 rounded-lg hover:bg-primary/10 text-subtext hover:text-primary transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeleteModal({ isOpen: true, planId: plan._id }), className: "p-2 rounded-lg hover:bg-red-500/10 text-subtext hover:text-red-500 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs text-subtext", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 text-amber-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-maintext", children: plan.credits }),
            " / ",
            plan.creditsYearly || plan.credits * 12,
            " credits (M/Y)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-[10px] opacity-70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-3 h-3" }),
            "ID: ",
            plan.planId
          ] }),
          plan.features && plan.features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 pt-2 border-t border-white/10 space-y-1", children: plan.features.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 text-green-500" }),
            " ",
            f
          ] }, i)) })
        ] })
      ] }, plan._id)),
      plans.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext text-sm col-span-full text-center py-8", children: "No plans created yet" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmModal,
      {
        isOpen: deleteModal.isOpen,
        onClose: () => setDeleteModal({ isOpen: false, planId: null }),
        onConfirm: handleDelete,
        title: "Delete Plan?",
        description: "Are you sure you want to delete this plan? This action cannot be undone."
      }
    )
  ] });
};
const PackagesTab = () => {
  const { t } = useLanguage();
  const [packages, setPackages] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingPkg, setEditingPkg] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({ name: "", credits: "", price: "", description: "" });
  const [deleteModal, setDeleteModal] = reactExports.useState({ isOpen: false, pkgId: null });
  reactExports.useEffect(() => {
    fetchPackages();
  }, []);
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPackages();
      setPackages(Array.isArray(data) ? data : data.packages || []);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    try {
      const body = { ...form, credits: Number(form.credits), price: Number(form.price) };
      let data;
      if (editingPkg) {
        data = await apiService.updatePackage(editingPkg._id, body);
      } else {
        data = await apiService.createPackage(body);
      }
      if (data.success) {
        zt.success(editingPkg ? "Package updated" : "Package created");
        resetForm();
        fetchPackages();
      }
    } catch (err) {
      zt.error("Failed to save package");
    }
  };
  const handleDelete = async () => {
    if (!deleteModal.pkgId) return;
    try {
      await apiService.deletePackage(deleteModal.pkgId);
      zt.success("Package deleted");
      setDeleteModal({ isOpen: false, pkgId: null });
      fetchPackages();
    } catch (err) {
      zt.error("Failed to delete package");
      setDeleteModal({ isOpen: false, pkgId: null });
    }
  };
  const startEdit = (pkg) => {
    var _a, _b;
    setEditingPkg(pkg);
    setForm({ name: pkg.name || "", credits: ((_a = pkg.credits) == null ? void 0 : _a.toString()) || "", price: ((_b = pkg.price) == null ? void 0 : _b.toString()) || "", description: pkg.description || "" });
    setShowForm(true);
  };
  const resetForm = () => {
    setForm({ name: "", credits: "", price: "", description: "" });
    setEditingPkg(null);
    setShowForm(false);
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          resetForm();
          setShowForm(!showForm);
        },
        className: "flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          " New Package"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-maintext", children: editingPkg ? "Edit Package" : "Create New Package" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            placeholder: "Package Name",
            value: form.name,
            onChange: (e) => setForm((p) => ({ ...p, name: e.target.value })),
            className: "bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            placeholder: "Credits",
            type: "number",
            value: form.credits,
            onChange: (e) => setForm((p) => ({ ...p, credits: e.target.value })),
            className: "bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext no-spinner"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            placeholder: "Price (₹)",
            type: "number",
            value: form.price,
            onChange: (e) => setForm((p) => ({ ...p, price: e.target.value })),
            className: "bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext no-spinner"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          placeholder: "Description",
          value: form.description,
          onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })),
          className: "w-full bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: resetForm, className: "px-4 py-2 rounded-xl text-sm font-bold text-subtext hover:text-maintext hover:bg-white/20 transition-all", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSubmit, className: "px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20", children: editingPkg ? "Update" : "Create" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [
      packages.map((pkg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-5 hover:border-primary/20 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-maintext", children: pkg.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext mt-1", children: pkg.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => startEdit(pkg), className: "p-2 rounded-lg hover:bg-primary/10 text-subtext hover:text-primary transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeleteModal({ isOpen: true, pkgId: pkg._id }), className: "p-2 rounded-lg hover:bg-red-500/10 text-subtext hover:text-red-500 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-black text-primary", children: [
            "₹",
            pkg.price
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-subtext font-semibold", children: [
            pkg.credits,
            " credits"
          ] })
        ] })
      ] }, pkg._id)),
      packages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext text-sm col-span-full text-center py-8", children: "No packages created yet" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmModal,
      {
        isOpen: deleteModal.isOpen,
        onClose: () => setDeleteModal({ isOpen: false, pkgId: null }),
        onConfirm: handleDelete,
        title: "Delete Package?",
        description: "Are you sure you want to delete this package? This action cannot be undone."
      }
    )
  ] });
};
const SettingsTab = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await apiService.getAdminSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);
  const handleSave = async () => {
    setSaving(true);
    try {
      await apiService.updateAdminSettings(settings);
      zt.success("Settings saved");
    } catch (err) {
      zt.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SectionCard,
    {
      title: "Admin Settings",
      action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleSave,
          disabled: saving,
          className: "flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50",
          children: [
            saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
            "Save"
          ]
        }
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold uppercase tracking-wider text-subtext", children: "Organization Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: (settings == null ? void 0 : settings.organizationName) || "",
              onChange: (e) => setSettings((p) => ({ ...p, organizationName: e.target.value })),
              className: "w-full bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold uppercase tracking-wider text-subtext", children: "Default AI Model" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: (settings == null ? void 0 : settings.defaultModel) || "",
              onChange: (e) => setSettings((p) => ({ ...p, defaultModel: e.target.value })),
              className: "w-full bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold uppercase tracking-wider text-subtext", children: "Max Tokens Per User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: (settings == null ? void 0 : settings.maxTokensPerUser) || "",
              onChange: (e) => setSettings((p) => ({ ...p, maxTokensPerUser: Number(e.target.value) })),
              className: "w-full bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary/50 text-maintext no-spinner"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold uppercase tracking-wider text-subtext", children: "Allow Public Signup" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSettings((p) => ({ ...p, allowPublicSignup: !p.allowPublicSignup })),
              className: `w-full py-3 rounded-xl font-bold text-sm transition-all border ${(settings == null ? void 0 : settings.allowPublicSignup) ? "bg-green-500/10 border-green-500/30 text-green-500" : "bg-red-500/10 border-red-500/30 text-red-500"}`,
              children: (settings == null ? void 0 : settings.allowPublicSignup) ? "Enabled" : "Disabled"
            }
          )
        ] })
      ] })
    }
  );
};
const LegalPagesTab = () => {
  const { t } = useLanguage();
  const [selectedPage, setSelectedPage] = reactExports.useState("cookie-policy");
  const [pageData, setPageData] = reactExports.useState({ sections: [] });
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [isParsing, setIsParsing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    fetchPage();
  }, [selectedPage]);
  const fetchPage = async () => {
    setLoading(true);
    try {
      const data = await apiService.getLegalPage(selectedPage);
      if (data && data.sections && data.sections.length > 0) {
        setPageData(data);
      } else {
        setPageData({
          sections: [],
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    } catch (err) {
      zt.error("Failed to fetch legal page data");
      setPageData({ sections: [] });
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      await apiService.updateLegalPage(selectedPage, pageData.sections);
      zt.success("Legal page updated successfully");
    } catch (err) {
      zt.error("Failed to update legal page");
    } finally {
      setSaving(false);
    }
  };
  const addSection = () => {
    setPageData((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: "New Section", content: [{ subtitle: "New Subtitle", text: "Section content here..." }] }]
    }));
  };
  const removeSection = (index) => {
    setPageData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };
  const updateSection = (index, field, value) => {
    setPageData((prev) => {
      const newSections = [...prev.sections];
      newSections[index] = { ...newSections[index], [field]: value };
      return { ...prev, sections: newSections };
    });
  };
  const addContent = (sectionIndex) => {
    setPageData((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        content: [...newSections[sectionIndex].content, { subtitle: "New Subtitle", text: "Content text here..." }]
      };
      return { ...prev, sections: newSections };
    });
  };
  const removeContent = (sectionIndex, contentIndex) => {
    setPageData((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        content: newSections[sectionIndex].content.filter((_, i) => i !== contentIndex)
      };
      return { ...prev, sections: newSections };
    });
  };
  const updateContent = (sectionIndex, contentIndex, field, value) => {
    setPageData((prev) => {
      const newSections = [...prev.sections];
      const newContent = [...newSections[sectionIndex].content];
      newContent[contentIndex] = { ...newContent[contentIndex], [field]: value };
      newSections[sectionIndex] = { ...newSections[sectionIndex], content: newContent };
      return { ...prev, sections: newSections };
    });
  };
  const handleDocUpload = async (e) => {
    var _a, _b, _c, _d;
    const file = e.target.files[0];
    if (!file) return;
    setIsParsing(true);
    try {
      const res = await apiService.parseLegalDoc(file);
      if (res.success && res.sections && res.sections.length > 0) {
        setPageData((prev) => ({ ...prev, sections: res.sections }));
        zt.success(`Successfully parsed ${res.sections.length} sections from ${file.name}!`);
      } else {
        zt.error("Could not detect sections in the document.");
      }
    } catch (err) {
      console.error("Doc upload error:", err);
      const errMsg = ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || ((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.error) || err.message;
      zt.error(errMsg || "Failed to parse document. Ensure it is a valid PDF, DOCX, or TXT file.");
    } finally {
      setIsParsing(false);
      e.target.value = "";
    }
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 bg-white/20 dark:bg-white/5 rounded-xl p-1 border border-white/10 overflow-x-auto admin-horizontal-scrollbar", children: ["cookie-policy", "terms-of-service", "privacy-policy"].map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSelectedPage(type),
          className: `px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${selectedPage === type ? "bg-primary text-white shadow-md" : "text-subtext hover:bg-white/10 hover:text-maintext"}`,
          children: type.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        },
        type
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-maintext rounded-xl font-bold text-sm transition-all border border-white/20 cursor-pointer ${isParsing ? "opacity-50 cursor-not-allowed" : ""}`, children: [
          isParsing ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileUp, { className: "w-4 h-4" }),
          isParsing ? "Parsing..." : "Upload Document",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              className: "hidden",
              accept: ".txt,.md,.pdf,.docx",
              onChange: handleDocUpload,
              disabled: isParsing
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleSave,
            disabled: saving || isParsing,
            className: "flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50",
            children: [
              saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
              "Save Changes"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionCard,
      {
        title: `${selectedPage.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} Content Management`,
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: addSection,
            className: "flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold text-maintext border border-white/10 transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-3.5 h-3.5" }),
              "Add Section"
            ]
          }
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
          pageData.sections.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 border-2 border-dashed border-white/10 rounded-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext text-sm mb-4", children: "No content found. Please create the first section to start building this page." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: addSection,
                className: "px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all",
                children: "Create First Section"
              }
            )
          ] }),
          pageData.sections.map((section, sIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white/10 dark:bg-white/5 rounded-2xl p-6 border border-white/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => removeSection(sIdx),
                className: "absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/30",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-primary", children: "Section Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: section.title,
                  onChange: (e) => updateSection(sIdx, "title", e.target.value),
                  className: "w-full bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-primary/50 text-maintext"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 ml-6 pl-6 border-l-2 border-primary/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-primary/50", children: "Section Content Units" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => addContent(sIdx),
                    className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] bg-primary text-white hover:opacity-90 font-bold transition-all shadow-lg shadow-primary/20",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                      " Add Content Unit"
                    ]
                  }
                )
              ] }),
              section.content.map((item, cIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 dark:bg-black/40 rounded-2xl p-6 space-y-4 relative group border border-white/5 hover:border-primary/30 transition-all", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => removeContent(sIdx, cIdx),
                    className: "absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        value: item.subtitle,
                        onChange: (e) => updateContent(sIdx, cIdx, "subtitle", e.target.value),
                        placeholder: "Subtitle (e.g. 1.1 Eligibility)",
                        className: `w-full bg-transparent border-none p-0 text-sm font-bold outline-none text-maintext placeholder:text-subtext/20 ${["General Terms", "Policy Overview", "Introduction", "N/A", ""].includes(item.subtitle) ? "opacity-20 italic font-normal" : ""}`
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      value: item.text,
                      onChange: (e) => updateContent(sIdx, cIdx, "text", e.target.value),
                      rows: 3,
                      className: "w-full bg-transparent border-none p-0 text-xs outline-none text-subtext resize-none placeholder:text-subtext/30"
                    }
                  )
                ] })
              ] }, cIdx))
            ] })
          ] }, sIdx))
        ] })
      }
    )
  ] });
};
const KnowledgeBaseTab = () => {
  const { t } = useLanguage();
  const [refreshTrigger, setRefreshTrigger] = reactExports.useState(0);
  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    zt.success(t("uploadSuccessKnowledge"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" }) }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionCard,
      {
        title: t("ingestNewKnowledge"),
        action: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-subtext font-medium", children: t("addFilesWebsitesRAG") }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(KnowledgeUpload, { onUploadSuccess: handleUploadSuccess })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: t("knowledgeAssetsManagement"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(KnowledgeManagement, {}, refreshTrigger) })
  ] }) });
};
const FeatureCreditsTab = () => {
  const { t } = useLanguage();
  const [features, setFeatures] = reactExports.useState([]);
  const [modifiedFeatures, setModifiedFeatures] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [showAiAdsModal, setShowAiAdsModal] = reactExports.useState(false);
  const AI_ADS_FEATURES = [
    "ai_ads_agent",
    "gemini_flash",
    "activate_strategy",
    "generate_content",
    "regenerate_content",
    "strategy_7days",
    "strategy_1x_week",
    "strategy_3x_week",
    "strategy_daily",
    "strategy_2x_daily"
  ];
  const fetchFeatures = async () => {
    try {
      const res = await apiService.getFeatureCredits();
      if (res.success && res.features) {
        setFeatures(res.features.sort((a, b) => a.category.localeCompare(b.category)));
        setModifiedFeatures({});
      }
    } catch (err) {
      zt.error(t("failedToLoadFeatureCredits") || "Failed to load feature credits");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchFeatures();
  }, []);
  const handleFeatureChange = (id, field, value) => {
    setModifiedFeatures((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };
  const handleSaveChanges = async () => {
    const changes = Object.entries(modifiedFeatures);
    if (changes.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(changes.map(async ([id, data]) => {
        const original = features.find((f) => f._id === id);
        const updatePayload = {
          cost: data.cost !== void 0 ? Number(data.cost) : original.cost,
          uiLabel: data.uiLabel !== void 0 ? data.uiLabel : original.uiLabel
        };
        await apiService.updateFeatureCredit(id, updatePayload);
      }));
      zt.success(t("featureCostsUpdated") || "All feature costs updated successfully!");
      fetchFeatures();
    } catch (error) {
      zt.error(t("failedToSaveFeatures") || "Failed to save some features");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {});
  const grouped = features.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});
  const hasChanges = Object.keys(modifiedFeatures).length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-4 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-primary shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-maintext", children: t("creditCostEconomics") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext mt-1", children: t("platformEconomicsDesc") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: fetchFeatures,
            className: "px-4 py-2 bg-white/10 dark:bg-black/20 text-maintext rounded-xl font-bold text-sm hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2",
            disabled: saving,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 ${saving ? "animate-spin" : ""}` }),
              " ",
              t("reset")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleSaveChanges,
            disabled: !hasChanges || saving,
            className: `px-5 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${hasChanges && !saving ? "bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105" : "bg-white/5 text-subtext cursor-not-allowed border border-white/10"}`,
            children: [
              saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
              t("saveChanges")
            ]
          }
        )
      ] })
    ] }),
    Object.entries(grouped).map(([category, items]) => {
      const isAdvanceCategory = category === "AISA Advance Feature";
      const regularFeatures = isAdvanceCategory ? items.filter((f) => !AI_ADS_FEATURES.includes(f.featureKey)) : items;
      const aiAdsFeatures = isAdvanceCategory ? items.filter((f) => AI_ADS_FEATURES.includes(f.featureKey)) : [];
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: category, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [
        isAdvanceCategory && aiAdsFeatures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => setShowAiAdsModal(true),
            className: "bg-white/5 border border-white/10 rounded-xl p-4 relative flex flex-col justify-between hover:bg-white/10 hover:border-primary/50 transition-colors cursor-pointer group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-subtext uppercase tracking-wider mb-1", children: "AI_ADS_AGENT_SUITE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-maintext text-lg", children: "AI ADS™ Credits" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext mt-1.5", children: "Manage credit costs for Visuals, Strategy, Content, and Brand Scraping." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between border-t border-white/10 pt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary font-bold group-hover:text-primary transition-colors", children: [
                  "Configure ",
                  aiAdsFeatures.length,
                  " Features"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-4 h-4 group-hover:rotate-90 transition-transform" }) })
              ] })
            ]
          }
        ),
        regularFeatures.map((f) => {
          const mod = modifiedFeatures[f._id] || {};
          const currentCost = mod.cost !== void 0 ? mod.cost : f.cost;
          const currentLabel = mod.uiLabel !== void 0 ? mod.uiLabel : f.uiLabel;
          const isChanged = mod.cost !== void 0 || mod.uiLabel !== void 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-white/5 border rounded-xl p-4 relative flex flex-col justify-between transition-colors ${isChanged ? "border-primary/50" : "border-white/10"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-subtext uppercase tracking-wider mb-1", children: f.featureKey }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  className: "font-bold text-maintext bg-transparent border-none p-0 outline-none w-full",
                  value: currentLabel,
                  onChange: (e) => handleFeatureChange(f._id, "uiLabel", e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext font-medium", children: "Credit Cost" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center bg-black/20 rounded-lg w-24 overflow-hidden border border-transparent focus-within:border-primary/50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  className: "bg-transparent border-none outline-none text-right font-black text-primary text-lg w-full p-2 no-spinner",
                  value: currentCost,
                  onChange: (e) => handleFeatureChange(f._id, "cost", e.target.value),
                  min: "0"
                }
              ) })
            ] })
          ] }, f._id);
        })
      ] }) }, category);
    }),
    showAiAdsModal && (() => {
      const getBase = (key) => {
        const f = features.find((f2) => f2.featureKey === key);
        if (!f) return 0;
        const mod = modifiedFeatures[f._id];
        return (mod == null ? void 0 : mod.cost) !== void 0 ? Number(mod.cost) : f.cost;
      };
      getBase("gemini_flash");
      getBase("activate_strategy");
      const baseVisual = getBase("ai_ads_agent");
      getBase("generate_content");
      getBase("regenerate_content");
      const strategyRows = [
        { key: "strategy_7days", label: "7 Days (Starter)", days: 7, posts: 7, freeOnly: true },
        { key: "strategy_1x_week", label: "1x per week", days: 30, posts: 4, freeOnly: false },
        { key: "strategy_3x_week", label: "3x per week", days: 30, posts: 12, freeOnly: false },
        { key: "strategy_daily", label: "Daily", days: 30, posts: 30, freeOnly: false },
        { key: "strategy_2x_daily", label: "2x Daily (High Growth)", days: 30, posts: 60, freeOnly: false }
      ];
      const carouselRows = [
        { slides: 2, credits: baseVisual * 2 },
        { slides: 3, credits: baseVisual * 3 },
        { slides: 4, credits: baseVisual * 4 }
      ];
      const FIXED_KEYS = [
        { key: "brand_setup", label: "Brand Setup Save", note: "No AI call — always free" },
        { key: "gemini_flash", label: "Website Scraping", note: "Per scrape (Gemini Flash)" },
        { key: "generate_content", label: "Content Generation", note: "Per calendar row" },
        { key: "regenerate_content", label: "Regeneration / Hashtags", note: "Per re-roll" },
        { key: "ai_ads_agent", label: "Visual Post (Single)", note: "GPT-4 + Imagen 3 per image" }
      ];
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface dark:bg-[#0e0e0e] border border-border/50 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-black text-maintext", children: "AI ADS™ Credit System" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext mt-0.5", children: "Full pricing matrix — edit base costs, dynamic costs auto-calculate" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowAiAdsModal(false), className: "w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-subtext", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-4 bg-primary rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-black uppercase tracking-widest text-maintext", children: "Fixed Base Costs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-subtext ml-1", children: "(editable — saved to DB)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: FIXED_KEYS.map(({ key, label, note }) => {
              const f = features.find((f2) => f2.featureKey === key);
              if (!f) return null;
              const mod = modifiedFeatures[f._id] || {};
              const currentCost = mod.cost !== void 0 ? mod.cost : f.cost;
              const isChanged = mod.cost !== void 0 || mod.uiLabel !== void 0;
              const isFree = key === "brand_setup";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between gap-3 rounded-xl px-4 py-3 border transition-all ${isChanged ? "border-primary/50 bg-primary/5" : "border-white/10 bg-white/5"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-wider text-subtext", children: key }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-maintext truncate", children: label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-subtext/70 mt-0.5", children: note })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex items-center gap-1.5 rounded-lg px-2 py-1 border shrink-0 ${isFree ? "bg-green-500/10 border-green-500/20" : "bg-black/20 border-transparent focus-within:border-primary/50"}`, children: isFree ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-black text-lg w-10 text-right", children: "FREE" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      className: "bg-transparent border-none outline-none text-right font-black text-primary text-xl w-16 no-spinner",
                      value: currentCost,
                      onChange: (e) => handleFeatureChange(f._id, "cost", e.target.value),
                      min: "0"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-subtext font-bold", children: "cr" })
                ] }) })
              ] }, f._id);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-4 bg-amber-400 rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-black uppercase tracking-widest text-maintext", children: "Strategy Activation — Dynamic Pricing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-subtext ml-1", children: "(editable — saved to DB)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-white/10 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-white/5 border-b border-white/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-subtext", children: "Posting Frequency" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-subtext", children: "Days" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-subtext", children: "Posts" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-subtext", children: "Credits" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-subtext", children: "Plan" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: strategyRows.map((row, i) => {
                const f = features.find((feat) => feat.featureKey === row.key);
                if (!f) return null;
                const mod = modifiedFeatures[f._id] || {};
                const currentCost = mod.cost !== void 0 ? mod.cost : f.cost;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `border-b border-white/5 last:border-0 ${row.freeOnly ? "bg-green-500/5" : ""}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-maintext text-sm", children: row.label }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-3 text-center text-subtext text-xs font-medium", children: [
                    row.days,
                    "d"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center text-subtext text-xs font-medium", children: row.posts }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        className: "bg-black/20 border border-transparent focus:border-primary/50 outline-none text-right font-black text-primary text-base w-16 px-2 py-1 rounded no-spinner",
                        value: currentCost,
                        onChange: (e) => handleFeatureChange(f._id, "cost", e.target.value),
                        min: "0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-subtext text-[10px]", children: "cr" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: row.freeOnly ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 text-[10px] font-black", children: "FREE + PRO" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black", children: "🔒 PRO" }) })
                ] }, i);
              }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-subtext mt-2 ml-1", children: [
              "⚠️ Free plan users are always forced to ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "7 Days = 14 credits" }),
              ". Other frequencies require a paid plan."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-4 bg-violet-400 rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-black uppercase tracking-widest text-maintext", children: "Carousel — Dynamic Pricing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-subtext ml-1", children: "(Visual base × slide count)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: carouselRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/10 bg-white/5 p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-0.5 mb-2", children: Array.from({ length: row.slides }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-6 rounded bg-primary/30 border border-primary/20" }, i)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-subtext font-bold uppercase tracking-wide mb-1", children: [
                row.slides,
                " Slides"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black text-primary", children: row.credits }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-subtext", children: "credits" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-subtext/50 mt-1", children: [
                baseVisual,
                " × ",
                row.slides
              ] })
            ] }, row.slides)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-subtext mt-2 ml-1", children: [
              "❌ Carousel posts are ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "blocked" }),
              " for free plan users."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-4 bg-red-400 rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-black uppercase tracking-widest text-maintext", children: "Free Plan Rules (500 Credits)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-subtext ml-1", children: "(enforced in backend middleware)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
              { icon: "🌐", rule: "Website Scraping", limit: "Max 2 scrapes (lifetime)", action: "3rd attempt → UPGRADE_REQUIRED → Upgrade modal", color: "amber" },
              { icon: "📅", rule: "Content Calendar", limit: "Hard-capped at 7 days", action: "Backend forces maxDays=7 regardless of selection", color: "blue" },
              { icon: "🎨", rule: "Visual Posts", limit: "Completely blocked", action: "PLAN_RESTRICTED 403 → Upgrade modal", color: "red" },
              { icon: "🖼️", rule: "Carousel Posts", limit: "Completely blocked", action: "Same as visual posts", color: "red" },
              { icon: "📊", rule: "Posting Frequency", limit: 'Only "7 Days (Starter)"', action: "Other options show 🔒 PRO lock in dropdown", color: "violet" }
            ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base shrink-0 mt-0.5", children: item.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-maintext", children: item.rule }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-black px-2 py-0.5 rounded-full ${item.color === "red" ? "bg-red-500/15 text-red-400" : item.color === "amber" ? "bg-amber-500/15 text-amber-400" : item.color === "blue" ? "bg-blue-500/15 text-blue-400" : "bg-violet-500/15 text-violet-400"}`, children: item.limit })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-subtext mt-0.5", children: item.action })
              ] })
            ] }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-subtext", children: Object.keys(modifiedFeatures).length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-400 font-bold", children: [
            "⚠ ",
            Object.keys(modifiedFeatures).length,
            " unsaved changes — click Save to apply"
          ] }) : "Changes to base costs are reflected in all dynamic calculations above." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowAiAdsModal(false), className: "px-4 py-2 rounded-xl font-bold text-sm bg-white/10 text-maintext hover:bg-white/20 transition-colors", children: "Close" }),
            Object.keys(modifiedFeatures).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  handleSaveChanges();
                  setShowAiAdsModal(false);
                },
                disabled: saving,
                className: "px-5 py-2 rounded-xl font-bold text-sm bg-primary text-white shadow-lg shadow-primary/30 hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50",
                children: [
                  saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
                  "Save Changes"
                ]
              }
            )
          ] })
        ] })
      ] }) });
    })()
  ] });
};
const AdminDashboard = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const navigate = useNavigate();
  const user = getUserData();
  const isAdmin = (user == null ? void 0 : user.token) && ((user == null ? void 0 : user.email) === ADMIN_EMAIL || (user == null ? void 0 : user.role) === "admin");
  reactExports.useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard/chat", { replace: true });
    }
  }, [isAdmin, navigate]);
  if (!isAdmin) return null;
  const tabs = [
    { id: "overview", label: t("overview"), icon: ChartColumn },
    { id: "users", label: t("users"), icon: Users },
    { id: "plans", label: t("plans"), icon: CreditCard },
    { id: "packages", label: t("packages"), icon: Package },
    { id: "credits", label: t("toolCosts"), icon: Zap },
    { id: "legal", label: t("legalPages"), icon: FileText },
    { id: "helpdesk", label: t("helpDesk"), icon: Headphones },
    { id: "knowledge", label: t("knowledge"), icon: BookOpen },
    { id: "settings", label: t("settings"), icon: Settings }
  ];
  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, {});
      case "users":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(UsersTab, {});
      case "plans":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(PlansTab, {});
      case "packages":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(PackagesTab, {});
      case "credits":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCreditsTab, {});
      case "legal":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(LegalPagesTab, {});
      case "helpdesk":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminHelpDesk, { isOpen: true, isEmbedded: true });
      case "knowledge":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(KnowledgeBaseTab, {});
      case "settings":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsTab, {});
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, {});
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center shadow-lg border border-white/10 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "AISA", className: "w-9 h-9 object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-maintext tracking-tight", children: t("adminDashboard") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext font-semibold uppercase tracking-wider", children: t("platformManagementConsole") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => navigate("/dashboard/chat"),
          className: "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-subtext hover:text-maintext hover:bg-white/20 dark:hover:bg-white/10 transition-all border border-white/20 dark:border-white/10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            " ",
            t("backToChat")
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 overflow-x-auto pb-2 admin-horizontal-scrollbar", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabButton,
      {
        active: activeTab === tab.id,
        icon: tab.icon,
        label: tab.label,
        onClick: () => setActiveTab(tab.id)
      },
      tab.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2 },
        children: renderTab()
      },
      activeTab
    ) })
  ] }) });
};
export {
  AdminDashboard as default
};
