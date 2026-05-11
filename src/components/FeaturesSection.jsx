"use client";

import React from "react";
import { Card } from "@heroui/react";
import { IoColorPaletteOutline } from "react-icons/io5"; 
import { HiOutlineLightBulb } from "react-icons/hi";   
import { GiOakLeaf } from "react-icons/gi";           
import { TbTruckDelivery } from "react-icons/tb";     
import OrderModal from "./OrderModal";
import { ArrowRight } from "@gravity-ui/icons";

const FeaturesWithAbout = ({ selectedTab, isModalOpen, setIsModalOpen }) => {
  const features = [
    {
      title: "কাস্টম ডিজাইন",
      description: "আপনার তথ্য অনুযায়ী ইউনিক ডিজাইন",
      icon: <IoColorPaletteOutline size={22} />,
    },
    {
      title: "লেজার এনগ্রেভিং",
      description: "দীর্ঘস্থায়ী ও নিখুঁত খোদাই",
      icon: <HiOutlineLightBulb size={22} />,
    },
    {
      title: "প্রিমিয়াম কাঠ",
      description: "উচ্চ মানের কাঠ ব্যবহার",
      icon: <GiOakLeaf size={22} />,
    },
    {
      title: "সেফ ডেলিভারি",
      description: "দেশের যেকোনো স্থানে",
      icon: <TbTruckDelivery size={22} />,
    },
  ];

  return (
    <section className="bg-[#50589C] py-12 px-4 md:px-10 flex flex-col items-center max-w-6xl mx-auto">
      
      {/* Section Title */}
      <div className="text-center mb-10">
        <h2 className="text-[#FFDE42] text-2xl md:text-3xl font-black mb-2 tracking-tight">
          কেন স্মৃতি স্মরণিকা আলাদা?
        </h2>
        <div className="w-16 h-1 bg-orange-400 mx-auto rounded-full opacity-60"></div>
      </div>
      
      {/* Features Grid - scale-105 এবং shadow-2xl যোগ করা হয়েছে */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl w-full mb-14">
        {features.map((item, index) => (
          <Card
            key={index}
            className="bg-[#636ccb]/30 backdrop-blur-md border border-white/10 p-6 flex flex-col items-center text-center
              hover:bg-[#636ccb]/50 hover:scale-105 hover:shadow-2xl hover:border-orange-400/30 
              transition-all duration-500 ease-out group"
          >
            <div className="mb-3 p-3 bg-[#FFDE42]/10 rounded-xl text-[#FFDE42] group-hover:bg-[#FFDE42] group-hover:text-[#50589C] group-hover:rotate-6 transition-all duration-300">
              {item.icon}
            </div>
            <h3 className="text-[#FFDE42] text-lg font-bold mb-1">{item.title}</h3>
            <p className="text-blue-100/70 text-[13px] leading-snug">{item.description}</p>
          </Card>
        ))}
      </div>

      {/* About Section */}
      <div className="max-w-5xl w-full mb-12 relative">
        <Card className="bg-[#121B23]/60 backdrop-blur-xl border border-white/5 p-8 md:p-12 text-center shadow-xl relative z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
          
          <h2 className="text-2xl md:text-4xl font-black mb-6">
            <span className="text-[#FFDE42]">Woodly</span> <span className="text-white opacity-90">সম্পর্কে</span>
          </h2>
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-orange-300 text-base md:text-lg font-semibold italic">
              স্মৃতি শুধু মনে রাখার জন্য নয়, বরং স্পর্শ করার জন্য।
            </p>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
              আমরা প্রিমিয়াম লেজার এনগ্রেভড কাঠের উপর আপনার জীবনের সবচেয়ে মূল্যবান মুহূর্তগুলো নিখুঁতভাবে তুলে ধরি।
            </p>
          </div>
        </Card>
      </div>

      {/* Dynamic CTA Button */}
      <div className="w-full max-w-xs">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-[#FFDE42] hover:bg-white text-gray-900 font-extrabold h-14 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-500/20 transition-all active:scale-95 group"
        >
          {selectedTab === "wedding" && "Wedding অর্ডার দিন"}
          {selectedTab === "birth" && "Birth অর্ডার দিন"}
          {selectedTab === "death" && "Death অর্ডার দিন"}
          <ArrowRight className="text-xl group-hover:translate-x-2 transition-transform duration-300" />
        </button>
      </div>

      {/* Order Modal */}
      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedType={selectedTab} 
      />
    </section>
  );
};

export default FeaturesWithAbout;