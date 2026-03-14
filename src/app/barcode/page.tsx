"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Search, Download, Printer } from "lucide-react";

const PRODUCTS = [
  { id:"p1", name:"ครัวซองต์เนย",      sku:"CRO-001", barcode:"8850000001", price:45,  emoji:"🥐" },
  { id:"p2", name:"ขนมปังโฮลวีท",      sku:"BRD-001", barcode:"8850000002", price:35,  emoji:"🍞" },
  { id:"p3", name:"มัฟฟินบลูเบอร์รี่",  sku:"MUF-001", barcode:"8850000003", price:55,  emoji:"🧁" },
  { id:"p4", name:"เค้กช็อกโกแลต",     sku:"CAK-001", barcode:"8850000004", price:180, emoji:"🎂" },
  { id:"p5", name:"ชีสเค้ก",           sku:"CAK-002", barcode:"8850000005", price:160, emoji:"🍰" },
  { id:"p6", name:"โดนัทกลาเซ่",       sku:"DON-001", barcode:"8850000006", price:40,  emoji:"🍩" },
  { id:"p7", name:"คุกกี้ช็อกโกแลต",   sku:"COO-001", barcode:"8850000007", price:25,  emoji:"🍪" },
  { id:"p8", name:"กาแฟลาเต้",         sku:"DRK-001", barcode:"8850000008", price:65,  emoji:"☕" },
];

function BarcodeDisplay({ value }: { value: string }) {
  // Simple visual barcode using bars
  const bars = value.split("").map((c, i) => parseInt(c) % 2 === 0 ? 2 : 3);
  return (
    <div className="flex items-end gap-0.5 h-12">
      {bars.map((w, i) => (
        <div key={i} style={{ width: w, height: i % 3 === 0 ? "100%" : "85%", background: "#1e293b" }} />
      ))}
    </div>
  );
}

export default function BarcodePage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [copies, setCopies] = useState(1);

  const filtered = PRODUCTS.filter(p =>
    search === "" || p.name.includes(search) || p.barcode.includes(search) || p.sku.includes(search)
  );

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p.id)));
  };

  const selectedProducts = PRODUCTS.filter(p => selected.has(p.id));

  return (
    <PageShell>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">พิมพ์บาร์โค้ด</h1>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 border border-slate-200 bg-white text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50">
              <Download size={15} /> ดาวน์โหลด PDF
            </button>
            <button
              disabled={selected.size === 0}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-40"
            >
              <Printer size={15} /> พิมพ์ {selected.size > 0 ? `(${selected.size})` : ""}
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Product list */}
          <div className="flex-1 space-y-3">
            <div className="bg-white rounded-xl p-3 shadow-sm flex gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="ค้นหาสินค้า SKU บาร์โค้ด..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <button onClick={selectAll} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200">
                {selected.size === filtered.length ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {filtered.map(p => (
                <label key={p.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)}
                    className="w-4 h-4 rounded accent-blue-600" />
                  <span className="text-xl">{p.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{p.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{p.sku} · {p.barcode}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{p.price} ฿</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="w-72 flex-shrink-0 space-y-3">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-700 mb-2">จำนวนสลาก/สินค้า</p>
              <input type="number" min={1} max={100} value={copies} onChange={e => setCopies(parseInt(e.target.value)||1)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-700 mb-3">ตัวอย่างบาร์โค้ด</p>
              {selectedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-300 gap-2">
                  <span className="text-4xl">📋</span>
                  <p className="text-sm">เลือกสินค้าก่อน</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-auto">
                  {selectedProducts.map(p => (
                    <div key={p.id} className="border border-slate-100 rounded-xl p-3 text-center">
                      <p className="text-[12px] font-medium text-slate-700 mb-2">{p.name}</p>
                      <div className="flex justify-center mb-1">
                        <BarcodeDisplay value={p.barcode} />
                      </div>
                      <p className="text-[11px] font-mono text-slate-500">{p.barcode}</p>
                      <p className="text-[13px] font-bold text-slate-800 mt-1">{p.price} ฿</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
