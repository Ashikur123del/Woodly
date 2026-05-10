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
      description: "আপনার তথ্য অনুযায়ী ইউনিক ডিজাইন তৈরি",
      icon: <IoColorPaletteOutline size={24} />,
    },
    {
      title: "লেজার এনগ্রেভিং",
      description: "দীর্ঘস্থায়ী ও নিখুঁত খোদাই",
      icon: <HiOutlineLightBulb size={24} />,
    },
    {
      title: "প্রিমিয়াম কাঠ",
      description: "উচ্চ মানের কাঠ ব্যবহার",
      icon: <GiOakLeaf size={24} />,
    },
    {
      title: "সেফ ডেলিভারি",
      description: "বাংলাদেশের যেকোনো স্থানে",
      icon: <TbTruckDelivery size={24} />,
    },
  ];

  return (
    <section className="bg-[#0B1218] py-16 px-4 md:px-10 flex flex-col items-center">
      <h2 className="text-[#C5A25D] text-2xl md:text-3xl font-bold mb-12 text-center">
        কেন স্মৃতি স্মরণিকা আলাদা?
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl w-full mb-20">
        {features.map((item, index) => (
          <Card
            key={index}
            className="bg-[#121B23]/40 border border-orange-300 p-8 flex flex-col items-center text-center
             hover:scale-105 hover:border-orange-400 transition-all hover:shadow-xl shadow-none"
          >
            <div className="mb-4 text-[#C5A25D]">{item.icon}</div>
            <h3 className="text-[#C5A25D] text-lg font-bold mb-4">{item.title}</h3>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{item.description}</p>
          </Card>
        ))}
      </div>

      <div className="max-w-7xl w-full mb-12">
        <Card className="bg-[#121B23]/40 border border-orange-300 p-10 md:p-16 text-center shadow-none">
          <h2 className="text-[#C5A25D] text-2xl md:text-3xl font-bold mb-6">
            Woodly <span className="text-white font-normal">সম্পর্কে</span>
          </h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            <p className="text-blue-400 text-sm md:text-base font-medium uppercase tracking-wider">
              Woodly বিশ্বাস করে— স্মৃতি শুধু মনে রাখার জন্য নয়, বরং স্পর্শ করার জন্য।
            </p>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              আমরা প্রিমিয়াম লেজার এনগ্রেভড কাঠের উপর আপনার জীবনের সবচেয়ে মূল্যবান মুহূর্তগুলো নিখুঁতভাবে তুলে ধরি।
            </p>
          </div>
        </Card>
      </div>

      {/* ডাইনামিক বাটন যা ওপরের ট্যাবের সাথে সিঙ্ক */}
      <div className="w-full max-w-md">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-[#d4a34d] hover:bg-[#b88a3e] text-black font-black h-16 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 mb-6 group"
        >
          {selectedTab === "wedding" && "Wedding অর্ডার করুন"}
          {selectedTab === "birth" && "Birth অর্ডার করুন"}
          {selectedTab === "death" && "Death অর্ডার করুন"}
          <ArrowRight className="text-2xl group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* মডাল যা সব জায়গা থেকে আসা ডাটা রিসিভ করবে */}
      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedType={selectedTab} 
      />
    </section>
  );
};

export default FeaturesWithAbout;