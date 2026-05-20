"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdClose } from "react-icons/md";
import { FiBox, FiShoppingCart, FiCornerUpLeft, FiMessageSquare, FiPlusCircle, FiLogOut } from "react-icons/fi";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, totalOrders }) => {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const getLinkClass = (path) => `
    flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
    ${isActive(path)
      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold"
      : "text-slate-400 border border-transparent hover:text-white hover:bg-slate-800/40"
    }
  `;

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen w-64 bg-[#071322] border-r border-slate-800/80 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out flex-shrink-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:sticky md:z-30`} 
    >
      <div>
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center font-black text-white text-xs shadow-md">B</div>
            <span className="text-base font-black text-white tracking-tight">Woodly</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="text-slate-500 hover:text-white md:hidden block p-1 rounded-lg hover:bg-slate-800/50 transition-colors"
            aria-label="Close Sidebar"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
          <Link 
            href="/dashboard" 
            onClick={handleLinkClick}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive("/dashboard") 
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold" 
                : "text-slate-400 border border-transparent hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <MdDashboard size={18} /> Dashboard
          </Link>

          <div>
            <nav className="space-y-1">
              <Link href="/dashboard" onClick={handleLinkClick} className={getLinkClass("/dashboard/products")}>
                <div className="flex items-center gap-3"><FiBox size={16} /> Product</div>
              </Link>
              <Link href="/dashboard/service" onClick={handleLinkClick} className={getLinkClass("/dashboard/products")}>
                <div className="flex items-center gap-3"><FiBox size={16} />Service</div>
              </Link>
              
              <Link href="/dashboard/order" onClick={handleLinkClick} className={getLinkClass("/dashboard/order")}>
                <div className="flex items-center gap-3"><FiShoppingCart size={16} /> Order</div>
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">{totalOrders}</span>
              </Link>

              <Link href="/dashboard/returns" onClick={handleLinkClick} className={getLinkClass("/dashboard/returns")}>
                <div className="flex items-center gap-3"><FiCornerUpLeft size={16} /> Return Order</div>
              </Link>

              <Link href="/dashboard" onClick={handleLinkClick} className={getLinkClass("/dashboard/reviews")}>
                <div className="flex items-center gap-3"><FiMessageSquare size={16} /> Review</div>
              </Link>

              <Link href="/dashboard//order-create" onClick={handleLinkClick} className={getLinkClass("/dashboard/order-create")}>
                <div className="flex items-center gap-3"><FiPlusCircle size={16} /> Create Order</div>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800/60 flex items-center justify-between bg-slate-900/20 flex-shrink-0">
        <span className="text-xs text-slate-400 truncate max-w-[170px]" title="bayplegen999@gmail.com">
          bayplegen999@gmail.com
        </span>
        <button className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors">
          <FiLogOut size={15} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 