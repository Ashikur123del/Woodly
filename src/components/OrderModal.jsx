"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Form,
  Input,
  Label,
  TextField,
  TextArea,
} from "@heroui/react";
import {
  FaRing,
  FaBaby,
  FaPray,
  FaTimes,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const OrderModal = ({ isOpen, onClose, selectedType }) => {
  const [loading, setLoading] = useState(false);

  const districts = [
    "ঢাকা", "চট্টগ্রাম", "কুমিল্লা", "ফেনী", "ব্রাহ্মণবাড়িয়া", "রাঙ্গামাটি", "নোয়াখালী", "চাঁদপুর", "লক্ষ্মীপুর", 
    "কক্সবাজার", "খাগড়াছড়ি", "বান্দরবান", "সিরাজগঞ্জ", "পাবনা", "বগুড়া", "রাজশাহী", "নাটোর", "জয়পুরহাট", 
    "চাঁপাইনবাবগঞ্জ", "নওগাঁ", "যশোর", "সাতক্ষীরা", "মেহেরপুর", "নড়াইল", "চুয়াডাঙ্গা", "কুষ্টিয়া", "মাগুরা", 
    "খুলনা", "বাগেরহাট", "ঝিনাইদহ", "ঝালকাঠি", "পটুয়াখালী", "পিরোজপুর", "বরিশাল", "ভোলা", "বরগুনা", "সিলেট", 
    "মৌলভীবাজার", "হবিগঞ্জ", "সুনামগঞ্জ", "নরসিংদী", "গাজীপুর", "শরীয়তপুর", "নারায়ণগঞ্জ", "টাঙ্গাইল", 
    "কিশোরগঞ্জ", "মানিকগঞ্জ", "মুন্সিগঞ্জ", "রাজবাড়ী", "মাদারীপুর", "গোপালগঞ্জ", "ফরিদপুর", "পঞ্চগড়", 
    "দিনাজপুর", "লালমনিরহাট", "নীলফামারী", "গাইবান্ধা", "ঠাকুরগাঁও", "রংপুর", "কুড়িগ্রাম", "শেরপুর", 
    "ময়মনসিংহ", "জামালপুর", "নেত্রকোণা"
  ];

  const inputStyles = {
    input: "text-slate-900 placeholder:text-slate-400 text-md",
    inputWrapper: [
      "bg-slate-50",
      "border-1 border-slate-200",
      "h-12",
      "group-data-[focus=true]:border-[#FFDE42]",
      "group-data-[focus=true]:bg-white",
      "shadow-sm",
      "rounded-xl"
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`https://woodly-server-fayw.vercel.app/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...data, 
          orderType: selectedType, 
          status: 'pending',
          totalAmount: 999 
        }),
      });

      if (response.ok) {
        toast.success("অর্ডারটি সফলভাবে জমা হয়েছে!");
        setTimeout(() => { onClose(); window.location.reload(); }, 1500);
      }
    } catch (error) {
      toast.error("সার্ভার কানেক্ট হতে পারছে না।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 md:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-800/30">
                <div className="flex items-center gap-3 text-[#FFDE42] text-lg md:text-xl font-black">
                  <span className="p-2 bg-yellow-500/10 rounded-lg">
                    {selectedType === "wedding" && <FaRing />}
                    {selectedType === "birth" && <FaBaby />}
                    {selectedType === "death" && <FaPray />}
                  </span>
                  <span>{selectedType === "wedding" ? "বিবাহ" : selectedType === "birth" ? "জন্মদিন/আকিকা" : "স্মরণিকা"} অর্ডার</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
                  <FaTimes size={20} />
                </button>
              </div>

              <Form onSubmit={handleSubmit} className="overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                
                {/* ১. কাস্টমার ইনফো */}
                <div className="space-y-4">
                  <h4 className="text-[#FFDE42] text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">যোগাযোগের তথ্য</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField isRequired name="customerName"><Label className="text-slate-300 text-xs mb-1">আপনার নাম</Label><Input placeholder="পূর্ণ নাম" variant="bordered" classNames={inputStyles} /></TextField>
                    <TextField isRequired name="phone"><Label className="text-slate-300 text-xs mb-1">মোবাইল নাম্বার</Label><Input placeholder="01XXXXXXXXX" variant="bordered" classNames={inputStyles} /></TextField>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField name="whatsapp"><Label className="text-green-400 text-xs mb-1 font-bold">WhatsApp</Label><Input placeholder="ডিজাইন কনফার্ম করার জন্য" variant="bordered" classNames={inputStyles} /></TextField>
                    <TextField name="email" type="email"><Label className="text-slate-300 text-xs mb-1">ইমেইল (ঐচ্ছিক)</Label><Input placeholder="example@gmail.com" variant="bordered" classNames={inputStyles} /></TextField>
                  </div>
                </div>

                <div className="w-full h-px bg-white/5"></div>

            
                <div className="space-y-4">
                  <h4 className="text-[#FFDE42] text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">প্রোডাক্টের তথ্য</h4>
                  
                  {selectedType === "wedding" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField isRequired name="groomName"><Label className="text-slate-300 text-xs">বরের নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                      <TextField isRequired name="brideName"><Label className="text-slate-300 text-xs">কনের নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                      <TextField name="groomFather"><Label className="text-slate-300 text-xs">বরের পিতার নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                      <TextField name="brideFather"><Label className="text-slate-300 text-xs">কনের পিতার নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                      <TextField name="groomMother"><Label className="text-slate-300 text-xs">বরের মাতার নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                      <TextField name="brideMother"><Label className="text-slate-300 text-xs">কনের মাতার নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                      <div className="md:col-span-2">
                        <Label className="text-slate-300 text-xs block mb-1 font-medium">বিয়ের তারিখ</Label>
                        <input isRequired name="eventDate" type="date" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#FFDE42] transition-all" />
                      </div>
                    </div>
                  )}

                  {selectedType === "birth" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField isRequired name="babyName"><Label className="text-slate-300 text-xs">শিশুর নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                      <TextField isRequired name="fatherName"><Label className="text-slate-300 text-xs">পিতার নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                      <TextField isRequired name="motherName"><Label className="text-slate-300 text-xs">মাতার নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                      <div>
                        <Label className="text-slate-300 text-xs block mb-1">জন্ম তারিখ</Label>
                        <input isRequired name="birthDate" type="date" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#FFDE42]" />
                      </div>
                    </div>
                  )}

                  {selectedType === "death" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField isRequired name="deceasedName"><Label className="text-slate-300 text-xs">মৃত ব্যক্তির নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                      <TextField name="fatherOrHusbandName"><Label className="text-slate-300 text-xs">পিতা/স্বামীর নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                      <div className="md:col-span-2">
                        <Label className="text-slate-300 text-xs block mb-1 font-medium">মৃত্যুর তারিখ</Label>
                        <input isRequired name="deathDate" type="date" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#FFDE42]" />
                      </div>
                    </div>
                  )}

                  <TextField name="specialMessage">
                    <Label className="text-slate-300 text-xs">বার্তা / বাণী (ঐচ্ছিক)</Label>
                    <TextArea placeholder="ছোট কোনো উদ্ধৃতি যা কার্ডে খোদাই করা হবে..." variant="bordered" classNames={{...inputStyles, input: "text-slate-900 pt-3 h-24"}} />
                  </TextField>
                </div>

                <div className="w-full h-px bg-white/5"></div>

                {/* ৩. ডেলিভারি ইনফো */}
                <div className="space-y-4">
                  <h4 className="text-[#FFDE42] text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">ডেলিভারি ঠিকানা</h4>
                  <TextField isRequired name="deliveryAddress">
                    <Label className="text-slate-300 text-xs mb-1">পূর্ণ ঠিকানা</Label>
                    <Input placeholder="গ্রাম, থানা, পোস্ট অফিস" variant="bordered" classNames={inputStyles} />
                  </TextField>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <Label className="text-slate-300 text-xs">জেলা</Label>
                      <select name="district" className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-3 text-slate-900 text-sm outline-none focus:border-[#FFDE42]">
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-slate-300 text-xs">ডেলিভারি টাইপ</Label>
                      <select name="deliveryType" className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 text-sm outline-none focus:border-[#FFDE42]">
                        <option value="Home">হোম ডেলিভারি</option>
                        <option value="Point">পয়েন্ট ডেলিভারি</option>
                      </select>
                    </div>
                  </div>
                  <TextField name="receiverName">
                    <Label className="text-slate-300 text-xs mb-1">প্রাপকের নাম (ঐচ্ছিক)</Label>
                    <Input placeholder="যদি অন্য কেউ রিসিভ করে" variant="bordered" classNames={inputStyles} />
                  </TextField>
                </div>

                {/* সাবমিট সেকশন */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-slate-400 text-xs block">সর্বমোট (ডেলিভারি ফ্রি)</span>
                      <span className="text-white text-3xl font-black">৳৯৯৯</span>
                    </div>
                    <div className="bg-green-500/10 text-green-400 text-[10px] font-bold px-3 py-1 rounded-full border border-green-500/20 uppercase tracking-widest">
                      Cash on Delivery
                    </div>
                  </div>
                  <Button
                    type="submit"
                    isLoading={loading}
                    className="w-full bg-[#FFDE42] hover:bg-white text-slate-950 font-black py-8 text-xl rounded-2xl shadow-xl transition-all active:scale-95"
                  >
                    অর্ডার কনফার্ম করুন
                  </Button>
                </div>
              </Form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0F172A; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </>
  );
};

export default OrderModal;