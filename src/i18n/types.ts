export type LanguageCode = "th" | "lo" | "en";

export interface Dict {
  // ── Navbar ──────────────────────────────────────────────
  nav_search_placeholder: string;
  nav_notifications: string;
  nav_full_screen: string;
  nav_logout: string;
  nav_profile: string;
  nav_settings: string;

  // ── Sidebar sections ────────────────────────────────────
  sec_store: string;
  sec_reports: string;
  sec_products: string;
  sec_promo: string;
  sec_crm: string;
  sec_admin: string;
  sec_help: string;

  // ── Store items ─────────────────────────────────────────
  item_sell: string;
  item_buy: string;
  item_credit: string;
  item_ecom: string;
  item_sort: string;
  item_settings: string;

  // ── Reports items ────────────────────────────────────────
  item_dashboard: string;
  item_reports: string;
  item_documents: string;
  item_sale_history: string;
  item_stock_history: string;
  item_expenses: string;
  item_delivery: string;
  item_shift: string;

  // ── Products items ───────────────────────────────────────
  item_stock: string;
  item_barcode: string;
  item_toppings: string;
  item_import_buy: string;
  item_requisition: string;
  item_creditor: string;
  item_extra: string;
  item_transfer: string;
  item_price_levels: string;
  item_wholesale: string;
  item_sku: string;
  item_expiration: string;

  // ── Promo items ──────────────────────────────────────────
  item_promotions: string;
  item_discounts: string;

  // ── CRM items ────────────────────────────────────────────
  item_customers: string;
  item_points_exchange: string;
  item_points_settings: string;

  // ── Admin items ──────────────────────────────────────────
  item_branches: string;
  item_employees: string;
  item_vendors: string;
  item_pos_machines: string;
  item_activity: string;
  item_table_monitor: string;
  item_devices: string;

  // ── Help items ───────────────────────────────────────────
  item_manual: string;
  item_report_problem: string;
  item_payment_confirm: string;
  item_package: string;
  item_hardware: string;
  item_partners: string;

  // ── Sidebar misc ─────────────────────────────────────────
  sidebar_search_placeholder: string;
  sidebar_demo_label: string;
  sidebar_demo_reset: string;

  // ── Sell page ────────────────────────────────────────────
  sell_search_placeholder: string;
  sell_filter: string;
  sell_cart: string;
  sell_all: string;
  sell_subtotal: string;
  sell_net_total: string;
  sell_pay: string;
  sell_clear: string;
  sell_customer: string;
  sell_drawer: string;
  sell_hold: string;
  sell_summary: string;
  sell_items_in_cart: string;
  sell_qty: string;
  sell_price: string;
  sell_remove: string;
  sell_no_products: string;
  sell_category_all: string;

  // ── Common actions ───────────────────────────────────────
  common_save: string;
  common_saving: string;
  common_cancel: string;
  common_delete: string;
  common_edit: string;
  common_add: string;
  common_search: string;
  common_loading: string;
  common_error: string;
  common_success: string;
  common_confirm: string;
  common_back: string;
  common_close: string;
  common_baht: string;
  common_all: string;
  common_add_new: string;
  common_no_data: string;
  common_view: string;

  // ── Common table columns ─────────────────────────────────
  col_name: string;
  col_sku: string;
  col_category: string;
  col_price: string;
  col_cost: string;
  col_stock: string;
  col_status: string;
  col_date: string;
  col_actions: string;
  col_receipt_no: string;
  col_employee: string;
  col_customer: string;
  col_payment: string;
  col_total: string;
  col_contact: string;
  col_tier: string;
  col_points: string;
  col_member_since: string;
  col_role: string;
  col_joined: string;

  // ── Common form labels ───────────────────────────────────
  label_name: string;
  label_full_name: string;
  label_phone: string;
  label_email: string;
  label_role: string;
  label_active_status: string;
  label_note: string;
  label_address: string;
  label_position: string;

