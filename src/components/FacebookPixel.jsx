"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const pixelIdRef = useRef(null); 
  const isInitialized = useRef(false);

  useEffect(() => {
    // 🎯 আপনার লাইভ Vercel ব্যাক-এন্ড ইউআরএল সেট করা হয়েছে
    const BACKEND_URL = "https://woodly-server-fayw.vercel.app/api/pixel-config"; 

    fetch(BACKEND_URL)
      .then((res) => {
        if (!res.ok) return { success: false, pixelId: null };
        return res.json();
      })
      .then((data) => {
        const PIXEL_ID = data?.pixelId;

        if (PIXEL_ID) {
          pixelIdRef.current = PIXEL_ID;

          import("react-facebook-pixel")
            .then((x) => x.default)
            .then((reactPixel) => {
              reactPixel.init(PIXEL_ID, null, { autoConfig: true, debug: false });
              reactPixel.pageView(); 
              isInitialized.current = true; 
              console.log(`🚀 Global Facebook Pixel (${PIXEL_ID}) Ready!`);
            });
        }
      })
      .catch((err) => {
        console.warn("⚠️ Global Facebook Pixel: Backend is currently unreachable.");
      });
  }, []);

  useEffect(() => {
    if (!isInitialized.current || !pixelIdRef.current) return;

    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((reactPixel) => {
        reactPixel.pageView();
        console.log(`📸 PageView tracked: ${pathname}`);
      })
      .catch((err) => console.error("Facebook Pixel PageView Error:", err));
  }, [pathname, searchParams]); 

  return null;
}