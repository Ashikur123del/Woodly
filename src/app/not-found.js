import Link from 'next/link';
import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4 text-center">
      <div className="max-w-md w-full">
        
        {/* ৪MD বা টেক্সট অ্যানিমেশন লুক */}
        <h1 className="text-9xl font-black text-gray-200 select-none tracking-widest animate-pulse">
          404
        </h1>
        
        {/* মূল মেসেজ */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-4 tracking-tight">
          Oops! Out of Bounds 🛑
        </h2>
        
        <p className="text-gray-500 mt-3 text-sm sm:text-base font-medium leading-relaxed">
          The sports facility or page you are looking for doesnt exist, has been moved, or is currently closed for maintenance.
        </p>

      
        <div className="my-8 p-6 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center gap-4 text-3xl shadow-sm">
          <span className="animate-bounce">⚽</span>
          <span className="animate-bounce delay-100">🏏</span>
          <span className="animate-bounce delay-200">🎾</span>
          <span className="animate-bounce delay-300">🏀</span>
        </div>


        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto bg-gray-900 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-sm tracking-wide shadow-sm cursor-pointer"
          >
            Go Back Home
          </Link>
          
        </div>

      </div>
    </div>
  );
};

export default NotFound;