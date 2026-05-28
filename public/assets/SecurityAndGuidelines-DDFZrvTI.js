import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion, X, k as Shield, l as TriangleAlert, n as Send, o as CircleCheckBig, p as getUserData, a as apiService, q as Lock, s as Scale, F as FileText, t as Eye } from "./index-PWHJcNR8.js";
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m8 2 1.88 1.88", key: "fmnt4t" }],
  ["path", { d: "M14.12 3.88 16 2", key: "qol33r" }],
  ["path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1", key: "d7y7pr" }],
  [
    "path",
    {
      d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",
      key: "xs1cw7"
    }
  ],
  ["path", { d: "M12 20v-9", key: "1qisl0" }],
  ["path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5", key: "32zzws" }],
  ["path", { d: "M6 13H2", key: "82j7cp" }],
  ["path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4", key: "4p0ekp" }],
  ["path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4", key: "18gb23" }],
  ["path", { d: "M22 13h-4", key: "1jl80f" }],
  ["path", { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4", key: "k3fwyw" }]
];
const Bug = createLucideIcon("Bug", __iconNode);
const ReportModal = ({ isOpen, onClose }) => {
  const [step, setStep] = reactExports.useState("form");
  const [loading, setLoading] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    type: "bug",
    priority: "medium",
    description: ""
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = getUserData();
      await apiService.submitReport({
        ...formData,
        userId: (user == null ? void 0 : user.id) || "anonymous-" + Date.now()
      });
      setLoading(false);
      setStep("success");
    } catch (error) {
      console.error("Report failed", error);
      alert("Failed to submit report. Please try again.");
      setLoading(false);
    }
  };
  const handleClose = () => {
    setStep("form");
    setFormData({ type: "bug", priority: "medium", description: "" });
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[110] flex items-center justify-center px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        onClick: handleClose,
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 },
        className: "relative bg-secondary border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden",
        children: step === "form" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-maintext", children: "Report an Issue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-subtext", children: "Help us improve by reporting bugs or security concerns." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleClose,
                className: "p-2 text-subtext hover:text-maintext hover:bg-surface rounded-lg transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-maintext mb-2", children: "Issue Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
                { id: "bug", label: "Bug", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "w-4 h-4" }) },
                { id: "security", label: "Security", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }) },
                { id: "other", label: "Other", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4" }) }
              ].map((type) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setFormData({ ...formData, type: type.id }),
                  className: `flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.type === type.id ? "bg-primary/10 border-primary text-primary" : "bg-surface border-border text-subtext hover:border-primary/50"}`,
                  children: [
                    type.icon,
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: type.label })
                  ]
                },
                type.id
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-maintext mb-2", children: "Priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: formData.priority,
                  onChange: (e) => setFormData({ ...formData, priority: e.target.value }),
                  className: "w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-maintext focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "low", children: "Low - Minor cosmetic issue" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "Medium - Functionality impacted" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "high", children: "High - Critical system failure" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-maintext mb-2", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  required: true,
                  value: formData.description,
                  onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                  placeholder: "Please describe the issue in detail...",
                  className: "w-full px-4 py-3 bg-surface border border-border rounded-xl text-maintext placeholder:text-subtext/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[120px] resize-none transition-all"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 mt-8 pt-4 border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleClose,
                className: "px-4 py-2 text-sm font-medium text-subtext hover:text-maintext transition-colors",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: "flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed",
                children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Submit Report" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
                ] })
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-10 flex flex-col items-center justify-center text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0 },
              animate: { scale: 1 },
              className: "w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-8 h-8" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-maintext mb-2", children: "Report Submitted!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext max-w-[250px] mb-6", children: "Thank you for helping us make A-Series better. We've received your report." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleClose,
              className: "px-6 py-2 bg-surface border border-border text-maintext rounded-xl font-medium hover:bg-secondary transition-colors",
              children: "Close"
            }
          )
        ] })
      }
    )
  ] }) });
};
const SecurityAndGuidelines = () => {
  const [isReportModalOpen, setIsReportModalOpen] = reactExports.useState(false);
  const sections = [
    {
      id: 1,
      title: "1. Data Privacy & Protection",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-5 h-5 text-primary" }),
      content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext", children: "A-Series™ is committed to safeguarding user data in accordance with applicable data protection laws, including but not limited to GDPR and CCPA." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-4 border-l-2 border-primary/20 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-maintext", children: "1.1 Data Collection" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-subtext", children: "A-Series™ may collect personal and technical information including account details, usage metadata, device identifiers, and file access permissions, solely for legitimate business and operational purposes." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-maintext", children: "1.2 Data Usage" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-subtext mb-2", children: "Collected data shall be used exclusively to:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside text-sm text-subtext ml-2 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Provide and operate platform services" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Improve performance, reliability, and security" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Communicate important updates or security notices" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-maintext", children: "1.3 Data Sharing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-subtext", children: "A-Series™ does not sell personal data. Data may be shared with trusted third-party service providers strictly for operational requirements and in compliance with industry security standards." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-maintext", children: "1.4 User Rights" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-subtext", children: [
              "Users retain the right to access, rectify, or request deletion of their data by contacting ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:admin@uwo24.com", className: "text-primary hover:underline", children: "admin@uwo24.com" }),
              "."
            ] })
          ] })
        ] })
      ] })
    },
    {
      id: 2,
      title: "2. Account Security Responsibilities",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary" }),
      content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: "2.1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext", children: "Users are solely responsible for maintaining the confidentiality of their account credentials." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: "2.2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext", children: "A-Series™ employs industry-standard security measures, including encryption and secure session handling, to protect accounts; however, users must immediately report unauthorized access or suspected breaches." })
        ] })
      ] })
    },
    {
      id: 3,
      title: "3. Acceptable Use & Prohibited Conduct",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-primary" }),
      content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext", children: "Users agree not to engage in any activity that may compromise the platform, including but not limited to:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
          "Illegal or unauthorized use of services",
          "Reverse engineering source code or AI models",
          "Uploading malicious or offensive content",
          "Attempting to bypass security controls"
        ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-sm text-subtext bg-surface p-2 rounded-lg border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }),
          item
        ] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext mt-2 italic", children: "A-Series™ reserves the right to suspend or terminate accounts found in violation of these guidelines." })
      ] })
    },
    {
      id: 4,
      title: "4. AI Usage & Content Disclaimer",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "w-5 h-5 text-primary" }),
      content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/50 p-3 rounded-lg border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-maintext text-sm mb-1", children: "4.1 Accuracy Disclaimer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext", children: "AI-generated outputs are provided on an “as-is” basis and may contain inaccuracies." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/50 p-3 rounded-lg border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-maintext text-sm mb-1", children: "4.2 Reliability Disclaimer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext", children: "Users acknowledge that A-Series™ shall not be held responsible for decisions or outcomes arising from reliance on AI-generated content, including legal, financial, or medical decisions." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/50 p-3 rounded-lg border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-maintext text-sm mb-1", children: "4.3 AI Usage Policy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext", children: "AISA™ AI tools must not be used for illegal activities. Users must not generate harmful, misleading, abusive, or discriminatory content using AI features." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/50 p-3 rounded-lg border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-maintext text-sm mb-1", children: "4.4 Review Before Public Use" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext", children: "AI-generated outputs should be reviewed and verified by users before any public use, publication, or professional reliance. Users are solely responsible for content they publish." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/50 p-3 rounded-lg border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-maintext text-sm mb-1", children: "4.5 Usage Restrictions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext", children: "AISA™ reserves the right to restrict, suspend, or terminate access for any usage that violates ethical standards, legal requirements, or these guidelines." })
        ] })
      ] })
    },
    {
      id: 5,
      title: "5. File Upload & Document Security",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-primary" }),
      content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext", children: "Uploaded files are processed solely for functionality (document analysis, RAG)." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext", children: "Restrictions apply to file size, type, and content to prevent abuse." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext font-medium text-blue-500", children: "Executable or malicious files may be rejected." })
      ] })
    },
    {
      id: 6,
      title: "6. Cookies & Tracking Technologies",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-5 h-5 text-primary" }),
      content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext", children: "A-Series™ uses cookies for functionality, security, and optimization." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-subtext", children: [
          "Users may manage cookies via browser settings. See ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary cursor-pointer hover:underline", children: "Cookie Policy" }),
          "."
        ] })
      ] })
    },
    {
      id: 7,
      title: "7. Third-Party Services & Integrations",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 flex items-center justify-center font-bold text-primary text-xs", children: "3P" }),
      content: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext", children: "Integrations with cloud providers and AI services are governed by contracts and limited to operational necessity." })
    },
    {
      id: 8,
      title: "8. Intellectual Property",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 flex items-center justify-center font-bold text-primary text-xs", children: "©" }),
      content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-subtext space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "8.1 License:" }),
          " Limited, non-exclusive, non-transferable access."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "8.2 Ownership:" }),
          " All rights remain with A-Series™ and UWO™."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "8.3 Transfer:" }),
          " No transfer of ownership implies."
        ] })
      ] })
    },
    {
      id: 9,
      title: "9. Enforcement & Termination",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-primary" }),
      content: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside text-subtext text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Monitor for compliance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Suspend/terminate for violations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Immediate action for security threats" })
      ] })
    },
    {
      id: 10,
      title: "10. Policy Updates",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-primary" }),
      content: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext", children: "Modifications may occur at any time. Continued use constitutes acceptance." })
    },
    {
      id: 11,
      title: "11. Contact Information",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-primary" }),
      content: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-subtext", children: [
        "For questions, concerns, or rights-related requests, contact ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:admin@uwo24.com", className: "text-primary hover:underline", children: "admin@uwo24.com" }),
        "."
      ] })
    },
    {
      id: 12,
      title: "12. Incident Reporting & Support",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-blue-500" }),
      content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext text-sm", children: "If you witness any security violations, encounter technical issues, or need urgent assistance, please report them immediately." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsReportModalOpen(true), className: "flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📧 Report in App:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Open Form" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "tel:+918358990909", className: "flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-lg hover:bg-primary/10 border border-primary/20 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📞 Support:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "+91 83589 90909" })
          ] })
        ] })
      ] })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-background overflow-hidden relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "px-6 py-5 border-b border-border bg-secondary/30 backdrop-blur-md sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-primary/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-maintext", children: "Security & Guidelines" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-subtext", children: "Last Updated: 07/03/2026" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6 pb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          className: "bg-secondary border border-border rounded-xl p-6 shadow-sm",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-subtext leading-relaxed", children: [
            "This Security & Guidelines section governs the acceptable use, data protection practices, and security standards applicable to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-maintext font-semibold", children: "A-Series™" }),
            ", operated by ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-maintext font-semibold", children: "UWO™" }),
            ". By accessing or using the platform, you agree to comply with the terms set forth herein."
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: sections.map((section, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.05 },
          className: "bg-secondary hover:bg-surface/50 border border-border rounded-xl p-5 hover:shadow-md transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3 border-b border-border/50 pb-2", children: [
              section.icon,
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-maintext", children: section.title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-1", children: section.content })
          ]
        },
        section.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.6 },
          className: "bg-surface border border-border rounded-xl p-5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-maintext mb-2 flex items-center gap-2", children: "🧠 Legal Summary Statement" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-subtext text-sm italic", children: '"These Security & Guidelines establish the framework for lawful use, data protection, AI governance, and operational security within the A-Series platform."' })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReportModal, { isOpen: isReportModalOpen, onClose: () => setIsReportModalOpen(false) })
  ] });
};
export {
  SecurityAndGuidelines as default
};
