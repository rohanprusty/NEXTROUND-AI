import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from "motion/react";
import { Bot, Coins, LogOut, User, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';

function Navbar() {
    const { userData } = useSelector((state) => state.user);
    const [showCreditPopup, setShowCreditPopup] = useState(false);
    const [showUserPopup, setShowUserPopup] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showAuth, setShowAuth] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.get(ServerUrl + "/api/auth/logout", { withCredentials: true });
            dispatch(setUserData(null));
            setShowCreditPopup(false);
            setShowUserPopup(false);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='fixed top-0 left-0 w-full z-50 flex justify-center px-4 pt-6'>
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='w-full max-w-5xl bg-[#0a0a0a]/70 backdrop-blur-2xl border border-white/5 rounded-full px-5 py-2.5 flex justify-between items-center relative shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/5'
            >
                {/* Logo Section */}
                <div 
                    onClick={() => navigate('/')} 
                    className='flex items-center gap-3 cursor-pointer group'
                >
                    <div className='relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30 group-hover:glow-border transition-all duration-300'>
                        <img src="/nextRound.png" alt="NextRound AI" className="w-full h-full object-contain" style={{ borderRadius: '50%' }} />
                        <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    <h1 className='font-bold hidden md:block text-xl tracking-tight text-white'>
                        NextRound<span className="text-gradient"> AI</span>
                    </h1>
                </div>

                {/* Right Controls */}
                <div className='flex items-center gap-4 relative'>
                    
                    {/* Navigation Links for Desktop */}
                    <div className="hidden md:flex items-center gap-6 mr-4 text-sm font-medium text-gray-300">
                        <span onClick={() => navigate('/interview')} className="hover:text-white cursor-pointer transition-colors hover:glow-text">Practice</span>
                        <span onClick={() => navigate('/history')} className="hover:text-white cursor-pointer transition-colors hover:glow-text">Analytics</span>
                        <span onClick={() => navigate('/pricing')} className="hover:text-white cursor-pointer transition-colors hover:glow-text">Pricing</span>
                    </div>

                    {/* Credits Button */}
                    <div className='relative flex items-center'>
                        <button
                            onClick={() => {
                                if (!userData) {
                                    setShowAuth(true);
                                    return;
                                }
                                setShowCreditPopup(!showCreditPopup);
                                setShowUserPopup(false);
                            }}
                            className='flex items-center gap-2 bg-[#141414] border border-white/10 px-3.5 py-1.5 rounded-full text-sm font-medium hover:bg-[#1a1a1a] hover:border-white/20 transition-all duration-300 shadow-sm'
                        >
                            <Sparkles size={14} className="text-emerald-400" />
                            <span className="text-gray-300">{userData?.credits || 0}</span>
                        </button>

                        <AnimatePresence>
                            {showCreditPopup && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className='absolute right-0 top-[calc(100%+0.75rem)] w-72 bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] ring-1 ring-white/5 z-50 flex flex-col gap-3'
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                            <Sparkles size={14} className="text-emerald-400" />
                                        </div>
                                        <h3 className="font-semibold text-gray-200 text-sm">Pro Credits</h3>
                                    </div>
                                    <p className='text-[13px] text-gray-400 leading-relaxed'>Unlock more AI interview sessions and advanced analytics.</p>
                                    <button 
                                        onClick={() => {
                                            setShowCreditPopup(false);
                                            navigate("/pricing");
                                        }} 
                                        className='w-full bg-white text-black py-2.5 rounded-xl text-[13px] font-semibold hover:bg-gray-200 transition-colors mt-1 shadow-sm'
                                    >
                                        Upgrade Plan
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User Profile */}
                    <div className='relative flex items-center'>
                        <button
                            onClick={() => {
                                if (!userData) {
                                    setShowAuth(true);
                                    return;
                                }
                                setShowUserPopup(!showUserPopup);
                                setShowCreditPopup(false);
                            }}
                            className='w-9 h-9 bg-[#141414] border border-white/10 text-gray-300 rounded-full flex items-center justify-center text-sm font-medium hover:bg-[#1a1a1a] hover:text-white hover:border-white/20 transition-all shadow-sm'
                        >
                            {userData ? userData?.name.slice(0, 1).toUpperCase() : <User size={15} />}
                        </button>

                        <AnimatePresence>
                            {showUserPopup && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className='absolute right-0 top-[calc(100%+0.75rem)] w-56 bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] ring-1 ring-white/5 z-50 flex flex-col'
                                >
                                    <div className="px-3 py-3 mb-1 flex flex-col gap-0.5">
                                        <p className='text-[11px] uppercase tracking-wider font-semibold text-gray-500'>Signed in as</p>
                                        <p className='text-[13px] font-medium text-gray-200 truncate'>{userData?.name}</p>
                                    </div>
                                    <div className="h-px w-full bg-white/5 mb-1" />
                                    
                                    <div className="flex flex-col gap-0.5">
                                        <button 
                                            onClick={() => { setShowUserPopup(false); navigate("/history"); }} 
                                            className='w-full text-left text-[13px] py-2 px-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors flex items-center gap-2.5 font-medium'
                                        >
                                            <Bot size={15} />
                                            Dashboard
                                        </button>
                                        <button 
                                            onClick={handleLogout}
                                            className='w-full text-left text-[13px] py-2 px-3 rounded-xl hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-colors flex items-center gap-2.5 font-medium'
                                        >
                                            <LogOut size={15} />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </motion.div>

            {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
        </div>
    );
}

export default Navbar;
