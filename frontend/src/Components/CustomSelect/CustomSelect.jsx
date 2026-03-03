import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ value, options, onChange, label, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative w-full ${isOpen ? 'z-[50]' : 'z-[1]'}`} ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-200
                    ${isOpen
                        ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-sm'
                        : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-800 hover:border-primary/50'
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon className={`w-4 h-4 ${isOpen ? 'text-primary' : 'text-gray-400'}`} />}
                    <span className="text-[14px] font-medium text-gray-700 dark:text-gray-200">
                        {value}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-[99999] left-0 right-0 p-1 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-white/10 shadow-2xl backdrop-blur-xl origin-top"
                    >
                        <div className="max-h-[240px] overflow-y-auto custom-scrollbar-light">
                            {options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        onChange({ target: { value: opt } });
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center justify-between px-3 py-2 rounded-lg text-[14px] transition-colors group
                                        ${value === opt
                                            ? 'bg-primary/10 text-primary font-bold'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700/50 hover:text-gray-900 dark:hover:text-white'
                                        }
                                    `}
                                >
                                    <span>{opt}</span>
                                    {value === opt && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Check className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomSelect;