  // ── Status labels ────────────────────────────────────────
  status_active: string;
  status_inactive: string;
  status_completed: string;
  status_cancelled: string;
  status_pending: string;
  status_out_of_stock: string;
  status_low_stock: string;
  status_normal: string;
  status_open: string;
  status_closed: string;

  // ── Payment method labels ────────────────────────────────
  payment_cash: string;
  payment_card: string;
  payment_qr: string;

  // ── Tier labels ──────────────────────────────────────────
  tier_gold: string;
  tier_silver: string;
  tier_bronze: string;

  // ── Stock page ───────────────────────────────────────────
  stock_title: string;
  stock_add_product: string;
  stock_all_products: string;
  stock_value: string;
  stock_low_stock: string;
  stock_out_of_stock: string;
  stock_search_placeholder: string;
  stock_filter_all: string;
  stock_filter_low: string;
  stock_filter_out: string;
  stock_items: string;

  // ── Sale history page ────────────────────────────────────
  sale_history_title: string;
  sale_total_revenue: string;
  sale_total_bills: string;
  sale_cancelled_bills: string;
  sale_search_placeholder: string;
  sale_receipt_title: string;
  sale_items_list: string;
  sale_discount: string;
  sale_vat: string;
  sale_net: string;
  sale_bills: string;
  sale_paid_with: string;
  sale_datetime: string;

  // ── Customers page ───────────────────────────────────────
  customers_title: string;
  customers_add: string;
  customers_total: string;
  customers_total_points: string;
  customers_search_placeholder: string;
  customers_new_title: string;
  customers_edit_title: string;
  customers_persons: string;
  customers_points_unit: string;

  // ── Employees page ───────────────────────────────────────
  employees_title: string;
  employees_add: string;
  employees_total: string;
  employees_active: string;
  employees_inactive: string;
  employees_new_title: string;
  employees_edit_title: string;
  employees_persons: string;
  emp_joined: string;

  // ── Role labels ──────────────────────────────────────────
  role_owner: string;
  role_manager: string;
  role_cashier: string;
  role_staff: string;

  // ── Settings page ────────────────────────────────────────
  settings_title: string;
  settings_store_info: string;
  settings_store_info_desc: string;
  settings_printer: string;
  settings_printer_desc: string;
  settings_payment_methods: string;
  settings_payment_methods_desc: string;
  settings_notifications: string;
  settings_notifications_desc: string;
  settings_security: string;
  settings_security_desc: string;

  // ── Expenses page ────────────────────────────────────────
  expenses_title: string;
  expenses_add: string;
  expenses_total: string;
  expenses_this_month: string;
  expenses_new_title: string;
  expenses_name: string;
  expenses_category: string;
  expenses_amount: string;
  expenses_date: string;
  expenses_note: string;

  // ── Branches page ────────────────────────────────────────
  branches_title: string;
  branches_add: string;
  branches_total: string;
  branches_main: string;
  branches_manager: string;
  branches_active: string;
  branches_add_new: string;
  branches_name: string;
  branches_edit_title: string;

  // ── Buy page ─────────────────────────────────────────────
  buy_title: string;
  buy_supplier: string;
  buy_supplier_placeholder: string;
  buy_order_list: string;
  buy_save: string;
  buy_select_product: string;
  buy_recent: string;
  buy_search_placeholder: string;

  // ── Creditor page ────────────────────────────────────────
  creditor_title: string;
  creditor_add: string;
  creditor_unpaid_total: string;
  creditor_unpaid_items: string;
  creditor_paid_items: string;
  creditor_name_col: string;
  creditor_amount: string;
  creditor_due_date: string;
  creditor_overdue: string;
  creditor_waiting: string;
  creditor_paid: string;
  creditor_name_label: string;
  creditor_amount_label: string;
  creditor_new_title: string;
  creditor_items_unit: string;

  // ── Wholesale page ───────────────────────────────────────
  wholesale_title: string;
  wholesale_desc: string;
  wholesale_saved: string;
  wholesale_retail: string;
  wholesale_min_qty: string;
  wholesale_price: string;
  wholesale_discount: string;
  wholesale_product: string;

