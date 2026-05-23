"use client";

import React, { useState, useEffect } from 'react';
import { Avatar, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spinner } from '@heroui/react';
import Link from 'next/link';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { FiCalendar, FiShoppingBag, FiEye, FiHome, FiUsers, FiTruck, FiCheckCircle, FiXCircle, FiCornerUpLeft } from 'react-icons/fi';

const DesboardComp = () => {
  const [orders, setOrders] = useState([]);
  const [totalViews, setTotalViews] = useState(0); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, viewsRes] = await Promise.all([
          fetch("https://woodly-server-fayw.vercel.app/orders", { cache: "no-store" }),
          fetch("https://woodly-server-fayw.vercel.app/views", { cache: "no-store" })
        ]);

        if (!ordersRes.ok) throw new Error("Failed to fetch orders data");

        const ordersData = await ordersRes.json();
        setOrders(ordersData);

        if (viewsRes.ok) {
          const viewsData = await viewsRes.json();
          setTotalViews(viewsData.count || 0);
        } else {
          console.error("Backend views route returned an error:", viewsRes.status);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020a17] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" className="text-blue-500" />
        <p className="text-xs text-slate-500 tracking-widest font-mono uppercase animate-pulse">
          Loading Dashboard Data...
        </p>
      </div>
    );
  }

  const offset = new Date().getTimezoneOffset() * 60000;
  const localISOTime = new Date(Date.now() - offset).toISOString();
  const todayStr = localISOTime.split('T')[0]; 

  const totalOrdersCount = orders.length;

  const totalSalesAmount = orders.reduce((sum, order) => {
    const status = (order.status || "").toLowerCase().trim();
    if (status !== 'cancelled' && status !== 'returned' && status !== 'fail') {
      return sum + (Number(order.totalAmount) || 0);
    }
    return sum;
  }, 0);

  const todayOrders = orders.filter(order => {
    try {
      const rawTargetDate = order.orderDate || order.createdAt || order.eventDate || "";
      let targetDate = rawTargetDate.includes('T') ? rawTargetDate.split('T')[0] : rawTargetDate;
      targetDate = targetDate.trim();

      if (targetDate === todayStr) return true;

      if (order._id && order._id.length === 24) {
        const timestamp = parseInt(order._id.substring(0, 8), 16) * 1000;
        const orderCreatedDate = new Date(timestamp);
        const localOrderTime = new Date(orderCreatedDate.getTime() - offset).toISOString();
        const orderDateStr = localOrderTime.split('T')[0];
        return orderDateStr === todayStr;
      }
      return false;
    } catch (e) {
      return false;
    }
  });

  const todayOrdersCount = todayOrders.length;

  const todaySales = todayOrders.reduce((sum, order) => {
    const status = (order.status || "").toLowerCase().trim();
    if (status !== 'cancelled' && status !== 'returned' && status !== 'fail') {
      return sum + (Number(order.totalAmount) || 0);
    }
    return sum;
  }, 0);

  const newOrdersCount = orders.filter(order => {
    const status = (order.status || "").toLowerCase().trim();
    return status === 'pending' || status === 'processing' || status === '';
  }).length;

  const followupSales = orders.reduce((sum, order) => {
    const status = (order.status || "").toLowerCase().trim();
    if (status === 'pending' || status === 'followup' || status === 'processing' || status === '') {
      return sum + (Number(order.totalAmount) || 0);
    }
    return sum;
  }, 0);

  const shippedSales = orders.reduce((sum, order) => {
    const status = (order.status || "").toLowerCase().trim();
    if (status === 'confirmed' || status === 'shipped') {
      return sum + (Number(order.totalAmount) || 0);
    }
    return sum;
  }, 0);

  const deliveredCount = orders.filter(order => (order.status || "").toLowerCase().trim() === 'delivered').length;

  const cancelledSales = orders.reduce((sum, order) => {
    const status = (order.status || "").toLowerCase().trim();
    if (status === 'cancelled') {
      return sum + (Number(order.totalAmount) || 0);
    }
    return sum;
  }, 0);

  const returnedSales = orders.reduce((sum, order) => {
    const status = (order.status || "").toLowerCase().trim();
    if (status === 'returned' || status === 'fail') {
      return sum + (Number(order.totalAmount) || 0);
    }
    return sum;
  }, 0);

  const overviewStats = [
    {
      id: 1,
      label: "Total Orders",
      count: totalOrdersCount.toString(),
      icon: <FiShoppingBag size={20} />,
      iconBg: "bg-blue-600 shadow-xl shadow-blue-600/30",
      waveColor: "#2563eb",
      gradId: "blueGrad",
      path: "M0,90 C150,130 350,50 500,100 L500,150 L0,150 Z",
      strokePath: "M0,90 C150,130 350,50 500,100"
    },
    {
      id: 2,
      label: "Total Sales",
      count: `৳${totalSalesAmount.toLocaleString()}`,
      icon: <span className="text-xl font-bold">৳</span>,
      iconBg: "bg-emerald-500 shadow-xl shadow-emerald-500/30",
      textColor: "text-emerald-400",
      waveColor: "#10b981",
      gradId: "greenGrad",
      path: "M0,110 C120,60 280,140 500,70 L500,150 L0,150 Z",
      strokePath: "M0,110 C120,60 280,140 500,70"
    },
    {
      id: 3,
      label: "Total Views",
      count: totalViews.toLocaleString(),
      icon: <FiEye size={20} />,
      iconBg: "bg-purple-600 shadow-xl shadow-purple-600/30",
      textColor: "text-purple-400",
      waveColor: "#8b5cf6",
      gradId: "purpleGrad",
      path: "M0,70 C150,120 300,60 500,110 L500,150 L0,150 Z",
      strokePath: "M0,70 C150,120 300,60 500,110"
    }
  ];

  const operationalStats = [
    { id: 1, label: "Today's Sales", value: `৳${todaySales.toLocaleString()}`, icon: <FiHome size={22} className="text-blue-400" /> },
    { id: 2, label: "Followup", value: `৳${followupSales.toLocaleString()}`, icon: <FiUsers size={22} className="text-cyan-400" /> },
    { id: 3, label: "Confirm + Shipped", value: `৳${shippedSales.toLocaleString()}`, icon: <FiTruck size={22} className="text-sky-400" /> },
    { id: 4, label: "Delivered (Count)", value: deliveredCount.toString(), icon: <FiCheckCircle size={22} className="text-emerald-400" /> },
    { id: 5, label: "Cancelled", value: `৳${cancelledSales.toLocaleString()}`, icon: <FiXCircle size={22} className="text-rose-500" /> },
    { id: 6, label: "Returned + Fail", value: `৳${returnedSales.toLocaleString()}`, icon: <FiCornerUpLeft size={22} className="text-amber-400" /> },
  ];

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#06142c] via-[#020a17] to-[#01050e] text-slate-100 p-4 md:p-8 font-sans antialiased selection:bg-blue-600 relative overflow-hidden">
      
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-[300px] h-[250px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-6 border-b border-slate-900/60 relative z-10">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1.5">Dashboard</h2>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <Link href="/dashboard" className="text-blue-500 hover:text-blue-400 font-medium transition-colors hover:underline">Home</Link>
            <span className="text-slate-700">/</span>
            <span className="text-slate-400 font-medium">Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <Dropdown backdrop="blur">
            <DropdownTrigger>
              <div className="relative p-3 bg-[#081730]/80 backdrop-blur-md rounded-xl border border-slate-800 shadow-lg cursor-pointer hover:bg-slate-900 hover:border-slate-700 transition-all duration-200">
                <IoMdNotificationsOutline className="text-cyan-400" size={22} />
                <Badge color="danger" size="sm" className="absolute -top-1 -right-1">{orders.length}</Badge>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Notifications">
              <DropdownItem key="sync">System Live Synchronized</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <div className="bg-[#081730]/70 backdrop-blur-md border border-slate-800/90 p-2.5 px-5 rounded-xl flex items-center gap-3 shadow-lg select-none">
            <div className="text-left">
              <p className="text-xs font-black text-slate-200 tracking-wide font-mono uppercase">{formattedDate}</p>
              <p className="text-[11px] text-slate-500 font-bold tracking-wider uppercase mt-0.5">{formattedDay}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <h3 className="text-base font-bold tracking-widest text-slate-400 mb-5 uppercase border-l-4 border-blue-500 pl-3">
          Sales & Views
        </h3>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="bg-[#081730]/40 backdrop-blur-md p-6 rounded-xl border border-slate-800/80 shadow-xl flex items-center justify-between relative overflow-hidden min-h-[115px] group hover:border-slate-700 transition-all">
            <div className="space-y-2 z-10">
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Today</span>
                <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded border border-blue-500/10 font-mono">
                  {todayStr}
                </span>
              </div>
              <p className="text-3xl font-black text-white tracking-tight font-mono">{todayOrdersCount}</p>
            </div>
            <div className="p-3.5 bg-blue-600/10 text-blue-400 rounded-xl z-10 border border-blue-500/10 shadow-inner">
              <FiCalendar size={22} />
            </div>
          </div>

          <div className="bg-[#081730]/40 backdrop-blur-md p-6 rounded-xl border border-slate-800/80 shadow-xl flex items-center justify-between relative overflow-hidden min-h-[115px] group hover:border-slate-700 transition-all">
            <div className="space-y-2 z-10">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">New Orders</p>
              <p className="text-3xl font-black text-white tracking-tight font-mono">{newOrdersCount}</p>
            </div>
            <div className="p-3.5 bg-blue-600/10 text-blue-400 rounded-xl z-10 border border-blue-500/10 shadow-inner">
              <FiShoppingBag size={22} />
            </div>
          </div>

          {overviewStats.map((stat) => (
            <div key={stat.id} className="bg-[#081730]/40 backdrop-blur-md p-6 rounded-xl border border-slate-800/80 shadow-xl flex flex-row items-center justify-between min-h-[115px] relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
              <div className="flex items-center gap-4 z-10">
                <div className={`p-3.5 text-white rounded-xl ${stat.iconBg}`}>{stat.icon}</div>
                <div className="space-y-0.5">
                  <p className={`text-2xl font-black font-mono tracking-tight ${stat.textColor || 'text-white'}`}>{stat.count}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full leading-[0] opacity-30 group-hover:opacity-60 transition-all duration-500">
                <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-12 transform scale-y-105 origin-bottom">
                  <path d={stat.path} fill={`url(#${stat.gradId})`} />
                  <path d={stat.strokePath} fill="none" stroke={stat.waveColor} strokeWidth="2.5" />
                  <defs>
                    <linearGradient id={stat.gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={stat.waveColor} stopOpacity="0.2"/>
                      <stop offset="100%" stopColor={stat.waveColor} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mt-8 relative z-10">
        {operationalStats.map((item) => (
          <div 
            key={item.id} 
            className="bg-[#081730]/30 backdrop-blur-md p-5 rounded-xl border border-blue-500/20 shadow-xl text-center flex flex-col items-center justify-center gap-3 min-h-[135px] hover:scale-[1.03] hover:border-blue-500/50 hover:bg-[#081730]/60 transition-all duration-300 cursor-pointer group"
          >
            <div className="p-2.5 bg-slate-950/40 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-slate-800/50">
              {item.icon}
            </div>
            <div className="space-y-0.5">
              <p className="text-lg font-black text-white font-mono tracking-tight">{item.value}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DesboardComp;