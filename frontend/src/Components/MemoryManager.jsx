import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apis } from '../types';
import { Save, Trash2, Brain, Power, Info, Edit3, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const MemoryManager = () => {
    const [memory, setMemory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        businessType: '',
        interests: '',
        goals: ''
    });

    const fetchMemory = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${apis.baseUrl}/api/memory`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMemory(res.data);
            setEditForm({
                name: res.data.name || '',
                businessType: res.data.businessType || '',
                interests: res.data.interests?.join(', ') || '',
                goals: res.data.goals?.join(', ') || ''
            });
        } catch (error) {
            console.error('Failed to fetch memory:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemory();
    }, []);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...editForm,
                interests: editForm.interests.split(',').map(i => i.trim()).filter(i => i),
                goals: editForm.goals.split(',').map(g => g.trim()).filter(g => g)
            };
            const res = await axios.put(`${apis.baseUrl}/api/memory`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMemory(res.data);
            setIsEditing(false);
            toast.success('Memory updated successfully');
        } catch (error) {
            toast.error('Failed to update memory');
        }
    };

    const handleToggle = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${apis.baseUrl}/api/memory`, {
                isMemoryEnabled: !memory.isMemoryEnabled
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMemory(res.data);
            toast.success(res.data.isMemoryEnabled ? 'Memory Enabled' : 'Memory Disabled');
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const handleReset = async () => {
        if (!window.confirm('Are you sure you want to clear your AI memory? This cannot be undone.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${apis.baseUrl}/api/memory`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMemory(null);
            fetchMemory();
            toast.success('Memory cleared');
        } catch (error) {
            toast.error('Failed to clear memory');
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse text-white/50">Processing your AI neural pathways...</div>;

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Brain className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white leading-tight">Personal AI Memory</h2>
                        <p className="text-sm text-white/50">AISA learns from you to provide better results</p>
                    </div>
                </div>
                <button
                    onClick={handleToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${memory?.isMemoryEnabled
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/5 text-white/40 border border-white/10'
                        }`}
                >
                    <Power className="w-4 h-4" />
                    {memory?.isMemoryEnabled ? 'Active' : 'Disabled'}
                </button>
            </div>

            <div className="p-6 space-y-6">
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Preferred Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50 outline-none transition-all"
                                        placeholder="What should AISA call you?"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Business / Profession</label>
                                    <input
                                        type="text"
                                        value={editForm.businessType}
                                        onChange={e => setEditForm({ ...editForm, businessType: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50 outline-none transition-all"
                                        placeholder="e.g. Content Creator, Developer"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Interests (Comma separated)</label>
                                <textarea
                                    rows="2"
                                    value={editForm.interests}
                                    onChange={e => setEditForm({ ...editForm, interests: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50 outline-none transition-all resize-none"
                                    placeholder="e.g. Artificial Intelligence, Cryptography, Gaming"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Goals (Comma separated)</label>
                                <textarea
                                    rows="2"
                                    value={editForm.goals}
                                    onChange={e => setEditForm({ ...editForm, goals: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50 outline-none transition-all resize-none"
                                    placeholder="e.g. Automate social media, Build a SaaS"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 transition-all">
                                    <Check className="w-5 h-5" /> Save Changes
                                </button>
                                <button onClick={() => setIsEditing(false)} className="px-6 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all border border-white/10">
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <MemoryItem icon={<User className="text-blue-400 w-4 h-4" />} label="Identity" value={memory?.name || 'Unknown User'} />
                                    <MemoryItem icon={<Sparkles className="text-amber-400 w-4 h-4" />} label="Specialization" value={memory?.businessType || 'Not identified yet'} />
                                </div>
                                <div className="space-y-4">
                                    <MemoryItem label="Interests" value={memory?.interests?.join(', ') || 'Waiting to learn...'} />
                                    <MemoryItem label="Current Goals" value={memory?.goals?.join(', ') || 'Tell AISA your goals!'} />
                                </div>
                            </div>

                            <div className="bg-purple-500/5 rounded-2xl p-4 border border-purple-500/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-4 h-4 text-purple-400" />
                                    <h3 className="text-sm font-bold text-white">Last Activity Insights</h3>
                                </div>
                                <p className="text-sm text-white/60 italic">
                                    "{memory?.lastSessionSummary || 'No recent session data currently stored.'}"
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setIsEditing(true)} className="flex-1 bg-white hover:bg-white/90 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl">
                                    <Edit3 className="w-5 h-5" /> Edit Profile
                                </button>
                                <button onClick={handleReset} className="px-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold py-3 rounded-xl transition-all">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const MemoryItem = ({ icon, label, value }) => (
    <div className="space-y-1">
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-white font-medium pl-6">{value}</p>
    </div>
);

export default MemoryManager;