  // ── Transfer page ────────────────────────────────────────
  transfer_title: string;
  transfer_create: string;
  transfer_from: string;
  transfer_to: string;
  transfer_qty: string;
  transfer_no_data: string;
  transfer_done: string;
  transfer_modal_title: string;
  transfer_from_branch: string;
  transfer_to_branch: string;
  transfer_select_product: string;
  transfer_stock_left: string;
  transfer_create_btn: string;

  // ── Ecom page ────────────────────────────────────────────
  ecom_title: string;
  ecom_channels: string;
  ecom_total_orders: string;
  ecom_online_sales: string;
  ecom_connected: string;
  ecom_not_connected: string;
  ecom_disconnect: string;
  ecom_connect: string;
  ecom_orders: string;
  ecom_sales: string;
  ecom_channels_unit: string;
  ecom_items_unit: string;

  // ── Documents page ───────────────────────────────────────
  docs_title: string;
  docs_receipt_btn: string;
  docs_tax_btn: string;
  docs_search_placeholder: string;
  docs_no_data: string;
  docs_doc_no: string;
  docs_receipt_title: string;
  docs_tax_title: string;
  docs_net: string;

  // ── Devices page ─────────────────────────────────────────
  devices_title: string;
  devices_add: string;
  devices_total: string;
  devices_online: string;
  devices_offline: string;
  devices_device_col: string;
  devices_type_col: string;
  devices_branch_col: string;
  devices_disconnect: string;
  devices_connect: string;
  devices_printer: string;
  devices_scanner: string;
  devices_name_placeholder: string;

  // ── Price levels page ────────────────────────────────────
  price_levels_title: string;
  price_levels_add: string;
  price_levels_default: string;
  price_levels_discount_from: string;
  price_levels_example: string;
  price_levels_col_level: string;
  price_levels_col_discount: string;
  price_levels_col_paid: string;
  price_levels_name_placeholder: string;
  price_levels_discount_placeholder: string;
  price_levels_color: string;
  price_levels_edit_title: string;
  price_levels_add_title: string;

  // ── Vendors page ─────────────────────────────────────────
  vendors_title: string;
  vendors_add: string;
  vendors_search_placeholder: string;
  vendors_no_data: string;
  vendors_company: string;
  vendors_contact_person: string;
  vendors_category: string;
  vendors_edit_title: string;

  // ── Activity page ────────────────────────────────────────
  activity_title: string;
  activity_sale: string;
  activity_purchase: string;
  activity_no_data: string;

  // ── Promotions page ──────────────────────────────────────
  promos_title: string;
  promos_add: string;
  promos_no_data: string;
  promos_name: string;
  promos_desc: string;
  promos_type: string;
  promos_start: string;
  promos_end: string;
  promos_edit_title: string;
  promo_type_discount: string;
  promo_type_buy1get1: string;
  promo_type_time: string;
  promo_type_birthday: string;
  promo_type_bundle: string;

  // ── Discounts page ───────────────────────────────────────
  discounts_title: string;
  discounts_add: string;
  discounts_total: string;
  discounts_name_col: string;
  discounts_value_col: string;
  discounts_min_order: string;
  discounts_active_label: string;
  discounts_type_percent: string;
  discounts_type_fixed: string;
  discounts_no_data: string;
  discounts_edit_title: string;

  // ── Stock history page ───────────────────────────────────
  stock_hist_title: string;
  stock_hist_total_cost: string;
  stock_hist_count: string;
  stock_hist_avg: string;
  stock_hist_search_placeholder: string;
  stock_hist_supplier_col: string;
  stock_hist_items_col: string;
  stock_hist_total_cost_col: string;
  stock_hist_detail_title: string;
  stock_hist_no_data: string;
  stock_hist_done: string;
  stock_hist_pending: string;
  stock_hist_times_unit: string;

  // ── Toppings page ────────────────────────────────────────
  toppings_title: string;
  toppings_add: string;
  toppings_required: string;
  toppings_multi: string;
  toppings_group_name: string;
  toppings_option_name: string;
  toppings_option_multi: string;
  toppings_edit_title: string;

