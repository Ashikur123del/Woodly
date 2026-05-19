"use client";

import { Spinner } from '@heroui/react';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiCalendar, FiCopy, FiHeart, FiMail, FiMapPin, FiPhone, FiTruck, FiUser, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

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
      <div className="min-h-screen bg-[#030d17] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-xs tracking-widest text-slate-400 font-bold uppercase font-mono animate-pulse">Loading Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#030d17] text-slate-400 flex flex-col items-center justify-center gap-4 p-4">
        <div className="p-4 bg-red-950/30 border border-red-900/40 rounded-2xl text-center max-w-sm">
          <p className="text-sm font-semibold text-red-400">No active order found or missing order ID!</p>
        </div>
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 bg-[#071322] hover:bg-blue-600 border border-slate-800 text-xs px-5 py-2.5 rounded-xl text-white transition-all duration-200"
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
      return "bg-emerald-950/50 text-emerald-400 border border-emerald-500/20";
    }
    if (text === 'cancelled' || text === 'failed') {
      return "bg-rose-950/50 text-rose-400 border border-rose-500/20";
    }
    return "bg-amber-950/50 text-amber-400 border border-amber-500/20";
  };

  return (
    // 💡 ব্যাকগ্রাউন্ড এখন ডার্ক ব্লু গ্রেডিয়েন্ট (কালো ভাব কমানো হয়েছে)
    <div className="w-full min-h-screen bg-gradient-to-b from-[#071322] via-[#030d17] to-[#020a17] text-slate-300 p-4 lg:p-6 font-sans antialiased relative overflow-hidden">
      
      {/* গ্লোয়িং লাইট ব্যাকগ্রাউন্ড ইফেক্ট (ব্লু ভাইব বাড়ানোর জন্য ওপেসিটি ডাবল করা হয়েছে) */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* 🗺️ Breadcrumb & Header Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-slate-800/60 relative z-10">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-2 mb-1.5">
            <span className="text-blue-500 hover:text-blue-400 font-medium cursor-pointer transition-colors" onClick={() => router.back()}>Orders</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-400 font-medium">Details</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Order Information</h1>
        </div>

        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-[#071322] border border-slate-800 text-slate-300 hover:bg-slate-900 transition-all cursor-pointer"
        >
          <FiArrowLeft size={14} /> Back to List
        </button>
      </div>
      
      <div className="space-y-6 relative z-10">
        
        {/* 📊 Top Status Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Order ID */}
          <div className="bg-[#071322]/80 backdrop-blur-md p-4 rounded-xl flex flex-col justify-between h-24 border border-slate-800/60 shadow-xl">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order ID</p>
            <div className="flex items-center justify-between mt-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800/40">
              <span className="text-xs font-black text-blue-400 font-mono truncate mr-1">{generatedId}</span>
              <button onClick={() => copyToClipboard(order?._id)} className="text-slate-500 hover:text-white transition-colors shrink-0">
                {copied ? <FiCheck size={14} className="text-emerald-400" /> : <FiCopy size={13} />}
              </button>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-[#071322]/80 backdrop-blur-md p-4 rounded-xl flex flex-col justify-between h-24 border border-slate-800/60 shadow-xl">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Payment Status</p>
            <div className="mt-1">
              <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide font-mono uppercase ${getStatusStyle(order?.paymentStatus || 'Paid')}`}>
                {order?.paymentStatus || "Paid"}
              </span>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-[#071322]/80 backdrop-blur-md p-4 rounded-xl flex flex-col justify-between h-24 border border-slate-800/60 shadow-xl">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order Status</p>
            <div className="mt-1">
              <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide font-mono uppercase ${getStatusStyle(order?.status || 'Confirmed')}`}>
                {order?.status || "Confirmed"}
              </span>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="bg-[#071322]/80 backdrop-blur-md p-4 rounded-xl flex flex-col justify-between h-24 border border-slate-800/60 shadow-xl">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Delivery</p>
            <div className="mt-1">
              <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide font-mono uppercase ${getStatusStyle(order?.deliveryStatus || 'Pending')}`}>
                {order?.deliveryStatus || "Not Shipped"}
              </span>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-[#071322]/80 backdrop-blur-md p-4 rounded-xl flex flex-col justify-between h-24 border border-slate-800/60 shadow-xl col-span-2 sm:col-span-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Grand Total</p>
            <p className="text-xl font-black text-emerald-400 font-mono tracking-tight mt-1">৳{(order?.totalAmount || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* 👤 Customer & Shipping Information Card */}
        <div className="bg-[#071322]/50 backdrop-blur-md rounded-xl overflow-hidden border border-slate-800/60 shadow-xl">
          <div className="bg-gradient-to-r from-blue-950/50 to-transparent px-5 py-3.5 text-white text-sm font-bold tracking-wider uppercase border-b border-slate-800/50">
            Customer & Shipping Information
          </div>
          
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 bg-[#030d17]/60 p-3 rounded-xl border border-slate-800/40 hover:border-slate-800 transition-all">
              <div className="p-2.5 bg-blue-950/60 text-blue-400 rounded-xl border border-blue-500/10"><FiUser size={16} /></div>
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Customer Name</span>
                <span className="text-slate-200 font-bold text-xs mt-0.5 block">{order?.customerName || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#030d17]/60 p-3 rounded-xl border border-slate-800/40 hover:border-slate-800 transition-all">
              <div className="p-2.5 bg-blue-950/60 text-blue-400 rounded-xl border border-blue-500/10"><FiPhone size={16} /></div>
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Phone</span>
                <span className="text-slate-200 text-xs font-bold mt-0.5 block font-mono">{order?.phone || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#030d17]/60 p-3 rounded-xl border border-slate-800/40 hover:border-slate-800 transition-all">
              <div className="p-2.5 bg-emerald-950/60 text-emerald-400 rounded-xl border border-emerald-500/10"><FaWhatsapp size={16} /></div>
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">WhatsApp</span>
                <span className="text-emerald-400 text-xs font-bold mt-0.5 block font-mono">{order?.whatsapp || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#030d17]/60 p-3 rounded-xl border border-slate-800/40 hover:border-slate-800 transition-all">
              <div className="p-2.5 bg-blue-950/60 text-blue-400 rounded-xl border border-blue-500/10"><FiMail size={16} /></div>
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Email Address</span>
                <span className="text-slate-200 text-xs mt-0.5 block truncate font-medium">{order?.email || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#030d17]/60 p-3 rounded-xl border border-slate-800/40 hover:border-slate-800 transition-all">
              <div className="p-2.5 bg-blue-950/60 text-blue-400 rounded-xl border border-blue-500/10"><FiTruck size={16} /></div>
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Shipping Method</span>
                <span className="text-slate-200 text-xs font-bold mt-0.5 block capitalize">{order?.deliveryType || "Standard"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#030d17]/60 p-3 rounded-xl border border-slate-800/40 hover:border-slate-800 transition-all">
              <div className="p-2.5 bg-blue-950/60 text-blue-400 rounded-xl border border-blue-500/10"><FiUser size={16} /></div>
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Receiver Name</span>
                <span className="text-slate-200 text-xs font-bold mt-0.5 block">{order?.receiverName || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#030d17]/60 p-3.5 rounded-xl border border-slate-800/40 hover:border-slate-800 transition-all md:col-span-2">
              <div className="p-2.5 bg-blue-950/60 text-blue-400 rounded-xl border border-blue-500/10"><FiMapPin size={16} /></div>
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Shipping Destination</span>
                <span className="text-slate-200 text-xs font-semibold mt-0.5 block leading-relaxed">
                  {order?.deliveryAddress || "N/A"}{order?.district ? `, ${order.district}` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 📑 Extra Information Grid Card */}
        <div className="bg-[#071322]/50 backdrop-blur-md rounded-xl overflow-hidden border border-slate-800/60 shadow-xl">
          <div className="bg-gradient-to-r from-blue-950/50 to-transparent px-5 py-3.5 text-white text-sm font-bold tracking-wider uppercase border-b border-slate-800/50">
            Order Specific Specifications
          </div>
          
          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-3 py-2 border-b border-slate-800/40 items-center">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Order Category</span>
              <span className="col-span-2 text-blue-400 font-black font-mono uppercase tracking-widest text-sm">{order?.orderType || "General"}</span>
            </div>

            {/* 💍 Wedding Specific Fields */}
            {order?.orderType === "wedding" && (
              <div className="space-y-3 bg-[#030d17]/50 p-3 rounded-xl border border-slate-800/40">
                <div className="grid grid-cols-3 py-1 items-center">
                  <span className="text-slate-400 font-medium">Couples</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-white font-bold">{order?.groomName || "N/A"}</span>
                    <FiHeart size={12} className="text-pink-500 fill-pink-500 animate-pulse" />
                    <span className="text-white font-bold">{order?.brideName || "N/A"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 py-1">
                  <span className="text-slate-400 font-medium">Groom's Parents</span>
                  <span className="col-span-2 text-slate-300">
                    Father: <span className="text-white font-medium">{order?.groomFather || "N/A"}</span> | Mother: <span className="text-white font-medium">{order?.groomMother || "N/A"}</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 py-1">
                  <span className="text-slate-400 font-medium">Bride's Parents</span>
                  <span className="col-span-2 text-slate-300">
                    Father: <span className="text-white font-medium">{order?.brideFather || "N/A"}</span> | Mother: <span className="text-white font-medium">{order?.brideMother || "N/A"}</span>
                  </span>
                </div>
              </div>
            )}

            {/* ⚱️ Death Specific Fields */}
            {order?.orderType === "death" && (
              <div className="space-y-3 bg-[#030d17]/50 p-3 rounded-xl border border-slate-800/40">
                <div className="grid grid-cols-3 py-1">
                  <span className="text-slate-400 font-medium">Deceased Name</span>
                  <span className="col-span-2 text-rose-400 font-bold">{order?.deceasedName || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3 py-1">
                  <span className="text-slate-400 font-medium">Father / Husband</span>
                  <span className="col-span-2 text-white font-semibold">{order?.fatherOrHusbandName || "N/A"}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 py-2 border-b border-slate-800/40 items-center">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Occasions Date</span>
              <span className="col-span-2 text-slate-200 font-mono font-bold flex items-center gap-1.5">
                <FiCalendar size={13} className="text-blue-400" /> {formattedDate}
              </span>
            </div>

            <div className="grid grid-cols-3 py-2 border-b border-slate-800/40 items-center">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Subtotal Cost</span>
              <span className="col-span-2 text-slate-300 font-mono font-semibold">৳{(order?.totalAmount || 0).toLocaleString()}.00</span>
            </div>

            <div className="grid grid-cols-3 py-3 bg-emerald-950/20 border border-emerald-500/20 px-3 rounded-xl items-center font-semibold">
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">Final Settlement</span>
              <span className="col-span-2 text-emerald-400 font-mono font-black text-base">৳{(order?.totalAmount || 0).toLocaleString()}.00</span>
            </div>

            <div className="grid grid-cols-3 py-2 items-start">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mt-0.5">Special Instruction</span>
              <span className="col-span-2 text-amber-500 font-medium italic bg-amber-950/20 border border-amber-900/20 p-2.5 rounded-xl leading-relaxed">
                {order?.specialMessage ? `"${order.specialMessage}"` : "No special instructions provided by customer."}
              </span>
            </div>
          </div>
        </div>

      </div>
      
      {/* 📜 Footer */}
      <div className="text-center mt-16 text-slate-600 text-[11px] font-medium tracking-widest uppercase font-mono select-none">
        Copyright © 2026 Woodly. All rights reserved.
      </div>
    </div>
  );
};

const OrderDetails = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030d17] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-xs tracking-widest text-slate-400 font-bold uppercase font-mono animate-pulse">Initializing System Layout...</p>
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  );
};

export default OrderDetails;