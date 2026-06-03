"use client";

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const PixelPage = () => {
  const [pixelId, setPixelId] = useState(""); 
  const [currentPixelId, setCurrentPixelId] = useState("Loading..."); 
  const [loading, setLoading] = useState(false);

  // 🎯 আপনার লাইভ Vercel ব্যাক-এন্ড ইউআরএল সেট করা হয়েছে
  const BACKEND_URL = "https://woodly-server-fayw.vercel.app/api/pixel-config"; 

  // ১. ব্যাক-এন্ড থেকে বর্তমান অ্যাক্টিভ পিক্সেল আইডি নিয়ে আসা
  const fetchPixelConfig = () => {
    fetch(BACKEND_URL, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) {
          console.warn(`⚠️ Server response warning: Status ${res.status}`);
          return { success: false, pixelId: null };
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.pixelId) {
          setCurrentPixelId(data.pixelId);
          
          import("react-facebook-pixel")
            .then((x) => x.default)
            .then((reactPixel) => {
              reactPixel.init(data.pixelId, null, { autoConfig: true, debug: false });
              reactPixel.pageView();
              console.log(`✅ Facebook Pixel (${data.pixelId}) Active on Dashboard!`);
            });
        } else {
          setCurrentPixelId("No Active Pixel Found");
        }
      })
      .catch((err) => {
        console.error("Network connection error:", err);
        setCurrentPixelId("Server Offline / Connecting...");
      });
  };

  useEffect(() => {
    fetchPixelConfig();
  }, []);

  // ২. ইনপুট ফিল্ড থেকে নতুন পিক্সেল আইডি ডাটাবেজে পাঠানো
  const handleUpdatePixel = (e) => {
    e.preventDefault();
    if (!pixelId.trim()) {
      toast.error("অনুগ্রহ করে একটি সঠিক পিক্সেল আইডি দিন!");
      return;
    }

    setLoading(true);
    const myToast = toast.loading("ডাটাবেজে সেভ হচ্ছে...");

    fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pixelId: pixelId.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server communication failed");
        return res.json();
      })
      .then((data) => {
        if (data && data.success) {
          toast.success("🎉 Pixel ID সফলভাবে MongoDB-তে আপডেট হয়েছে!", { id: myToast });
          setPixelId("");
          fetchPixelConfig(); 
        } else {
          toast.error("আইডি আপডেট করা যায়নি।", { id: myToast });
        }
      })
      .catch((err) => {
        console.error("Post error:", err);
        toast.error("❌ সার্ভার অফলাইন অথবা কানেকশন এরর!", { id: myToast });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-6 text-white">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-2xl border border-slate-700">
        <h1 className="text-2xl font-bold text-emerald-400 mb-2 text-center">🎯 Pixel Dashboard</h1>
        <p className="text-slate-400 text-sm text-center mb-6">Manage and initialize your Facebook Pixel dynamically</p>

        {/* বর্তমানে অ্যাক্টিভ পিক্সেল আইডি বক্স */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
          <span className="text-xs text-slate-400 block mb-1 font-medium uppercase tracking-wider">Active Pixel ID:</span>
          <span className="text-lg font-mono text-emerald-300 font-bold">
            {currentPixelId}
          </span>
        </div>

        {/* আপডেট করার ফর্ম */}
        <form onSubmit={handleUpdatePixel} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 uppercase tracking-wide">
              Add New Pixel ID
            </label>
            <input
              type="text"
              placeholder="e.g. 2036082460278696"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-white transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl transition-all shadow-lg"
          >
            {loading ? "Updating..." : "Save & Initialize Pixel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PixelPage;