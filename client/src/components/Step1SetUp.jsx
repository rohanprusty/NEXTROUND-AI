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
           const result = await axios.post(ServerUrl + "/api/interview/generate-questions", { role, experience, mode, resumeText, projects, skills }, { withCredentials: true });
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
            className='min-h-screen flex items-center justify-center bg-bg-primary px-4 py-12 relative overflow-hidden'>
            
            {/* Background effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className='w-full max-w-6xl bg-[#0B1120] text-white border border-white/10 shadow-2xl backdrop-blur-md rounded-2xl grid md:grid-cols-2 overflow-hidden relative z-10'>

                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className='relative bg-black/40 p-12 flex flex-col justify-center border-r border-white/10'>

                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-[60px] pointer-events-none" />

                    <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
                        Start Your <span className="text-gradient">AI Interview</span>
                    </h2>

                    <p className="text-gray-400 mb-10 leading-relaxed">
                        Practice real interview scenarios powered by AI. Improve communication, technical skills, and professional confidence.
                    </p>

                    <div className='space-y-4'>
                        {[
                            {
                                icon: <User className="text-accent-primary shrink-0" size={20} />,
                                text: "Select your targeted role and experience.",
                            },
                            {
                                icon: <Mic className="text-accent-secondary shrink-0" size={20} />,
                                text: "Engage in an interactive voice simulation.",
                            },
                            {
                                icon: <LineChart className="text-accent-tertiary shrink-0" size={20} />,
                                text: "Receive comprehensive performance analytics.",
                            },
                        ].map((item, index) => (
                            <motion.div key={index}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.15 }}
                                className='flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl shadow-sm'>
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
                    className="p-10 md:p-12 relative">
                    
                    <h2 className='text-2xl font-bold text-white mb-8 flex items-center gap-2'>
                        <Sparkles className="text-accent-primary" size={24} />
                        Session Setup
                    </h2>

                    <div className='space-y-6'>

                        <div className='relative'>
                            <User className='absolute top-3.5 left-4 text-gray-500' size={18} />
                            <input type='text' placeholder='Target Role (e.g. Frontend Engineer)'
                                className='w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition rounded-lg'
                                onChange={(e) => setRole(e.target.value)} value={role} />
                        </div>

                        <div className='relative'>
                            <Briefcase className='absolute top-3.5 left-4 text-gray-500' size={18} />
                            <input type='text' placeholder='Experience (e.g. 3 years)'
                                className='w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition rounded-lg'
                                onChange={(e) => setExperience(e.target.value)} value={experience} />
                        </div>

                        <div className="relative">
                            <select value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                className='w-full py-3 px-4 bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition rounded-lg appearance-none cursor-pointer'>
                                <option value="Technical" className="bg-[#0B1120] text-white">Technical Interview</option>
                                <option value="HR" className="bg-[#0B1120] text-white">HR / Behavioral</option>
                            </select>
                        </div>

                        {!analysisDone && (
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                onClick={() => document.getElementById("resumeUpload").click()}
                                className='border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-accent-primary hover:bg-accent-primary/5 transition-all group'>
                                <div className="bg-white/5 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-primary/20 transition-colors">
                                    <Upload className='text-gray-400 group-hover:text-accent-primary transition-colors' size={24} />
                                </div>

                                <input type="file"
                                    accept="application/pdf"
                                    id="resumeUpload"
                                    className='hidden'
                                    onChange={(e) => setResumeFile(e.target.files[0])} />

                                <p className='text-gray-300 font-medium mb-1'>
                                    {resumeFile ? resumeFile.name : "Upload Resume PDF (Optional)"}
                                </p>
                                <p className="text-gray-500 text-xs">Used to tailor specific project questions.</p>

                                {resumeFile && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUploadResume();
                                        }}
                                        className='mt-5 bg-white/10 text-white px-6 py-2.5 rounded-lg hover:bg-white/20 transition-colors font-medium border border-white/10'>
                                        {analyzing ? "Analyzing Document..." : "Extract Context"}
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {analysisDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='bg-accent-secondary/10 border border-accent-secondary/20 rounded-xl p-5 space-y-4 relative overflow-hidden'>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/10 blur-2xl" />
                                <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
                                    <Sparkles size={16} className="text-accent-secondary"/> Resume Context Extracted
                                </h3>

                                {projects?.length > 0 && (
                                    <div>
                                        <p className='font-medium text-gray-400 text-xs uppercase tracking-wider mb-2'>Key Projects</p>
                                        <ul className='list-disc list-inside text-gray-300 space-y-1 text-sm'>
                                            {projects.map((p, i) => <li key={i}>{p}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {skills?.length > 0 && (
                                    <div>
                                        <p className='font-medium text-gray-400 text-xs uppercase tracking-wider mb-2'>Identified Skills</p>
                                        <div className='flex flex-wrap gap-2'>
                                            {skills.map((s, i) => (
                                                <span key={i} className='bg-white/10 text-gray-300 border border-white/10 px-3 py-1 rounded-full text-xs font-medium'>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        <button
                            onClick={handleStart}
                            disabled={!role || !experience || loading}
                            className='w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white py-3.5 rounded-xl text-lg font-semibold transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none mt-4'>
                            {loading ? "Preparing Session..." : "Initialize Interview"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default Step1SetUp;