  // ── SKU page ─────────────────────────────────────────────
  sku_title: string;
  sku_search_placeholder: string;
  sku_margin_col: string;
  sku_product_col: string;
  sku_add_title: string;
  sku_edit_title: string;
  sku_name_label: string;
  sku_sale_status: string;
  sku_status_on: string;
  sku_status_off: string;

  // ── Sort page ────────────────────────────────────────────
  sort_title: string;
  sort_desc: string;
  sort_save_order: string;
  sort_saved: string;
  sort_no_category: string;

  // ── Payment confirm page ─────────────────────────────────
  pay_confirm_title: string;
  pay_confirm_paid: string;
  pay_confirm_waiting: string;
  pay_confirm_channel: string;
  pay_confirm_search_placeholder: string;
  pay_confirm_confirm_btn: string;
  pay_confirm_bill_title: string;
  pay_confirm_confirm_payment: string;
  pay_confirm_no_data: string;
  pay_confirm_net: string;
  pay_confirm_amount: string;

  // ── Shift page ───────────────────────────────────────────
  shift_title: string;
  shift_open: string;
  shift_close: string;
  shift_start_time: string;
  shift_end_time: string;
  shift_cash_start: string;
  shift_cash_end: string;
  shift_sales: string;
  shift_bills: string;
  shift_open_shift: string;
  shift_close_shift: string;
  shift_current: string;
  shift_history: string;

  // ── Credit (ขายเชื่อ) page ───────────────────────────────
  credit_title: string;
  credit_add: string;
  credit_total_debt: string;
  credit_waiting: string;
  credit_paid: string;
  credit_overdue: string;
  credit_col_buy_date: string;
  credit_col_due: string;
  credit_receive_btn: string;
  credit_new_title: string;
  credit_amount_label: string;
  credit_due_label: string;
  credit_no_data: string;

  // ── Delivery page ────────────────────────────────────────
  delivery_title: string;
  delivery_create: string;
  delivery_pending: string;
  delivery_delivering: string;
  delivery_delivered: string;
  delivery_order_title: string;
  delivery_items_label: string;
  delivery_total_label: string;
  delivery_accept: string;
  delivery_complete: string;

  // ── Barcode page ─────────────────────────────────────────
  barcode_title: string;
  barcode_download: string;
  barcode_print: string;
  barcode_search_placeholder: string;
  barcode_deselect_all: string;
  barcode_select_all: string;
  barcode_copies_label: string;
  barcode_preview_label: string;
  barcode_select_first: string;

  // ── Expiration page ──────────────────────────────────────
  expiry_title: string;
  expiry_expired_today: string;
  expiry_near: string;
  expiry_normal: string;
  expiry_filter_critical: string;
  expiry_filter_warning: string;
  expiry_lot_col: string;
  expiry_date_col: string;
  expiry_status_expired: string;
  expiry_status_today: string;

  // ── Hardware page ────────────────────────────────────────
  hw_title: string;
  hw_subtitle: string;
  hw_cart: string;
  hw_add_to_cart: string;
  hw_added: string;

  // ── Table monitor page ───────────────────────────────────
  table_title: string;
  table_empty: string;
  table_occupied: string;
  table_bill: string;
  table_reserved: string;
  table_unit: string;
  table_seats: string;
  table_close: string;
  table_clear: string;

  // ── Points settings page ─────────────────────────────────
  pts_title: string;
  pts_enable: string;
  pts_enable_desc: string;
  pts_earn_section: string;
  pts_earn_every: string;
  pts_earn_gets: string;
  pts_earn_label: string;
  pts_redeem_section: string;
  pts_min_redeem: string;
  pts_expiry_label: string;
  pts_save: string;
  pts_saved: string;

  // ── Points exchange page ─────────────────────────────────
  pts_ex_title: string;
  pts_ex_search_placeholder: string;
  pts_ex_redeem_btn: string;
  pts_ex_no_customer: string;
  pts_ex_customer_pts_label: string;

