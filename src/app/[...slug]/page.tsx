import StubLayout from "@/components/StubLayout";

const PAGE_TITLES: Record<string, string> = {
  sell:             "หน้าขาย",
  buy:              "รับซื้อ",
  credit:           "ค้างจ่าย (หนี้)",
  ecom:             "อีคอมเมิร์ซ",
  sort:             "เรียงลำดับ",
  settings:         "ตั้งค่า",
  reports:          "รายงาน",
  documents:        "เอกสาร",
  "sale-history":   "ประวัติขาย",
  "stock-history":  "ประวัติสินค้า",
  expenses:         "ค่าใช้จ่าย",
  delivery:         "เดลิเวอรี่",
  stock:            "สต็อก",
  barcode:          "บาร์โค้ด",
  toppings:         "ท็อปปิ้ง/สูตร",
  "import-buy":     "นำเข้า/รับซื้อ",
  requisition:      "เบิก/คืนสินค้า",
  creditor:         "เจ้าหนี้",
  extra:            "POSPOS Extra",
  transfer:         "โอนสินค้า",
  "price-levels":   "ระดับราคา",
  wholesale:        "ราคาขายส่ง",
  sku:              "สินค้า (SKU)",
  expiration:       "วันหมดอายุ",
  promotions:       "โปรโมชั่น",
  discounts:        "ส่วนลด",
  customers:        "ลูกค้า",
  "points-exchange":"แลกแต้มสะสม",
  "points-settings":"ตั้งค่าแต้มสะสม",
  branches:         "สาขา",
  employees:        "พนักงาน",
  vendors:          "ผู้ผลิต",
  "pos-machines":   "เครื่อง POS",
  activity:         "กิจกรรม",
  "table-monitor":  "มอนิเตอร์โต๊ะ",
  devices:          "อุปกรณ์ที่เข้าสู่ระบบ",
  manual:           "คู่มือ",
  "report-problem": "แจ้งปัญหา",
  "payment-confirm":"แจ้งชำระเงิน",
  package:          "แพคเกจ",
  hardware:         "อุปกรณ์",
  partners:         "พาร์ทเนอร์",
};

export default async function StubPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const key   = slug?.join("/") ?? "";
  const title = PAGE_TITLES[key] ?? key;

  return <StubLayout title={title} />;
}
