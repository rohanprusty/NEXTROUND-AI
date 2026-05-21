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
                className='w-full max-w-6xl glass-card px-6 py-3 flex justify-between items-center relative'
            >
                {/* Logo Section */}
                <div 
                    onClick={() => navigate('/')} 
                    className='flex items-center gap-3 cursor-pointer group'
                >
                    <div className='relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30 group-hover:glow-border transition-all duration-300'>
                        <Bot size={20} className="text-accent-primary" />
                        <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h1 className='font-bold hidden md:block text-xl tracking-tight text-white'>
                        InterviewForge<span className="text-gradient">.AI</span>
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
                    <div className='relative'>
                        <button
                            onClick={() => {
                                if (!userData) {
                                    setShowAuth(true);
                                    return;
                                }
                                setShowCreditPopup(!showCreditPopup);
                                setShowUserPopup(false);
                            }}
                            className='flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-all duration-300'
                        >
                            <Coins size={16} className="text-accent-tertiary" />
                            <span className="text-gray-200">{userData?.credits || 0}</span>
                        </button>

                        <AnimatePresence>
                            {showCreditPopup && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className='absolute right-0 md:right-[-50px] mt-4 w-72 glass-card p-5 z-50'
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles size={16} className="text-accent-primary" />
                                        <h3 className="font-semibold text-white">Pro Credits</h3>
                                    </div>
                                    <p className='text-sm text-gray-400 mb-4 leading-relaxed'>Unlock more AI interview sessions and advanced analytics.</p>
                                    <button 
                                        onClick={() => {
                                            setShowCreditPopup(false);
                                            navigate("/pricing");
                                        }} 
                                        className='w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(167,139,250,0.4)]'
                                    >
                                        Upgrade Plan
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User Profile */}
                    <div className='relative'>
                        <button
                            onClick={() => {
                                if (!userData) {
                                    setShowAuth(true);
                                    return;
                                }
                                setShowUserPopup(!showUserPopup);
                                setShowCreditPopup(false);
                            }}
                            className='w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 text-white rounded-full flex items-center justify-center font-semibold hover:border-accent-primary/50 transition-colors'
                        >
                            {userData ? userData?.name.slice(0, 1).toUpperCase() : <User size={16} className="text-gray-400" />}
                        </button>

                        <AnimatePresence>
                            {showUserPopup && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className='absolute right-0 mt-4 w-56 glass-card p-2 z-50 flex flex-col gap-1'
                                >
                                    <div className="px-3 py-2 mb-2 border-b border-white/5">
                                        <p className='text-sm text-gray-400'>Signed in as</p>
                                        <p className='text-sm font-medium text-white truncate'>{userData?.name}</p>
                                    </div>

                                    <button 
                                        onClick={() => { setShowUserPopup(false); navigate("/history"); }} 
                                        className='w-full text-left text-sm py-2 px-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors flex items-center gap-2'
                                    >
                                        <Bot size={16} />
                                        Dashboard
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        className='w-full text-left text-sm py-2 px-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors flex items-center gap-2'
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
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
