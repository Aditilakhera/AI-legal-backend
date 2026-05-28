import { bL as Briefcase, bM as Gavel, F as FileText, bN as Binary, bO as LegalLogo, bP as FileCheck, bQ as Brain, bR as Library, x as useLanguage, r as reactExports, ad as reactDomExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion, i as Sparkles, af as Minimize2, ag as Maximize2, X, bS as MessageCircle, Z as Zap, k as Shield, z as zt } from "./index-Nt9jGuPD.js";
const PREMIUM_TOOLS = (t) => [
  {
    id: "legal_my_case",
    name: t("myCase"),
    icon: Briefcase,
    desc: t("myCaseDesc"),
    price: "₹1299",
    workflow: t("myCaseWorkflow")
  },
  {
    id: "legal_precedents",
    name: t("legalPrecedents"),
    icon: Gavel,
    desc: t("legalPrecedentsDesc"),
    price: "₹999",
    workflow: t("legalPrecedentsWorkflow")
  },
  {
    id: "legal_draft_maker",
    name: t("draftMaker"),
    icon: FileText,
    desc: t("draftMakerDesc"),
    price: "₹599",
    workflow: t("draftMakerWorkflow")
  },
  {
    id: "legal_evidence_checker",
    name: t("evidenceAnalyst"),
    icon: Binary,
    desc: t("evidenceAnalystDesc"),
    price: "₹599",
    workflow: t("evidenceAnalystWorkflow")
  },
  {
    id: "legal_argument_builder",
    name: t("argumentBuilder"),
    icon: Gavel,
    desc: t("argumentBuilderDesc"),
    price: "₹999",
    workflow: t("argumentBuilderWorkflow")
  },
  {
    id: "legal_case_predictor",
    name: t("casePredictor"),
    icon: LegalLogo,
    desc: t("casePredictorDesc"),
    price: "₹999",
    workflow: t("casePredictorWorkflow")
  },
  {
    id: "legal_contract_analyzer",
    name: t("contractAnalyzer"),
    icon: FileCheck,
    desc: t("contractAnalyzerDesc"),
    price: "₹799",
    workflow: t("contractAnalyzerWorkflow")
  },
  {
    id: "legal_strategy_engine",
    name: t("strategyEngine"),
    icon: Brain,
    desc: t("strategyEngineDesc"),
    price: "₹899",
    workflow: t("strategyEngineWorkflow")
  },
  {
    id: "legal_research_assistant",
    name: t("researchAssistant"),
    icon: Library,
    desc: t("researchAssistantDesc"),
    price: "₹699",
    workflow: t("researchAssistantWorkflow")
  }
];
const ToolCard = ({ tool, isPrimary = false, size = "md", onClose, onSelect, t }) => {
  const isUnlocked = true;
  const Icon = tool.icon;
  const [showWorkflow, setShowWorkflow] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      whileHover: { y: -4, scale: 1.01 },
      onClick: () => {
        {
          onSelect(tool, isUnlocked);
        }
      },
      className: `group relative cursor-pointer rounded-[1.4rem] p-4 transition-all duration-300 border overflow-hidden
        bg-white/65 border-white/75 backdrop-blur-[12px] shadow-[0_4px_16px_rgba(99,102,241,0.06)]
        dark:bg-[#1A2540]/60 dark:border-white/5 dark:shadow-none`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showWorkflow && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, backdropFilter: "blur(0px)" },
            animate: { opacity: 1, backdropFilter: "blur(8px)" },
            exit: { opacity: 0, backdropFilter: "blur(0px)" },
            className: "absolute inset-0 z-20 bg-indigo-600/95 rounded-[1.4rem] p-6 flex flex-col justify-start overflow-y-auto custom-scrollbar",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h6", { className: "text-white font-black text-[12px] uppercase tracking-widest flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 fill-white" }),
                    " ",
                    t("workflow")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        setShowWorkflow(false);
                      },
                      className: "p-1 hover:bg-white/20 rounded-lg transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-white" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: Array.isArray(tool.workflow) && tool.workflow.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black text-white shrink-0", children: i + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/90 text-[11px] leading-snug font-medium pt-0.5", children: step })
                ] }, i)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    onSelect(tool, isUnlocked);
                  },
                  className: "w-full py-2 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg mt-4",
                  children: t("launchNow")
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute inset-0 rounded-[1.4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            style: { background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 100%)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${"bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_6_16px_rgba(99,102,241,0.35)]"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5.5 h-5.5 ${"text-white"}` }) }),
              tool.id === "legal_case_predictor" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[6px] font-black uppercase tracking-[0.1em] transition-colors ${"text-indigo-600 dark:text-indigo-400"}`, children: "सत्यमेव जयते" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setShowWorkflow(true);
                },
                className: "p-2 transition-all text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-lg",
                title: "How it works",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors tracking-tight text-[14px]", children: tool.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7.5px] font-black text-indigo-600 bg-indigo-50/80 dark:bg-indigo-500/20 px-1.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-500/30 uppercase tracking-tighter", children: "Unlocked" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed font-medium line-clamp-2", children: tool.desc })
          ] }),
          !isUnlocked
        ] })
      ]
    }
  );
};
const LegalToolkitCard = ({ isOpen, onClose, onSelect, unlockedTools = [], isAdmin = false }) => {
  const { toolkitLanguage, setToolkitLanguage, tLegal } = useLanguage();
  const [isMaximized, setIsMaximized] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (isMaximized) {
          setIsMaximized(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, isMaximized]);
  reactExports.useEffect(() => {
    if (!isOpen) setIsMaximized(false);
  }, [isOpen]);
  reactExports.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  const SectionTitle = ({ children }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-5 mt-8 first:mt-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 rounded-full bg-slate-500" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[8px] sm:text-[9px] font-black text-slate-500 dark:text-[#94A3B8] uppercase tracking-[0.28em] whitespace-nowrap", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[1px] flex-1 bg-black/[0.06] dark:bg-white/5" })
  ] });
  const handleLanguageChange = (lang) => {
    setToolkitLanguage(lang);
    const messages = {
      "Auto": "Auto Language Detection Active 🌐",
      "Hindi": "भाषा बदलकर हिंदी कर दी गई है 🇮🇳",
      "English": "Language switched to English 🇺🇸",
      "Hinglish": "Language switched to Hinglish 🇮🇳"
    };
    zt.success(messages[lang] || `Language set to ${lang}`, {
      icon: "🌐",
      style: { borderRadius: "12px", background: "#333", color: "#fff", fontSize: "12px" }
    });
  };
  const toolsList = PREMIUM_TOOLS(tLegal);
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.15 } },
        className: "fixed inset-0 z-[110000] flex items-center justify-center p-4 sm:p-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              onClick: onClose,
              className: "absolute inset-0 bg-black/60 backdrop-blur-[12px]"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `relative z-10 w-full flex items-center justify-center ${isMaximized ? "h-full" : "max-w-5xl"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { scale: 0.9, opacity: 0, y: 20 },
              animate: { scale: 1, opacity: 1, y: 0 },
              exit: { scale: 0.94, opacity: 0, transition: { duration: 0.12 } },
              layout: true,
              transition: {
                layout: { duration: 0.25, ease: "easeInOut" },
                opacity: { duration: 0.18 },
                scale: { duration: 0.22 }
              },
              className: `relative z-[2] flex flex-col overflow-hidden w-full ${isMaximized ? "modal-maximized rounded-[27px]" : "modal-default rounded-[28px]"}`,
              style: {
                boxShadow: "0 40px 80px -15px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)",
                maxHeight: "90vh"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-white/95 dark:bg-[#0B1020]/98 backdrop-blur-[40px] z-0 rounded-[28px]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "relative z-[8] flex items-center justify-between px-4 sm:px-10 py-4 sm:py-5 border-b border-black/[0.05] dark:border-white/5 bg-white/40 dark:bg-[#131C31]/50 backdrop-blur-md cursor-default select-none",
                    onDoubleClick: () => setIsMaximized(!isMaximized),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.div,
                          {
                            whileHover: { rotate: 180, scale: 1.08 },
                            className: "w-[42px] h-[42px] rounded-[14px] bg-gradient-to-br from-indigo-500 via-[#4F46E5] to-[#3B82F6] flex items-center justify-center shadow-[0_6px_15px_rgba(99,102,241,0.35)] border border-white/30",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(LegalLogo, { size: 24, color: "white", showText: true })
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[17px] font-black text-slate-900 dark:text-white leading-tight tracking-tight", children: tLegal("legalToolkitTitle") }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-2.5 h-2.5 text-indigo-500 animate-pulse" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7.5px] sm:text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.22em]", children: tLegal("legalProfessionalToolkit") })
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-slate-100/50 dark:bg-[#131C31] p-1 rounded-xl border border-black/5 dark:border-white/5 mr-1 sm:mr-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              onClick: () => handleLanguageChange("English"),
                              className: `px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${toolkitLanguage === "English" ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`,
                              children: "EN"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              onClick: () => handleLanguageChange("Hindi"),
                              className: `px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black transition-all ${toolkitLanguage === "Hindi" ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`,
                              children: "हिंदी"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            motion.button,
                            {
                              whileHover: { scale: 1.1 },
                              whileTap: { scale: 0.9 },
                              onClick: () => setIsMaximized(!isMaximized),
                              title: isMaximized ? "Restore" : "Maximize",
                              className: "w-8 h-8 rounded-full bg-slate-100 dark:bg-[#131C31] flex items-center justify-center text-slate-500 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white hover:shadow-md transition-all shadow-sm border border-black/5 dark:border-white/5",
                              children: isMaximized ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize2, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-4 h-4" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            motion.button,
                            {
                              whileHover: { scale: 1.1, rotate: 90 },
                              whileTap: { scale: 0.9 },
                              onClick: onClose,
                              title: "Close",
                              className: "w-8 h-8 rounded-full bg-slate-100 dark:bg-[#131C31] flex items-center justify-center text-slate-500 dark:text-[#94A3B8] hover:text-rose-500 hover:shadow-md transition-all shadow-sm border border-black/5 dark:border-white/5",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18, strokeWidth: 2.5 })
                            }
                          )
                        ] })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-[8] flex-1 overflow-y-auto px-5 sm:px-11 py-5 sm:py-7 custom-scrollbar min-h-0", children: [
                  !isMaximized && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-slate-500 dark:text-slate-400 font-semibold", children: tLegal("advancedSuitesDesc") }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, y: 20 },
                      animate: { opacity: 1, y: 0 },
                      onClick: () => {
                        onSelect({ id: "legal_general_chat", name: tLegal("generalLegalChat") }, true);
                        onClose();
                      },
                      className: "group relative cursor-pointer rounded-[1.4rem] sm:rounded-[1.8rem] p-4 sm:p-7 mb-5 sm:mb-8 overflow-hidden",
                      style: {
                        background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #7c3aed 100%)",
                        boxShadow: "0 25px 60px -10px rgba(79,70,229,0.5)"
                      },
                      whileHover: { scale: 1.015, y: -3 },
                      whileTap: { scale: 0.985 },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.div,
                          {
                            animate: { x: ["-100%", "200%"] },
                            transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.5 },
                            className: "absolute top-0 bottom-0 w-[45%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-60 h-60 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 bg-violet-400/25 rounded-full -ml-10 -mb-10 blur-2xl" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3.5 sm:gap-6 w-full sm:w-auto", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-xl rounded-[1rem] sm:rounded-[1.4rem] flex items-center justify-center border border-white/25 shadow-xl group-hover:scale-105 transition-transform duration-500 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-6 h-6 sm:w-8 sm:h-8 text-white" }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left space-y-0.5 sm:space-y-1.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-start gap-1.5 sm:gap-2", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[7px] sm:text-[8px] font-black text-white uppercase tracking-widest", children: tLegal("basicStatus") }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" })
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-[17px] leading-tight sm:text-2xl font-extrabold text-white tracking-tight", children: [
                                "💬 ",
                                tLegal("generalLegalChat")
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-100 text-[10px] sm:text-[12px] font-medium leading-tight sm:leading-relaxed", children: tLegal("generalLegalChatDesc") })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            motion.button,
                            {
                              whileHover: { scale: 1.05 },
                              whileTap: { scale: 0.95 },
                              className: "w-full sm:w-auto mt-0 sm:mt-0 px-4 py-2.5 sm:px-6 sm:py-3 bg-white text-indigo-700 font-black rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all text-[10px] sm:text-[11px] uppercase tracking-[0.15em] shrink-0",
                              children: tLegal("startChatBtn")
                            }
                          )
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { children: tLegal("professionalLegalEngines") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: toolsList.map((tool, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(ToolCard, { tool, index: idx, onClose, onSelect, t: tLegal }, tool.id)) }),
                  !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, y: 15 },
                      animate: { opacity: 1, y: 0 },
                      transition: { delay: 0.4 },
                      className: "mt-10 sm:mt-12 p-6 sm:p-8 rounded-[1.8rem] sm:rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/5 dark:bg-[#131C31]/40 border border-black/5 dark:border-white/5 backdrop-blur-2xl shadow-lg",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[1.2rem] flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-7 h-7 text-white" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("h6", { className: "font-extrabold text-slate-900 dark:text-white text-[15px] sm:text-[17px]", children: tLegal("fullLegalSuiteAccess") }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-semibold", children: tLegal("unlockAdvancedTools") })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          motion.button,
                          {
                            whileHover: { scale: 1.03, y: -1 },
                            whileTap: { scale: 0.97 },
                            className: "relative px-8 py-3.5 rounded-2.5xl font-black text-[12px] uppercase tracking-[0.2em] text-white overflow-hidden shrink-0 shadow-lg",
                            style: { background: "linear-gradient(135deg, #6366f1, #7c3aed)" },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                motion.div,
                                {
                                  animate: { backgroundPosition: ["0% center", "200% center"] },
                                  transition: { duration: 4, repeat: Infinity, ease: "linear" },
                                  className: "absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 bg-[length:200%_auto]"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10", children: tLegal("accessProSuite") })
                            ]
                          }
                        )
                      ]
                    }
                  )
                ] })
              ]
            }
          ) })
        ]
      },
      "legal-toolkit-overlay"
    ) }),
    document.body
  );
};
export {
  PREMIUM_TOOLS,
  LegalToolkitCard as default
};