  // ── Requisition page ─────────────────────────────────────
  req_title: string;
  req_back_list: string;
  req_create: string;
  req_withdraw: string;
  req_return: string;
  req_reason_label: string;
  req_reason_placeholder: string;
  req_submit: string;
  req_approved: string;
  req_pending_approval: string;
  req_rejected: string;

  // ── POS Machines page ────────────────────────────────────
  pos_mac_title: string;
  pos_mac_add: string;
  pos_mac_online: string;
  pos_mac_offline: string;
  pos_mac_branch_label: string;
  pos_mac_last_seen: string;
  pos_mac_monthly_bills: string;
  pos_mac_revenue: string;

  // ── Manual / Help page ───────────────────────────────────
  manual_title: string;
  manual_subtitle: string;
  manual_search_placeholder: string;
  manual_results: string;
  manual_read_time: string;

  // ── Package page ─────────────────────────────────────────
  pkg_title: string;
  pkg_subtitle: string;
  pkg_monthly: string;
  pkg_yearly: string;
  pkg_save_20: string;
  pkg_current: string;
  pkg_select: string;
  pkg_subscription_info: string;

  // ── Partners page ────────────────────────────────────────
  partners_title: string;
  partners_subtitle: string;
  partners_total: string;
  partners_connected: string;
  partners_ready: string;
  partners_categories: string;
  partners_manage: string;
  partners_connect: string;

  // ── Report problem page ──────────────────────────────────
  report_title: string;
  report_category_label: string;
  report_subject_label: string;
  report_subject_placeholder: string;
  report_detail_label: string;
  report_detail_placeholder: string;
  report_screenshot_label: string;
  report_submit: string;
  report_success_title: string;
  report_success_desc: string;
  report_another: string;

  // ── Reports page ─────────────────────────────────────────
  rep_export_excel: string;
  rep_days: string;
  rep_kpi_revenue: string;
  rep_kpi_bills: string;
  rep_kpi_avg: string;
  rep_kpi_profit: string;
  rep_daily_chart: string;
  rep_col_date: string;
  rep_col_bills: string;
  rep_col_cancelled: string;
  rep_col_total: string;
  rep_col_avg: string;
  rep_total: string;
  rep_no_data: string;
  rep_tab_graph: string;
  rep_tab_product: string;
  rep_tab_staff: string;
  rep_tab_customer: string;
  rep_tab_branch: string;
  rep_tab_payment: string;
  rep_tab_delivery: string;
  rep_tab_document: string;
  rep_tab_note: string;
  rep_tab_category: string;
  rep_tab_pos: string;
  rep_tab_promo: string;
  rep_col_sold: string;
  rep_col_qty: string;
  rep_col_amount: string;
  rep_no_product: string;
  rep_col_pay_method: string;
  rep_col_ratio: string;
  rep_placeholder_connect: string;
  rep_payment_title: string;
  rep_category_title: string;
  rep_col_category: string;
  rep_staff_title: string;
  rep_staff_desc: string;
  rep_customer_title: string;
  rep_customer_desc: string;
  rep_branch_title: string;
  rep_branch_desc: string;
  rep_delivery_title: string;
  rep_delivery_desc: string;
  rep_document_title: string;
  rep_document_desc: string;
  rep_note_title: string;
  rep_note_desc: string;
  rep_pos_title: string;
  rep_pos_desc: string;
  rep_promo_title: string;
  rep_promo_desc: string;
  dash_search_menu: string;
  dash_import: string;
  dash_today_title: string;
  dash_all_staff: string;
  dash_yesterday: string;
  dash_today: string;
  dash_this_week: string;
  dash_this_month: string;
  dash_this_year: string;
  dash_custom: string;
  dash_total_revenue: string;
  dash_growth: string;
  dash_from_yesterday: string;
  dash_cancelled_bills: string;
  dash_sale_bills: string;
  dash_avg_per_bill: string;
  dash_24h: string;
  dash_download_chart: string;
  dash_no_data: string;
  dash_more_data: string;
}
