import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ServerUrl } from '../App';
import { ArrowLeft, Clock, Code2, BrainCircuit } from 'lucide-react';

function InterviewHistory() {
    const [interviews, setInterviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true });
                setInterviews(result.data);
            } catch (error) {
                console.log(error);
            }
        };
        getMyInterviews();
    }, []);

    return (
        <div className='min-h-screen bg-bg-primary py-10 relative overflow-hidden'>
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto relative z-10'>
                <div className='mb-12 w-full flex items-start gap-4 flex-wrap'>
                    <button
                        onClick={() => navigate("/")}
                        className='mt-1 p-3 rounded-xl glass border border-white/10 hover:bg-white/10 transition-colors'
                    >
                        <ArrowLeft className='text-gray-300' size={20} />
                    </button>

                    <div>
                        <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-white mb-2'>
                            Analytics <span className="text-gradient">Dashboard</span>
                        </h1>
                        <p className='text-gray-400'>
                            Track your past interviews and performance reports.
                        </p>
                    </div>
                </div>

                {interviews.length === 0 ? (
                    <div className='glass-card p-12 text-center border border-white/10'>
                        <BrainCircuit size={48} className="text-gray-600 mx-auto mb-4" />
                        <p className='text-gray-400 text-lg'>
                            No interviews found. Start your first AI mock interview to see analytics.
                        </p>
                        <button 
                            onClick={() => navigate("/interview")}
                            className="mt-6 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10"
                        >
                            Start Interview
                        </button>
                    </div>
                ) : (
                    <div className='grid gap-6'>
                        {interviews.map((item, index) => (
                            <div 
                                key={index}
                                onClick={() => navigate(`/report/${item._id}`)}
                                className='glass-card p-6 border border-white/10 hover:border-accent-primary/40 transition-all duration-300 cursor-pointer group hover:bg-white/5 relative overflow-hidden'
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10'>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center border border-white/10 shrink-0 text-accent-primary">
                                            {item.mode === "Technical" ? <Code2 size={24}/> : <BrainCircuit size={24}/>}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white mb-1">
                                                {item.role}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                                                <span>{item.experience}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                <span>{item.mode} Mode</span>
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                                <Clock size={12}/>
                                                {new Date(item.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-6'>
                                        {/* SCORE */}
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-accent-tertiary">
                                                {item.finalScore || 0}<span className="text-base text-gray-500 font-medium">/10</span>
                                            </p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                                                Overall Score
                                            </p>
                                        </div>

                                        {/* STATUS BADGE */}
                                        <span
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                item.status === "completed"
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default InterviewHistory;
