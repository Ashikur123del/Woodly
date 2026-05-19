"use client";
import React, { useState } from "react"; 
import HeroPage from "@/components/Hero";
import FeaturesWithAbout from "@/components/FeaturesSection";



export default function Home() {
  const [selectedTab, setSelectedTab] = useState("wedding");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="bg-[#50589C]">
      
      <HeroPage 
        selectedTab={selectedTab} 
        setSelectedTab={setSelectedTab} 
        setIsModalOpen={setIsModalOpen} 
      />
      
      <FeaturesWithAbout 
        selectedTab={selectedTab} 
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen} 
      />
    </main>
  );
}
