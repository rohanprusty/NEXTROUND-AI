import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { motion } from "motion/react";
import { 
  Bot, Mic, Clock, BarChart, FileText, Sparkles, 
  ChevronRight, Code2, BrainCircuit, Activity 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import AuthModel from '../components/AuthModel';
import Footer from '../components/Footer';

// Keeping the original image imports
import hrImg from "../assets/hr.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-bg-primary text-gray-100 flex flex-col relative overflow-hidden'>
      {/* Global Background Effects */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-accent-secondary/5 rounded-full blur-[150px]" />
      </div>

      <Navbar />

      <div className='flex-1 px-6 pt-32 pb-20 relative z-10'>
        <div className='max-w-6xl mx-auto'>
          
          {/* HERO SECTION */}
          <div className='flex justify-center mb-8'>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='glass px-4 py-2 rounded-full flex items-center gap-2 border border-accent-primary/30 glow-border'
            >
              <Sparkles size={16} className="text-accent-primary" />
              <span className="text-sm font-medium text-gray-200">AI Powered Smart Interview Platform</span>
            </motion.div>
          </div>

          <div className='text-center mb-32 relative'>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='text-5xl md:text-7xl font-bold leading-tight max-w-4xl mx-auto tracking-tight'
            >
              Master Your Next Interview with <br className="hidden md:block" />
              <span className='relative inline-block mt-2'>
                <span className='text-gradient glow-text'>
                  AI Intelligence
                </span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full opacity-50" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className='text-gray-400 mt-8 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed'
            >
              High-fidelity technical and behavioral interview simulations powered by advanced AI. Experience real-time coding, emotion analysis, and deep feedback.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className='flex flex-wrap justify-center gap-4 mt-12'
            >
              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                className='group relative bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-10 py-4 rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(167,139,250,0.3)] hover:shadow-[0_0_30px_rgba(167,139,250,0.6)] hover:scale-[1.02]'
              >
                <div className="flex items-center gap-2">
                  Start Interview
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/history");
                }}
                className='glass border border-white/10 px-10 py-4 rounded-full font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all hover:scale-[1.02]'
              >
                Watch Demo
              </button>
            </motion.div>
          </div>

          {/* 3 STEPS CARDS */}
          <div className='grid md:grid-cols-3 gap-8 mb-40 relative z-20'>
            {[
              {
                icon: <Bot size={28} />,
                step: "PHASE 1",
                title: "Role Selection",
                desc: "AI adjusts technical depth and questions based on your specific job role."
              },
              {
                icon: <Mic size={28} />,
                step: "PHASE 2",
                title: "Live Simulation",
                desc: "Engage in voice and coding interviews with dynamic follow-ups."
              },
              {
                icon: <Activity size={28} />,
                step: "PHASE 3",
                title: "Deep Analysis",
                desc: "Receive actionable metrics on confidence, correctness, and speed."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className='glass-card p-8 group hover:border-accent-primary/50 transition-all duration-300'
              >
                <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center text-accent-primary mb-6 border border-accent-primary/30 group-hover:glow-border transition-all'>
                  {item.icon}
                </div>
                <div className='text-xs font-bold text-accent-secondary tracking-widest mb-3 uppercase'>{item.step}</div>
                <h3 className='font-semibold text-xl mb-3 text-white'>{item.title}</h3>
                <p className='text-gray-400 text-sm leading-relaxed'>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* ADVANCED AI CAPABILITIES */}
          <div className='mb-40 relative'>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent-primary/5 blur-[100px] rounded-full pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-center mb-16'
            >
              <h2 className='text-4xl md:text-5xl font-bold tracking-tight mb-4'>
                Advanced AI <span className="text-gradient">Capabilities</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Powered by state-of-the-art LLMs and real-time execution environments.</p>
            </motion.div>

            <div className='grid md:grid-cols-2 gap-8'>
              {[
                {
                  image: evalImg,
                  icon: <BrainCircuit size={22} />,
                  title: "AI Answer Evaluation",
                  desc: "Scores communication, technical accuracy, and execution speed instantly."
                },
                {
                  image: resumeImg,
                  icon: <FileText size={22} />,
                  title: "Resume Context",
                  desc: "Project-specific deep dives based on your uploaded resume data."
                },
                {
                  image: pdfImg,
                  icon: <FileText size={22} />,
                  title: "PDF Reporting",
                  desc: "Export detailed, structured performance reviews and improvement areas."
                },
                {
                  image: analyticsImg,
                  icon: <BarChart size={22} />,
                  title: "Historical Analytics",
                  desc: "Track growth over time with heatmaps, charts, and metric graphs."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className='glass border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all group overflow-hidden relative'
                >
                  <div className="absolute right-[-10%] top-[-10%] w-40 h-40 bg-accent-primary/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className='flex flex-col md:flex-row items-center gap-8 relative z-10'>
                    <div className='w-full md:w-1/2 flex justify-center p-4 bg-black/20 rounded-2xl border border-white/5'>
                      <img src={item.image} alt={item.title} className='w-full h-auto object-contain max-h-56 filter drop-shadow-xl' />
                    </div>

                    <div className='w-full md:w-1/2'>
                      <div className='bg-accent-primary/20 text-accent-primary w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-accent-primary/30'>
                        {item.icon}
                      </div>
                      <h3 className='font-semibold mb-3 text-xl text-white'>{item.title}</h3>
                      <p className='text-gray-400 text-sm leading-relaxed'>{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* INTERVIEW MODES */}
          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-4xl md:text-5xl font-bold tracking-tight text-center mb-16'
            >
              Multiple Interview <span className="text-gradient">Modes</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-8'>
              {[
                {
                  img: hrImg,
                  title: "HR Behavioral",
                  desc: "Soft skills, culture fit, and communication evaluation."
                },
                {
                  img: techImg,
                  title: "Technical Execution",
                  desc: "Live code execution with real-time feedback."
                },
                {
                  img: confidenceImg,
                  title: "Emotion Tracking",
                  desc: "Real-time webcam analysis of confidence and nervousness."
                },
                {
                  img: creditImg,
                  title: "Pro Credits",
                  desc: "Unlock limitless mock interviews and premium features."
                }
              ].map((mode, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="glass border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all group relative overflow-hidden"
                >
                  <div className='flex items-center justify-between gap-6 relative z-10'>
                    <div className="w-1/2">
                      <h3 className="font-semibold text-xl mb-3 text-white">
                        {mode.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {mode.desc}
                      </p>
                    </div>

                    <div className="w-1/2 flex justify-end">
                      <div className="relative">
                        <div className="absolute inset-0 bg-accent-primary/20 blur-[20px] rounded-full group-hover:bg-accent-primary/40 transition-colors" />
                        <img
                          src={mode.img}
                          alt={mode.title}
                          className="w-28 h-28 object-contain relative z-10 drop-shadow-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      <Footer />
    </div>
  );
}

export default Home;
