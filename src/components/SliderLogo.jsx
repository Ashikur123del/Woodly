
"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// আপনার ইমপোর্ট করা লোগোগুলো
import logo1 from "@/assets/-1.jpeg";
import logo2 from "@/assets/-2.jpeg";
import logo3 from "@/assets/-3.jpeg";
import logo4 from "@/assets/-4.jpeg";

const SliderLogo = () => {
  const logos = [logo1, logo2, logo3, logo4, logo1, logo2, logo3, logo4];

  return (
    <div className="overflow-hidden max-w-6xl mx-auto">
     
      <div className="flex overflow-hidden relative group">
        <motion.div
          className="flex flex-none gap-16 items-center"
          animate={{
            x: ["0%", "-50%"], 
          }}
          transition={{
            ease: "linear",
            duration: 20, 
            repeat: Infinity,
          }}
        >
         
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className="flex-none w-32 md:w-48  transition-all duration-300">
              <Image
                src={logo}
                alt={`Logo ${index}`}
                className="h-16 w-auto object-contain mx-auto"
              />
            </div>
          ))}
        </motion.div>

        {/* সাইডে হালকা শ্যাডো ইফেক্ট (ঐচ্ছিক) */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
      </div>
    </div>
  );
};

export default SliderLogo;