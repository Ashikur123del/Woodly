"use client";

import { Spinner } from '@heroui/react';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCalendar, FiCopy, FiHeart, FiMail, FiMapPin, FiPhone, FiTruck, FiUser, FiArrowLeft, FiCheck, FiLayers, FiDollarSign, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { RiSkullLine } from 'react-icons/ri';

// 🎬 Framer Motion Variants (অ্যানিমেশন কনফিগারেশন)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 } // একটার পর একটা কার্ড স্মুথলি আসবে
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

const OrderDetailsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false); 
  const [formattedDate, setFormattedDate] = useState("N/A");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const res = await fetch(`https://woodly-server-fayw.vercel.app/orders/${orderId}`, { 
          cache: "no-store"
        });
        
        if (res.ok) {
          const data = await res.json();
          setOrder(data);

          const rawDate = data?.eventDate || data?.deathDate;
          if (rawDate) {
            const dateObj = new Date(rawDate);
            if (!isNaN(dateObj.getTime())) {
              setFormattedDate(dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
            }
          }
        } else {
          console.error("Order not found on server");
          setOrder(null);
        }
      } catch (error) {
        console.error("Error fetching single order from DB:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1d20] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="default" className="text-[#e3d18d]" />
        <motion.p 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-xs tracking-widest text-slate-400 font-bold uppercase font-mono"
        >
          Fetching Secure Payload...
        </motion.p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#1a1d20] text-slate-400 flex flex-col items-center justify-center gap-4 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-[#2a2f35] border border-slate-700/50 rounded-2xl text-center max-w-sm backdrop-blur-md shadow-xl"
        >
          <p className="text-sm font-bold text-rose-400 uppercase tracking-wide mb-1">Order Not Found</p>
          <p className="text-xs text-slate-500">No active order found or missing order ID parameter.</p>
        </motion.div>
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 bg-[#252a30] hover:bg-[#e3d18d] hover:text-gray-950 border border-slate-700 text-xs px-5 py-2.5 rounded-xl text-white transition-all duration-200 shadow-lg cursor-pointer"
        >
          <FiArrowLeft size={14} /> Go Back
        </button>
      </div>
    );
  }

  const generatedId = order._id ? `ORD-${order._id.substring(0, 8).toUpperCase()}` : "N/A";

  const getStatusStyle = (status) => {
    const text = status?.toLowerCase() || 'pending';
    if (text === 'paid' || text === 'delivered' || text === 'confirmed') {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
    if (text === 'cancelled' || text === 'failed') {
      return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    }
    return "bg-[#e3d18d]/10 text-[#e3d18d] border border-[#e3d18d]/20";
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#252930] via-[#1a1d22] to-[#121417] text-slate-300 p-4 lg:p-8 font-sans antialiased relative overflow-hidden">
      
      {/* Background Glow Spots */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#e3d18d]/3 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[300px] bg-slate-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* 🗺️ Header Row */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800/60 relative z-10"
      >
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-2 mb-2">
            <span className="text-[#e3d18d] hover:underline font-bold cursor-pointer transition-colors" onClick={() => router.back()}>Orders</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-400 font-bold">Details</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Order Profile</h1>
        </div>

        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold px-5 py-3 rounded-xl bg-[#2a2f35]/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:bg-[#32383f] transition-all cursor-pointer shadow-lg"
        >
          <FiArrowLeft size={14} /> Back to Management
        </button>
      </motion.div>
      
      {/* 📊 Main Content Stagger Wrapper */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 relative z-10"
      >
        {/* Top Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Tracking ID */}
          <motion.div variants={itemVariants} className="bg-[#2a2f35]/50 backdrop-blur-md p-5 rounded-xl flex flex-col justify-between h-28 border border-slate-700/40 shadow-xl group hover:border-slate-600 transition-all">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tracking ID</p>
            <div className="flex items-center justify-between mt-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800/40">
              <span className="text-xs font-black text-slate-300 font-mono truncate mr-1">{generatedId}</span>
              <button onClick={() => copyToClipboard(order?._id)} className="text-slate-500 hover:text-white transition-colors shrink-0 p-1 bg-slate-800/80 rounded">
                {copied ? <FiCheck size={12} className="text-emerald-400" /> : <FiCopy size={11} />}
              </button>
            </div>
          </motion.div>

          {/* Payment Status */}
          <motion.div variants={itemVariants} className="bg-[#2a2f35]/50 backdrop-blur-md p-5 rounded-xl flex flex-col justify-between h-28 border border-slate-700/40 shadow-xl group hover:border-slate-600 transition-all">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Payment Status</p>
            <div className="mt-2">
              <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest font-mono uppercase border block text-center ${getStatusStyle(order?.paymentStatus || 'Paid')}`}>
                {order?.paymentStatus || "Paid"}
              </span>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div variants={itemVariants} className="bg-[#2a2f35]/50 backdrop-blur-md p-5 rounded-xl flex flex-col justify-between h-28 border border-slate-700/40 shadow-xl group hover:border-slate-600 transition-all">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Status</p>
            <div className="mt-2">
              <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest font-mono uppercase border block text-center ${getStatusStyle(order?.status || 'Confirmed')}`}>
                {order?.status || "Confirmed"}
              </span>
            </div>
          </motion.div>

          {/* Logistics Flow */}
          <motion.div variants={itemVariants} className="bg-[#2a2f35]/50 backdrop-blur-md p-5 rounded-xl flex flex-col justify-between h-28 border border-slate-700/40 shadow-xl group hover:border-slate-600 transition-all">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Logistics Flow</p>
            <div className="mt-2">
              <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest font-mono uppercase border block text-center ${getStatusStyle(order?.deliveryStatus || 'Pending')}`}>
                {order?.deliveryStatus || "Not Shipped"}
              </span>
            </div>
          </motion.div>

          {/* Grand Settlement */}
          <motion.div variants={itemVariants} className="bg-[#2a2f35]/50 backdrop-blur-md p-5 rounded-xl flex flex-col justify-between h-28 border border-slate-700/40 shadow-xl col-span-2 lg:col-span-1 group hover:border-slate-600 transition-all">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Grand Settlement</p>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-sm font-bold text-[#e3d18d]">৳</span>
              <p className="text-2xl font-black text-[#e3d18d] font-mono tracking-tight">{(order?.totalAmount || 0).toLocaleString()}</p>
            </div>
          </motion.div>
        </div>

        {/* 👤 Customer & Shipping Information Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-[#2a2f35]/20 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700/40 shadow-2xl"
        >
          <div className="bg-gradient-to-r from-slate-800/40 to-transparent px-5 py-4 text-white text-xs font-bold tracking-widest uppercase border-b border-slate-800/50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e3d18d] shadow-[0_0_8px_rgba(227,209,141,0.8)]" />
            Customer & Shipping Information
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Customer Name */}
            <div className="flex items-center gap-4 bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/40 hover:border-slate-700 transition-all">
              <div className="p-3 bg-slate-800 text-slate-300 rounded-xl border border-slate-700/40"><FiUser size={18} /></div>
              <div>
                <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Customer Name</span>
                <span className="text-white font-bold text-sm mt-0.5 block">{order?.customerName || "N/A"}</span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/40 hover:border-slate-700 transition-all justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 text-slate-300 rounded-xl border border-slate-700/40"><FiPhone size={18} /></div>
                <div>
                  <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Phone Number</span>
                  <span className="text-white text-sm font-bold mt-0.5 block font-mono">{order?.phone || "N/A"}</span>
                </div>
              </div>
              {order?.phone && (
                <a href={`tel:${order.phone}`} className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all text-[10px] font-bold rounded-lg font-mono tracking-wider">CALL</a>
              )}
            </div>

            {/* WhatsApp */}
            <div className="flex items-center gap-4 bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/40 hover:border-slate-700 transition-all justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10"><FaWhatsapp size={18} /></div>
                <div>
                  <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">WhatsApp Link</span>
                  <span className="text-emerald-400 text-sm font-bold mt-0.5 block font-mono">{order?.whatsapp || "N/A"}</span>
                </div>
              </div>
              {order?.whatsapp && (
                <a href={`https://wa.me/${order.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-emerald-950/40 border border-emerald-500/20 rounded-lg text-emerald-400 text-[10px] font-black tracking-wider">CHAT</a>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/40 hover:border-slate-700 transition-all">
              <div className="p-3 bg-slate-800 text-slate-300 rounded-xl border border-slate-700/40"><FiMail size={18} /></div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Email Address</span>
                <span className="text-white text-sm mt-0.5 block truncate font-medium">{order?.email || "N/A"}</span>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="flex items-center gap-4 bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/40 hover:border-slate-700 transition-all">
              <div className="p-3 bg-slate-800 text-slate-300 rounded-xl border border-slate-700/40"><FiTruck size={18} /></div>
              <div>
                <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Shipping Route</span>
                <span className="text-white text-sm font-bold mt-0.5 block capitalize">{order?.deliveryType || "Standard"}</span>
              </div>
            </div>

            {/* Receiver Name */}
            <div className="flex items-center gap-4 bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/40 hover:border-slate-700 transition-all">
              <div className="p-3 bg-slate-800 text-slate-300 rounded-xl border border-slate-700/40"><FiUser size={18} /></div>
              <div>
                <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Receiver Identity</span>
                <span className="text-white text-sm font-bold mt-0.5 block">{order?.receiverName || "N/A"}</span>
              </div>
            </div>

            {/* Full Destination Row */}
            <div className="flex items-center gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800/40 hover:border-slate-700 transition-all md:col-span-2 lg:col-span-3">
              <div className="p-3 bg-slate-800 text-slate-300 rounded-xl border border-slate-700/40"><FiMapPin size={18} /></div>
              <div>
                <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Final Shipping Destination</span>
                <span className="text-slate-200 text-sm font-bold mt-0.5 block leading-relaxed">
                  {order?.deliveryAddress || "N/A"}{order?.district ? `, ${order.district}` : ""}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 📑 Specifications Sheet Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-[#2a2f35]/20 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700/40 shadow-2xl"
        >
          <div className="bg-gradient-to-r from-slate-800/40 to-transparent px-5 py-4 text-white text-xs font-bold tracking-widest uppercase border-b border-slate-800/50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.8)]" />
            Order Metrics & Specifications
          </div>
          
          <div className="p-6 space-y-4 text-xs">
            {/* Category */}
            <div className="grid grid-cols-3 py-3 border-b border-slate-800/30 items-center">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-2"><FiLayers size={13} className="text-slate-500" /> Order Category</span>
              <div className="col-span-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-black font-mono tracking-widest uppercase ${order?.orderType === 'wedding' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : order?.orderType === 'death' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-700 text-slate-200 border border-slate-600'}`}>
                  {order?.orderType || "General"}
                </span>
              </div>
            </div>

            {/* Wedding Fields layout */}
            {order?.orderType === "wedding" && (
              <div className="space-y-3 bg-slate-900/20 p-4 rounded-xl border border-slate-800/40">
                <div className="grid grid-cols-3 py-1 items-center">
                  <span className="text-slate-400 font-semibold">Couples Profile</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-white font-black text-sm">{order?.groomName || "N/A"}</span>
                    <FiHeart size={14} className="text-pink-500 fill-pink-500 animate-pulse mx-1" />
                    <span className="text-white font-black text-sm">{order?.brideName || "N/A"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 py-2 border-t border-slate-800/30">
                  <span className="text-slate-400 font-medium">Groom's Lineage</span>
                  <span className="col-span-2 text-slate-300 font-medium">
                    Father: <span className="text-white font-bold">{order?.groomFather || "N/A"}</span> <span className="text-slate-600 mx-1">|</span> Mother: <span className="text-white font-bold">{order?.groomMother || "N/A"}</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 py-2 border-t border-slate-800/30">
                  <span className="text-slate-400 font-medium">Bride's Lineage</span>
                  <span className="col-span-2 text-slate-300 font-medium">
                    Father: <span className="text-white font-bold">{order?.brideFather || "N/A"}</span> <span className="text-slate-600 mx-1">|</span> Mother: <span className="text-white font-bold">{order?.brideMother || "N/A"}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Death Specific Fields */}
            {order?.orderType === "death" && (
              <div className="space-y-3 bg-slate-900/20 p-4 rounded-xl border border-slate-800/40">
                <div className="grid grid-cols-3 py-1 items-center">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5"><RiSkullLine className="text-rose-500" size={14} /> Deceased Soul</span>
                  <span className="col-span-2 text-rose-400 font-black text-sm tracking-wide">{order?.deceasedName || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3 py-2 border-t border-slate-800/30 items-center">
                  <span className="text-slate-400 font-medium">Father / Husband</span>
                  <span className="col-span-2 text-white font-bold text-xs">{order?.fatherOrHusbandName || "N/A"}</span>
                </div>
              </div>
            )}

           
            <div className="grid grid-cols-3 py-3 border-b border-slate-800/30 items-center">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-2"><FiCalendar size={13} className="text-slate-500" /> Event Date</span>
              <span className="col-span-2 text-slate-200 font-mono font-bold text-sm flex items-center gap-1.5">
                {formattedDate}
              </span>
            </div>

      
            <div className="grid grid-cols-3 py-3 border-b border-slate-800/30 items-center">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-2"><FiDollarSign size={13} className="text-slate-500" /> Base Subtotal</span>
              <span className="col-span-2 text-slate-400 font-mono font-bold">৳{(order?.totalAmount || 0).toLocaleString()}.00</span>
            </div>

            <div className="grid grid-cols-3 py-4 bg-[#e3d18d]/5 border border-[#e3d18d]/20 px-4 rounded-xl items-center font-semibold">
              <span className="text-[#e3d18d] font-black uppercase tracking-wider text-[11px] flex items-center gap-2"><FiTrendingUp size={14} /> Net Settlement</span>
              <span className="col-span-2 text-[#e3d18d] font-mono font-black text-lg">৳{(order?.totalAmount || 0).toLocaleString()}.00</span>
            </div>

            <div className="grid grid-cols-3 py-3 items-start">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mt-1 flex items-center gap-2"><FiMessageSquare size={13} className="text-slate-500" /> Special Instruction</span>
              <span className="col-span-2 text-[#e3d18d] font-medium italic bg-[#e3d18d]/5 border border-[#e3d18d]/10 p-3.5 rounded-xl text-xs leading-relaxed">
                {order?.specialMessage ? `"${order.specialMessage}"` : "No special notes custom provided by client."}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      <div className="text-center mt-16 text-slate-600 text-[10px] font-bold tracking-widest uppercase font-mono select-none">
        Copyright © 2026 Woodly. Protected by Secure Architectural Systems.
      </div>
    </div>
  );
};

const OrderDetails = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1a1d20] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="default" className="text-[#e3d18d]" />
        <p className="text-xs tracking-widest text-slate-400 font-bold uppercase font-mono animate-pulse">Initializing Layout...</p>
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  );
};

export default OrderDetails;