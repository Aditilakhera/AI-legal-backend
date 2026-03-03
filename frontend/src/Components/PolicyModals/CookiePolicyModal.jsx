import React from 'react';
import { X, Cookie, Settings2, BarChart3, Shield, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { name } from '../../constants';
import { useLanguage } from '../../context/LanguageContext';

const CookiePolicyModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();

    const sections = [
        {
            icon: Cookie,
            title: t('cp_what_title'),
            items: [
                t('cp_what_item1'),
                t('cp_what_item2'),
                t('cp_what_item3')
            ]
        },
        {
            icon: Settings2,
            title: t('cp_types_title'),
            items: [
                t('cp_types_item1'),
                t('cp_types_item2'),
                t('cp_types_item3'),
                t('cp_types_item4')
            ]
        },
        {
            icon: Smartphone,
            title: t('cp_storage_title'),
            items: [
                t('cp_storage_item1'),
                t('cp_storage_item2'),
                t('cp_storage_item3'),
                t('cp_storage_item4')
            ]
        },
        {
            icon: BarChart3,
            title: t('cp_third_title'),
            items: [
                t('cp_third_item1'),
                t('cp_third_item2'),
                t('cp_third_item3'),
                t('cp_third_item4')
            ]
        },
        {
            icon: Shield,
            title: t('cp_choices_title'),
            items: [
                t('cp_choices_item1'),
                t('cp_choices_item2'),
                t('cp_choices_item3'),
                t('cp_choices_item4')
            ]
        }
    ];



    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-card dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-border"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-border bg-purple-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Cookie className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-maintext">{t('cookiePolicy')}</h2>
                                <p className="text-xs text-subtext mt-0.5">{t('lastUpdated')}: January 22, 2026</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-surface rounded-lg transition-colors text-subtext hover:text-maintext"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Introduction */}
                        <div className="bg-surface rounded-xl p-4 border border-border">
                            <p className="text-sm text-maintext leading-relaxed">
                                {t('cp_intro')}
                            </p>
                        </div>

                        {/* Sections */}
                        {sections.map((section, index) => (
                            <div key={index} className="bg-surface rounded-xl p-5 border border-border hover:border-purple-500/30 transition-all">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <section.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-maintext pt-1">{section.title}</h3>
                                </div>
                                <ul className="ml-1 sm:ml-14 space-y-2">
                                    {section.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-subtext">
                                            <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                                            <span className="flex-1">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}



                        {/* Contact */}
                        <div className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl p-5 border border-purple-500/20">
                            <h3 className="text-lg font-bold text-maintext mb-3">{t('cp_questions_title_cookies')}</h3>
                            <div className="space-y-1.5 text-sm text-subtext">
                                <p><strong className="text-maintext">Email:</strong> <a href="mailto:admin@uwo24.com" className="text-primary hover:underline">admin@uwo24.com</a></p>
                                <p><strong className="text-maintext">Phone:</strong> <a href="tel:+918359890909" className="text-primary hover:underline">+91 83589 90909</a></p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-border bg-surface flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-purple-600/20"
                        >
                            {t('close')}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CookiePolicyModal;
