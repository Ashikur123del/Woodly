"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRing, FaBaby, FaPray, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import OrderModal from '@/components/OrderModal';


const OrderCreatePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("wedding");

  // ৩টি প্রধান প্রোডাক্ট ক্যাটাগরি কনফিগ
  const orderTabs = [
    {
      key: "wedding",
      title: "বিবাহ",
      subtitle: "Wedding Memory Card",
      desc: "দুটি মনের এক চিরন্তন বন্ধনের বিশেষ মুহূর্ত খোদাই করুন প্রিমিয়াম লেজার এনগ্রেভিংয়ে।",
      icon: <FaRing className="text-3xl text-pink-400 group-hover:scale-110 transition-transform" />,
      bgGradient: "from-pink-500/10 to-transparent",
      borderColor: "hover:border-pink-500/50"
    },
    {
      key: "birth",
      title: "জন্মদিন / আকিকা",
      subtitle: "Birth Memory Card",
      desc: "নতুন আশা এবং ভালোবাসার সূচনা— আপনার আদরের সন্তানের প্রথম আগমনী বার্তা আজীবন ধরে রাখুন।",
      icon: <FaBaby className="text-3xl text-blue-400 group-hover:scale-110 transition-transform" />,
      bgGradient: "from-blue-500/10 to-transparent",
      borderColor: "hover:border-blue-500/50"
    },
    {
      key: "death",
      title: "স্মরণিকা",
      subtitle: "In Loving Memory",
      desc: "হারিয়ে যাওয়া প্রিয় মানুষটির নাম, স্মৃতি এবং পুরো জীবনের এক শ্রদ্ধাঞ্জলি রূপরেখা।",
      icon: <FaPray className="text-3xl text-yellow-400 group-hover:scale-110 transition-transform" />,
      bgGradient: "from-yellow-500/10 to-transparent",
      borderColor: "hover:border-yellow-500/50"
    }
  ];

  const handleTabClick = (type) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0b111e] to-[#070b14] text-slate-300 p-4 lg:p-8 font-sans antialiased relative overflow-hidden flex flex-col justify-center items-center">
      
      {/* 🔮 Woodly Premium Background Decorative Glows */}
      <div className="absolute top-[-10%] right-[15%] w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[5%] left-[10%] w-[400px] h-[400px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* 🏷️ Header Information */}
      <div className="text-center mb-12 max-w-xl relative z-10">
        <p className="text-[10px] tracking-[0.3em] text-[#FFDE42] uppercase font-bold mb-2">Woodly Premium Studio</p>
        <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight font-extrabold mb-3">নতুন অর্ডার তৈরি করুন</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          আপনার কাঙ্খিত ক্যাটাগরি নির্বাচন করুন। ক্লিক করার সাথে সাথে প্রিমিয়াম লেজার-এনগ্রেভড মেমোরি কার্ড অর্ডারের এক্সক্লুসিভ ফরমটি ওপেন হয়ে যাবে।
        </p>
      </div>

      {/* 🗂️ Interactive 3-Tabs Grid Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full relative z-10 px-2 md:px-6">
        {orderTabs.map((tab) => (
          <motion.div
            key={tab.key}
            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            onClick={() => handleTabClick(tab.key)}
            className={`group bg-[#1e293b]/40 backdrop-blur-md border border-white/10 rounded-[24px] p-6 flex flex-col justify-between items-start transition-all cursor-pointer ${tab.borderColor} relative overflow-hidden min-h-[260px]`}
          >
            {/* Soft Ambient Inner Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${tab.bgGradient} opacity-40 pointer-events-none transition-opacity duration-300`} />

            <div className="w-full relative z-10">
              {/* Icon Holder */}
              <div className="w-14 h-14 bg-slate-900/60 rounded-2xl border border-white/5 flex items-center justify-center mb-5 shadow-inner">
                {tab.icon}
              </div>

              {/* Titles */}
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider block mb-1">
                {tab.subtitle}
              </span>
              <h3 className="text-xl font-black text-white group-hover:text-[#FFDE42] transition-colors duration-300">
                {tab.title}
              </h3>
              
              {/* Short Description */}
              <p className="text-slate-400 text-xs mt-3 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                {tab.desc}
              </p>
            </div>

            {/* Bottom Action Footer Trigger */}
            <div className="w-full flex justify-between items-center mt-6 pt-4 border-t border-white/5 relative z-10 text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
              <span className="group-hover:underline">অর্ডার করতে চাপুন</span>
              <div className="w-8 h-8 rounded-full bg-slate-900/40 border border-white/5 flex items-center justify-center group-hover:bg-[#FFDE42] group-hover:text-slate-950 transition-all">
                <FaArrowRight size={12} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🔒 Bottom Secure Trust Banner */}
      <div className="mt-12 flex items-center gap-2 bg-slate-900/30 border border-white/5 px-4 py-2 rounded-full text-[10px] text-slate-500 font-medium tracking-wide relative z-10 select-none">
        <FaShieldAlt className="text-[#FFDE42]" /> Cash on Delivery Available Nationwide • 999 BDT Flat Rate
      </div>

      {/* 📦 Master Order Modal Component */}
      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedType={selectedType} 
      />

    </div>
  );
};

export default OrderCreatePage;