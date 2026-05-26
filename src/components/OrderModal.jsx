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
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const districts = [
    { id: "1", value: "comilla", name: "কুমিল্লা" },
    { id: "2", value: "feni", name: "ফেনী" },
    { id: "3", value: "brahmanbaria", name: "ব্রাহ্মণবাড়িয়া" },
    { id: "4", value: "rangamati", name: "রাঙ্গামাটি" },
    { id: "5", value: "noakhali", name: "নোয়াখালী" },
    { id: "6", value: "chandpur", name: "চাঁদপুর" },
    { id: "7", value: "lakshmipur", name: "লক্ষ্মীপুর" },
    { id: "8", value: "chattogram", name: "চট্টগ্রাম" },
    { id: "9", value: "coxsbazar", name: "কক্সবাজার" },
    { id: "10", value: "khagrachhari", name: "খাগড়াছড়ি" },
    { id: "11", value: "bandarban", name: "বান্দরবান" },
    { id: "12", value: "sirajganj", name: "সিরাজগঞ্জ" },
    { id: "13", value: "pabna", name: "পাবনা" },
    { id: "14", value: "bogura", name: "বগুড়া" },
    { id: "15", value: "rajshahi", name: "রাজশাহী" },
    { id: "16", value: "natore", name: "নাটোর" },
    { id: "17", value: "joypurhat", name: "জয়পুরহাট" },
    { id: "18", value: "chapainawabganj", name: "চাঁপাইনবাবগঞ্জ" },
    { id: "19", value: "naogaon", name: "নওগাঁ" },
    { id: "20", value: "jashore", name: "যশোর" },
    { id: "21", value: "satkhira", name: "সাতক্ষীরা" },
    { id: "22", value: "meherpur", name: "মেহেরপুর" },
    { id: "23", value: "narail", name: "নড়াইল" },
    { id: "24", value: "chuadanga", name: "চুয়াডাঙ্গা" },
    { id: "25", value: "kushtia", name: "কুষ্টিয়া" },
    { id: "26", value: "magura", name: "মাগুরা" },
    { id: "27", value: "khulna", name: "খুলনা" },
    { id: "28", value: "bagerhat", name: "বাগেরহাট" },
    { id: "29", value: "jhenaidah", name: "ঝিনাইদহ" },
    { id: "30", value: "jhalakathi", name: "ঝালকাঠি" },
    { id: "31", value: "patuakhali", name: "পটুয়াখালী" },
    { id: "32", value: "pirojpur", name: "পিরোজপুর" },
    { id: "33", value: "barisal", name: "বরিশাল" },
    { id: "34", value: "bhola", name: "ভোলা" },
    { id: "35", value: "barguna", name: "বরগুনা" },
    { id: "36", value: "sylhet", name: "সিলেট" },
    { id: "37", value: "moulvibazar", name: "মৌলভীবাজার" },
    { id: "38", value: "habiganj", name: "হবিগঞ্জ" },
    { id: "39", value: "sunamganj", name: "সুনামগঞ্জ" },
    // ঢাকা বিভাগের জেলাসমূহ (ID: 40 থেকে 52)
    { id: "40", value: "narsingdi", name: "নরসিংদী" },
    { id: "41", value: "gazipur", name: "গাজীপুর" },
    { id: "42", value: "shariatpur", name: "শরীয়তপুর" },
    { id: "43", value: "narayanganj", name: "নারায়ণগঞ্জ" },
    { id: "44", value: "tangail", name: "টাঙ্গাইল" },
    { id: "45", value: "kishoreganj", name: "কিশোরগঞ্জ" },
    { id: "46", value: "manikganj", name: "মানিকগঞ্জ" },
    { id: "47", value: "dhaka", name: "ঢাকা" },
    { id: "48", value: "munshiganj", name: "মুন্সিগঞ্জ" },
    { id: "49", value: "rajbari", name: "রাজবাড়ী" },
    { id: "50", value: "madaripur", name: "مাদারীপুর" },
    { id: "51", value: "gopalganj", name: "গোপালগঞ্জ" },
    { id: "52", value: "faridpur", name: "ফরিদপুর" },
    // অন্যান্য বিভাগের জেলাসমূহ
    { id: "53", value: "panchagarh", name: "পঞ্চগড়" },
    { id: "54", value: "dinajpur", name: "দিনাজপুর" },
    { id: "55", value: "lalmonirhat", name: "লালমনিরহাট" },
    { id: "56", value: "nilphamari", name: "নীলফামারী" },
    { id: "57", value: "gaibandha", name: "গাইবান্ধা" },
    { id: "58", value: "thakurgaon", name: "ঠাকুরগাঁও" },
    { id: "59", value: "rangpur", name: "রংপুর" },
    { id: "60", value: "kurigram", name: "কুড়িগ্রাম" },
    { id: "61", value: "sherpur", name: "শেরপুর" },
    { id: "62", value: "mymensingh", name: "ময়মনসিংহ" },
    { id: "63", value: "jamalpur", name: "জামালপুর" },
    { id: "64", value: "netrokona", name: "নেত্রকোণা" }
  ];

  const productPrice = 999;
  const totalAmount = productPrice + deliveryCharge;

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setSelectedDistrict(value);

    if (!value) {
      setDeliveryCharge(0);
      return;
    }
    
    const matchedDistrict = districts.find(d => d.value === value);
    
    if (matchedDistrict) {
      const districtId = parseInt(matchedDistrict.id);
      
      if (districtId >= 40 && districtId <= 52) {
        setDeliveryCharge(80);
      } else {
        setDeliveryCharge(120);
      }
    }
  };

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
    if (!selectedDistrict) {
      toast.error("অনুগ্রহ করে জেলা সিলেক্ট করুন");
      return;
    }
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const districtInfo = districts.find(d => d.value === selectedDistrict);

    try {
      const response = await fetch(`https://woodly-server-fayw.vercel.app/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...data, 
          district: districtInfo?.name || "", 
          districtValue: districtInfo?.value || "",
          districtId: districtInfo?.id || "",
          orderType: selectedType, 
          status: 'pending',
          productPrice: productPrice,
          deliveryCharge: deliveryCharge, 
          totalAmount: totalAmount 
        }),
      });

      if (response.ok) {
        toast.success("অর্ডারটি সফলভাবে জমা হয়েছে!");
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
              <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-800/30">
                <div className="flex items-center gap-3 text-[#FFDE42] text-lg md:text-xl font-black">
                  <span className="p-2 bg-yellow-500/10 rounded-lg">
                    {selectedType === "wedding" && <FaRing />}
                    {selectedType === "birth" && <FaBaby />}
                    {selectedType === "death" && <FaPray />}
                  </span>
                  <span>{selectedType === "wedding" ? "বিবাহ" : selectedType === "birth" ? "জন্মদিন/আকিকা" : "স্মরণিকা"} অর্ডার</span>
                </div>
                <button type="button" onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
                  <FaTimes size={20} />
                </button>
              </div>

              <Form onSubmit={handleSubmit} className="overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
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
              
                <div className="space-y-4">
                  <h4 className="text-[#FFDE42] text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">ডেলিভারি ঠিকানা</h4>
                  <TextField isRequired name="deliveryAddress">
                    <Label className="text-slate-300 text-xs mb-1">পূর্ণ ঠিকানা</Label>
                    <Input placeholder="গ্রাম, থানা, পোস্ট অফিস" variant="bordered" classNames={inputStyles} />
                  </TextField>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <Label className="text-slate-300 text-xs">জেলা</Label>
                      <select 
                        required
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-3 text-slate-900 text-sm outline-none focus:border-[#FFDE42]"
                      >
                        <option value="">-- সিলেক্ট করুন --</option>
                        {districts.map(d => (
                          <option key={d.id} value={d.value}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-slate-300 text-xs">ডেলিভারি টাইপ</Label>
                      <select name="deliveryType" className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 text-sm outline-none focus:border-[#FFDE42]">
                        <option value="Home">হোম ডেলিভারি</option>
                        <option value="Point">পয়েন্ট ডেলিভারি</option>
                      </select>
                    </div>
                  </div>
                  <TextField name="receiverName">
                    <Label className="text-slate-300 text-xs mb-1">প্রাপকের নাম (ঐচ্ছিক)</Label>
                    <Input placeholder="যদি অন্য কেউ রিসিভ করে" variant="bordered" classNames={inputStyles} />
                  </TextField>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <div className="space-y-1">
                      <div className="text-slate-400 text-xs flex gap-2">
                        <span>প্রোডাক্ট: ৳{productPrice}</span>
                        <span>+</span>
                        <span className="text-yellow-400 font-medium">ডেলিভারি: ৳{deliveryCharge}</span>
                      </div>
                      <span className="text-white text-3xl font-black">৳{totalAmount}</span>
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