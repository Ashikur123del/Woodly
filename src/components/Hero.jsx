"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from '@gravity-ui/icons';
import { SiWhatsapp } from "react-icons/si";
import { LuMessageSquareMore } from "react-icons/lu";

import weddingImg from "@/assets/Wod-1.jpeg"; 
import birthImg from "@/assets/Wod-2.jpeg";
import deathImg from "@/assets/Wod-3.jpeg";
import { FaRegStar } from "react-icons/fa";
import SliderLogo from "./SliderLogo";

const contentData = {
  wedding: {
    tabTitle: "Wedding",
    quote: "“বিবাহ শুধুমাত্র একটি চুক্তি নয়— এটি দুটি মনের এক চিরন্তন বন্ধন।”",
    image: weddingImg,
    badgeColor: "border-pink-500 text-pink-400 shadow-pink-500/20",
  },
  birth: {
    tabTitle: "Birth",
    quote: "“একটি শিশুর জন্ম মানেই হলো নতুন আশা এবং ভালোবাসার সূচনা।”",
    image: birthImg,
    badgeColor: "border-blue-500 text-blue-400 shadow-blue-500/20",
  },
  death: {
    tabTitle: "Death",
    quote: "“এই নামটার সাথে জড়িয়ে আছে একটা পুরো জীবন এবং স্মৃতি।”",
    image: deathImg, 
    badgeColor: "border-yellow-500/50 text-yellow-500 shadow-yellow-500/20",
  }
};

const HeroPage = ({ selectedTab, setSelectedTab, setIsModalOpen }) => {
  const data = contentData[selectedTab];

  
  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        const response = await fetch("https://woodly-server-fayw.vercel.app/views/increment", {
          method: "POST",
          cache: "no-store", 
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          const errorHtmlText = await response.text();
          console.error(`Backend Returned HTML/Error instead of JSON (${response.status}):`, errorHtmlText);
          return;
        }

        const resData = await response.json();
        console.log("View count incremented successfully:", resData);
      } catch (error) {
        console.error("Fetch Exception Error:", error);
      }
    };

    incrementViewCount();
  }, []);

  const tabs = [
    { key: "wedding", title: "Wedding", icon: weddingImg },
    { key: "birth", title: "Birth", icon: birthImg },
    { key: "death", title: "Death", icon: deathImg },
  ];

  return (
    <div className="text-white p-4 md:py-6 md:px-20 font-sans flex flex-col items-center justify-center">
      
      <div className="text-center mb-6">
        <p className="text-[10px] tracking-[0.3em] text-[#FFDE42] uppercase font-light">WOODLY PREMIUM</p>
        <h1 className="text-3xl md:text-4xl font-serif mt-1 text-[#FFDE42] tracking-tight">স্মৃতি চিরন্তন</h1>
        <SliderLogo />
      </div>

      <motion.div 
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl w-full bg-[#0d1b26] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[30px] overflow-hidden grid md:grid-cols-2 gap-0 group/main"
      >
        
     
        <div className="relative p-8 bg-gradient-to-br from-[#2FA084] to-[#94a3b8] flex flex-col items-center justify-center min-h-[400px] md:min-h-[450px] overflow-hidden">
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#3ABEF9] group-hover/main:scale-110 transition-transform"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#3ABEF9] group-hover/main:scale-110 transition-transform"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#3ABEF9] group-hover/main:scale-110 transition-transform"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#3ABEF9] group-hover/main:scale-110 transition-transform"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center w-full z-10"
            >
              <p className="text-center text-white font-bold text-lg md:text-xl mb-6 px-4 leading-tight italic drop-shadow-md">
                {data.quote}
              </p>
              <div className="relative w-full max-w-[500px] group/img">
                <div className="bg-[#0b1a26] p-2 rounded-sm border-[6px] border-[#1e293b] shadow-2xl transition-transform duration-500 group-hover/img:rotate-2 group-hover/img:scale-105">
                  <Image 
                    src={data.image} 
                    alt="Product" 
                    priority 
                    className="w-full object-cover rounded-sm border border-white/20 shadow-lg" 
                    style={{ height: "auto" }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 md:bottom-6 left-6 z-50">
            <div className={`flex items-center gap-2 bg-[#05111a] border backdrop-blur-sm ${data.badgeColor} px-3 py-1 rounded-full text-[10px] font-bold shadow-lg`}>
              <span><FaRegStar className="animate-pulse" /></span> {data.tabTitle}
            </div>
          </div>
        </div>

        {/* Right Side (Content) */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-[#636CCB] relative">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">আপনার বিশেষ দিনটি খোদাই করুন</h2>
            <p className="text-slate-200 text-xs leading-relaxed opacity-90">
              প্রিমিয়াম লেজার-এনগ্রেভড কার্ডের উপর আপনার জীবনের সেরা মুহূর্তগুলো আজীবন সংরক্ষণ করুন।
            </p>
          </div>

          {/* ডিজাইন সিলেকশন ট্যাব সেকশন */}
          <div className="mb-6">
            <label className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider mb-3 block">
              ডিজাইন নির্বাচন করুন
            </label>
            <div className="grid grid-cols-3 gap-3">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.key}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0px 10px 20px rgba(255, 222, 66, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-300 ${
                    selectedTab === tab.key
                      ? "border-yellow-500 bg-[#3C467B] shadow-lg"
                      : "border-slate-300/20 bg-[#3C467B]/50 hover:border-slate-100"
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border mb-1 overflow-hidden transition-all duration-300 ${
                    selectedTab === tab.key 
                      ? "bg-white border-yellow-500 shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                      : "bg-white/90 border-transparent grayscale hover:grayscale-0"
                  }`}> 
                    <Image 
                      src={tab.icon} 
                      alt={tab.title} 
                      width={24} 
                      height={24} 
                      className="object-contain" 
                      style={{ height: "auto" }}
                    />
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase tracking-tighter ${
                    selectedTab === tab.key ? "text-yellow-400" : "text-slate-300"
                  }`}>
                    {tab.title}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Price Tag */}
          <div className="flex justify-between items-center p-4 bg-black/30 backdrop-blur-md rounded-xl border border-white/5 mb-6 shadow-inner hover:bg-black/40 transition-colors">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">মূল্য</span>
            <div className="text-right">
                <span className="text-xl font-black text-[#FFDE42]">999.00 BDT</span>
              
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#FFDE42] hover:bg-white text-gray-900 font-black h-14 rounded-xl text-md flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(255,222,66,0.2)] transition-all active:scale-95 mb-4 group/btn"
          >
            অর্ডার করুন 
            <ArrowRight className="text-xl group-hover/btn:translate-x-2 transition-transform duration-300" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-white/5 text-white py-3 rounded-xl text-[11px] font-bold border border-white/10 hover:bg-[#0084FF] hover:border-[#0084FF] transition-all duration-300">
              <LuMessageSquareMore className="text-base"/> Messenger
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#15803d]/10 text-[#4ade80] py-3 rounded-xl text-[11px] font-bold border border-[#15803d]/20 hover:bg-[#25D366] hover:text-white transition-all duration-300">
              <SiWhatsapp className="text-base" /> WhatsApp
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroPage;