"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@heroui/react";
import { motion } from "framer-motion";
import { FaRegStar } from "react-icons/fa";
import Link from "next/link";

import weddingImg from "@/assets/Wod-1.jpeg";
import birthImg from "@/assets/Wod-2.jpeg";
import deathImg from "@/assets/Wod-3.jpeg";

const Service = () => {
  const dynamicServices = [
    {
      id: "wedding",
      title: "Wedding (বিবাহ বার্ষিকী / স্মরণিকা)",
      quote: "“বিবাহ শুধুমাত্র একটি চুক্তি নয়— এটি দুটি মনের এক চিরন্তন বন্ধন।”",
      description: "বরের নাম, কনের নাম এবং পিতা-মাতার নামসহ আপনার বিশেষ দিনটির স্মৃতি আজীবন খোদাই করে রাখার জন্য প্রিমিয়াম লেজার-এনগ্রেভড মেমোরিয়াল কার্ড।",
      image: weddingImg,
      badgeColor: "border-pink-500 text-pink-400 shadow-pink-500/20 bg-pink-500/10",
      price: "999.00 BDT",
      tag: "Wedding",
    },
    {
      id: "birth",
      title: "Birth (জন্মদিন / আকিকা স্মরণিকা)",
      quote: "“একটি শিশুর জন্ম মানেই হলো নতুন আশা এবং ভালোবাসার সূচনা।”",
      description: "নবাগত শিশুর নাম, জন্ম তারিখ এবং পিতা-মাতার নাম লেজার এনগ্রেভিং এর মাধ্যমে সুন্দর ফ্রেমে বন্দি করে রাখার এক্সক্লুসিভ সল্যুশন।",
      image: birthImg,
      badgeColor: "border-blue-500 text-blue-400 shadow-blue-500/20 bg-blue-500/10",
      price: "999.00 BDT",
      tag: "Birth",
    },
    {
      id: "death",
      title: "Death (স্মরণিকা / শোক বার্তা)",
      quote: "“এই নামটার সাথে জড়িয়ে আছে একটা পুরো জীবন এবং স্মৃতি।”",
      description: "মৃত প্রিয় মানুষটির নাম, মৃত্যুর তারিখ এবং তার রেখে যাওয়া বিশেষ বাণী বা উদ্ধৃতি কাঠের ওপর খোদাই করে আজীবন সংরক্ষণ করার মেমোরিয়াল ফ্রেম।",
      image: deathImg,
      badgeColor: "border-yellow-500/50 text-yellow-500 shadow-yellow-500/20 bg-yellow-500/10",
      price: "999.00 BDT",
      tag: "Death",
    },
  ]; 

  return (
    <section className="min-h-screen bg-[#020a13] text-slate-300 px-4 py-10 md:px-20 lg:px-32">
      <div className="text-xs text-slate-400 mb-6 flex items-center gap-2">
        <Link href="/dashboard" className="text-[#FFDE42] font-medium hover:underline">
          হোম
        </Link>
        <span>/</span>
        <span>আমাদের সেবাসমূহ</span>
      </div>
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.3em] text-[#FFDE42] uppercase">WOODLY PREMIUM</p>
        <h1 className="text-3xl md:text-4xl font-serif mt-2 text-[#FFDE42]">আমাদের সেবাসমূহ</h1>
        <div className="w-20 h-[2px] bg-[#FFDE42] mx-auto mt-4 opacity-60" />
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">
        {dynamicServices.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/dashboard/order-create">
              <Card className="bg-[#0d1b26] border border-white/10 rounded-xl p-4 group hover:border-[#FFDE42]/30 transition-all duration-300 shadow-xl overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                
                  <div className="w-full md:w-[200px] h-[150px] md:h-[120px] shrink-0 relative rounded-lg overflow-hidden border border-white/5 bg-[#0b1a26]">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2">
                      <div className={`flex items-center gap-1 border backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${service.badgeColor}`}>
                        <FaRegStar size={8} className="animate-pulse" /> {service.tag}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col lg:flex-row justify-between lg:items-center gap-4 w-full">
                    <div className="space-y-2">
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        ✓ Available
                      </span>
                      <h2 className="text-lg font-bold text-white tracking-wide group-hover:text-[#FFDE42] transition-colors">
                        {service.title}
                      </h2>

                      <p className="text-[11px] text-[#FFDE42] italic bg-black/30 p-2 rounded-lg border border-white/5 border-l-2 border-l-[#FFDE42]">
                        {service.quote}
                      </p>

                      <p className="text-xs text-slate-400 leading-relaxed font-normal">
                        {service.description}
                      </p>
                    </div>

                    <div className="shrink-0 pt-2 md:pt-0 border-t border-white/5 md:border-none flex flex-row md:flex-col justify-between items-center md:items-end">
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                        প্রিমিয়াম মূল্য
                      </p>
                      <h3 className="text-xl text-[#FFDE42] font-black font-mono">
                        {service.price}
                      </h3>
                    </div>
                  </div>

                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-16 text-slate-600 text-xs tracking-wider">
        কপিরাইট © {new Date().getFullYear()} উডলি প্রিমিয়াম। সর্বস্বত্ব সংরক্ষিত।
      </div>
    </section>
  );
};

export default Service;