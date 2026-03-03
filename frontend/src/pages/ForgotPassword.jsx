import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Loader, Key, CheckCircle, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { AppRoute, apis } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(apis.forgotPassword, { email });
            toast.success(response.data.message || "OTP sent successfully!");
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(apis.resetPassword, {
                email,
                otp,
                newPassword
            });
            toast.success(response.data.message || "Password updated successfully!");
            setTimeout(() => {
                navigate(AppRoute.LOGIN);
            }, 2000);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Invalid OTP or session expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden selection:bg-primary/20 bg-[#f8fafc] dark:bg-[#020617] aisa-scalable-text">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-primary/20 dark:bg-primary/10 blur-[140px] rounded-full"
                />
                <motion.div
                    animate={{ x: [0, -80, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-5%] left-[-5%] w-[50%] h-[50%] bg-primary/20 dark:bg-primary/10 blur-[140px] rounded-full"
                />
            </div>

            <div className="relative w-full max-w-[440px] px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative overflow-hidden bg-white/20 dark:bg-white/[0.02] backdrop-blur-3xl border border-white/40 dark:border-white/10 p-10 rounded-[3.5rem] shadow-2xl text-center ring-1 ring-white/20"
                >
                    {/* Header */}
                    <div className="mb-10">
                        <div className={`inline-flex items-center justify-center p-5 rounded-[2rem] mb-6 shadow-xl transition-all duration-500 ${step === 1 ? 'bg-primary shadow-primary/20' : 'bg-green-600 shadow-green-600/20'}`}>
                            {step === 1 ? <ShieldCheck className="w-8 h-8 text-white" /> : <Key className="w-8 h-8 text-white" />}
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter uppercase">
                            {step === 1 ? 'Reset Password' : 'Verify & Reset'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            {step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP sent to your email"}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSendOTP}
                                className="space-y-6"
                                autoComplete="off"
                            >
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-white/30 dark:bg-slate-900/40 rounded-2xl blur-sm transition-all group-focus-within:bg-white/50 dark:group-focus-within:bg-slate-900/60" />
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email Address"
                                        className="relative w-full bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-white/5 rounded-2xl py-4.5 pl-14 pr-4 text-slate-700 dark:text-white placeholder-slate-400/70 focus:outline-none focus:ring-1 focus:ring-white/50 dark:focus:ring-white/10 transition-all font-medium text-sm backdrop-blur-md"
                                        required
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4.5 bg-primary rounded-3xl font-black text-sm uppercase tracking-widest text-white shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <><span>Send OTP</span> <ArrowRight className="w-4 h-4" /></>}
                                </motion.button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleResetPassword}
                                className="space-y-6 text-left"
                                autoComplete="off"
                            >
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Verification Code</label>
                                    <input
                                        type="text"
                                        name="otp"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder="000000"
                                        className="w-full text-center text-2xl tracking-[0.5em] py-4 bg-white/30 dark:bg-slate-900/40 border border-white/50 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-slate-800 dark:text-white font-black placeholder:text-slate-400/20 backdrop-blur-md shadow-inner"
                                        required
                                    />
                                </div>

                                <div className="relative group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">New Password</label>
                                    <div className="relative">
                                        <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-green-500 transition-colors z-10" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="new-password"
                                            autoComplete="new-password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-white/5 rounded-2xl py-4.5 pl-14 pr-12 text-slate-700 dark:text-white placeholder-slate-400/70 focus:outline-none focus:ring-1 focus:ring-white/50 dark:focus:ring-white/10 transition-all font-medium text-sm backdrop-blur-md"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500 transition-colors z-10"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4.5 bg-green-600 rounded-3xl font-black text-sm uppercase tracking-widest text-white shadow-xl shadow-green-600/30 hover:shadow-green-600/50 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <><span>Reset Password</span> <CheckCircle className="w-4 h-4" /></>}
                                </motion.button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                                >
                                    Change Email?
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 pt-8 border-t border-white/10 dark:border-slate-800/50">
                        <Link to="/login" className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-black text-[10px] uppercase tracking-widest transition-all group">
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
