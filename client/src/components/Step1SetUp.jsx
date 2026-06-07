import React, { useState } from 'react';
import { motion } from "motion/react";
import { User, Briefcase, Upload, Mic, LineChart, Sparkles } from "lucide-react";
import axios from "axios";
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Step1SetUp({ onStart }) {
    const { userData } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [targetCompany, setTargetCompany] = useState("");
    const [interviewMode, setInterviewMode] = useState("Practice");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) return;
        setAnalyzing(true);

        const formdata = new FormData();
        formdata.append("resume", resumeFile);

        try {
            const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { withCredentials: true });

            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);
            setAnalyzing(false);

        } catch (error) {
            console.log(error);
            setAnalyzing(false);
        }
    };

    const handleStart = async () => {
        setLoading(true);
        try {
           const result = await axios.post(ServerUrl + "/api/interview/generate-questions", { role, experience, mode, targetCompany, interviewMode, resumeText, projects, skills }, { withCredentials: true });
           if(userData){
               dispatch(setUserData({ ...userData, credits: result.data.creditsLeft }));
           }
           setLoading(false);
           onStart(result.data);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='h-screen w-full flex items-center justify-center bg-bg-primary px-4 relative overflow-hidden'>
            
            {/* Background effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className='w-full max-w-6xl max-h-[90vh] bg-[#0B1120] text-white border border-white/10 shadow-2xl backdrop-blur-md rounded-2xl flex flex-col md:flex-row overflow-hidden relative z-10'>

                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className='relative bg-black/40 p-8 md:p-10 flex flex-col justify-start border-b md:border-b-0 md:border-r border-white/10 md:w-1/2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>

                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-[60px] pointer-events-none" />

                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 mt-2">
                        Start Your <span className="text-gradient">AI Interview</span>
                    </h2>

                    <p className="text-gray-400 mb-8 leading-relaxed text-sm md:text-base">
                        Practice real interview scenarios powered by AI. Improve communication, technical skills, and professional confidence.
                    </p>

                    <div className='space-y-3'>
                        {[
                            {
                                icon: <User className="text-accent-primary shrink-0" size={18} />,
                                text: "Select your targeted role and experience.",
                            },
                            {
                                icon: <Mic className="text-accent-secondary shrink-0" size={18} />,
                                text: "Engage in an interactive voice simulation.",
                            },
                            {
                                icon: <LineChart className="text-accent-tertiary shrink-0" size={18} />,
                                text: "Receive comprehensive performance analytics.",
                            },
                        ].map((item, index) => (
                            <motion.div key={index}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.15 }}
                                className='flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl shadow-sm'>
                                <div className="bg-white/5 p-2 rounded-lg">
                                    {item.icon}
                                </div>
                                <span className='text-gray-300 font-medium text-sm'>{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="p-8 md:p-10 relative flex flex-col md:w-1/2 h-[60vh] md:h-auto">
                    
                    <h2 className='text-xl font-bold text-white mb-6 flex items-center gap-2 shrink-0'>
                        <Sparkles className="text-accent-primary" size={22} />
                        Session Setup
                    </h2>

                    <div className='flex-1 overflow-y-auto pr-2 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>

                        <div className='relative'>
                            <User className='absolute top-3 left-4 text-gray-500' size={18} />
                            <input type='text' placeholder='Target Role (e.g. Frontend Engineer)'
                                className='w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition rounded-lg text-sm'
                                onChange={(e) => setRole(e.target.value)} value={role} />
                        </div>

                        <div className='relative'>
                            <Briefcase className='absolute top-3 left-4 text-gray-500' size={18} />
                            <input type='text' placeholder='Experience (e.g. 3 years)'
                                className='w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition rounded-lg text-sm'
                                onChange={(e) => setExperience(e.target.value)} value={experience} />
                        </div>

                        <div className='space-y-2.5'>
                            <div className='relative'>
                                <input type='text' placeholder='Target Company (e.g., Google, Stripe) - Optional'
                                    className='w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition rounded-lg text-sm'
                                    onChange={(e) => setTargetCompany(e.target.value)} value={targetCompany} />
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {["FAANG", "MAANG", "Product-Based", "Service-Based", "Consulting", "Fintech", "Startup"].map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => setTargetCompany(tag)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                            targetCompany === tag 
                                            ? 'bg-violet-600/20 border border-violet-500 text-violet-300' 
                                            : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <select value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                className='w-full py-2.5 px-4 bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition rounded-lg appearance-none cursor-pointer text-sm'>
                                <option value="Technical" className="bg-[#0B1120] text-white">Technical Interview</option>
                                <option value="HR" className="bg-[#0B1120] text-white">HR / Behavioral</option>
                            </select>
                        </div>

                        <div className="relative space-y-1.5">
                            <select value={interviewMode}
                                onChange={(e) => setInterviewMode(e.target.value)}
                                className='w-full py-2.5 px-4 bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition rounded-lg appearance-none cursor-pointer text-sm'>
                                <option value="Practice" className="bg-[#0B1120] text-white">Practice Mode</option>
                                <option value="Strict" className="bg-[#0B1120] text-red-400">Strict Mode (Proctored)</option>
                            </select>
                            <p className="text-[11px] text-gray-500 pl-1">Strict mode monitors tab-switching and copy/pasting. Violations result in an automatic zero.</p>
                        </div>

                        {!analysisDone && (
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                onClick={() => document.getElementById("resumeUpload").click()}
                                className='border-2 border-dashed border-white/20 rounded-xl p-5 text-center cursor-pointer hover:border-accent-primary hover:bg-accent-primary/5 transition-all group'>
                                <div className="bg-white/5 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-accent-primary/20 transition-colors">
                                    <Upload className='text-gray-400 group-hover:text-accent-primary transition-colors' size={20} />
                                </div>

                                <input type="file"
                                    accept="application/pdf"
                                    id="resumeUpload"
                                    className='hidden'
                                    onChange={(e) => setResumeFile(e.target.files[0])} />

                                <p className='text-gray-300 font-medium text-sm mb-1'>
                                    {resumeFile ? resumeFile.name : "Upload Resume PDF (Optional)"}
                                </p>
                                <p className="text-gray-500 text-[11px]">Used to tailor specific project questions.</p>

                                {resumeFile && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUploadResume();
                                        }}
                                        className='mt-3 bg-white/10 text-white px-5 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium border border-white/10'>
                                        {analyzing ? "Analyzing..." : "Extract Context"}
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {analysisDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='bg-accent-secondary/10 border border-accent-secondary/20 rounded-xl p-4 space-y-3 relative overflow-hidden'>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/10 blur-2xl" />
                                <h3 className='text-sm font-semibold text-white flex items-center gap-2'>
                                    <Sparkles size={14} className="text-accent-secondary"/> Resume Context Extracted
                                </h3>

                                {projects?.length > 0 && (
                                    <div>
                                        <p className='font-medium text-gray-400 text-[10px] uppercase tracking-wider mb-1.5'>Key Projects</p>
                                        <ul className='list-disc list-inside text-gray-300 space-y-0.5 text-xs'>
                                            {projects.slice(0, 3).map((p, i) => <li key={i} className="truncate">{p}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {skills?.length > 0 && (
                                    <div>
                                        <p className='font-medium text-gray-400 text-[10px] uppercase tracking-wider mb-1.5'>Identified Skills</p>
                                        <div className='flex flex-wrap gap-1.5'>
                                            {skills.slice(0, 5).map((s, i) => (
                                                <span key={i} className='bg-white/10 text-gray-300 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-medium'>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                    </div>
                    
                    <div className="shrink-0 pt-5 mt-2 border-t border-white/10">
                        <button
                            onClick={handleStart}
                            disabled={!role || !experience || loading}
                            className='w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white py-3 rounded-xl text-base font-semibold transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'>
                            {loading ? "Preparing Session..." : "Initialize Interview"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default Step1SetUp;
