import React from "react";

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 overflow-hidden select-none">
      {/* Decorative Blueprint Background Grids */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #3b82f6 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Soft Ambient Light Rays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

      <div className="relative flex flex-col items-center space-y-8 z-10 scale-95 md:scale-100">
        <div className="relative flex items-center justify-center space-x-2">
          {/* Simple Spinner */}
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-widest text-white font-sans uppercase">
            EstimaPro
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-medium">
            Quantity Estimation Suite
          </p>
        </div>

        {/* Glowing Loading Status */}
        <div className="flex flex-col items-center space-y-2 pt-2">
          <div className="flex items-center gap-1.5 text-blue-400/80 text-xs font-semibold uppercase tracking-wider animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Initializing Workspace
            <span className="inline-flex gap-0.5 ml-0.5">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-600 uppercase tracking-widest">
            Establishing Secure Auth Handshake
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
