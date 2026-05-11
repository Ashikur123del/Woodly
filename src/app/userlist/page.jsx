"use client";
import React, { useEffect, useState } from 'react';
import { FaWhatsapp, FaTruck, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const UserListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://woodly-server-fayw-7uw9xbwfe-ashiks-projects-65b0ba35.vercel.app/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white text-center p-10 text-xl font-bold animate-pulse">ডাটা লোড হচ্ছে...</div>;

  return (
    <div className="p-4 md:p-10 bg-[#0f172a] min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            অর্ডার ম্যানেজমেন্ট প্যানেল
          </h2>
          <div className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold">
            মোট অর্ডার: {orders.length}
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-2xl border border-gray-700 shadow-2xl bg-[#1e293b]">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#334155] text-gray-200 uppercase text-xs">
              <tr>
                <th className="p-4">কাস্টমার ও যোগাযোগ</th>
                <th className="p-4">কার্ডের তথ্য (বর ও কনে)</th>
                <th className="p-4">পিতার নাম</th>
                <th className="p-4">ডেলিভারি ঠিকানা</th>
                <th className="p-4">তারিখ ও টাইপ</th>
                <th className="p-4">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800 transition-all group">
                    {/* কাস্টমার ও যোগাযোগ */}
                    <td className="p-4">
                      <div className="font-bold text-lg text-white">{order.customerName}</div>
                      <div className="text-gray-400">{order.phone}</div>
                      {order.whatsapp && (
                        <div className="flex items-center gap-1 text-green-400 text-xs mt-1">
                          <FaWhatsapp /> {order.whatsapp}
                        </div>
                      )}
                    </td>

                    {/* বর ও কনে */}
                    <td className="p-4">
                      {order.orderType === "wedding" ? (
                        <div className="space-y-1">
                          <div className="text-pink-400 font-bold">বর: {order.groomName}</div>
                          <div className="text-blue-400 font-bold">কনে: {order.brideName}</div>
                        </div>
                      ) : (
                        <div className="text-yellow-500">{order.babyName || "N/A"}</div>
                      )}
                    </td>

                    {/* পিতার নাম */}
                    <td className="p-4 text-gray-300">
                      <div className="text-xs uppercase text-gray-500 mb-1">পিতার নাম</div>
                      <div>ব: {order.groomFather || "-"}</div>
                      <div>ক: {order.brideFather || "-"}</div>
                    </td>

                    {/* ডেলিভারি ঠিকানা */}
                    <td className="p-4">
                      <div className="flex items-start gap-2 max-w-[200px]">
                        <FaMapMarkerAlt className="mt-1 text-red-400 shrink-0" />
                        <div>
                          <p className="text-white leading-tight">{order.deliveryAddress}</p>
                          <p className="text-gray-400 text-xs">{order.district}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-[10px] bg-slate-700 w-fit px-2 py-1 rounded">
                        <FaTruck /> {order.deliveryType}
                      </div>
                    </td>

                    {/* তারিখ ও টাইপ */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-yellow-500 font-medium mb-1">
                        <FaCalendarAlt size={12} /> {order.eventDate}
                      </div>
                      <span className="px-2 py-0.5 bg-indigo-900 text-indigo-300 rounded text-[10px] font-bold uppercase">
                        {order.orderType}
                      </span>
                    </td>

                    {/* স্ট্যাটাস */}
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-[11px] text-center font-bold border ${
                          order.status === 'pending' 
                            ? 'bg-yellow-900/30 text-yellow-500 border-yellow-500/50' 
                            : 'bg-green-900/30 text-green-500 border-green-500/50'
                        }`}>
                          {order.status === 'pending' ? 'অপেক্ষমান' : 'সম্পন্ন'}
                        </span>
                        <div className="text-[10px] text-gray-500 text-center">
                          ৳{order.totalAmount}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center text-gray-500 text-lg">
                    কোনো অর্ডার পাওয়া যায়নি। ডাটাবেস চেক করুন।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;