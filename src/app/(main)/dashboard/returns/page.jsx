"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Spinner } from '@heroui/react';
import { FiArrowLeft, FiPackage, FiCalendar, FiClock, FiShield, FiAlertCircle, FiCheckCircle, FiDollarSign, FiTruck, FiXCircle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

const ReturnsOrderContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnId = searchParams.get('id');

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ডায়নামিক ডেটা ফেচিং ইফেক্ট
  useEffect(() => {
    if (!returnId) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://woodly-server-fayw.vercel.app/orders/${returnId}`, {
          cache: "no-store"
        });
        
        if (!res.ok) throw new Error("Failed to fetch data");
        
        const data = await res.json();
        setOrderData(data);
      } catch (err) {
        console.error("Error fetching dynamic return:", err);
        toast.error("সার্ভার থেকে অর্ডারের বিস্তারিত তথ্য পাওয়া যায়নি");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [returnId, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" className="text-[#e3d18d]" />
        <p className="text-xs tracking-widest text-neutral-500 font-bold uppercase font-mono animate-pulse">
          Loading Dynamic Record...
        </p>
      </div>
    );
  }

  // ডেটাবেজ থেকে আসা ডেটা অথবা ফলব্যাক সেফটি অবজেক্ট
  const returnData = {
    generatedId: orderData?._id ? `ORD-${orderData._id.substring(0, 10).toUpperCase()}` : "N/A",
    customerName: orderData?.customerName || "No Name",
    initiationDate: orderData?.eventDate || orderData?.birthDate || orderData?.deathDate || "N/A",
    reason: orderData?.specialMessage || "অর্ডারটি ক্যানসেল বা রিটার্ন হিসেবে চিহ্নিত করা হয়েছে।",
    refundMethod: orderData?.deliveryType === "Point" ? "COD (POINT) Reversal" : "COD (HOME) Reversal / Gateway",
    amountToRefund: orderData?.totalAmount || 0,
    status: (orderData?.status || orderData?.orderStatus || "cancelled").toLowerCase()
  };

  const isCancelled = returnData.status === "cancelled" || returnData.status === "canceled";

  // আপডেট হওয়া ডাইনামিক টাইমলাইন
  const timelineSteps = [
    { title: "Order Initialized", desc: "অর্ডারটি সিস্টেমে সফলভাবে তৈরি হয়েছিল", date: returnData.initiationDate, done: true },
    { title: "Status Transition", desc: "কারেন্ট প্রসেস স্টেট পরিবর্তন", date: "Processed", done: !isCancelled, cancelled: isCancelled },
    { title: isCancelled ? "Return / Cancelled" : "Active Workflow", desc: isCancelled ? "ম্যানেজমেন্ট প্যানেল থেকে ক্যানসেল করা হয়েছে" : "অর্ডারটি বর্তমানে একটিভ প্রসেসিং মোডে রয়েছে", date: returnData.initiationDate !== "N/A" ? returnData.initiationDate : "Live", done: false, cancelled: isCancelled, active: !isCancelled },
    { title: "Settlement Status", desc: "ব্যালেন্স রিভার্সাল বা গেটওয়ে সেটেলমেন্ট", date: isCancelled ? "Terminated" : "Pending", done: false }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0d0e0f] via-[#0a0a0a] to-[#070707] text-slate-300 p-4 lg:p-8 font-sans antialiased relative overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#e3d18d]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className={`absolute bottom-10 left-10 w-[400px] h-[300px] ${isCancelled ? 'bg-rose-500/5' : 'bg-blue-500/5'} blur-[120px] rounded-full pointer-events-none`} />
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800/60 relative z-10"
      >
        <div>
          <div className="text-xs text-neutral-500 flex items-center gap-2 mb-2">
            <span className="text-[#e3d18d] hover:underline font-bold cursor-pointer transition-colors" onClick={() => router.push('/dashboard')}>Management</span>
            <span className="text-neutral-700">/</span>
            <span className="text-slate-400 font-bold">Returns</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Return Detail</h1>
        </div>

        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold px-5 py-3 rounded-xl bg-[#2a2f35]/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:bg-[#32383f] transition-all cursor-pointer shadow-lg"
        >
          <FiArrowLeft size={14} /> Back to Dashboard
        </button>
      </motion.div>

      {/* Grid Content */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Left Columns */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#2a2f35]/50 backdrop-blur-md p-5 rounded-xl border border-slate-700/40 shadow-xl">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Object DB ID</p>
              <p className="text-sm font-black font-mono mt-2 tracking-wide text-[#e3d18d] truncate" title={returnId || ""}>{returnId || "N/A"}</p>
            </div>
            <div className="bg-[#2a2f35]/50 backdrop-blur-md p-5 rounded-xl border border-slate-700/40 shadow-xl">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">System Generated ID</p>
              <p className="text-sm font-black text-slate-300 font-mono mt-2 tracking-wide truncate">{returnData.generatedId}</p>
            </div>
            <div className="bg-[#2a2f35]/50 backdrop-blur-md p-5 rounded-xl border border-slate-700/40 shadow-xl flex flex-col justify-between">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-2">Live Sync Status</p>
              <div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest font-mono uppercase block text-center border ${
                  isCancelled 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {returnData.status}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#2a2f35]/20 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700/40 shadow-2xl">
            <div className="bg-gradient-to-r from-slate-800/40 to-transparent px-5 py-4 text-white text-xs font-bold tracking-widest uppercase border-b border-slate-800/50 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isCancelled ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'}`} />
              Return Logistics & Claim Information {isCancelled && "(Cancelled Path)"}
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 py-2 border-b border-slate-800/30 items-center">
                <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-2"><FiPackage size={13} /> Client Name</span>
                <span className="col-span-2 text-white font-bold text-sm">{returnData.customerName}</span>
              </div>

              <div className="grid grid-cols-3 py-2 border-b border-slate-800/30 items-center">
                <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-2"><FiCalendar size={13} /> Event/Record Date</span>
                <span className="col-span-2 text-slate-300 font-mono font-semibold">{returnData.initiationDate}</span>
              </div>

              <div className="grid grid-cols-3 py-2 border-b border-slate-800/30 items-center">
                <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-2"><FiTruck size={13} /> Channel System</span>
                <span className="col-span-2 text-slate-300 font-semibold">{returnData.refundMethod}</span>
              </div>

              <div className="grid grid-cols-3 py-3 border-b border-slate-800/30 items-start">
                <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] mt-1 flex items-center gap-2"><FiAlertCircle size={13} /> Special Note</span>
                <span className={`col-span-2 p-3 rounded-xl leading-relaxed italic border ${
                  isCancelled 
                    ? 'text-neutral-400 bg-neutral-950 border-neutral-800 line-through' 
                    : 'text-slate-300 bg-neutral-950 border-neutral-800'
                }`}>
                  "{returnData.reason}"
                </span>
              </div>

              <div className={`grid grid-cols-3 py-4 border px-4 rounded-xl items-center font-semibold ${isCancelled ? 'bg-rose-500/5 border-rose-500/10' : 'bg-[#e3d18d]/5 border-[#e3d18d]/20'}`}>
                <span className={`font-black uppercase tracking-wider text-[11px] flex items-center gap-2 ${isCancelled ? 'text-rose-400' : 'text-[#e3d18d]'}`}><FiDollarSign size={14} /> Total Amount</span>
                <span className={`col-span-2 font-mono font-black text-lg ${isCancelled ? 'text-neutral-500 line-through' : 'text-white'}`}>৳{Number(returnData.amountToRefund).toLocaleString()}.00</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Audit Trail Column */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="bg-[#2a2f35]/20 backdrop-blur-md rounded-xl p-6 border border-slate-700/40 shadow-2xl">
            <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
              <FiClock className="text-[#e3d18d]" /> Audit & Tracking Trail
            </h3>

            <div className="relative border-l border-neutral-800 ml-3 space-y-6 pb-2">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative pl-6 group">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                    step.done 
                      ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                      : step.cancelled 
                        ? 'bg-rose-500 border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                        : step.active
                          ? 'bg-[#1a1d22] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          : 'bg-[#1a1d22] border-neutral-800'
                  }`}>
                    {step.done && <FiCheckCircle size={10} className="text-white" />}
                    {step.cancelled && <FiXCircle size={10} className="text-white" />}
                    {step.active && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold ${step.done ? 'text-white' : step.cancelled ? 'text-rose-400' : step.active ? 'text-white' : 'text-neutral-600'}`}>
                        {step.title}
                      </h4>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                        step.cancelled 
                          ? 'text-rose-400 bg-rose-950/20 border-rose-900/40' 
                          : 'text-neutral-500 bg-neutral-900/40 border-neutral-800/40'
                      }`}>
                        {step.date}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 font-medium leading-relaxed ${step.cancelled ? 'text-rose-400/70' : 'text-neutral-500'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-start gap-2.5 text-[11px] text-neutral-400">
              <FiShield className="text-[#e3d18d] shrink-0 mt-0.5" size={14} />
              <p className="leading-relaxed">
                {isCancelled ? "This return/cancel track statement has been locked." : "All systems conform to standard secure operations Workflow."}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="text-center mt-16 text-neutral-700 text-[10px] font-bold tracking-widest uppercase font-mono select-none">
        Woodly Merchant Group • Architecture Framework
      </div>
    </div>
  );
};

const ReturnsOrderPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" className="text-[#e3d18d]" />
        <p className="text-xs tracking-widest text-neutral-500 font-bold uppercase font-mono animate-pulse">Initializing Return Portal...</p>
      </div>
    }>
      <ReturnsOrderContent />
    </Suspense>
  );
};

export default ReturnsOrderPage; 