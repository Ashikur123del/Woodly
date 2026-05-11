"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { FaWhatsapp, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaBaby, FaRing } from 'react-icons/fa';

const UserListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('https://woodly-server-fayw.vercel.app/orders', {
        cache: 'no-store'
      });
      const data = await res.json();
      // ডাটা রিভার্স করা হয়েছে যাতে নতুন অর্ডার আগে দেখা যায়
      setOrders(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (loading) return <div className="text-white text-center p-10 text-xl font-bold animate-pulse">ডাটা লোড হচ্ছে...</div>;

  return (
    <div className="p-4 md:p-10 bg-[#0f172a] min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            অর্ডার ম্যানেজমেন্ট প্যানেল
          </h2>
          <div className="flex gap-4 items-center">
            <button onClick={loadOrders} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                রিফ্রেশ ডাটা
            </button>
            <div className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold">
              মোট অর্ডার: {orders.length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-700 shadow-2xl bg-[#1e293b]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#334155] text-gray-200 uppercase text-xs">
              <tr>
                <th className="p-4">কাস্টমার ও যোগাযোগ</th>
                <th className="p-4">কার্ডের তথ্য</th>
                <th className="p-4">পিতা/মাতার নাম</th>
                <th className="p-4">ডেলিভারি ঠিকানা</th>
                <th className="p-4">তারিখ ও টাইপ</th>
                <th className="p-4">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800 transition-all">
                    <td className="p-4">
                      <div className="font-bold text-white">{order.customerName}</div>
                      <div className="text-gray-400">{order.phone}</div>
                      {order.whatsapp && (
                        <div className="flex items-center gap-1 text-green-400 text-xs mt-1">
                          <FaWhatsapp /> {order.whatsapp}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      {order.orderType === "wedding" ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-pink-400 font-bold"><FaRing size={10}/> বর: {order.groomName}</div>
                          <div className="flex items-center gap-1 text-blue-400 font-bold"><FaRing size={10}/> কনে: {order.brideName}</div>
                        </div>
                      ) : (
                        <div className="text-yellow-500 font-bold flex items-center gap-1">
                          <FaBaby /> {order.babyName || "N/A"}
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-gray-300">
                      {order.orderType === "wedding" ? (
                        <>
                          <div className="text-[10px] text-gray-500">পিতার নাম</div>
                          <div className="text-xs">ব: {order.groomFather || "-"}</div>
                          <div className="text-xs">ক: {order.brideFather || "-"}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-xs">পিতা: {order.fatherName || "-"}</div>
                          <div className="text-xs">মাতা: {order.motherName || "-"}</div>
                        </>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-start gap-2 max-w-[180px]">
                        <FaMapMarkerAlt className="mt-1 text-red-400 shrink-0" />
                        <div>
                          <p className="text-white text-xs leading-tight">{order.deliveryAddress}</p>
                          <p className="text-gray-500 text-[10px]">{order.district}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2 text-yellow-500 text-xs mb-1">
                        <FaCalendarAlt size={10} /> {order.eventDate || order.birthDate || "N/A"}
                      </div>
                      <span className="px-2 py-0.5 bg-indigo-900 text-indigo-300 rounded text-[9px] font-bold uppercase">
                        {order.orderType}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] block text-center border ${
                        order.status === 'pending' ? 'bg-yellow-900/30 text-yellow-500 border-yellow-500/50' : 'bg-green-900/30 text-green-500 border-green-500/50'
                      }`}>
                        {order.status === 'pending' ? 'অপেক্ষমান' : 'সম্পন্ন'}
                      </span>
                      <div className="text-[10px] text-gray-500 text-center mt-1">৳{order.totalAmount}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="p-20 text-center text-gray-500">কোনো অর্ডার পাওয়া যায়নি।</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;