"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaWhatsapp, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaBaby, 
  FaRing, 
  FaPray, 
  FaSync, 
  FaPhoneAlt, 
  FaUser, 
  FaEnvelope,
  FaInfoCircle
} from 'react-icons/fa';

const UserListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('https://woodly-server-fayw.vercel.app/orders', { cache: 'no-store' });
      const data = await res.json();
      setOrders(Array.isArray(data) ? [...data].reverse() : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">
      <div className="text-xl font-bold text-orange-500 animate-bounce">ডেটা লোড হচ্ছে...</div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 bg-[#0f172a] min-h-screen text-white font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div>
            <h2 className="text-3xl font-black text-white">অর্ডার <span className="text-orange-500">লিস্ট</span></h2>
            <p className="text-gray-400 mt-1 text-base">মোট অর্ডারের সংখ্যা: {orders.length} টি</p>
          </div>
          <button 
            onClick={loadOrders} 
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            <FaSync className={loading ? "animate-spin" : ""} /> রিফ্রেশ করুন
          </button>
        </div>

        {/* List Section */}
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-[#1e293b] border border-gray-700 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all shadow-md">
              
              {/* Card Header */}
              <div className="flex justify-between items-center px-6 py-4 bg-[#263349] border-b border-gray-700">
                <div className="flex items-center gap-3">
                  {order.orderType === "wedding" && <span className="flex items-center gap-2 bg-pink-500/20 text-pink-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase"><FaRing/> Wedding</span>}
                  {order.orderType === "birth" && <span className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase"><FaBaby/> Birth</span>}
                  {order.orderType === "death" && <span className="flex items-center gap-2 bg-yellow-500/20 text-yellow-500 px-4 py-1.5 rounded-full text-sm font-bold uppercase"><FaPray/> Death</span>}
                  <span className="text-gray-400 text-sm font-mono">ID: {order._id}</span>
                </div>
                <div className={`px-4 py-1 rounded-lg text-sm font-bold ${order.status === 'pending' ? 'bg-orange-900/40 text-orange-400' : 'bg-green-900/40 text-green-400'}`}>
                  {order.status === 'pending' ? 'অপেক্ষমান' : 'সম্পন্ন'}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
                
                {/* 1. কাস্টমার ইনফো - এখানে কোন তথ্য বাদ যাবে না */}
                <div className="space-y-4">
                  <h4 className="text-orange-500 font-bold uppercase text-xs tracking-widest border-b border-gray-700 pb-2 flex items-center gap-2">
                    <FaUser/> Customer Info
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xl font-black text-white leading-none">{order.customerName}</div>
                      <div className="text-gray-400 mt-2 flex items-center gap-2 text-lg font-semibold tracking-wide">
                        <FaPhoneAlt className="text-orange-500" size={14}/> {order.phone}
                      </div>
                      <div className="text-green-500 mt-1 flex items-center gap-2 text-base">
                        <FaWhatsapp size={16}/> {order.whatsapp || "N/A"}
                      </div>
                      <div className="text-blue-400 mt-1 flex items-center gap-2 text-sm italic">
                        <FaEnvelope size={14}/> {order.email || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. কার্ডের বিস্তারিত ডেটা (Type specific fields) */}
                <div className="space-y-4 bg-gray-800/30 p-4 rounded-xl border border-white/5">
                  <h4 className="text-orange-500 font-bold uppercase text-xs tracking-widest border-b border-gray-700 pb-2 flex items-center gap-2">
                    <FaInfoCircle/> Card Details
                  </h4>
                  
                  {/* Wedding All Data */}
                  {order.orderType === "wedding" && (
                    <div className="space-y-2">
                      <div className="text-white font-bold text-lg underline decoration-pink-500/30">
                        {order.groomName} <span className="text-pink-500 text-xs">Weds</span> {order.brideName}
                      </div>
                      <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                        <p>বরের পিতা: <span className="text-white font-medium">{order.groomFather}</span></p>
                        <p>বরের মাতা: <span className="text-white font-medium">{order.groomMother}</span></p>
                        <div className="h-[1px] bg-gray-700 my-1"></div>
                        <p>কনের পিতা: <span className="text-white font-medium">{order.brideFather}</span></p>
                        <p>কনের মাতা: <span className="text-white font-medium">{order.brideMother}</span></p>
                      </div>
                    </div>
                  )}

                  {/* Birth All Data */}
                  {order.orderType === "birth" && (
                    <div className="space-y-2">
                      <div className="text-white font-bold text-lg underline decoration-blue-500/30">
                        শিশুর নাম: {order.babyName}
                      </div>
                      <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                        <p>পিতার নাম: <span className="text-white font-medium">{order.fatherName}</span></p>
                        <p>মাতার নাম: <span className="text-white font-medium">{order.motherName}</span></p>
                      </div>
                    </div>
                  )}

                  {/* Death All Data */}
                  {order.orderType === "death" && (
                    <div className="space-y-2">
                      <div className="text-white font-bold text-lg underline decoration-yellow-500/30">
                        মৃত ব্যক্তি: {order.deceasedName}
                      </div>
                      <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                        <p>পিতা/স্বামী: <span className="text-white font-medium">{order.fatherOrHusbandName}</span></p>
                      </div>
                    </div>
                  )}

                  {/* Special Message (Always visible if exists) */}
                  {order.specialMessage && (
                    <div className="mt-4 p-3 bg-black/40 border-l-4 border-orange-500 rounded text-sm italic text-gray-300">
                      " {order.specialMessage} "
                    </div>
                  )}
                </div>

                {/* 3. ডেলিভারি ও তারিখ */}
                <div className="space-y-4">
                  <h4 className="text-orange-500 font-bold uppercase text-xs tracking-widest border-b border-gray-700 pb-2">Delivery & Date</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-yellow-500 font-black text-xl">
                      <FaCalendarAlt size={18}/> 
                      {order.eventDate || order.birthDate || order.deathDate || "No Date"}
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-white font-bold text-lg">{order.district}</div>
                        <div className="text-gray-400 text-sm leading-relaxed">{order.deliveryAddress}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="bg-gray-700 px-3 py-1 rounded text-[12px] font-bold text-gray-300 border border-gray-600">
                        Type: {order.deliveryType}
                      </span>
                      <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-[12px] font-bold border border-blue-500/30">
                        Receiver: {order.receiverName || "Self"}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                      <span className="text-gray-400 font-bold">Total Bill:</span>
                      <span className="text-2xl font-black text-white">৳{order.totalAmount || "999"}.00</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserListPage;