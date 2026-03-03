import React from 'react';
import { motion } from 'framer-motion';

const RobotMascot = ({ isPasswordFocused, isPasswordVisible, emailLength }) => {
    // Eye tracking
    const eyeX = Math.min(Math.max((emailLength / 30) * 12 - 6, -6), 6);

    return (
        <div className="relative w-full max-w-[600px] h-[600px] flex flex-col items-center justify-center scale-90 md:scale-100 pointer-events-none select-none">
            {/* Robot Body Container */}
            <motion.div
                className="relative w-full flex flex-col items-center"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Head - Premium 3D Glossy Style */}
                <div className="relative w-80 h-64 bg-gradient-to-b from-white to-slate-100 rounded-[5.5rem] shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.05),inset_10px_10px_20px_rgba(255,255,255,0.8),0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-white/80 flex flex-col items-center justify-center overflow-visible z-20">

                    {/* Head Gloss Reflection - Left */}
                    <div className="absolute top-8 left-10 w-24 h-16 bg-gradient-to-br from-white/80 to-transparent rounded-full opacity-60 blur-sm rotate-[-15deg]" />

                    {/* Pulse Antenna */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="w-1.5 h-10 bg-slate-200 rounded-full bg-gradient-to-t from-slate-300 to-slate-100" />
                        <motion.div
                            className="w-5 h-5 bg-purple-500 rounded-full mt-[-6px] shadow-[0_0_20px_#a855f7] border-2 border-white"
                            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    {/* Face Panel / Visor */}
                    <div className="w-64 h-36 bg-[#0E1220] rounded-[3.5rem] relative flex items-center justify-center border-[4px] border-[#1a1f26] shadow-[inset_0_4px_24px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] overflow-hidden">
                        {/* Visor Glare */}
                        <div className="absolute top-4 left-10 w-28 h-8 bg-white/5 rounded-full blur-2xl -rotate-15" />

                        {/* Eyes Container - Purple Ring Style */}
                        <motion.div
                            className="flex gap-16 relative z-10"
                            animate={{
                                y: isPasswordFocused && !isPasswordVisible ? -15 : 0,
                                scale: isPasswordFocused && !isPasswordVisible ? 0.9 : 1
                            }}
                        >
                            {/* Left Eye */}
                            <div className="relative w-18 h-18 flex items-center justify-center">
                                <motion.div
                                    className="w-full h-full rounded-full border-[8px] border-purple-500 shadow-[0_0_30px_#a855f7,inset_0_0_20px_#a855f7] bg-purple-900/20"
                                    animate={{ x: eyeX }}
                                >
                                    {/* Pupil Highlight */}
                                    <div className="absolute top-2 right-3 w-3 h-3 bg-white rounded-full blur-[1px] opacity-80" />
                                </motion.div>
                            </div>

                            {/* Right Eye */}
                            <div className="relative w-18 h-18 flex items-center justify-center">
                                <motion.div
                                    className="w-full h-full rounded-full border-[8px] border-purple-500 shadow-[0_0_30px_#a855f7,inset_0_0_20px_#a855f7] bg-purple-900/20"
                                    animate={{ x: eyeX }}
                                >
                                    {/* Pupil Highlight */}
                                    <div className="absolute top-2 right-3 w-3 h-3 bg-white rounded-full blur-[1px] opacity-80" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Faint 'Peek' Eyes when hands are up */}
                        {isPasswordFocused && !isPasswordVisible && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                className="absolute inset-0 flex items-center justify-center gap-10 mt-8"
                            >
                                <div className="w-10 h-1.5 bg-purple-400 rounded-full blur-[2px] shadow-[0_0_15px_#a855f7]" />
                                <div className="w-10 h-1.5 bg-purple-400 rounded-full blur-[2px] shadow-[0_0_15px_#a855f7]" />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Arms and Hands - Perfect Eye Covering Gesture */}
                {/* Left Arm */}
                <motion.div
                    className="absolute left-[-55px] top-36 z-30"
                    initial={false}
                    animate={{
                        x: isPasswordFocused && !isPasswordVisible ? 135 : 0,
                        y: isPasswordFocused && !isPasswordVisible ? -110 : 0,
                        rotate: isPasswordFocused && !isPasswordVisible ? 40 : 10, // Slight casual idle rotation
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                >
                    {/* Shoulder & Arm Segment */}
                    <div className="w-24 h-44 bg-gradient-to-r from-slate-50 to-white rounded-full border border-white/60 shadow-xl relative origin-top transform -rotate-6">
                        <div className="absolute inset-x-4 top-12 h-px bg-slate-200/30" />
                    </div>

                    {/* Hand/Mitt */}
                    <div className="w-28 h-26 bg-white rounded-[2.8rem] mt-[-35px] border border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative flex items-center justify-center px-4">
                        <div className="flex gap-1.5 mt-2">
                            <div className="w-3.5 h-12 bg-slate-50 rounded-full border-r border-slate-200/50 shadow-sm" />
                            <div className="w-3.5 h-12 bg-slate-50 rounded-full border-r border-slate-200/50 shadow-sm" />
                            <div className="w-3.5 h-12 bg-slate-50 rounded-full border-r border-slate-200/50 shadow-sm" />
                        </div>
                    </div>
                </motion.div>

                {/* Right Arm */}
                <motion.div
                    className="absolute right-[-55px] top-36 z-30"
                    initial={false}
                    animate={{
                        x: isPasswordFocused && !isPasswordVisible ? -135 : 0,
                        y: isPasswordFocused && !isPasswordVisible ? -110 : 0,
                        rotate: isPasswordFocused && !isPasswordVisible ? -40 : -10,
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                >
                    {/* Shoulder & Arm Segment */}
                    <div className="w-24 h-44 bg-gradient-to-l from-slate-50 to-white rounded-full border border-white/60 shadow-xl relative origin-top transform rotate-6">
                        <div className="absolute inset-x-4 top-12 h-px bg-slate-200/30" />
                    </div>

                    {/* Hand/Mitt */}
                    <div className="w-28 h-26 bg-white rounded-[2.8rem] mt-[-35px] border border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative flex items-center justify-center px-4">
                        <div className="flex gap-1.5 mt-2">
                            <div className="w-3.5 h-12 bg-slate-50 rounded-full border-l border-slate-200/50 shadow-sm" />
                            <div className="w-3.5 h-12 bg-slate-50 rounded-full border-l border-slate-200/50 shadow-sm" />
                            <div className="w-3.5 h-12 bg-slate-50 rounded-full border-l border-slate-200/50 shadow-sm" />
                        </div>
                    </div>
                </motion.div>

                {/* Torso - Large rounded body */}
                <div className="relative w-72 h-72 bg-gradient-to-b from-white to-slate-100 rounded-[6rem] mt-[-70px] shadow-[inset_10px_10px_30px_rgba(255,255,255,1),inset_-10px_-10px_30px_rgba(0,0,0,0.03),0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 flex flex-col items-center pt-12 z-10">
                    {/* Core Purple Glow inside body */}
                    <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-purple-500/5 blur-[60px] rounded-full pointer-events-none" />

                    {/* Body Gloss Curve */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-white to-transparent opacity-80 rounded-full blur-xl" />

                    {/* Neck segment */}
                    <div className="absolute -top-5 w-16 h-10 bg-slate-100 rounded-full border border-white/40 shadow-inner" />

                    {/* Center body line detail */}
                    <div className="w-px h-24 bg-slate-200/40 mb-4" />
                </div>

                {/* Legs/Base Segments */}
                <div className="flex gap-6 mt-[-45px] z-0">
                    <motion.div
                        className="w-28 h-32 bg-gradient-to-b from-white to-slate-200 rounded-b-[3rem] rounded-t-[2rem] shadow-lg border border-white"
                        animate={{ rotate: [0, 2, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div
                        className="w-28 h-32 bg-gradient-to-b from-white to-slate-200 rounded-b-[3rem] rounded-t-[2rem] shadow-lg border border-white"
                        animate={{ rotate: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>

            {/* Ground Shadow */}
            <motion.div
                className="absolute bottom-0 w-64 h-8 bg-black/10 blur-xl rounded-[100%]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
};

export default RobotMascot;
