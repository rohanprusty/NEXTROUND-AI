import React, { useEffect, useState } from 'react';
import { Editor } from "@monaco-editor/react";
import { Play, RotateCcw, Settings, Code } from 'lucide-react';
import { motion } from "motion/react";

export const BOILERPLATES = {
  python: `def solve():\n    pass\n\nif __name__ == "__main__":\n    solve()`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}`,
  javascript: `function solve() {\n    \n}\n\nsolve();`,
  typescript: `function solve(): void {\n    \n}\n\nsolve();`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    \n}`
};

export const PISTON_LANGUAGES = {
  python: { language: 'python', version: '3.10.0' },
  cpp: { language: 'cpp', version: '10.2.0' },
  java: { language: 'java', version: '15.0.2' },
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  go: { language: 'go', version: '1.16.2' }
};

function InterviewEditor({ codeAnswer, setCodeAnswer, language, setLanguage, onRunCode, isExecuting }) {
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState("vs-dark");

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCodeAnswer(BOILERPLATES[newLang]);
  };

  const resetCode = () => {
    setCodeAnswer(BOILERPLATES[language]);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
      {/* Floating Glass Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 glass-card px-4 py-2 flex items-center gap-4 glow-border">
        <div className="flex items-center gap-2 border-r border-white/10 pr-4">
          <Code size={16} className="text-accent-secondary" />
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="bg-transparent text-sm text-gray-200 outline-none cursor-pointer"
          >
            <option value="python" className="bg-bg-secondary">Python</option>
            <option value="cpp" className="bg-bg-secondary">C++</option>
            <option value="java" className="bg-bg-secondary">Java</option>
            <option value="javascript" className="bg-bg-secondary">JavaScript</option>
            <option value="typescript" className="bg-bg-secondary">TypeScript</option>
            <option value="go" className="bg-bg-secondary">Go</option>
          </select>
        </div>

        <div className="flex items-center gap-3 border-r border-white/10 pr-4">
          <Settings size={16} className="text-gray-400" />
          <select 
            value={fontSize} 
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer w-12"
          >
            <option value="12" className="bg-bg-secondary">12px</option>
            <option value="14" className="bg-bg-secondary">14px</option>
            <option value="16" className="bg-bg-secondary">16px</option>
            <option value="18" className="bg-bg-secondary">18px</option>
          </select>
        </div>

        <button 
          onClick={resetCode}
          className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 transition-colors"
          title="Reset Code"
        >
          <RotateCcw size={16} />
        </button>

        <button 
          onClick={onRunCode}
          disabled={isExecuting}
          className="flex items-center gap-2 bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isExecuting ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <RotateCcw size={14} />
            </motion.div>
          ) : (
            <Play size={14} fill="currentColor" />
          )}
          Run Code
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 mt-16 pt-2">
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={codeAnswer}
          onChange={(val) => setCodeAnswer(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: fontSize,
            fontFamily: "'Fira Code', 'Inter', monospace",
            fontLigatures: true,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
            autoClosingBrackets: "always",
            scrollBeyondLastLine: false,
            padding: { top: 16 }
          }}
        />
      </div>
    </div>
  );
}

export default InterviewEditor;
