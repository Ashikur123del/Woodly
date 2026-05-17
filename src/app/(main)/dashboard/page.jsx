"use client";
import React, { useState, useEffect, useCallback } from "react";
import { MdSearch, MdSync, MdAdd, MdContentCopy } from "react-icons/md"; 
import toast, { Toaster } from "react-hot-toast"; // react-hot-toast ইমপোর্ট করা হয়েছে

export default function DashboardPage() {
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

 
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
  }, [loadOrders]);

 
  useEffect(() => {
    let result = [...orders];

    if (activeTab !== "All") {
      if (activeTab === "NEW") {
        result = result.filter(o => o.status?.toLowerCase() === "pending" || o.orderStatus?.toLowerCase() === "pending");
      } else if (activeTab === "COMPLETED") {
        result = result.filter(o => o.status?.toLowerCase() === "completed" || o.orderStatus?.toLowerCase() === "confirmed");
      } else if (activeTab === "CANCELLED") {
        result = result.filter(o => o.status?.toLowerCase() === "cancelled");
      } else {
        result = result.filter(o => o.status?.toUpperCase() === activeTab || o.orderStatus?.toUpperCase() === activeTab);
      }
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.customerName?.toLowerCase().includes(query) || 
        o.phone?.includes(query) ||
        o._id?.includes(query)
      );
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredOrders(result);
  }, [activeTab, searchQuery, orders]);


  const getTabCount = (tabName) => {
    if (tabName === "All") return orders.length;
    if (tabName === "NEW") return orders.filter(o => o.status?.toLowerCase() === "pending" || o.orderStatus?.toLowerCase() === "pending").length;
    if (tabName === "COMPLETED") return orders.filter(o => o.status?.toLowerCase() === "completed" || o.orderStatus?.toLowerCase() === "confirmed").length;
    if (tabName === "CANCELLED") return orders.filter(o => o.status?.toLowerCase() === "cancelled").length;
    return orders.filter(o => o.status?.toUpperCase() === tabName || o.orderStatus?.toUpperCase() === tabName).length;
  };

  const handleCopyRow = (generatedId, order) => {
    const textToCopy = `Order ID: ${generatedId}\nCustomer: ${order.customerName || "No Name"}\nPhone: ${order.phone || "N/A"}\nAmount: ৳${order.totalAmount || "0"}.00`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast.success("অর্ডার কপি হয়ে গেছে!", {
          style: {
            border: "1px solid #1e293b",
            padding: "12px",
            color: "#fff",
            background: "green",
          },
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#fff",
          },
        });
      })
      .catch((err) => {
        toast.error("Failed to copy!");
        console.error("Failed to copy text: ", err);
      });
  };

  if (loading) return <div className="text-center py-20 text-blue-500 font-bold animate-pulse">লোড হচ্ছে...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-white tracking-tight">Dashboard</h2>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Total Due</span>
          <span className="text-sm font-bold text-slate-300">USD 0.00</span>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-slate-800/60 overflow-x-auto pb-1 custom-scrollbar-h">
        {statuses.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-xs font-bold whitespace-nowrap rounded-t-lg transition-all border-b-2 -mb-[1px] ${
              activeTab === tab 
                ? "text-blue-500 border-blue-500 bg-blue-500/5 font-black" 
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            {tab === "NEW" ? "NEW" : tab} ({getTabCount(tab)})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-5 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-500"><MdSearch size={18} /></span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Orders..." 
            className="w-full h-10 bg-[#071322] border border-slate-500 rounded-xl pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500/40 placeholder-slate-600"
          />
        </div>
        <div className="lg:col-span-4 flex items-center bg-[#071322] border border-slate-500 rounded-xl px-3 h-10">
          <input type="text" placeholder="Start Date — End Date" className="bg-transparent text-xs text-slate-200 outline-none w-full cursor-not-allowed" />
        </div>
        <div className="lg:col-span-3 flex gap-2">
          <button onClick={loadOrders} className="flex-1 bg-[#071322] border border-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 h-10 hover:bg-slate-800/50 transition-colors">
            <MdSync size={16} /> Sync
          </button>
          <button className="flex-1 bg-blue-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 h-10 hover:bg-blue-700 transition-colors whitespace-nowrap">
            <MdAdd size={16} /> Add Order
          </button>
        </div>
      </div>

  
      <div className="bg-[#071322] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar-h">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/30 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                <th className="p-4 w-12"><input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0 cursor-pointer" /></th>
                <th className="p-4">ORDER ID</th>
                <th className="p-4">CUSTOMER</th>
                <th className="p-4">PHONE</th>
                <th className="p-4">PRICE</th>
                <th className="p-4 text-center">METHOD</th>
                <th className="p-4 text-center">STATUS</th>
                <th className="p-4 text-right">DATE</th>
                <th className="p-4 text-center">ACTION</th> 
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-10 text-center text-slate-500 font-bold">
                    No orders found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, i) => {

                  const generatedId = order._id ? `ORD-202605${order._id.slice(-6).toUpperCase()}` : `ORD-2026051200${i}`;
                
                  const orderDate = order.eventDate 
                    ? new Date(order.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ", 1:24 pm"
                    : "May 12, 2026, 1:24 pm";

                  return (
                    <tr key={order._id || i} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="p-4">
                        <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0 cursor-pointer" />
                      </td>
                      <td className="p-4 font-mono text-xs font-semibold text-blue-400 group-hover:underline cursor-pointer">
                        {generatedId}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 uppercase">
                            {order.customerName ? order.customerName[0] : "C"}
                          </div>
                          <span className="text-slate-300 font-medium">{order.customerName || "No Name"}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap text-xs font-mono text-slate-400">{order.phone || "N/A"}</td>
                      <td className="p-4 font-bold text-slate-300 font-mono whitespace-nowrap">৳{order.totalAmount || "0"}.00</td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 text-[10px] font-extrabold rounded">
                          {order.deliveryType === "Point" ? "COD" : "COD"}
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60 text-[11px] font-medium">
                          Mail Sent
                        </span>
                      </td>
                      <td className="p-4 text-right text-sm text-white whitespace-nowrap">{orderDate}</td>
                      
                      {/* কপি বাটন অ্যাকশন কলাম */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <button 
                          onClick={() => handleCopyRow(generatedId, order)}
                          className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700/60"
                          title="Copy Row Data"
                        >
                          Copy
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
}