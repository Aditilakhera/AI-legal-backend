import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Key, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { apis, AppRoute } from '../types';
import { setUserData, userData as userDataAtom } from '../userStore/userData';
import { useSetRecoilState } from 'recoil';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';

import loginBg from './login_bg.gif';


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const setUserRecoil = useSetRecoilState(userDataAtom);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setError(false);

    try {
      const payload = { email, password };
      const res = await axios.post(apis.logIn, payload);

      toast.success(t('successLogin'));
      const from = location.state?.from || AppRoute.DASHBOARD;

      setUserData(res.data);
      setUserRecoil({ user: res.data });
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("token", res.data.token);

      navigate(from, { replace: true });
    } catch (err) {
      setError(true);
      const errorMessage = err.response?.data?.error || err.message || t('serverError');
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    setError(false);
    setMessage(null);

    try {
      // Get user info from Google using the access token
      const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      });

      const { email, name, picture } = userInfoRes.data;

      // Send to our backend
      const res = await axios.post(apis.googleLogin, {
        credential: tokenResponse.access_token,
        email,
        name,
        picture
      });

      toast.success('Logged in with Google!');
      const from = location.state?.from || AppRoute.DASHBOARD;

      setUserData(res.data);
      setUserRecoil({ user: res.data });
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("token", res.data.token);

      navigate(from, { replace: true });
    } catch (err) {
      setError(true);
      const errorMessage = err.response?.data?.error || 'Google login failed';
      setMessage(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setError(true);
      setMessage('Google login was cancelled or failed');
    },
  });

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#f8fafc] dark:bg-[#020617] aisa-scalable-text">
      {/* Top Background GIF - Robot */}
      <div className="absolute top-0 left-0 w-full h-[45vh] pointer-events-none overflow-hidden z-0 flex justify-center items-center">
        <img
          src={loginBg}
          alt=""
          className="h-full object-contain opacity-[1] brightness-110 scale-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f8fafc]/5 dark:via-[#020617]/5 to-[#f8fafc] dark:to-[#020617]" />
      </div>

      {/* Background Blobs - STATIC */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden text-black dark:text-white">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-primary/20 dark:bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/20 dark:bg-primary/10 blur-[100px] rounded-full" />
      </div>

      {/* Content Container - Centered and Compact */}
      <div className="relative w-full max-w-[400px] flex flex-col items-center pt-[20vh] z-50">
        {/* Main Glass Card */}
        <div className="relative w-full overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-[64px] border border-white/60 dark:border-white/10 p-6 rounded-[2rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.12)] text-center ring-1 ring-white/30 group/card">
          {/* Glossy Reflection Effect */}
          <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 pointer-events-none" />

          <div className="text-center mb-6 relative">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1 tracking-tighter uppercase">{t('welcomeBack')}</h2>
            <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">{t('signInToContinue')}</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 justify-center"
              >
                <AlertCircle className="w-3 h-3" />
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-white/5 rounded-xl py-4 pl-12 pr-4 text-slate-700 dark:text-white placeholder-slate-400/70 focus:outline-none transition-all font-medium text-lg backdrop-blur-md"
                required
              />
            </div>

            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-white/5 rounded-xl py-4 pl-12 pr-12 text-slate-700 dark:text-white placeholder-slate-400/70 focus:outline-none transition-all font-medium text-lg tracking-[0.3em] backdrop-blur-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-500 transition-colors z-10"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary rounded-xl font-bold text-sm text-white shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "LOGIN"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/50" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/50" />
          </div>

          {/* Google Login Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => googleLogin()}
            disabled={googleLoading}
            className="w-full py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-700 dark:text-white shadow-md transition-all flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </motion.button>

          <div className="mt-4">
            <Link to="/forgot-password" opacity={0.6} className="text-[9px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors uppercase tracking-widest">
              Forgot Password?
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 dark:border-slate-800/50 text-[10px] font-bold text-slate-400 tracking-wide uppercase">
            No account? <Link to="/signup" className="text-primary hover:underline ml-1 uppercase font-black">Create Now</Link>
          </div>
        </div>

        <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-[9px] uppercase tracking-widest transition-all">
          <ArrowLeft className="w-3 h-3" />
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default Login;
