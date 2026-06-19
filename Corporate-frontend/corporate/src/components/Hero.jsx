import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative w-full h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-[#1a1f2c]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url('/hero-bg.png')` }}
      ></div>
      
      {/* Translucent Oval Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="w-[120%] md:w-[900px] h-[900px] bg-[#0f121b]/80 rounded-full blur-[2px] transform scale-y-[1.1] scale-x-[0.9] -mt-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center mt-12">
        <div className="flex items-center justify-center space-x-2 text-white/90 text-[11px] font-bold tracking-[0.2em] uppercase mb-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>On demand live support</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold text-white mb-6 leading-[1.1] tracking-tight">
          Delivering creative<br />digital products
        </h1>
        
        <p className="text-lg md:text-[19px] text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          We're a fully dedicated corporate service agency<br className="hidden md:block" /> collaborating with brands all over the world.
        </p>
        
        <button className="group relative flex items-center space-x-3 bg-gradient-to-r from-[#f46b45] to-[#7154c1] text-white px-9 py-4 rounded-full font-semibold hover:opacity-95 transition-all hover:scale-105 shadow-[0_0_20px_rgba(113,84,193,0.3)]">
          <span className="text-[15px]">Get started now</span>
          <div className="bg-white rounded-full p-1.5 flex items-center justify-center transition-transform group-hover:translate-x-1">
            <ArrowRight className="w-4 h-4 text-[#7154c1]" />
          </div>
        </button>
      </div>

      {/* Floating Badge */}
      <div className="absolute right-10 md:right-48 top-[30%] animate-[bounce_4s_infinite]">
        <div className="bg-[#4f46e5] rounded-full w-[110px] h-[110px] flex flex-col items-center justify-center text-white shadow-2xl relative">
          <div className="absolute -top-3 bg-white rounded-full p-1 shadow-md">
            <div className="bg-[#4f46e5] rounded-full p-1">
              <Check className="w-3 h-3 text-white stroke-[3]" />
            </div>
          </div>
          <span className="text-[10px] font-bold tracking-[0.1em] text-center leading-tight mt-1">DECIDED<br/>QUALITY</span>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 rounded-full hidden md:flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-colors backdrop-blur-sm z-20">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 rounded-full hidden md:flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-colors backdrop-blur-sm z-20">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Side Text */}
      <div className="absolute right-0 bottom-40 origin-bottom-right -rotate-90 text-[10px] font-semibold tracking-[0.2em] text-white/80 hidden lg:block bg-black/20 px-4 py-2 rounded-t-md backdrop-blur-sm">
        56+ PRE-BUILT SITES
      </div>
      
      {/* Bottom right floating button */}
      <button className="absolute right-6 bottom-6 w-14 h-14 bg-[#22c55e] rounded-md flex items-center justify-center shadow-lg z-20 hover:bg-[#16a34a] transition-colors">
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M12 2C6.48 2 2 5.58 2 10c0 2.54 1.45 4.8 3.75 6.22C5.6 17.5 5.2 19.3 5.1 19.8c-.1.3.1.6.4.6.1 0 .2 0 .3-.1 1.7-1.1 3.5-1.9 4.3-2.1.6.1 1.3.2 1.9.2 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
        </svg>
      </button>
    </section>
  );
};

export default Hero;
