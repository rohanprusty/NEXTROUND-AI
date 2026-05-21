import React from 'react';
import { Bot } from 'lucide-react';

function Footer() {
  return (
    <div className='relative bg-bg-primary pt-20 pb-10 px-4 border-t border-white/5 overflow-hidden'>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-accent-primary/5 blur-[100px] pointer-events-none" />
      
      <div className='w-full max-w-6xl mx-auto flex flex-col items-center text-center relative z-10'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30'>
            <img src="/nextRound.png" alt="NextRound AI" className="w-full h-full object-contain" />
          </div>
          <h2 className='font-bold text-xl tracking-tight text-white'>
            NextRound<span className="text-gradient"> AI</span>
          </h2>
        </div>
        
        <p className='text-gray-400 text-sm max-w-xl mx-auto leading-relaxed mb-8'>
          An elite AI-powered interview operating system designed to enhance technical depth, communication skills, and professional confidence for FAANG-level preparation.
        </p>

        <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
        
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-accent-primary transition-colors cursor-pointer">Privacy Policy</a>
          <a href="#" className="hover:text-accent-primary transition-colors cursor-pointer">Terms of Service</a>
          <a href="#" className="hover:text-accent-primary transition-colors cursor-pointer">Contact Us</a>
          <a href="#" className="hover:text-accent-primary transition-colors cursor-pointer">Mail - rohankrprusty@gmail.com</a>
        </div>
        
        <p className="text-xs text-gray-600 mt-8">
          &copy; {new Date().getFullYear()} NextRound AI. All rights reserved. Built By - <a href="https://github.com/rohan064" target="_blank" className="text-accent-primary hover:text-accent-secondary transition-colors"> Rohan Prusty</a> || IIIT JABALPUR.
        </p>
      </div>
    </div>
  );
}

export default Footer;
