"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Checkbox,
  Description,
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

const OrderModal = ({ isOpen, onClose, selectedType }) => {
  const [hasEmail, setHasEmail] = useState(false);
  const districts = [
    "নাটোর", "কুমিল্লা","ফেনী", "ব্রাহ্মণবাড়িয়া","রাঙ্গামাটি","নোয়াখালী","চাঁদপুর","লক্ষ্মীপুর","চট্টগ্রাম","কক্সবাজার","খাগড়াছড়ি","বান্দরবান","সিরাজগঞ্জ","পাবনা","বগুড়া",
    "রাজশাহী","নাটোর", "জয়পুরহাট", "চাঁপাইনবাবগঞ্জ", "নওগাঁ", "যশোর", "সাতক্ষীরা", "মেহেরপুর", "নড়াইল", "চুয়াডাঙ্গা", "কুষ্টিয়া", "মাগুরা", "খুলনা", "বাগেরহাট", "ঝিনাইদহ",
    "ঝালকাঠি", "পটুয়াখালী", "পিরোজপুর", "বরিশাল", "ভোলা", "বরগুনা", "সিলেট", "মৌলভীবাজার", "হবিগঞ্জ", "সুনামগঞ্জ", "নরসিংদী", "গাজীপুর", "শরীয়তপুর", "নারায়ণগঞ্জ",
    "টাঙ্গাইল", "কিশোরগঞ্জ", "মানিকগঞ্জ", "ঢাকা", "মুন্সিগঞ্জ", "রাজবাড়ী", "মাদারীপুর", "গোপালগঞ্জ", "ফরিদপুর", "পঞ্চগড়", "দিনাজপুর", "লালমনিরহাট",
     "নীলফামারী", "গাইবান্ধা", "ঠাকুরগাঁও", "রংপুর","কুড়িগ্রাম", "শেরপুর", "ময়মনসিংহ", "জামালপুর", "নেত্রকোনা",
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          className="relative w-full max-w-2xl bg-[#0b1218] border border-white/10 rounded-[25px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#0b1218]">
            <div className="flex items-center gap-3 text-[#e5c277] text-xl font-bold uppercase">
              {selectedType === "wedding" && (
                <FaRing className="text-pink-500" />
              )}
              {selectedType === "birth" && <FaBaby className="text-blue-400" />}
              {selectedType === "death" && (
                <FaPray className="text-yellow-500" />
              )}
              <span className="text-white">{selectedType} - Order Form</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-gray-400"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar bg-[#0b1218]">
            <Form className="space-y-8">
              <Fieldset>
                <Fieldset.Legend className="text-white font-bold text-lg">
                  আপনার তথ্য
                </Fieldset.Legend>
                <FieldGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField isRequired name="customerName">
                      <Label className="text-white">আপনার নাম</Label>
                      <Input placeholder="পূর্ণ নাম" variant="bordered" />
                    </TextField>
                    <TextField isRequired name="phone">
                      <Label className="text-white">মোবাইল নাম্বার</Label>
                      <Input placeholder="01XXXXXXXXX" variant="bordered" />
                    </TextField>
                  </div>

                  <div className="space-y-2 mt-2">
                    <Checkbox isSelected={hasEmail} onValueChange={setHasEmail}>
                      <span className="text-white text-sm">
                        {" "}
                        Have you any email?
                      </span>
                    </Checkbox>
                    {hasEmail && (
                      <TextField
                        name="email"
                        type="email"
                        className="animate-in fade-in"
                      >
                        <Label className="text-white">ইমেইল এড্রেস</Label>
                        <Input
                          placeholder="example@mail.com"
                          variant="bordered"
                        />
                      </TextField>
                    )}
                  </div>

                  <TextField name="whatsapp">
                    <Label className="text-white">WhatsApp</Label>
                    <Input
                      placeholder="01XXXXXXXXX"
                      variant="bordered"
                      startContent={<FaWhatsapp className="text-green-500" />} // ERROR EKHANEI!
                    />
                  </TextField>
                </FieldGroup>
              </Fieldset>

              <Fieldset className="bg-white/5 p-5 rounded-2xl border border-white/5">
                <Fieldset.Legend className="text-white font-bold text-lg">
                  কার্ডের বিস্তারিত তথ্য
                </Fieldset.Legend>
                <FieldGroup className="mt-4">
                  {selectedType === "wedding" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField>
                        <Label className="text-white">বরের নাম</Label>
                        <Input variant="bordered" />
                      </TextField>
                      <TextField>
                        <Label className="text-white">কনের নাম</Label>
                        <Input variant="bordered" />
                      </TextField>

                      <TextField>
                        <Label className="text-white">বরের পিতার নাম</Label>
                        <Input variant="bordered" />
                      </TextField>
                      <TextField>
                        <Label className="text-white">কনের পিতার নাম</Label>
                        <Input variant="bordered" />
                      </TextField>

                      <TextField>
                        <Label className="text-white">বরের মাতার নাম</Label>
                        <Input variant="bordered" />
                      </TextField>
                      <TextField>
                        <Label className="text-white">কনের মাতার নাম</Label>
                        <Input variant="bordered" />
                      </TextField>

                      <div className="md:col-span-2">
                        <Label className="text-white block mb-2">
                          বিয়ের তারিখ
                        </Label>
                        <input
                          type="date"
                          className="w-full bg-[#161d24] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-500 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {selectedType === "birth" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField>
                        <Label className="text-white">শিশুর নাম</Label>
                        <Input variant="bordered" />
                      </TextField>
                      <TextField>
                        <Label className="text-white">পিতার নাম</Label>
                        <Input variant="bordered" />
                      </TextField>
                      <TextField>
                        <Label className="text-white">মাতার নাম</Label>
                        <Input variant="bordered" />
                      </TextField>
                      <TextField>
                        <Label className="text-white">জন্ম তারিখ</Label>
                        <Input type="date" variant="bordered" />
                      </TextField>
                    </div>
                  )}

                  {selectedType === "death" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextField>
                        <Label className="text-white">মরহুমের নাম</Label>
                        <Input variant="bordered" />
                      </TextField>
                      <TextField>
                        <Label className="text-white">পিতা/স্বামীর নাম</Label>
                        <Input variant="bordered" />
                      </TextField>
                      <TextField>
                        <Label className="text-white">মৃত্যুর তারিখ</Label>
                        <Input type="date" variant="bordered" />
                      </TextField>
                    </div>
                  )}

                  <TextField className="mt-4">
                    <Label className="text-white">
                      বিশেষ কোনো বাণী (ঐচ্ছিক)
                    </Label>
                    <TextArea placeholder="এখানে লিখুন..." variant="bordered" />
                  </TextField>
                </FieldGroup>
              </Fieldset>

              <Fieldset>
                <Fieldset.Legend className="text-white font-bold text-lg">
                  ডেলিভারি ডিটেইলস
                </Fieldset.Legend>
                <FieldGroup>
                  <TextField isRequired name="address">
                    <Label className="text-white">ডেলিভারি ঠিকানা</Label>
                    <Input placeholder="গ্রাম, থানা, জেলা" variant="bordered" />
                  </TextField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-white">জেলা</Label>
                      <div className="relative">
                        <select className="w-full h-12 bg-[#161d24] border border-white/10 rounded-xl px-3 text-white appearance-none outline-none focus:border-yellow-500">
                          {districts.map((d, index) => (
                            <option
                              key={`${d}-${index}`}
                              value={d}
                              className="bg-[#0b1218]"
                            >
                              {d}
                            </option>
                          ))}
                        </select>
                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="text-white">ডেলিভারি টাইপ</Label>
                      <div className="relative">
                        <select className="w-full h-12 bg-[#161d24] border border-white/10 rounded-xl px-3 text-white appearance-none outline-none focus:border-yellow-500">
                          <option className="bg-[#0b1218]">হোম ডেলিভারি</option>
                          <option className="bg-[#0b1218]">
                            পয়েন্ট ডেলিভারি
                          </option>
                        </select>
                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs" />
                      </div>
                    </div>
                  </div>

                  <TextField name="recipientName">
                    <Label className="text-white">প্রাপক (যদি গিফট হয়)</Label>
                    <Input
                      placeholder="প্রাপকের নাম (ঐচ্ছিক)"
                      variant="bordered"
                    />
                  </TextField>
                </FieldGroup>
              </Fieldset>
            </Form>
          </div>

          <div className="p-6 border-t border-white/5 bg-[#0b1218]">
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-gray-400">ডেলিভারি চার্জ </span>
              <span className="text-yellow-500 text-2xl font-black">০০</span>
            </div>
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-yellow-500 text-black font-black py-6 text-lg rounded-xl shadow-lg active:scale-95 transition-all"
                onClick={onClose}
              >
                অর্ডার নিশ্চিত করুন{" "}
                <span className="text-black text-2xl font-black">৳৯৯০.০০</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderModal;
