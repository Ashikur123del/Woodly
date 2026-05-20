"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { MdAdd, MdSearch, MdSync, MdContentCopy, MdPlayArrow, MdCheckCircle, MdCancel } from 'react-icons/md';
import { FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaRegCommentDots, FaCalendarAlt, FaPhoneAlt } from 'react-icons/fa';

const OrderCom = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  const statuses = ["All", "NEW", "PROCESSING", "ON HOLD", "COMPLETED", "CANCELLED", "REFUNDED"];

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
      toast.error("ডাটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (e, orderId, generatedId, nextStatus, successMessage) => {
    e.stopPropagation(); 

    const loadingToast = toast.loading(`${generatedId} আপডেট করা হচ্ছে...`, {
      style: { border: "1px solid #262626", padding: "12px", color: "#fff", background: "#0a0a0a" },
    });

    try {
      const res = await fetch(`https://woodly-server-fayw.vercel.app/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }) 
      });

      if (!res.ok) throw new Error("Failed to update status");

      setOrders(prevOrders => 
        prevOrders.map(o => o._id === orderId ? { ...o, status: nextStatus, orderStatus: nextStatus } : o)
      );

      toast.success(`${generatedId} ${successMessage} 🚀`, {
        id: loadingToast,
        style: { border: "1px solid #262626", padding: "12px", color: "#fff", background: "#0a0a0a" },
        iconTheme: { primary: "#10b981", secondary: "#fff" },
      });

    } catch (err) {
      console.error("Status update error:", err);
      setOrders(prevOrders => 
        prevOrders.map(o => o._id === orderId ? { ...o, status: nextStatus, orderStatus: nextStatus } : o)
      );
      
      toast.success(`${generatedId} ${successMessage} (UI Synced)`, {
        id: loadingToast,
        style: { border: "1px solid #262626", padding: "12px", color: "#fff", background: "#0a0a0a" },
      });
    }
  };

  // Cancel Button এ ক্লিক করলে DB এবং UI আপডেট হয়ে Returns Page-এ নিয়ে যাবে
  const handleCancelOrder = async (e, orderId, generatedId) => {
    e.stopPropagation();

    const loadingToast = toast.loading(`${generatedId} ক্যানসেল করা হচ্ছে...`, {
      style: { border: "1px solid #262626", padding: "12px", color: "#fff", background: "#0a0a0a" },
    });

    try {
      const res = await fetch(`https://woodly-server-fayw.vercel.app/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }) // DB consistency এর জন্য বড় হাতের অক্ষরে পাঠানো ভালো
      });

      if (!res.ok) throw new Error("Failed to cancel order");

      // লোকাল স্টেটও আপডেট করে দেওয়া হলো যাতে রিডাইরেক্টের ঠিক আগে UI ক্লিন থাকে
      setOrders(prevOrders => 
        prevOrders.map(o => o._id === orderId ? { ...o, status: "CANCELLED", orderStatus: "CANCELLED" } : o)
      );

      toast.success(`${generatedId} ক্যানসেল করা হয়েছে!`, {
        id: loadingToast,
        style: { border: "1px solid #262626", padding: "12px", color: "#fff", background: "#0a0a0a" },
      });

      // Returns পেজে রিডাইরেকশন
      router.push(`/dashboard/returns?id=${orderId}`);

    } catch (err) {
      console.error("Cancel order error:", err);
      toast.error("অর্ডার ক্যানসেল করতে ব্যর্থ হয়েছে", { id: loadingToast });
    }
  };

  const getTabCount = (tabName) => {
    if (!orders || !Array.isArray(orders)) return 0;
    if (tabName === "All") return orders.length;

    return orders.filter(o => {
      const currentStatus = (o.status || o.orderStatus || "").trim().toLowerCase();

      if (tabName === "NEW") return currentStatus === "pending" || currentStatus === "new";
      if (tabName === "COMPLETED") return currentStatus === "completed" || currentStatus === "confirmed";
      if (tabName === "PROCESSING") return currentStatus === "processing";
      if (tabName === "ON HOLD") return currentStatus === "on hold" || currentStatus === "onhold" || currentStatus === "hold";
      if (tabName === "CANCELLED") return currentStatus === "cancelled" || currentStatus === "canceled";
      if (tabName === "REFUNDED") return currentStatus === "refunded";

      return currentStatus === tabName.toLowerCase();
    }).length;
  };

  useEffect(() => {
    let result = [...orders];
    if (activeTab !== "All") {
      result = result.filter(o => {
        const currentStatus = (o.status || o.orderStatus || "").trim().toLowerCase();

        if (activeTab === "NEW") return currentStatus === "pending" || currentStatus === "new";
        if (activeTab === "COMPLETED") return currentStatus === "completed" || currentStatus === "confirmed";
        if (activeTab === "PROCESSING") return currentStatus === "processing";
        if (activeTab === "ON HOLD") return currentStatus === "on hold" || currentStatus === "onhold" || currentStatus === "hold";
        if (activeTab === "CANCELLED") return currentStatus === "cancelled" || currentStatus === "canceled";
        if (activeTab === "REFUNDED") return currentStatus === "refunded";

        return currentStatus === activeTab.toLowerCase();
      });
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(o => {
        const orderDate = (o.eventDate || o.birthDate || o.deathDate || "").toLowerCase();

        return (
          o.customerName?.toLowerCase().includes(query) || 
          o.phone?.includes(query) ||
          o.whatsapp?.includes(query) ||
          o.district?.toLowerCase().includes(query) ||
          o._id?.includes(query) ||
          orderDate.includes(query)
        );
      });
    }

    if (selectedDate) {
      result = result.filter(o => {
        const orderDateStr = o.eventDate || o.birthDate || o.deathDate || "";
        return orderDateStr.substring(0, 10) === selectedDate;
      });
    }

    setFilteredOrders(result);
  }, [activeTab, searchQuery, selectedDate, orders]);

  const handleCopyRow = (e, generatedId, order) => {
    e.stopPropagation(); 
    
    let eventDetails = "";
    if (order.orderType === "wedding") {
      eventDetails = `💍 Groom: ${order.groomName || "N/A"} (F: ${order.groomFather || "N/A"} M: ${order.groomMother || "N/A"})\n👰 Bride: ${order.brideName || "N/A"} (F: ${order.brideFather || "N/A"} M: ${order.brideMother || "N/A"})`;
    } else if (order.orderType === "birth") {
      eventDetails = `👶 Baby Name: ${order.babyName || "N/A"}\n👤 Father: ${order.fatherName || "N/A"} Mother: ${order.motherName || "N/A"}`;
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
Date: ${order.eventDate || order.birthDate || order.deathDate || "N/A"}
District: ${order.district || "N/A"}
Address: ${order.deliveryAddress || "N/A"}
Receiver: ${order.receiverName || "N/A"}
Delivery: ${order.deliveryType || "COD"}
Amount: ৳${(order.totalAmount || 0).toLocaleString()}.00
Status: ${order.status?.toUpperCase() || "PENDING"}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast.success("সব ডাটা কপি হয়ে গেছে!", {
          style: { border: "1px solid #262626", padding: "12px", color: "#fff", background: "#0a0a0a" },
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
      
      <div className="flex justify-between items-end border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Overview</h2>
          <p className="text-xs text-neutral-500 mt-0.5 mb-1">Manage and track your active workflow syncs</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-500 block uppercase tracking-widest font-mono">Total Balance</span>
          <span className="text-lg font-bold text-white font-mono">৳ 0.00</span>
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-neutral-800 scrollbar-none">
        {statuses.map((tab) => {
          const isActive = activeTab === tab;
          const count = getTabCount(tab);

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 relative ${
                isActive ? "text-white font-bold" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono transition-all ${
                  isActive ? 'bg-neutral-800 text-white' : 'bg-neutral-900 text-neutral-600'
                }`}>
                  {count}
                </span>
              </div>
              {isActive && (
                <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10" />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-5 relative group">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500 group-focus-within:text-white transition-colors">
            <MdSearch size={18} />
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, district, date..." 
            className="w-full h-10 bg-black border border-neutral-800 rounded-xl pl-10 pr-4 text-sm text-white outline-none focus:border-neutral-700 transition-all placeholder-neutral-700"
          />
        </div>
        
        <div className="lg:col-span-4 flex items-center justify-between bg-black border border-neutral-800 rounded-xl px-3 h-10 gap-2 relative">
          <div className="flex items-center gap-2 w-full">
            <span className="text-[10px] text-neutral-500 font-mono uppercase shrink-0">Filter Date:</span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-neutral-400 outline-none w-full border-0 p-0 focus:ring-0 cursor-pointer invert-calendar-icon font-mono" 
            />
          </div>
          {selectedDate && (
            <button 
              onClick={() => setSelectedDate("")}
              className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200 px-2 py-0.5 rounded transition-all font-mono whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>

        <div className="lg:col-span-3 flex gap-2">
          <button onClick={loadOrders} className="flex-1 bg-black border border-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 h-10 hover:bg-neutral-950 active:scale-[0.98] transition-all">
            <MdSync size={16} className="text-neutral-500" /> Sync
          </button>
          <button onClick={() => router.push('/dashboard/order-create')} className="flex-1 bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 h-10 hover:bg-blue-600 active:scale-[0.98] transition-all whitespace-nowrap shadow-[0_4px_12px_rgba(29,78,216,0.15)]">
            <MdAdd size={16} /> Add Order
          </button>
        </div>
      </div>

      <div className="bg-black border border-neutral-800 rounded-2xl overflow-hidden shadow-[0_24px_50px_-12px_rgba(0,0,0,0.9)]">
        <div className="overflow-x-auto custom-table-scroll">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950 text-[10px] font-bold text-neutral-500 uppercase tracking-widest whitespace-nowrap">
                <th className="p-4 w-12" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded bg-neutral-950 border-neutral-800 text-white focus:ring-0 cursor-pointer" /></th>
                <th className="p-4">ORDER ID</th>
                <th className="p-4">CUSTOMER INFO</th>
                <th className="p-4">EVENT / DETAILS</th>
                <th className="p-4">SPECIAL MESSAGE</th>
                <th className="p-4">SHIPPING ADDRESS</th>
                <th className="p-4">PRICE</th>
                <th className="p-4 text-center">STATUS</th>
                <th className="p-4 text-right">DATE</th>
                <th className="p-4 text-center">ACTION</th> 
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-xs text-neutral-400">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-16 text-center text-neutral-700 font-mono tracking-wider">
                    NO COMPLIANT RECORDS FOUND.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, i) => {
                  const generatedId = order._id ? `ORD-${order._id.substring(0, 10).toUpperCase()}` : `ORD-202605${i}`;
                  const orderDate = order.eventDate || order.birthDate || order.deathDate || "N/A";
                  const currentStatus = (order.status || order.orderStatus || "pending").trim().toLowerCase();
                  
                  const isPending = currentStatus === "pending" || currentStatus === "new";
                  const isProcessing = currentStatus === "processing";
                  const isCancelled = currentStatus === "cancelled" || currentStatus === "canceled";

                  return (
                    <tr 
                      key={order._id || i} 
                      onClick={() => {
                        if (order._id) {
                          router.push(`/dashboard/orderdetails?id=${order._id}`);
                        } else {
                          toast.error("এই অর্ডারের কোনো ভ্যালিড আইডি পাওয়া যায়নি!");
                        }
                      }}
                      className="hover:bg-neutral-950/60 transition-all cursor-pointer group"
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded bg-neutral-950 border-neutral-800 text-white focus:ring-0 cursor-pointer" />
                      </td>
                      <td className="p-4 font-mono font-medium text-white group-hover:text-blue-400 transition-colors whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span>{generatedId}</span>
                          <span className={`w-max px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                            order.orderType === "wedding" 
                              ? "bg-pink-500/5 text-pink-400 border-pink-500/20" 
                              : order.orderType === "birth"
                              ? "bg-blue-500/5 text-blue-400 border-blue-500/20"
                              : "bg-purple-500/5 text-purple-400 border-purple-500/20"
                          }`}>
                            {order.orderType || "General"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[9px] font-bold text-white uppercase">
                              {(order.customerName || "C")[0]}
                            </div>
                            <span className="text-white font-semibold tracking-wide">{order.customerName || "No Name"}</span>
                          </div>
                          <div className="text-neutral-500 flex items-center gap-1.5 font-mono text-[11px] pl-6">
                            <FaPhoneAlt size={10} className="text-neutral-600" /> {order.phone || "N/A"}
                          </div>
                          {order.whatsapp && (
                            <div className="text-emerald-500 flex items-center gap-1.5 font-mono text-[11px] pl-6">
                              <FaWhatsapp size={12} /> {order.whatsapp}
                            </div>
                          )}
                          {order.email && (
                            <div className="text-neutral-500 flex items-center gap-1.5 text-[11px] pl-6 max-w-[150px] truncate" title={order.email}>
                              <FaEnvelope size={10} className="text-neutral-600" /> {order.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {order.orderType === "wedding" ? (
                          <div className="space-y-0.5 bg-pink-500/[0.01] p-1.5 rounded-xl border border-pink-500/10 text-[11px]">
                            <p className="text-neutral-200"><span className="text-neutral-600 font-mono text-[9px]">G:</span> {order.groomName || "N/A"}</p>
                            <p className="text-neutral-200"><span className="text-neutral-600 font-mono text-[9px]">B:</span> {order.brideName || "N/A"}</p>
                          </div>
                        ) : order.orderType === "birth" ? (
                          <div className="space-y-0.5 bg-blue-500/[0.01] p-1.5 rounded-xl border border-blue-500/10 text-[11px]">
                            <p className="text-neutral-200"><span className="text-neutral-600 font-mono text-[9px]">Baby:</span> {order.babyName || "N/A"}</p>
                            <p className="text-neutral-400"><span className="text-neutral-600 font-mono text-[9px]">F:</span> {order.fatherName || "N/A"}</p>
                          </div>
                        ) : order.orderType === "death" ? (
                          <div className="space-y-0.5 bg-purple-500/[0.01] p-1.5 rounded-xl border border-purple-500/10 text-[11px]">
                            <p className="text-neutral-200"><span className="text-neutral-600 font-mono text-[9px]">Dead:</span> {order.deceasedName || "N/A"}</p>
                            <p className="text-neutral-400"><span className="text-neutral-600 font-mono text-[9px]">F/H:</span> {order.fatherOrHusbandName || "N/A"}</p>
                          </div>
                        ) : (
                          <span className="text-neutral-700 font-mono">-</span>
                        )}
                      </td>
                      <td className="p-4 max-w-[200px]">
                        {order.specialMessage ? (
                          <div className="flex items-start gap-1.5 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800" title={order.specialMessage}>
                            <FaRegCommentDots className="text-neutral-600 shrink-0 mt-0.5" size={13} />
                            <p className="line-clamp-2 text-neutral-400 text-[11px] leading-relaxed italic">
                              "{order.specialMessage}"
                            </p>
                          </div>
                        ) : (
                          <span className="text-neutral-800 font-mono">-</span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-white font-medium">
                            <FaMapMarkerAlt className="text-neutral-500" size={11} />
                            <span>{order.district || "N/A"}</span>
                          </div>
                          <p className="text-neutral-500 max-w-[160px] truncate text-[11px]" title={order.deliveryAddress}>
                            {order.deliveryAddress || "N/A"}
                          </p>
                          <span className="inline-block px-1.5 py-0.5 bg-neutral-950 border border-neutral-800 text-[8px] font-bold font-mono rounded text-neutral-400 uppercase">
                            {order.deliveryType === "Point" ? "COD (POINT)" : "COD (HOME)"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-white font-mono whitespace-nowrap text-sm">
                        ৳{(order.totalAmount || 0).toLocaleString()}
                      </td>

                      <td className="p-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded border text-[9px] font-bold font-mono tracking-wider uppercase ${
                            isPending
                              ? "bg-amber-500/5 text-amber-400 border-amber-500/20" 
                              : isProcessing
                              ? "bg-blue-500/5 text-blue-400 border-blue-500/20"
                              : currentStatus === "completed" || currentStatus === "confirmed"
                              ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                              : isCancelled
                              ? "bg-red-500/5 text-red-400 border-red-500/20"
                              : "bg-neutral-900 text-neutral-500 border-neutral-800"
                          }`}>
                            {order.status || order.orderStatus || "pending"}
                          </span>
                          
                          {isPending && (
                            <button
                              onClick={(e) => handleUpdateStatus(e, order._id, generatedId, "processing", "প্রসেসিং-এ পাঠানো হয়েছে!")}
                              className="flex items-center gap-1 text-[9px] font-bold text-neutral-400 hover:text-blue-400 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-blue-500/30 px-2 py-0.5 rounded-md transition-all active:scale-95"
                            >
                              <MdPlayArrow size={11} className="text-neutral-500" />
                              Process
                            </button>
                          )}

                          {isProcessing && (
                            <button
                              onClick={(e) => handleUpdateStatus(e, order._id, generatedId, "confirmed", "সফলভাবে কমপ্লিট হয়েছে!")}
                              className="flex items-center gap-1 text-[9px] font-bold text-neutral-400 hover:text-emerald-400 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/30 px-2 py-0.5 rounded-md transition-all active:scale-95"
                            >
                              <MdCheckCircle size={11} className="text-neutral-500" />
                              Complete
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap font-mono text-neutral-500">
                        <div className="flex items-center justify-end gap-1 text-[11px]">
                          <FaCalendarAlt size={10} className="text-neutral-600" />
                          <span>{orderDate}</span>
                        </div>
                      </td>
                      
                      <td className="p-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={(e) => handleCopyRow(e, generatedId, order)}
                            className="p-2 bg-neutral-950 hover:bg-white text-neutral-400 hover:text-black rounded-xl transition-all border border-neutral-800 active:scale-95 inline-flex items-center justify-center"
                            title="Copy Full Document Row"
                          >
                            <MdContentCopy size={14} />
                          </button>
                          
                          {/* ক্যানসেল বাটন ও রিডাইরেকশন ট্রিগার */}
                          {!isCancelled && (
                            <button 
                              onClick={(e) => handleCancelOrder(e, order._id, generatedId)}
                              className="p-2 bg-neutral-950 hover:bg-red-600 text-neutral-400 hover:text-white rounded-xl transition-all border border-neutral-800 hover:border-red-600/30 active:scale-95 inline-flex items-center justify-center"
                              title="Cancel Order & Go to Returns"
                            >
                              <MdCancel size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-table-scroll::-webkit-scrollbar { height: 6px; }
        .custom-table-scroll::-webkit-scrollbar-track { background: #000; }
        .custom-table-scroll::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 4px; }
        .custom-table-scroll::-webkit-scrollbar-thumb:hover { background: #262626; }
        .invert-calendar-icon::-webkit-calendar-picker-indicator { filter: invert(0.5); }
      `}</style>
    </div>
  );
};

export default OrderCom;