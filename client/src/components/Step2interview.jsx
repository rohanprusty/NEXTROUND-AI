import React, { useState, useRef, useEffect } from 'react';
import maleVideo from "../assets/videos/male-ai.mp4";
import femaleVideo from "../assets/videos/female-ai.mp4";
import Timer from './Timer';
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Video, VideoOff, Send, ArrowRight, Brain, Eye, Activity, Smile, Frown, Meh, Cpu } from "lucide-react";
import axios from "axios";
import { ServerUrl } from '../App';
import * as faceapi from 'face-api.js';
import toast from 'react-hot-toast';

import InterviewEditor, { BOILERPLATES, PISTON_LANGUAGES } from './InterviewEditor';
import InterviewTerminal from './InterviewTerminal';

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [codeAnswer, setCodeAnswer] = useState("");
  const [language, setLanguage] = useState("cpp");
  
  // Piston Execution State
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [terminalError, setTerminalError] = useState("");
  const [runStats, setRunStats] = useState(null);

  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const [isCameraVisible, setIsCameraVisible] = useState(true);

  const [emotionTally, setEmotionTally] = useState({ happy: 0, neutral: 0, nervous: 0 });
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  
  const webcamRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const faceIntervalRef = useRef(null);
  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    setCodeAnswer(BOILERPLATES[language]);
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(v =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find(v =>
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("mark") ||
        v.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Load face-api.js models ONCE
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      } catch (err) {
        console.error("Error loading face-api models", err);
      }
    };
    loadModels();
  }, []);

  // Webcam Logic (with strict cleanup)
  useEffect(() => {
    let activeStream = null;

    const startWebcam = async () => {
      if (!isCameraVisible) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        activeStream = stream;
        webcamStreamRef.current = stream;
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Webcam access denied", err);
      }
    };
    startWebcam();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraVisible]);

  // Global unmount cleanup for webcam (route changes)
  useEffect(() => {
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Face Tracking Logic
  useEffect(() => {
    if (isMicOn && isCameraVisible && !isIntroPhase) {
      faceIntervalRef.current = setInterval(async () => {
        if (webcamRef.current && webcamRef.current.readyState === 4) {
          try {
            const detections = await faceapi.detectSingleFace(
              webcamRef.current,
              new faceapi.TinyFaceDetectorOptions()
            ).withFaceExpressions();

            if (detections) {
              const expressions = detections.expressions;
              let dominantEmotion = "";
              let maxScore = -1;
              for (const [emotion, score] of Object.entries(expressions)) {
                if (score > maxScore) {
                  maxScore = score;
                  dominantEmotion = emotion;
                }
              }
              
              setCurrentEmotion(dominantEmotion);

              setEmotionTally(prev => {
                const updated = { ...prev };
                if (dominantEmotion === 'happy' || dominantEmotion === 'surprised') updated.happy += 1;
                else if (dominantEmotion === 'neutral') updated.neutral += 1;
                else if (dominantEmotion === 'sad' || dominantEmotion === 'fearful' || dominantEmotion === 'angry' || dominantEmotion === 'disgusted') updated.nervous += 1;
                return updated;
              });
            }
          } catch(err) {
            console.error("Face detection error", err);
          }
        }
      }, 2000);
    } else {
      if (faceIntervalRef.current) clearInterval(faceIntervalRef.current);
    }

    return () => {
      if (faceIntervalRef.current) clearInterval(faceIntervalRef.current);
    };
  }, [isMicOn, isIntroPhase, isCameraVisible]);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;     
      utterance.pitch = 1.05;    
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);
        if (isMicOn) startMic();
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) return;
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(`Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`);
        await speakText("I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.");
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }
        await speakText(currentQuestion.question);
        if (isMicOn) startMic();
      }
    }
    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try { recognitionRef.current.start(); } catch {}
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleMic = () => {
    if (isMicOn) stopMic();
    else startMic();
    setIsMicOn(!isMicOn);
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    try {
      const timeElapsed = currentQuestion.timeLimit - timeLeft || 1;
      const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;
      const wpm = (wordCount / timeElapsed) * 60;
      const behavioralTelemetry = { emotionTally, wpm: Math.round(wpm) };

      // Send the codeSnippet to backend for AI Evaluation
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer,
        codeSnippet: codeAnswer,
        timeTaken: timeElapsed,
        behavioralTelemetry
      }, { withCredentials: true });

      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setAnswer("");
    setCodeAnswer(BOILERPLATES[language]);
    setTerminalOutput("");
    setTerminalError("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");
    setCurrentIndex(currentIndex + 1);
    setTimeout(() => { if (isMicOn) startMic(); }, 500);
  };

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(ServerUrl + "/api/interview/finish", { interviewId }, { withCredentials: true });
      toast.success("Interview completed! Generating report...");
      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return;
    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Piston API Execution
  const handleRunCode = async () => {
    setIsExecuting(true);
    setTerminalOutput("");
    setTerminalError("");
    setRunStats(null);

    try {
      const pistonConfig = PISTON_LANGUAGES[language];
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: pistonConfig.language,
          version: pistonConfig.version,
          files: [{ content: codeAnswer }],
        }),
      });

      const data = await response.json();
      
      if (data.run.stderr || data.compile?.stderr) {
        setTerminalError(data.run.stderr || data.compile.stderr);
      } else {
        setTerminalOutput(data.run.stdout);
      }
      
      setRunStats({ time: data.run.time || 0, memory: data.run.memory || 0 });
    } catch (error) {
      setTerminalError("Execution failed. Network error or API limit reached.");
    } finally {
      setIsExecuting(false);
    }
  };

  const getEmotionIcon = () => {
    if (currentEmotion === 'happy' || currentEmotion === 'surprised') return <Smile className="text-emerald-400" size={16}/>;
    if (currentEmotion === 'neutral') return <Meh className="text-blue-400" size={16}/>;
    return <Frown className="text-red-400" size={16}/>;
  };

  return (
    <div className='min-h-screen bg-bg-primary p-4 sm:p-6 lg:p-8 flex flex-col gap-6 relative'>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-primary/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center glass-card px-6 py-3 relative z-10">
        <div className="flex items-center gap-3">
          <Brain className="text-accent-primary" size={24} />
          <h1 className="text-xl font-bold text-white tracking-tight">AI Interview Session</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Progress</span>
            <span className="text-sm font-bold text-white">{currentIndex + 1} / {questions.length}</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 min-h-0">
        
        {/* Left Column: AI Avatar & Feedback */}
        <div className="lg:col-span-4 flex flex-col gap-6 min-h-0">
          
          {/* Avatar Card */}
          <div className="glass-card overflow-hidden flex flex-col relative group">
            <div className="relative w-full aspect-[4/3] bg-black">
              <video
                src={videoSource}
                key={videoSource}
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
              {/* AI Status Indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <div className={`w-2 h-2 rounded-full ${isAIPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-xs font-medium text-white">{isAIPlaying ? 'AI Speaking' : 'AI Listening'}</span>
              </div>

              {/* Emotion HUD */}
              {!isIntroPhase && (
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <Activity size={14} className="text-accent-secondary" />
                    <span className="text-xs text-white capitalize">{currentEmotion}</span>
                    {getEmotionIcon()}
                  </div>
                </div>
              )}

              {/* Webcam PiP */}
              <div className="absolute bottom-4 right-4 w-32 h-24 z-50">
                {isCameraVisible ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/20 shadow-2xl group-hover:glow-border transition-all">
                    <video
                      ref={webcamRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover bg-black scale-x-[-1]"
                    />
                    {/* Live Mic Indicator in PiP */}
                    {isMicOn && (
                      <div className="absolute bottom-1 right-1 bg-black/60 p-1 rounded-md backdrop-blur-sm">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full rounded-lg shadow-lg border border-white/10 bg-gray-900 flex items-center justify-center">
                    <VideoOff className="text-gray-500" size={20} />
                  </div>
                )}
                <button
                  onClick={() => setIsCameraVisible(!isCameraVisible)}
                  className="absolute -top-2 -right-2 bg-gray-800 text-white p-1.5 rounded-full hover:bg-gray-700 transition-colors border border-white/10 shadow-lg"
                >
                  {isCameraVisible ? <VideoOff size={12} /> : <Video size={12} />}
                </button>
              </div>
            </div>

            {/* Subtitles Area */}
            <div className="p-4 bg-bg-secondary min-h-[80px] flex items-center justify-center border-t border-white/5">
              <AnimatePresence mode="wait">
                {subtitle ? (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium text-gray-200 text-center leading-relaxed"
                  >
                    "{subtitle}"
                  </motion.p>
                ) : (
                  <p className="text-sm text-gray-600 italic">Waiting for response...</p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls & Voice Input */}
          <div className="glass-card p-6 flex flex-col gap-4">
             <div className="flex items-center gap-4">
               <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg border transition-colors ${
                  isMicOn 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30 glow-border' 
                    : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                }`}
              >
                {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
              </motion.button>
              
              <div className="flex-1 bg-black/40 rounded-xl p-4 border border-white/5 h-32 overflow-y-auto custom-scrollbar relative">
                {!answer && <span className="text-gray-600 italic text-sm absolute top-4 left-4 pointer-events-none">Speech recognized text will appear here...</span>}
                <p className="text-sm text-gray-300 leading-relaxed">{answer}</p>
              </div>
             </div>

             {!feedback ? (
              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-primary to-accent-secondary text-white py-3.5 rounded-xl font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Evaluating..." : "Submit Answer"}
                <Send size={16} />
              </motion.button>
             ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col gap-3"
              >
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm leading-relaxed custom-scrollbar max-h-40 overflow-y-auto">
                  {feedback}
                </div>
                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Next Question <ArrowRight size={16}/>
                </button>
              </motion.div>
             )}
          </div>
        </div>

        {/* Right Column: Question, Editor & Terminal */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
          
          {/* Question Panel */}
          <div className="glass-card p-6 border-l-4 border-l-accent-primary flex-shrink-0">
            <h3 className="text-sm font-bold text-accent-secondary uppercase tracking-wider mb-2">Current Question</h3>
            {isIntroPhase ? (
               <p className="text-lg text-gray-400 animate-pulse">Initializing interview...</p>
            ) : (
               <p className="text-lg md:text-xl font-semibold text-white leading-relaxed">{currentQuestion?.question}</p>
            )}
          </div>

          {/* IDE Area (Editor + Terminal) */}
          {currentQuestion?.questionType === 'coding' ? (
            <div className="flex-1 flex flex-col gap-6 min-h-0">
              {/* Editor Pane */}
              <div className="flex-[0.7] min-h-[300px]">
                <InterviewEditor 
                  codeAnswer={codeAnswer} 
                  setCodeAnswer={setCodeAnswer}
                  language={language}
                  setLanguage={setLanguage}
                  onRunCode={handleRunCode}
                  isExecuting={isExecuting}
                />
              </div>
              
              {/* Terminal Pane */}
              <div className="flex-[0.3] min-h-[150px]">
                <InterviewTerminal 
                  output={terminalOutput}
                  error={terminalError}
                  isExecuting={isExecuting}
                  runStats={runStats}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 glass-card p-6 flex flex-col relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
               <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
                 <Eye size={16}/> Behavioral Focus Mode
               </h3>
               <textarea
                  placeholder="Alternatively, type your thoughts here..."
                  onChange={(e) => setAnswer(e.target.value)}
                  value={answer}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 resize-none outline-none focus:border-accent-primary/50 transition-colors custom-scrollbar relative z-10"
               />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Step2Interview;
