"use client";

import { Settings, ImageIcon } from "lucide-react";
import type { Store } from "@/lib/supabase/types";

interface StoreBannerProps {
  store: Store;
}

export default function StoreBanner({ store }: StoreBannerProps) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='240'%3E%3Ctext x='10' y='55' font-size='38' opacity='0.1' fill='white'%3E🍕%3C/text%3E%3Ctext x='100' y='35' font-size='34' opacity='0.1' fill='white'%3E🍜%3C/text%3E%3Ctext x='210' y='65' font-size='36' opacity='0.1' fill='white'%3E☕%3C/text%3E%3Ctext x='310' y='40' font-size='30' opacity='0.1' fill='white'%3E🍰%3C/text%3E%3Ctext x='420' y='60' font-size='32' opacity='0.1' fill='white'%3E🥗%3C/text%3E%3Ctext x='50' y='140' font-size='34' opacity='0.1' fill='white'%3E🍔%3C/text%3E%3Ctext x='160' y='155' font-size='30' opacity='0.1' fill='white'%3E🍱%3C/text%3E%3Ctext x='260' y='148' font-size='36' opacity='0.1' fill='white'%3E🧁%3C/text%3E%3Ctext x='370' y='145' font-size='32' opacity='0.1' fill='white'%3E🥤%3C/text%3E%3Ctext x='460' y='150' font-size='28' opacity='0.1' fill='white'%3E🍩%3C/text%3E%3Ctext x='20' y='215' font-size='30' opacity='0.1' fill='white'%3E🧃%3C/text%3E%3Ctext x='430' y='210' font-size='32' opacity='0.1' fill='white'%3E🍫%3C/text%3E%3C/svg%3E\"), linear-gradient(135deg, #0064bd 0%, #089eff 100%)",
        backgroundSize: "cover, cover",
        minHeight: 200,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
      }}
    >
      {/* Top-right actions */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button className="text-white/60 hover:text-white transition-colors text-base">
          <Settings size={18} />
        </button>
        <button className="text-white/60 hover:text-white transition-colors text-base">
          <ImageIcon size={18} />
        </button>
      </div>

      {/* Store info */}
      <div className="flex items-center gap-4 px-5 pt-6 pb-6 pr-32">
        {/* Store image */}
        <div className="flex-shrink-0 flex items-center justify-center bg-white rounded-2xl text-[58px] shadow-lg"
          style={{ width: 110, height: 110 }}>
          {store.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={store.image_url} alt={store.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            "🎂"
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-white text-xl font-bold mb-1">{store.name}</h1>

          <div className="flex items-center gap-2 flex-wrap mb-3">
            {store.demo && (
              <span className="text-yellow-300 text-[13px]">Demo (3,610 วัน)</span>
            )}
            <span className="text-white/30">|</span>
            <span className="text-white/80 text-[13px]">POS: {store.pos_name}</span>
            {store.vat_enabled && (
              <>
                <span className="text-white/30">|</span>
                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  VAT
                </span>
              </>
            )}
          </div>

          {/* Search menu */}
          <div className="relative w-48">
            <select
              className="w-full appearance-none rounded-md px-2.5 py-1.5 text-[13px] pr-7 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "rgba(255,255,255,0.85)",
                fontFamily: "Sarabun, sans-serif",
              }}
            >
              <option value="">ค้นหาเมนู</option>
            </select>
            <svg
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
              width="10" height="6" fill="rgba(255,255,255,0.6)"
            >
              <path d="M0 0l5 6 5-6z" />
            </svg>
          </div>
        </div>
      </div>

      {/* DEMO stamp */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          right: 68, top: "50%", transform: "translateY(-50%) rotate(-15deg)",
          width: 88, height: 88,
          border: "4px dashed rgba(255,50,50,0.85)",
          borderRadius: "50%",
        }}
      >
        <span
          className="font-extrabold text-[16px] tracking-wider"
          style={{ color: "rgba(255,50,50,0.85)" }}
        >
          DEMO
        </span>
      </div>
    </div>
  );
}
