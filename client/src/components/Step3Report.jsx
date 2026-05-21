import React from 'react';
import { ArrowLeft, Download, Code2, Activity, Video, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

function Step3Report({ report }) {
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Crunching Analytics...</p>
        </div>
      </div>
    );
  }
  
  // DEFENSIVE PROGRAMMING: Fallbacks for missing data
  const finalScore = report?.finalScore ?? 0;
  const confidence = report?.confidence ?? 0;
  const communication = report?.communication ?? 0;
  const correctness = report?.correctness ?? 0;
  const questionWiseScore = report?.questionWiseScore ?? [];

  const questionScoreData = questionWiseScore.map((q, index) => ({
    name: `Q${index + 1}`,
    score: q?.score ?? 0
  }));

  const radarData = [
    { subject: 'Confidence', A: confidence * 10, fullMark: 100 },
    { subject: 'Communication', A: communication * 10, fullMark: 100 },
    { subject: 'Correctness', A: correctness * 10, fullMark: 100 },
    { subject: 'Problem Solving', A: Math.max(0, (finalScore * 10) - 5), fullMark: 100 },
    { subject: 'Structure', A: Math.min(100, (communication * 10) + 5), fullMark: 100 },
  ];

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "Needs Focus";
  let shortTagline = "Work on clarity, confidence, and accuracy.";

  if (finalScore >= 8) {
    performanceText = "Elite Performance";
    shortTagline = "Top 10% - Ready for FAANG interviews.";
  } else if (finalScore >= 5) {
    performanceText = "Solid Foundation";
    shortTagline = "Good structure, but refine articulation.";
  }

  const percentage = (finalScore / 10) * 100;

  const downloadPDF = async () => {
    const toastId = toast.loading("Generating PDF Report...");
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let currentY = 25;

      // Dark theme PDF styling
      doc.setFillColor(11, 17, 32); // #0B1120
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("InterviewForge AI Report", pageWidth / 2, 25, { align: "center" });

      currentY = 55;

      doc.setFillColor(243, 244, 246);
      doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");
      doc.setFontSize(14);
      doc.setTextColor(31, 41, 55); // #1f2937 sleek dark gray
      doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 13, { align: "center" });

      currentY += 30;

      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");
      doc.setFontSize(12);
      doc.text(`Confidence: ${confidence}/10`, margin + 10, currentY + 10);
      doc.text(`Communication: ${communication}/10`, margin + 10, currentY + 18);
      doc.text(`Correctness: ${correctness}/10`, margin + 10, currentY + 26);

      currentY += 45;

      let advice = "";
      if (finalScore >= 8) {
        advice = "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
      } else if (finalScore >= 5) {
        advice = "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
      } else {
        advice = "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
      }

      doc.setFont("helvetica", "bold");
      doc.text("Professional Advice", margin, currentY);
      currentY += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitAdvice = doc.splitTextToSize(advice, contentWidth);
      doc.text(splitAdvice, margin, currentY);

      currentY += (splitAdvice.length * 6) + 10;

      // Defensive mapping for autoTable
      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [["#", "Question", "Score", "Feedback"]],
        body: questionWiseScore.map((q, i) => [
          `${i + 1}`,
          q?.question || "Unknown Question",
          `${q?.score ?? 0}/10`,
          q?.feedback || "No feedback provided",
        ]),
        styles: { fontSize: 9, cellPadding: 5, valign: "top", textColor: [55, 65, 81] },
        headStyles: { fillColor: [139, 92, 246], textColor: 255, halign: "center" }, // Violet-500
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 55 },
          2: { cellWidth: 20, halign: "center" },
          3: { cellWidth: "auto" },
        },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });

      doc.save("AI_Interview_Report.pdf");
      toast.success("PDF Report downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF. Check console.", { id: toastId });
    }
  };

  return (
    <div className='min-h-screen bg-bg-primary px-4 sm:px-6 lg:px-10 py-10 relative overflow-hidden'>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-accent-primary/5 blur-[150px] pointer-events-none" />

      <div className='mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10'>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => navigate("/history")}
            className='p-3 rounded-xl glass border border-white/10 hover:bg-white/10 transition-colors'
          >
            <ArrowLeft className='text-gray-300' size={20} />
          </button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-white'>
              Analytics <span className="text-gradient">Dashboard</span>
            </h1>
            <p className='text-gray-400 mt-1 text-sm'>
              AI-powered comprehensive performance insights
            </p>
          </div>
        </div>

        <button 
          onClick={downloadPDF} 
          className='group flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all text-sm font-semibold'
        >
          <Download size={16} className="group-hover:-translate-y-1 transition-transform" />
          Export PDF
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10'>
        <div className='space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center border-t-4 border-t-accent-primary"
          >
            <h3 className="text-gray-400 mb-6 text-sm uppercase tracking-widest font-bold">
              Overall Rating
            </h3>
            <div className='relative w-32 h-32 mx-auto filter drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]'>
              <CircularProgressbar
                value={percentage}
                text={`${finalScore}/10`}
                styles={buildStyles({
                  textSize: "24px",
                  pathColor: "#A78BFA",
                  textColor: "#fff",
                  trailColor: "rgba(255,255,255,0.1)",
                })}
              />
            </div>
            <div className="mt-8">
              <p className="font-bold text-white text-xl">
                {performanceText}
              </p>
              <p className="text-accent-primary text-sm mt-2 font-medium bg-accent-primary/10 py-2 px-4 rounded-lg inline-block">
                {shortTagline}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='glass-card p-8'
          >
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
              Skill Metrics
            </h3>
            <div className='space-y-6'>
              {skills.map((s, i) => (
                <div key={i}>
                  <div className='flex justify-between mb-2 text-sm'>
                    <span className="text-gray-300 font-medium">{s.label}</span>
                    <span className='font-bold text-accent-tertiary'>{s.value}/10</span>
                  </div>
                  <div className='bg-white/5 h-2 rounded-full overflow-hidden'>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.value ?? 0) * 10}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className='bg-gradient-to-r from-accent-primary to-accent-secondary h-full rounded-full'
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='glass-card p-6 h-64'
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="#A78BFA" fill="#A78BFA" fillOpacity={0.3} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1120', borderColor: 'rgba(255,255,255,0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className='lg:col-span-2 space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='glass-card p-6 md:p-8'
          >
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
              Score Timeline
            </h3>
            <div className='h-64 sm:h-80 w-full'>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} stroke="#6b7280" tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1120', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone"
                    dataKey="score"
                    stroke="#A78BFA"
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='glass-card p-6 md:p-8'
          >
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
              Question Breakdown
            </h3>
            <div className='space-y-6'>
              {questionWiseScore.map((q, i) => (
                <div key={i} className='bg-white/5 p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors'>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-accent-secondary tracking-widest uppercase mb-2">
                        Question {i + 1}
                      </p>
                      <p className="font-semibold text-white text-base leading-relaxed">
                        {q?.question || "Question not available"}
                      </p>
                    </div>
                    <div className='bg-accent-tertiary/10 text-accent-tertiary border border-accent-tertiary/20 px-4 py-1.5 rounded-full font-bold text-sm shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]'>
                      {q?.score ?? 0}/10
                    </div>
                  </div>

                  <div className='bg-white/5 border border-white/10 p-5 rounded-xl backdrop-blur-sm relative z-10'>
                    <p className='text-xs text-accent-primary font-bold uppercase tracking-wider mb-2 flex items-center gap-2'>
                      <BrainCircuit size={14} /> AI Analysis
                    </p>
                    <p className='text-sm text-gray-300 leading-relaxed'>
                      {q?.feedback?.trim() ? q.feedback : "No feedback available for this question."}
                    </p>
                  </div>

                  {q?.questionType === 'coding' && q?.codeSnippet && (
                    <div className="bg-[#1e1e1e] border border-white/10 p-5 rounded-xl mt-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap relative z-10">
                      <p className="text-xs text-gray-500 mb-3 font-sans font-bold uppercase tracking-wider flex items-center gap-2">
                        <Code2 size={14} /> Code Submission
                      </p>
                      <span className="text-gray-300">{q.codeSnippet}</span>
                    </div>
                  )}

                  {q?.body_language_feedback ? (
                    <div className='mt-4 bg-accent-secondary/10 border border-accent-secondary/20 p-5 rounded-xl flex items-start gap-4 relative z-10'>
                      <div className='text-accent-secondary mt-0.5 shrink-0 bg-accent-secondary/20 p-2 rounded-lg'>
                        <Activity size={18} />
                      </div>
                      <div>
                        <p className='text-xs text-accent-secondary font-bold uppercase tracking-wider mb-1'>
                          Behavioral Metrics
                        </p>
                        <p className='text-sm text-gray-300 leading-relaxed'>
                          {q.body_language_feedback}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className='mt-4 bg-white/5 border border-white/5 p-5 rounded-xl flex items-start gap-4 relative z-10 opacity-70'>
                      <div className='text-gray-500 mt-0.5 shrink-0 bg-white/5 p-2 rounded-lg'>
                        <Video size={18} />
                      </div>
                      <div>
                        <p className='text-xs text-gray-500 font-bold uppercase tracking-wider mb-1'>
                          Behavioral Metrics
                        </p>
                        <p className='text-sm text-gray-400 leading-relaxed italic'>
                          Analytics unavailable (Camera likely disabled)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Step3Report;
