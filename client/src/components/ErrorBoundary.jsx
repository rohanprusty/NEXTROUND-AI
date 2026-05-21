import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center p-6 font-mono relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-red-500/10 blur-[120px] pointer-events-none" />
          
          <div className="glass-card p-8 md:p-12 border border-red-500/30 max-w-2xl w-full text-center relative z-10 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 border border-red-500/30">
              <AlertTriangle className="text-red-400" size={32} />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">System Failure</h1>
            <p className="text-red-400/80 mb-8">A critical error occurred while rendering this interface.</p>

            <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-left mb-8 overflow-auto max-h-48 custom-scrollbar">
              <p className="text-red-400 text-sm whitespace-pre-wrap">
                {this.state.error?.toString() || "Unknown rendering error."}
              </p>
              <p className="text-gray-500 text-xs mt-4 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack || ""}
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 hover:text-red-300 px-8 py-3.5 rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all font-semibold mx-auto"
            >
              <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
