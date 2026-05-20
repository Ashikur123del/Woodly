import Link from 'next/link';
import React from 'react';

const NotFound = () => {
  return (
  
    <div className="w-full min-h-screen bg-gradient-to-b from-[#06142c] via-[#020a17] to-[#01050e] text-slate-100 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden font-sans antialiased">
      
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[500px] h-[400px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        
   
        <div className="relative inline-block select-none">
          <h1 className="text-[12rem] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-blue-500/30 to-transparent leading-none select-none">
            404
          </h1>
         
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Oops! Page Out of Bounds 🛑
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed max-w-sm mx-auto">
            The premium route or asset you are trying to reach doesnt exist, has been shifted, or is under scheduled maintenance.
          </p>
        </div>

        <div className="p-6 bg-[#081730]/40 backdrop-blur-md border border-slate-800/80 rounded-2xl flex items-center justify-center gap-5 text-2xl shadow-xl max-w-xs mx-auto">
          <span className="animate-bounce inline-block text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">✦</span>
          <span className="animate-bounce delay-100 inline-block text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">✧</span>
          <span className="animate-bounce delay-200 inline-block text-purple-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">✦</span>
          <span className="animate-bounce delay-300 inline-block text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">✧</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 text-sm tracking-wider shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 active:scale-[0.98] cursor-pointer uppercase"
          >
            Go Back Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;