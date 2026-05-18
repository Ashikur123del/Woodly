"use client";

import { Spinner } from '@heroui/react';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiCalendar, FiCopy, FiHeart, FiMail, FiMapPin, FiPhone, FiTruck, FiUser, FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const OrderDetailsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(""); 
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

          // ডাইনামিক ডেট পিকিং (eventDate অথবা deathDate)
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
      setCopiedId(text);
      setTimeout(() => setCopiedId(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-xs tracking-widest text-slate-500 font-bold uppercase font-mono">Loading Dynamic Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-400 flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-sm font-semibold text-white">No active order found or missing order ID!</p>
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 bg-[#0b1329] border-none text-xs px-4 py-2 rounded-xl text-white hover:bg-slate-900 transition-all"
        >
          <FiArrowLeft size={14} /> Go Back
        </button>
      </div>
    );
  }

  const generatedId = order._id ? `ORD-${order._id.toUpperCase()}` : "N/A";

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 p-4 lg:p-6 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 🗺️ Breadcrumb & Title */}
      <div className="mb-6">
        <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
          <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => router.back()}>Order</span>
          <span>/</span>
          <span className="text-slate-400">Order Details</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Order Details</h1>
      </div>
      
      <div className="space-y-6">
        
        {/* 📊 Top Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Order ID */}
          <div className="bg-[#0b1329] p-4 rounded-xl flex flex-col justify-between h-24 border-none shadow-lg shadow-black/20">
            <p className="text-xs text-slate-400 font-medium">Order ID</p>
            <div className="flex items-center gap-2 mt-1 bg-black/20 p-1.5 rounded-lg border-none">
              <span className="text-xs font-semibold text-blue-400 truncate">{generatedId}</span>
              <button onClick={() => copyToClipboard(order?._id)} className="text-slate-500 hover:text-white transition-colors shrink-0">
                {copiedId === order?._id ? <span className="text-[10px] text-green-400 font-mono">Copied!</span> : <FiCopy size={13} />}
              </button>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-[#0b1329] p-4 rounded-xl flex flex-col justify-between h-24 border-none shadow-lg shadow-black/20">
            <p className="text-xs text-slate-400 font-medium">Payment Status</p>
            <div className="mt-1">
              <span className="bg-green-950/80 text-green-400 px-3 py-1 rounded-full text-[11px] font-bold border-none">Paid</span>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-[#0b1329] p-4 rounded-xl flex flex-col justify-between h-24 border-none shadow-lg shadow-black/20">
            <p className="text-xs text-slate-400 font-medium">Order Status</p>
            <div className="mt-1">
              <span className="bg-blue-950/80 text-blue-400 px-3 py-1 rounded-full text-[11px] font-bold border-none capitalize">
                {order?.status || "Confirmed"}
              </span>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="bg-[#0b1329] p-4 rounded-xl flex flex-col justify-between h-24 border-none shadow-lg shadow-black/20">
            <p className="text-xs text-slate-400 font-medium">Delivery Status</p>
            <div className="mt-1">
              <span className="bg-slate-900 text-slate-400 px-3 py-1 rounded-full text-[11px] font-bold border-none">Not Shipped</span>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-[#0b1329] p-4 rounded-xl flex flex-col justify-between h-24 border-none shadow-lg shadow-black/20 col-span-2 sm:col-span-1">
            <p className="text-xs text-slate-400 font-medium">Total Amount</p>
            <p className="text-lg font-bold text-green-400 mt-1">৳ {(order?.totalAmount || 0).toLocaleString()}.00</p>
          </div>
        </div>

        {/* 👤 Customer & Shipping Information Card */}
        <div className="bg-[#0b1329] rounded-xl overflow-hidden border-none shadow-lg shadow-black/20">
          <div className="bg-blue-950/30 px-5 py-3.5 text-white text-sm font-bold tracking-wide border-none">
            Customer & Shipping Information
          </div>
          
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 bg-slate-900/40 p-3 rounded-lg border-none">
              <div className="p-2.5 bg-blue-950/60 text-blue-400 rounded-lg"><FiUser size={16} /></div>
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">Customer Name</span>
                <span className="text-slate-200 font-semibold text-xs mt-0.5 block">{order?.customerName || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/40 p-3 rounded-lg border-none">
              <div className="p-2.5 bg-blue-950/60 text-blue-400 rounded-lg"><FiPhone size={16} /></div>
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">Phone</span>
                <span className="text-slate-200 text-xs mt-0.5 block font-mono">{order?.phone || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/40 p-3 rounded-lg border-none">
              <div className="p-2.5 bg-blue-950/60 text-emerald-400 rounded-lg"><FaWhatsapp size={16} /></div>
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">WhatsApp</span>
                <span className="text-slate-200 text-xs mt-0.5 block font-mono">{order?.whatsapp || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/40 p-3 rounded-lg border-none">
              <div className="p-2.5 bg-blue-950/60 text-blue-400 rounded-lg"><FiMail size={16} /></div>
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">Email</span>
                <span className="text-slate-200 text-xs mt-0.5 block truncate">{order?.email || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/40 p-3 rounded-lg border-none">
              <div className="p-2.5 bg-blue-950/60 text-blue-400 rounded-lg"><FiTruck size={16} /></div>
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">Shipping Method</span>
                <span className="text-slate-200 text-xs mt-0.5 block capitalize">{order?.deliveryType || "Standard"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/40 p-3 rounded-lg border-none">
              <div className="p-2.5 bg-blue-950/60 text-blue-400 rounded-lg"><FiUser size={16} /></div>
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">Receiver Name</span>
                <span className="text-slate-200 text-xs mt-0.5 block">{order?.receiverName || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/40 p-3 rounded-lg border-none md:col-span-2">
              <div className="p-2.5 bg-blue-950/60 text-blue-400 rounded-lg"><FiMapPin size={16} /></div>
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">Shipping Address</span>
                <span className="text-slate-200 text-xs mt-0.5 block leading-relaxed font-medium">
                  {order?.deliveryAddress || "N/A"}{order?.district ? `, ${order.district}` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 📑 Extra Information Table Card */}
        <div className="bg-[#0b1329] rounded-xl overflow-hidden border-none shadow-lg shadow-black/20">
          <div className="bg-blue-950/30 px-5 py-3.5 text-white text-sm font-bold tracking-wide border-none">
            Extra Information
          </div>
          
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left !border-none border-separate border-spacing-0">
              <tbody>
                <tr className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-1.5 px-5 text-slate-400 font-medium w-1/3 !border-none">Order Type</td>
                  <td className="py-1.5 px-2 text-blue-400 font-bold uppercase tracking-wider !border-none">{order?.orderType || "General"}</td>
                </tr>

                {/* 💍 Wedding Specific Fields */}
                {order?.orderType === "wedding" && (
                  <>
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-1.5 px-5 text-slate-400 font-medium !border-none">Groom Name / Bride Name</td>
                      <td className="py-1.5 px-2 text-slate-200 !border-none flex items-center gap-2">
                        <span className="text-white font-semibold">{order?.groomName || "N/A"}</span>
                        <FiHeart size={12} className="text-pink-500 fill-pink-500" />
                        <span className="text-white font-semibold">{order?.brideName || "N/A"}</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-1.5 px-5 text-slate-400 font-medium !border-none">Groom's Parents</td>
                      <td className="py-1.5 px-2 text-slate-400 !border-none">
                        Father: <span className="text-white">{order?.groomFather || "N/A"}</span> | Mother: <span className="text-white">{order?.groomMother || "N/A"}</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-1.5 px-5 text-slate-400 font-medium !border-none">Bride's Parents</td>
                      <td className="py-1.5 px-2 text-slate-400 !border-none">
                        Father: <span className="text-white">{order?.brideFather || "N/A"}</span> | Mother: <span className="text-white">{order?.brideMother || "N/A"}</span>
                      </td>
                    </tr>
                  </>
                )}

                {/* ⚱️ Death Specific Fields */}
                {order?.orderType === "death" && (
                  <>
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-1.5 px-5 text-slate-400 font-medium !border-none">Deceased Name</td>
                      <td className="py-1.5 px-2 text-white font-semibold !border-none">{order?.deceasedName || "N/A"}</td>
                    </tr>
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-1.5 px-5 text-slate-400 font-medium !border-none">Father / Husband Name</td>
                      <td className="py-1.5 px-2 text-slate-200 !border-none">{order?.fatherOrHusbandName || "N/A"}</td>
                    </tr>
                  </>
                )}

                <tr className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-1.5 px-5 text-slate-400 font-medium !border-none">Event / Death Date</td>
                  <td className="py-1.5 px-2 text-slate-200 font-mono !border-none">
                    <FiCalendar size={13} className="inline mr-1 text-slate-500" /> {formattedDate}
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-1.5 px-5 text-slate-400 font-medium !border-none">Subtotal</td>
                  <td className="py-1.5 px-2 text-slate-200 font-mono !border-none">৳ {(order?.totalAmount || 0).toLocaleString()}.00</td>
                </tr>
                <tr className="hover:bg-slate-900/40 bg-slate-900/20 font-semibold">
                  <td className="py-1.5 px-5 text-slate-300 !border-none">Grand Total</td>
                  <td className="py-1.5 px-2 text-green-400 font-mono font-bold !border-none">৳ {(order?.totalAmount || 0).toLocaleString()}.00</td>
                </tr>
                <tr className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-1.5 px-5 text-slate-400 font-medium !border-none">Special Message / Note</td>
                  <td className="py-1.5 px-2 text-amber-500 italic leading-tight !border-none">
                    {order?.specialMessage ? `"${order.specialMessage}"` : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
      
      {/* 📜 Footer */}
      <div className="text-center mt-12 text-slate-600 text-xs tracking-wide">
        Copyright © 2024. All rights reserved.
      </div>
    </div>
  );
};

const OrderDetails = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-xs tracking-widest text-slate-500 font-bold uppercase font-mono">Initializing System...</p>
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  );
};

export default OrderDetails; 