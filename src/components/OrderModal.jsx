"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Checkbox,
  FieldGroup,
  Fieldset,
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
  FaChevronDown,
  FaWhatsapp,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const OrderModal = ({ isOpen, onClose, selectedType }) => {
  const [hasEmail, setHasEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const districts = [
    "ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "সাভার", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "সিলেট", "বরিশাল", "রংপুর", "ময়মনসিংহ", 
    "নাটোর", "কুমিল্লা", "ফেনী", "ব্রাহ্মণবাড়িয়া", "নোয়াখালী", "চাঁদপুর", "পাবনা", "বগুড়া", "যশোর"
  ];

  const inputStyles = {
    input: "text-black placeholder:text-gray-500",
    inputWrapper: [
      "bg-white/90",
      "border-white/20",
      "data-[hover=true]:border-yellow-500",
      "group-data-[focus=true]:border-yellow-500",
      "group-data-[focus=true]:bg-white",
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const orderPayload = {
      ...data,
      orderType: selectedType,
      totalAmount: 999,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`https://woodly-server-fayw.vercel.app/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        toast.success("অর্ডারটি সফলভাবে জমা হয়েছে!");
        // ফিক্স: সরাসরি reload না করে ১.৫ সেকেন্ড পর ক্লোজ এবং রিলোড করা ভালো
        setTimeout(() => {
          onClose();
          window.location.reload(); 
        }, 1500);
      } else {
        toast.error("সার্ভারে সমস্যা হয়েছে।");
      }
    } catch (error) {
      toast.error("সার্ভার কানেক্ট হতে পারছে না।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* ফিক্স: handleClose এর বদলে onClose ব্যবহার করা হয়েছে */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-[#636CCB]/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-2xl bg-[#636CCB] border border-white/10 rounded-[25px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#636CCB]">
                <div className="flex items-center gap-3 text-[#e5c277] text-xl font-bold uppercase">
                  {selectedType === "wedding" && <FaRing className="text-pink-500" />}
                  {selectedType === "birth" && <FaBaby className="text-blue-400" />}
                  {selectedType === "death" && <FaPray className="text-yellow-500" />}
                  <span className="text-white">{selectedType} - Order Form</span>
                </div>
                {/* ফিক্স: handleClose এর বদলে onClose */}
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                  <FaTimes size={20} />
                </button>
              </div>

              <Form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                <div className="p-6 overflow-y-auto custom-scrollbar bg-[#636CCB]">
                  <div className="space-y-8">
                    {/* Personal Info */}
                    <Fieldset>
                      <Fieldset.Legend className="text-white font-bold text-lg">আপনার তথ্য</Fieldset.Legend>
                      <FieldGroup>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextField isRequired name="customerName">
                            <Label className="text-white">আপনার নাম</Label>
                            <Input placeholder="পূর্ণ নাম" variant="bordered" classNames={inputStyles} />
                          </TextField>
                          <TextField isRequired name="phone">
                            <Label className="text-white">মোবাইল নাম্বার</Label>
                            <Input placeholder="01XXXXXXXXX" variant="bordered" classNames={inputStyles} />
                          </TextField>
                        </div>

                        <div className="space-y-2 mt-2">
                          <Checkbox isSelected={hasEmail} onValueChange={setHasEmail} color="warning">
                            <span className="text-white text-sm">আপনার কি ইমেইল আছে?</span>
                          </Checkbox>
                          {hasEmail && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                              <TextField name="email" type="email">
                                <Label className="text-white">ইমেইল এড্রেস</Label>
                                <Input placeholder="example@mail.com" variant="bordered" classNames={inputStyles} />
                              </TextField>
                            </motion.div>
                          )}
                        </div>

                        <TextField name="whatsapp">
                          <Label className="text-white">WhatsApp (ঐচ্ছিক)</Label>
                          <Input
                            placeholder="01XXXXXXXXX"
                            variant="bordered"
                            classNames={inputStyles}
                            startContent={<FaWhatsapp className="text-green-600" />}
                          />
                        </TextField>
                      </FieldGroup>
                    </Fieldset>

                    {/* Card Details */}
                    <Fieldset className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <Fieldset.Legend className="text-white font-bold text-lg">কার্ডের বিস্তারিত তথ্য</Fieldset.Legend>
                      <FieldGroup className="mt-4">
                        {selectedType === "wedding" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField name="groomName"><Label className="text-white">বরের নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                            <TextField name="brideName"><Label className="text-white">কনের নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                            <TextField name="groomFather"><Label className="text-white">বরের পিতার নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                            <TextField name="brideFather"><Label className="text-white">কনের পিতার নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                            <div className="md:col-span-2">
                              <Label className="text-white block mb-2">বিয়ের তারিখ</Label>
                              <input name="eventDate" type="date" className="w-full bg-white text-black border border-white/10 rounded-xl p-3 outline-none focus:border-yellow-500" />
                            </div>
                          </div>
                        )}

                        {selectedType === "birth" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField name="babyName"><Label className="text-white">শিশুর নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                            <TextField name="fatherName"><Label className="text-white">পিতার নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                            <TextField name="motherName"><Label className="text-white">মাতার নাম</Label><Input variant="bordered" classNames={inputStyles} /></TextField>
                            <div className="md:col-span-2">
                                <Label className="text-white block mb-2">জন্ম তারিখ</Label>
                                <input name="birthDate" type="date" className="w-full bg-white text-black border border-white/10 rounded-xl p-3 outline-none" />
                            </div>
                          </div>
                        )}

                        <TextField name="specialMessage" className="mt-4">
                          <Label className="text-white">বিশেষ কোনো বাণী (ঐচ্ছিক)</Label>
                          <TextArea placeholder="এখানে লিখুন..." variant="bordered" classNames={inputStyles} />
                        </TextField>
                      </FieldGroup>
                    </Fieldset>

                    {/* Delivery Details */}
                    <Fieldset>
                      <Fieldset.Legend className="text-white font-bold text-lg">ডেলিভারি ডিটেইলস</Fieldset.Legend>
                      <FieldGroup>
                        <TextField isRequired name="deliveryAddress">
                          <Label className="text-white">ডেলিভারি ঠিকানা</Label>
                          <Input placeholder="গ্রাম, থানা, পোস্ট" variant="bordered" classNames={inputStyles} />
                        </TextField>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <Label className="text-white">জেলা</Label>
                            <div className="relative">
                              <select name="district" className="w-full h-12 bg-white border border-white/10 rounded-xl px-3 text-black appearance-none outline-none focus:border-yellow-500">
                                {districts.map((d, index) => (
                                  <option key={index} value={d}>{d}</option>
                                ))}
                              </select>
                              <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Label className="text-white">ডেলিভারি টাইপ</Label>
                            <div className="relative">
                              <select name="deliveryType" className="w-full h-12 bg-white border border-white/10 rounded-xl px-3 text-black appearance-none outline-none focus:border-yellow-500">
                                <option value="Home">হোম ডেলিভারি</option>
                                <option value="Point">পয়েন্ট ডেলিভারি</option>
                              </select>
                              <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </FieldGroup>
                    </Fieldset>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#636CCB]">
                  <div className="flex justify-between items-center mb-6 px-2">
                    <span className="text-gray-200">ডেলিভারি চার্জ</span>
                    <span className="text-yellow-500 text-2xl font-black">Free</span>
                  </div>
                  <Button
                    type="submit"
                    isLoading={loading}
                    className="w-full bg-[#6E8CFB] text-white font-black py-6 text-lg rounded-xl shadow-lg active:scale-95 transition-all"
                  >
                    {loading ? "অর্ডার প্রসেস হচ্ছে..." : "অর্ডার নিশ্চিত করুন"} <span className="ml-2 text-2xl font-black">৳৯৯৯.০০</span>
                  </Button>
                </div>
              </Form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderModal;