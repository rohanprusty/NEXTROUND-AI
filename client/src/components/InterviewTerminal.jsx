import React, { useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

function InterviewTerminal({ output, error, isExecuting, runStats }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [output, error, isExecuting]);

  const getGlowStyles = () => {
    if (isExecuting) return "border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.1)]";
    if (error) return "border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]";
    if (runStats && output) return "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]";
    return "border-white/10 shadow-inner";
  };

  return (
    <div className={`h-full w-full bg-black/90 rounded-2xl border flex flex-col font-mono text-sm overflow-hidden transition-all duration-500 ${getGlowStyles()}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2 text-gray-400">
          <TerminalIcon size={14} />
          <span>Output Console</span>
        </div>
        
        {runStats && !isExecuting && (
          <div className="flex items-center gap-3 text-xs">
            {error ? (
              <span className="flex items-center gap-1 text-red-400"><AlertCircle size={12}/> Failed</span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={12}/> Success</span>
            )}
            {runStats.time && <span className="text-gray-500">Time: <span className="text-gray-300">{runStats.time}ms</span></span>}
            {runStats.memory && <span className="text-gray-500">Mem: <span className="text-gray-300">{(runStats.memory / 1024 / 1024).toFixed(2)}MB</span></span>}
          </div>
        )}
      </div>

      {/* Terminal Body */}
      <div ref={bodyRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar scroll-smooth">
        {isExecuting ? (
          <div className="flex items-center gap-2 text-gray-400 animate-pulse">
            <div className="w-2 h-4 bg-gray-400 animate-bounce" />
            Executing code...
          </div>
        ) : output ? (
          <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
        ) : error ? (
          <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
        ) : (
          <div className="text-gray-600 italic">Run your code to see the output here...</div>
        )}
      </div>
    </div>
  );
}

export default InterviewTerminal;
