export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string;
          name: string;
          image_url: string | null;
          pos_name: string;
          vat_enabled: boolean;
          demo: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["stores"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["stores"]["Insert"]>;
      };
      employees: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          email: string | null;
          role: string;
          phone: string | null;
          active: boolean;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["employees"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["employees"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          store_id: string;
          category_id: string | null;
          name: string;
          price: number;
          cost: number;
          stock: number;
          sku: string | null;
          emoji: string;
          image_url: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      customers: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          phone: string | null;
          email: string | null;
          points: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["customers"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
      };
      sales: {
        Row: {
          id: string;
          store_id: string;
          employee_id: string | null;
          customer_id: string | null;
          receipt_no: string | null;
          total: number;
          discount: number;
          vat: number;
          payment_method: string;
          status: "completed" | "cancelled" | "pending";
          note: string | null;
          sold_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sales"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["sales"]["Insert"]>;
      };
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          product_id: string | null;
          name: string;
          price: number;
          cost: number;
          quantity: number;
          subtotal: number;
        };
        Insert: Omit<Database["public"]["Tables"]["sale_items"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["sale_items"]["Insert"]>;
      };
      purchases: {
        Row: {
          id: string;
          store_id: string;
          employee_id: string | null;
          supplier: string | null;
          total: number;
          status: string;
          note: string | null;
          purchased_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["purchases"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["purchases"]["Insert"]>;
      };
      purchase_items: {
        Row: {
          id: string;
          purchase_id: string;
          product_id: string | null;
          name: string;
          cost: number;
          quantity: number;
          subtotal: number;
        };
        Insert: Omit<Database["public"]["Tables"]["purchase_items"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["purchase_items"]["Insert"]>;
      };
    };
    Views: {
      daily_sales_summary: {
        Row: {
          store_id: string;
          sale_date: string;
          total_bills: number;
          cancelled_bills: number;
          total_revenue: number;
          avg_per_bill: number;
        };
      };
    };
  };
}

// Convenience aliases
export type Store        = Database["public"]["Tables"]["stores"]["Row"];
export type Employee     = Database["public"]["Tables"]["employees"]["Row"];
export type Category     = Database["public"]["Tables"]["categories"]["Row"];
export type Product      = Database["public"]["Tables"]["products"]["Row"];
export type Customer     = Database["public"]["Tables"]["customers"]["Row"];
export type Sale         = Database["public"]["Tables"]["sales"]["Row"];
export type SaleItem     = Database["public"]["Tables"]["sale_items"]["Row"];
export type Purchase     = Database["public"]["Tables"]["purchases"]["Row"];
export type PurchaseItem = Database["public"]["Tables"]["purchase_items"]["Row"];
export type DailySalesSummary = Database["public"]["Views"]["daily_sales_summary"]["Row"];
