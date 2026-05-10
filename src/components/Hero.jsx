"use client";
import Image from "next/image";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from '@gravity-ui/icons';
import { SiWhatsapp } from "react-icons/si";
import { LuMessageSquareMore } from "react-icons/lu";

import weddingImg from "@/assets/logo-1.jpeg"; 
import birthImg from "@/assets/logo-2.jpeg";
import deathImg from "@/assets/logo-3.jpeg";
import { FaRegStar } from "react-icons/fa";
import logo4 from '@/assets/logo-4.jpg'

const contentData = {
  wedding: {
    tabTitle: "Wedding",
    quote: "“বিবাহ শুধুমাত্র একটি চুক্তি নয়— এটি দুটি মনের এক চিরন্তন বন্ধন, যা নতুন এক জীবনের সূচনা করে।”",
    image: weddingImg,
    badgeColor: "border-pink-500 text-pink-400",
  },
  birth: {
    tabTitle: "Birth",
    quote: "“একটি শিশুর জন্ম মানেই হলো নতুন আশা, নতুন স্বপ্ন এবং পৃথিবীতে ভালোবাসার নতুন এক অধ্যায়ের সূচনা।”",
    image: birthImg,
    badgeColor: "border-blue-500 text-blue-400",
  },
  death: {
    tabTitle: "Death",
    quote: "“ এই নামটা শুধু একটা নাম না— এই নামটার সাথে জড়িয়ে আছে একটা পুরো জীবন। ”",
    image: deathImg, 
    badgeColor: "border-yellow-500/50 text-yellow-500",
  }
};

const HeroPage = ({ selectedTab, setSelectedTab, setIsModalOpen }) => {
    
  const data = contentData[selectedTab];

  const tabs = [
    { key: "wedding", title: "Wedding", icon: weddingImg },
    { key: "birth", title: "Birth", icon: birthImg },
    { key: "death", title: "Death", icon: deathImg },
  ];

  return (
    <div className="text-white p-4 md:p-20 font-sans flex flex-col items-center justify-center">
      <div className="">
        <Image src={logo4} className="w-[1152px] h-[200px]" alt="logo"></Image>
      </div>
      <div className="text-center mb-10">
        <p className="text-[10px] tracking-[0.3em] text-yellow-500/80 uppercase font-light">WOODLY PREMIUM</p>
        <h1 className="text-4xl md:text-5xl font-serif mt-2 text-[#e5c277] tracking-tight">স্মৃতি চিরন্তন</h1>
      </div>

      <div className="max-w-6xl w-full bg-[#0d1b26] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[40px] overflow-hidden grid md:grid-cols-2 gap-0">
        
        {/* Left Side (Preview) */}
        <div className="relative p-12 bg-gradient-to-br from-[#cbd5e1] to-[#94a3b8] flex flex-col items-center justify-center min-h-[500px]">
          <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-black/80"></div>
          <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-black/80"></div>
          <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-black/80"></div>
          <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-black/80"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col items-center w-full"
            >
              <p className="text-center text-black font-bold text-xl md:text-2xl mb-10 px-6 leading-snug italic">
                {data.quote}
              </p>
              <div className="relative w-full max-w-[480px] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <div className="bg-[#0b1a26] p-3 rounded-sm border-[10px] border-[#1e293b]">
                  <Image src={data.image} alt="Product" priority className="w-full h-auto object-contain aspect-square" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-10 left-10">
            <div className={`flex items-center gap-2 bg-[#05111a] border ${data.badgeColor} px-4 py-1.5 rounded-full text-xs`}>
              <span><FaRegStar /></span> {data.tabTitle}
            </div>
          </div>
        </div>

        {/* Right Side (Content) */}
        <div className="p-10 md:p-16 flex flex-col justify-center bg-[#0d1b26]">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">আপনার বিশেষ দিনটি খোদাই করুন</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              প্রিমিয়াম লেজার-এনগ্রেভড কার্ডের উপর আপনার জীবনের সেরা মুহূর্তগুলো আজীবন সংরক্ষণ করুন।
            </p>
          </div>

          <div className="mb-10">
            <label className="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-4 block">ডিজাইন নির্বাচন করুন</label>
            <div className="grid grid-cols-3 gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
                    selectedTab === tab.key
                      ? "border-yellow-500 bg-yellow-500/10 scale-105 shadow-lg shadow-yellow-500/20"
                      : "border-slate-800 bg-[#16252f] hover:border-slate-600"
                  }`}
                >
                  <div className="w-14 h-14 flex items-center justify-center rounded-full border border-white/10 mb-2 overflow-hidden bg-white"> 
                    <Image src={tab.icon} alt={tab.title} width={30} height={30} className="object-contain" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${selectedTab === tab.key ? "text-white" : "text-slate-500"}`}>
                    {tab.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center p-5 bg-black/40 rounded-2xl border border-white/5 mb-6 shadow-inner">
            <span className="text-slate-400 text-sm">মূল্য (৳)</span>
            <span className="text-2xl font-bold text-[#e5c277]">990.00 BDT</span>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#d4a34d] hover:bg-[#b88a3e] text-black font-black h-16 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 mb-6 group"
          >
            অর্ডার করুন <ArrowRight className="text-2xl group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-[#1d4ed8]/10 text-[#60a5fa] py-4 rounded-2xl text-xs font-bold border border-[#1d4ed8]/20 hover:bg-[#1d4ed8]/20">
              <LuMessageSquareMore className="text-lg"/> Messenger
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#15803d]/10 text-[#4ade80] py-4 rounded-2xl text-xs font-bold border border-[#15803d]/20 hover:bg-[#15803d]/20">
              <SiWhatsapp className="text-lg" /> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;