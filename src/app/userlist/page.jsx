"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { FaWhatsapp, FaMapMarkerAlt, FaCalendarAlt, FaBaby, FaRing } from 'react-icons/fa';

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
      // ডাটা রিভার্স করা হয়েছে যাতে নতুন অর্ডার আগে আসে
      setOrders(Array.isArray(data) ? [...data].reverse() : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (loading) return <div className="text-white text-center p-10 font-bold animate-pulse">ডাটা লোড হচ্ছে...</div>;

  return (
    <div className="p-4 md:p-10 bg-[#0f172a] min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-orange-500">অর্ডার লিস্ট</h2>
          <div className="flex gap-4">
            <button onClick={loadOrders} className="bg-orange-500 px-4 py-2 rounded-lg text-sm">রিফ্রেশ</button>
            <div className="bg-blue-600 px-4 py-2 rounded-lg text-sm">মোট: {orders.length}</div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-700 bg-[#1e293b]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#334155] text-gray-200 uppercase text-xs">
              <tr>
                <th className="p-4">কাস্টমার</th>
                <th className="p-4">কার্ডের তথ্য</th>
                <th className="p-4">ঠিকানা</th>
                <th className="p-4">তারিখ</th>
                <th className="p-4">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-800">
                  <td className="p-4">
                    <div className="font-bold">{order.customerName}</div>
                    <div className="text-gray-400 text-xs">{order.phone}</div>
                  </td>
                  <td className="p-4">
                    {order.orderType === "wedding" ? (
                      <span className="text-pink-400 flex items-center gap-1"><FaRing/> {order.groomName} + {order.brideName}</span>
                    ) : (
                      <span className="text-blue-400 flex items-center gap-1"><FaBaby/> {order.babyName}</span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-gray-300">{order.deliveryAddress}</td>
                  <td className="p-4 text-yellow-500 text-xs">
                    <FaCalendarAlt className="inline mr-1"/> {order.eventDate || order.birthDate || "N/A"}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] ${order.status === 'pending' ? 'bg-yellow-900 text-yellow-500' : 'bg-green-900 text-green-500'}`}>
                      {order.status === 'pending' ? 'অপেক্ষমান' : 'সম্পন্ন'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;