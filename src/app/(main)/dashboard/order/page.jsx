"use client";
import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { 
  FiUser, FiPhone, FiMail, FiTruck, FiMapPin, FiCopy, FiCalendar, FiHeart
} from "react-icons/fi";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(""); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://woodly-server-fayw.vercel.app/orders", { 
          cache: "no-store"
        });
        const data = await res.json();
    
        if (Array.isArray(data)) {
          setOrders(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dynamic data from DB:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020a13] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-xs tracking-widest text-blue-500 font-bold uppercase">Loading Dynamic Orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#020a13] text-slate-400 flex flex-col items-center justify-center gap-2">
        <p className="text-sm font-semibold text-white">No active orders found in the database!</p>
        <p className="text-xs text-slate-500">Please add an order to see dynamic mapping.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020a13] text-slate-300 p-4 lg:p-6 font-sans antialiased">

      <div className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
        <span className="text-blue-500 font-medium">Order</span>
        <span>/</span>
        <span className="text-slate-400">Order Details ({orders.length})</span>
      </div>

      <h1 className="text-xl font-bold text-white mb-6">Order Management Dashboard</h1>
      <div className="space-y-12">
        {orders.map((order) => {
          const formattedDate = order?.eventDate 
            ? new Date(order.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : "N/A";

          return (
            <div key={order._id} className="border-b border-slate-800/40 pb-12 last:border-none last:pb-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-[#071322] border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between">
                  <p className="text-xs text-slate-400 font-medium mb-2">Order ID</p>
                  <div className="flex items-center justify-between gap-2 bg-[#020a13] p-2 rounded border border-slate-800">
                    <span className="text-xs font-mono font-bold text-slate-300 truncate">{order?._id}</span>
                    <button onClick={() => copyToClipboard(order?._id)} className="text-slate-500 hover:text-blue-400 transition-colors shrink-0">
                      {copiedId === order?._id ? <span className="text-[10px] text-green-400">Copied!</span> : <FiCopy size={13} />}
                    </button>
                  </div>
                </div>

                <div className="bg-[#071322] border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between">
                  <p className="text-xs text-slate-400 font-medium mb-2">Payment Status</p>
                  <div>
                    <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded text-xs font-semibold border border-emerald-500/20">Paid</span>
                  </div>
                </div>

                <div className="bg-[#071322] border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between">
                  <p className="text-xs text-slate-400 font-medium mb-2">Order Status</p>
                  <div>
                    <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded text-xs font-semibold border border-blue-500/20 capitalize">
                      {order?.status || "Confirmed"}
                    </span>
                  </div>
                </div>

                <div className="bg-[#071322] border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between">
                  <p className="text-xs text-slate-400 font-medium mb-2">Delivery Status</p>
                  <div>
                    <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded text-xs font-semibold border border-slate-700">Not Shipped</span>
                  </div>
                </div>

                <div className="bg-[#071322] border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between">
                  <p className="text-xs text-slate-400 font-medium mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-emerald-400 font-mono">৳ {order?.totalAmount || 0}.00</p>
                </div>
              </div>

        
              <div className="space-y-6">
                
                <div className="bg-[#071322] border border-slate-800/80 rounded-lg overflow-hidden shadow-lg">
                  <div className="bg-[#0b1a2d] px-4 py-3 border-b border-slate-800 text-white text-xs font-bold tracking-wide">
                    Customer & Shipping Information
                  </div>
                  
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#040f1d] border border-slate-800 p-3 rounded flex items-center gap-4">
                      <div className="p-2 bg-blue-500/10 text-blue-400 rounded"><FiUser size={16} /></div>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Customer Name</span>
                        <span className="text-slate-200 font-medium text-xs mt-0.5 block">{order?.customerName}</span>
                      </div>
                    </div>

                    <div className="bg-[#040f1d] border border-slate-800 p-3 rounded flex items-center gap-4">
                      <div className="p-2 bg-blue-500/10 text-blue-400 rounded"><FiPhone size={16} /></div>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Phone</span>
                        <span className="text-slate-200 font-mono text-xs mt-0.5 block">{order?.phone}</span>
                      </div>
                    </div>

                    <div className="bg-[#040f1d] border border-slate-800 p-3 rounded flex items-center gap-4">
                      <div className="p-2 bg-blue-500/10 text-blue-400 rounded"><FiMail size={16} /></div>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Email</span>
                        <span className="text-slate-200 text-xs mt-0.5 block">{order?.email || "N/A"}</span>
                      </div>
                    </div>

                    <div className="bg-[#040f1d] border border-slate-800 p-3 rounded flex items-center gap-4">
                      <div className="p-2 bg-blue-500/10 text-blue-400 rounded"><FiTruck size={16} /></div>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Shipping Method</span>
                        <span className="text-slate-200 text-xs mt-0.5 block capitalize">{order?.deliveryType} Delivery</span>
                      </div>
                    </div>

                    <div className="bg-[#040f1d] border border-slate-800 p-3 rounded flex items-center gap-4 md:col-span-2">
                      <div className="p-2 bg-blue-500/10 text-blue-400 rounded"><FiMapPin size={16} /></div>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Shipping Address</span>
                        <span className="text-slate-200 text-xs mt-0.5 block leading-relaxed">
                          {order?.deliveryAddress}, {order?.district}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ২. এক্সট্রা ইনফরমেশন টেবিল কার্ড */}
                <div className="bg-[#071322] border border-slate-800/80 rounded-lg overflow-hidden shadow-lg">
                  <div className="bg-[#0b1a2d] px-4 py-3 border-b border-slate-800 text-white text-xs font-bold tracking-wide">
                    Extra Information
                  </div>
                  
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <tbody className="divide-y divide-slate-800/60">
                        <tr className="hover:bg-slate-800/10">
                          <td className="p-3 px-5 text-slate-400 font-medium w-1/3">Order Date / Event Date</td>
                          <td className="p-3 text-slate-200 font-mono flex items-center gap-2">
                            <FiCalendar size={13} className="text-slate-400" /> {formattedDate}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-800/10">
                          <td className="p-3 px-5 text-slate-400 font-medium">Order Type</td>
                          <td className="p-3 text-blue-400 font-semibold capitalize">{order?.orderType}</td>
                        </tr>
                        <tr className="hover:bg-slate-800/10">
                          <td className="p-3 px-5 text-slate-400 font-medium">Couple Profile</td>
                          <td className="p-3 text-slate-200 flex items-center gap-2">
                            <span className="text-blue-400 font-bold">{order?.groomName} (Groom)</span>
                            <FiHeart size={12} className="text-pink-500 fill-pink-500" />
                            <span className="text-pink-400 font-bold">{order?.brideName} (Bride)</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-800/10">
                          <td className="p-3 px-5 text-slate-400 font-medium">Grooms Parents</td>
                          <td className="p-3 text-slate-400 leading-normal">
                            Father: {order?.groomFather} <br /> Mother: {order?.groomMother}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-800/10">
                          <td className="p-3 px-5 text-slate-400 font-medium">Brides Parents</td>
                          <td className="p-3 text-slate-400 leading-normal">
                            Father: {order?.brideFather} <br /> Mother: {order?.brideMother}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-800/10">
                          <td className="p-3 px-5 text-slate-400 font-medium">Customer IP</td>
                          <td className="p-3 text-slate-500 font-mono">103.247.238.12 (Fallback)</td>
                        </tr>
                        <tr className="hover:bg-slate-800/10">
                          <td className="p-3 px-5 text-slate-400 font-medium">User Agent</td>
                          <td className="p-3 text-slate-500 font-mono text-[11px] break-all">
                            Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (Chrome)
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-800/10">
                          <td className="p-3 px-5 text-slate-400 font-medium">Subtotal</td>
                          <td className="p-3 text-slate-200 font-mono">৳ {order?.totalAmount || 0}.00</td>
                        </tr>
                        <tr className="hover:bg-slate-800/10">
                          <td className="p-3 px-5 text-slate-400 font-medium">Shipping Charge</td>
                          <td className="p-3 text-slate-200 font-mono">৳ 0.00</td>
                        </tr>
                        <tr className="hover:bg-slate-800/10 font-bold bg-slate-900/20">
                          <td className="p-3 px-5 text-slate-300">Grand Total</td>
                          <td className="p-3 text-emerald-400 font-mono font-bold">৳ {order?.totalAmount || 0}.00</td>
                        </tr>
                        <tr className="hover:bg-slate-800/10">
                          <td className="p-3 px-5 text-slate-400 font-medium">Customer Note / Special Message</td>
                          <td className="p-3 text-amber-400 italic bg-amber-500/[0.01]">{order?.specialMessage || "N/A"}</td>
                        </tr>
                        <tr className="hover:bg-slate-800/10">
                          <td className="p-3 px-5 text-slate-400 font-medium">Device & Browser</td>
                          <td className="p-3 text-slate-400 font-medium">Desktop (Chrome on Windows 10)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>
      
      {/* 📜 ফুটার কপিরাইট */}
      <div className="text-center mt-12 text-slate-600 text-xs tracking-wider">
        Copyright © 2024. All rights reserved.
      </div>
    </div>
  );
};

export default OrderPage;