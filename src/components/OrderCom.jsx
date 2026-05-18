"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { MdAdd, MdSearch, MdSync, MdContentCopy } from 'react-icons/md';
import { FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaRegCommentDots, FaCalendarAlt } from 'react-icons/fa';

const OrderCom = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const statuses = ["All", "NEW", "PROCESSING", "ON HOLD", "COMPLETED", "CANCELLED", "REFUNDED"];

  // 🔄 API থেকে ডাটা লোড
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("https://woodly-server-fayw.vercel.app/orders", { cache: "no-store" });
      const data = await res.json();
      
      const fetchedOrders = Array.isArray(data) ? [...data].reverse() : [];
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
    } catch (err) {
      console.error("Order load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // 🎯 ফিল্টারিং লজিক 
  useEffect(() => {
    let result = [...orders];

    if (activeTab !== "All") {
      if (activeTab === "NEW") {
        result = result.filter(
          o => o.status?.trim().toLowerCase() === "pending" || o.orderStatus?.trim().toLowerCase() === "pending"
        );
      } else if (activeTab === "COMPLETED") {
        result = result.filter(
          o => o.status?.trim().toLowerCase() === "completed" || o.orderStatus?.trim().toLowerCase() === "confirmed"
        );
      } else if (activeTab === "CANCELLED") {
        result = result.filter(o => o.status?.trim().toLowerCase() === "cancelled");
      } else {
        result = result.filter(
          o => o.status?.trim().toLowerCase() === activeTab.toLowerCase() || 
               o.orderStatus?.trim().toLowerCase() === activeTab.toLowerCase()
        );
      }
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.customerName?.toLowerCase().includes(query) || 
        o.phone?.includes(query) ||
        o.whatsapp?.includes(query) ||
        o.district?.toLowerCase().includes(query) ||
        o._id?.includes(query)
      );
    }

    setFilteredOrders(result);
  }, [activeTab, searchQuery, orders]);

  const getTabCount = (tabName) => {
    if (tabName === "All") return orders.length;
    if (tabName === "NEW") {
      return orders.filter(o => o.status?.trim().toLowerCase() === "pending" || o.orderStatus?.trim().toLowerCase() === "pending").length;
    }
    if (tabName === "COMPLETED") {
      return orders.filter(o => o.status?.trim().toLowerCase() === "completed" || o.orderStatus?.trim().toLowerCase() === "confirmed").length;
    }
    if (tabName === "CANCELLED") {
      return orders.filter(o => o.status?.trim().toLowerCase() === "cancelled").length;
    }
    return orders.filter(
      o => o.status?.trim().toLowerCase() === tabName.toLowerCase() || 
           o.orderStatus?.trim().toLowerCase() === tabName.toLowerCase()
    ).length;
  };

  // 📋 কপি করার ফাংশন
  const handleCopyRow = (e, generatedId, order) => {
    e.stopPropagation(); 
    
    let eventDetails = "";
    if (order.orderType === "wedding") {
      eventDetails = `💍 Groom: ${order.groomName || "N/A"} (F: ${order.groomFather || "N/A"}, M: ${order.groomMother || "N/A"})\n👰 Bride: ${order.brideName || "N/A"} (F: ${order.brideFather || "N/A"}, M: ${order.brideMother || "N/A"})`;
    } else if (order.orderType === "death") {
      eventDetails = `⚱️ Deceased: ${order.deceasedName || "N/A"}\n👤 Father/Husband: ${order.fatherOrHusbandName || "N/A"}`;
    }

    const textToCopy = `Order ID: ${generatedId}
Type: ${order.orderType?.toUpperCase() || "GENERAL"}
Customer: ${order.customerName || "No Name"}
Phone: ${order.phone || "N/A"}
WhatsApp: ${order.whatsapp || "N/A"}
Email: ${order.email || "N/A"}
Event Details:
${eventDetails || "No Custom Details"}
Date: ${order.eventDate || order.deathDate || "N/A"}
District: ${order.district || "N/A"}
Address: ${order.deliveryAddress || "N/A"}
Receiver: ${order.receiverName || "N/A"}
Delivery: ${order.deliveryType || "COD"}
Amount: ৳${(order.totalAmount || 0).toLocaleString()}.00
Status: ${order.status?.toUpperCase() || "PENDING"}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast.success("সব ডাটা কপি হয়ে গেছে!", {
          style: {
            border: "1px solid #171717",
            padding: "12px",
            color: "#fff",
            background: "#000000",
          },
          iconTheme: { primary: "#10b981", secondary: "#fff" },
        });
      })
      .catch(() => toast.error("Copy করতে ব্যর্থ হয়েছে!"));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-neutral-400 font-mono text-xs tracking-widest">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-white/15 border-t-white rounded-full animate-spin"></div>
          <span>LOADING SYSTEM...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-black min-h-screen text-neutral-400 p-4 md:p-6 font-sans antialiased selection:bg-white selection:text-black">
      <Toaster position="top-right" reverseOrder={false} />

      {/* 🔝 Dashboard Header */}
      <div className="flex justify-between items-end border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Overview</h2>
          <p className="text-xs text-neutral-500 mt-0.5 mb-3">Manage and track your active workflow syncs</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-500 block uppercase tracking-widest font-mono">Total Balance</span>
          <span className="text-lg font-bold text-white font-mono">৳ 0.00</span>
        </div>
      </div>

      {/* 📑 Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-px border-b border-gray-700 custom-scrollbar-h">
        {statuses.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 relative -mb-px ${
                isActive ? "text-white font-bold" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <span>{tab}</span>
              <span className={`ml-1.5 text-[14px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-neutral-800 text-white' : 'bg-neutral-950 text-neutral-600'}`}>
                ({getTabCount(tab)})
              </span>
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
            </button>
          );
        })}
      </div>

      {/* 🔍 Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-5 relative group">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500 group-focus-within:text-white transition-colors">
            <MdSearch size={18} />
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search details, name, phone, district..." 
            className="w-full h-10 bg-black border border-gray-600 rounded-xl pl-10 pr-4 text-sm text-white outline-none focus:border-neutral-800 transition-all placeholder-neutral-700"
          />
        </div>
        <div className="lg:col-span-4 flex items-center bg-black border border-gray-700 rounded-xl px-3 h-10">
          <input type="text" placeholder="Timeline (Start Date — End Date)" className="bg-transparent text-xs text-neutral-700 outline-none w-full cursor-not-allowed" />
        </div>
        <div className="lg:col-span-3 flex gap-2">
          <button onClick={loadOrders} className="flex-1 bg-black border border-gray-700 text-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 h-10 hover:bg-neutral-950 active:scale-[0.98] transition-all">
            <MdSync size={16} className="text-neutral-500" /> Sync
          </button>
          <button className="flex-1 bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 h-10 hover:bg-blue-600 active:scale-[0.98] transition-all whitespace-nowrap shadow-[0_4px_12px_rgba(29,78,216,0.15)]">
            <MdAdd size={16} /> Add Order
          </button>
        </div>
      </div>

      {/* 📋 Table Container */}
      <div className="bg-black border border-gray-700 rounded-2xl overflow-hidden shadow-[0_24px_50px_-12px_rgba(0,0,0,0.9)]">
        <div className="overflow-x-auto custom-scrollbar-h">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 bg-neutral-950 text-[10px] font-bold text-neutral-500 uppercase tracking-widest whitespace-nowrap">
                <th className="p-4 w-12" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded bg-neutral-950 border-neutral-800 text-white focus:ring-0 cursor-pointer" /></th>
                <th className="p-4">ORDER ID</th>
                <th className="p-4">CUSTOMER INFO</th>
                <th className="p-4">EVENT/DETAILS</th>
                <th className="p-4">SPECIAL MESSAGE</th>
                <th className="p-4">SHIPPING ADDRESS</th>
                <th className="p-4">PRICE</th>
                <th className="p-4 text-center">STATUS</th>
                <th className="p-4 text-right">DATE</th>
                <th className="p-4 text-center">ACTION</th> 
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-950 text-xs text-neutral-400">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-16 text-center text-neutral-700 font-mono tracking-wider">
                    NO COMPLIANT RECORDS FOUND.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, i) => {
                  const generatedId = order._id ? `ORD-${order._id.substring(0, 10).toUpperCase()}` : `ORD-2026051200${i}`;
                  const orderDate = order.eventDate || order.deathDate || "N/A";

                  return (
                    <tr 
                      key={order._id || i} 
                      /* 🔥 এখানে ফিক্স করা হয়েছে: অবজেক্টের আসল ডাটাবেজ _id কুয়েরি প্যারামিটারে পাঠানো হচ্ছে */
                      onClick={() => {
                        if (order._id) {
                          router.push(`/dashboard/orderdetails?id=${order._id}`);
                        } else {
                          toast.error("এই অর্ডারের কোনো ভ্যালিড আইডি পাওয়া যায়নি!");
                        }
                      }}
                      className="hover:bg-neutral-950 transition-all cursor-pointer group"
                    >
                      {/* Checkbox */}
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded bg-neutral-950 border-neutral-800 text-white focus:ring-0 cursor-pointer" />
                      </td>

                      {/* Order ID */}
                      <td className="p-4 font-mono font-medium text-white group-hover:text-blue-400 transition-colors whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span>{generatedId}</span>
                          <span className={`w-max px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider border ${
                            order.orderType === "wedding" 
                              ? "bg-pink-500/[0.02] text-pink-400 border-pink-500/10" 
                              : "bg-purple-500/[0.02] text-purple-400 border-purple-500/10"
                          }`}>
                            {order.orderType || "General"}
                          </span>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-neutral-950 border border-gray-700 flex items-center justify-center text-[9px] font-bold text-white uppercase">
                              {(order.customerName || "C")[0]}
                            </div>
                            <span className="text-white font-semibold tracking-wide">{order.customerName || "No Name"}</span>
                          </div>
                          <div className="text-neutral-500 font-mono text-[11px] pl-6">📞 {order.phone || "N/A"}</div>
                          {order.whatsapp && (
                            <div className="text-emerald-500 flex items-center gap-1 font-mono text-[11px] pl-6">
                              <FaWhatsapp size={12} /> {order.whatsapp}
                            </div>
                          )}
                          {order.email && (
                            <div className="text-neutral-500 flex items-center gap-1 text-[11px] pl-6 max-w-[150px] truncate" title={order.email}>
                              <FaEnvelope size={10} /> {order.email}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Event/Details */}
                      <td className="p-4 whitespace-nowrap">
                        {order.orderType === "wedding" ? (
                          <div className="space-y-1 bg-pink-500/[0.01] p-2 rounded-xl border border-pink-500/10">
                            <p className="text-neutral-200"><span className="text-neutral-600 text-[10px] uppercase font-mono">G:</span> {order.groomName || "N/A"}</p>
                            <p className="text-neutral-200"><span className="text-neutral-600 text-[10px] uppercase font-mono">B:</span> {order.brideName || "N/A"}</p>
                          </div>
                        ) : order.orderType === "death" ? (
                          <div className="space-y-1 bg-purple-500/[0.01] p-2 rounded-xl border border-purple-500/10">
                            <p className="text-neutral-200"><span className="text-neutral-600 text-[10px] uppercase font-mono">Deceased:</span> {order.deceasedName || "N/A"}</p>
                            <p className="text-neutral-400"><span className="text-neutral-600 text-[10px] uppercase font-mono">F/H:</span> {order.fatherOrHusbandName || "N/A"}</p>
                          </div>
                        ) : (
                          <span className="text-neutral-600 font-mono">-</span>
                        )}
                      </td>

                      {/* Special Message */}
                      <td className="p-4 max-w-[200px]">
                        {order.specialMessage ? (
                          <div className="flex items-start gap-1.5 bg-neutral-950 p-2 rounded-xl border border-gray-700" title={order.specialMessage}>
                            <FaRegCommentDots className="text-neutral-600 shrink-0 mt-0.5" size={13} />
                            <p className="line-clamp-2 text-neutral-400 text-[11px] leading-relaxed italic">
                              "{order.specialMessage}"
                            </p>
                          </div>
                        ) : (
                          <span className="text-neutral-800 font-mono">-</span>
                        )}
                      </td>

                      {/* Shipping Address */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-white font-medium">
                            <FaMapMarkerAlt className="text-neutral-500" size={11} />
                            <span>{order.district || "N/A"}</span>
                          </div>
                          <p className="text-neutral-500 max-w-[160px] truncate text-[11px]" title={order.deliveryAddress}>
                            {order.deliveryAddress || "N/A"}
                          </p>
                          <span className="inline-block px-1.5 py-0.2 bg-neutral-950 border border-gray-700 text-[9px] font-bold font-mono rounded text-neutral-400">
                            {order.deliveryType === "Point" ? "COD (POINT)" : "COD (HOME)"}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-4 font-bold text-white font-mono whitespace-nowrap text-sm">
                        ৳{(order.totalAmount || 0).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <span className={`px-2 py-0.5 rounded border text-[9px] font-bold font-mono tracking-wider ${
                          order.status?.trim().toLowerCase() === "pending" 
                            ? "bg-amber-500/5 text-amber-400 border-amber-500/10" 
                            : "bg-neutral-950 text-neutral-500 border-gray-700"
                        }`}>
                          {order.status || "Mail Sent"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-right whitespace-nowrap font-mono text-neutral-500">
                        <div className="flex items-center justify-end gap-1 text-[11px]">
                          <FaCalendarAlt size={10} className="text-neutral-600" />
                          <span>{orderDate}</span>
                        </div>
                      </td>
                      
                      {/* Action Button */}
                      <td className="p-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={(e) => handleCopyRow(e, generatedId, order)}
                          className="p-2 bg-neutral-950 hover:bg-white text-neutral-400 hover:text-black rounded-xl transition-all border border-gray-700 active:scale-95 inline-flex items-center justify-center"
                          title="Copy Full Document Row"
                        >
                          <MdContentCopy size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderCom;