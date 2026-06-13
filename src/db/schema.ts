import { pgTable, text, integer, real, boolean } from "drizzle-orm/pg-core";

// 1. Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(), // U-NNN or firebase uid
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  role: text("role").notNull(),
  avatarUrl: text("avatar_url"),
  cnic: text("cnic"),
  uid: text("uid"),
  password: text("password"),
});

// 2. Projects table
export const projects = pgTable("projects", {
  id: text("id").primaryKey(), // AMB-2026-NNN
  name: text("name").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  areaSize: text("area_size").notNull(),
  numFloors: integer("num_floors").notNull(),
  estimatedCost: real("estimated_cost").notNull(),
  ratePerSqFt: real("rate_per_sq_ft"),
  totalSqFt: real("total_sq_ft"),
  startDate: text("start_date").notNull(),
  expectedEndDate: text("expected_end_date").notNull(),
  actualEndDate: text("actual_end_date"),
  status: text("status").notNull(),
  description: text("description").notNull(),
  repName: text("rep_name").notNull(),
  repRole: text("rep_role").notNull(),
  repCnic: text("rep_cnic").notNull(),
  clientName: text("client_name").notNull(),
  clientCnic: text("client_cnic").notNull(),
  clientPhone: text("client_phone").notNull(),
  clientEmail: text("client_email").notNull(),
  clientAddress: text("client_address").notNull(),
  clientAvatarUrl: text("client_avatar_url"),
  imageUrl: text("image_url"),
  createdBy: text("created_by"),
});

// 3. Workers table
export const workers = pgTable("workers", {
  id: text("id").primaryKey(), // W-NN
  name: text("name").notNull(),
  cnic: text("cnic").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  photoUrl: text("photo_url"),
  cnicCopyUrl: text("cnic_copy_url"),
  emergencyContact: text("emergency_contact"),
  category: text("category").notNull(),
  projectId: text("project_id").notNull(),
  joiningDate: text("joining_date").notNull(),
  status: text("status").notNull(),
  paymentType: text("payment_type").notNull(),
  agreedRate: real("agreed_rate").notNull(),
  rateUnit: text("rate_unit").notNull(),
  workDescription: text("work_description").notNull(),
  expectedEndDate: text("expected_end_date"),
  agreedTotalAmount: real("agreed_total_amount"),
  advancePaid: real("advance_paid").notNull(),
  approvedBy: text("approved_by").notNull(),
  remarks: text("remarks"),
  createdBy: text("created_by"),
});

// 4. Attendance table
export const attendance = pgTable("attendance", {
  id: text("id").primaryKey(), // AT-NNN
  projectId: text("project_id").notNull(),
  workerId: text("worker_id").notNull(),
  workerName: text("worker_name").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(),
  checkIn: text("check_in"),
  checkOut: text("check_out"),
  totalHours: real("total_hours"),
  dailyRate: real("daily_rate").notNull(),
  overtimeHours: real("overtime_hours"),
  overtimeRate: real("overtime_rate"),
  calculatedPay: real("calculated_pay").notNull(),
  workDoneToday: text("work_done_today").notNull(),
  addedBy: text("added_by").notNull(),
  approvedBy: text("approved_by").notNull(),
  remarks: text("remarks"),
  createdBy: text("created_by"),
});

// 5. Materials table
export const materials = pgTable("materials", {
  id: text("id").primaryKey(), // M-NN
  name: text("name").notNull(),
  category: text("category").notNull(),
  currentStock: real("current_stock").notNull(),
  unit: text("unit").notNull(),
  lowStockAlert: real("low_stock_alert").notNull(),
  createdBy: text("created_by"),
});

// 6. Purchases table
export const purchases = pgTable("purchases", {
  id: text("id").primaryKey(), // PR-NNN
  projectId: text("project_id").notNull(),
  materialName: text("material_name").notNull(),
  category: text("category").notNull(),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(),
  supplierName: text("supplier_name").notNull(),
  supplierPhone: text("supplier_phone").notNull(),
  purchaseDate: text("purchase_date").notNull(),
  deliveryDate: text("delivery_date").notNull(),
  ratePerUnit: real("rate_per_unit").notNull(),
  totalCost: real("total_cost").notNull(),
  vehicleNumber: text("vehicle_number").notNull(),
  deliveredBy: text("delivered_by").notNull(),
  receivedBy: text("received_by").notNull(),
  approvedBy: text("approved_by").notNull(),
  invoiceUrl: text("invoice_url"),
  imageUrl: text("image_url"),
  remarks: text("remarks"),
  advancePaid: real("advance_paid"),
  deliveryStatus: text("delivery_status").default("Delivered"),
  createdBy: text("created_by"),
});

// 7. Usages table
export const usages = pgTable("usages", {
  id: text("id").primaryKey(), // US-NNN
  projectId: text("project_id").notNull(),
  materialName: text("material_name").notNull(),
  category: text("category").notNull(),
  quantityUsedText: text("quantity_used_text"),
  quantityUsed: real("quantity_used"),
  unit: text("unit").notNull(),
  usedDate: text("used_date").notNull(),
  usedFor: text("used_for").notNull(),
  addedBy: text("added_by").notNull(),
  approvedBy: text("approved_by").notNull(),
  remarks: text("remarks"),
  createdBy: text("created_by"),
});

// 8. Suppliers table
export const suppliers = pgTable("suppliers", {
  id: text("id").primaryKey(), // S-NN
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  materialType: text("material_type").notNull(),
  companyName: text("company_name").notNull(),
  cnicOrNtn: text("cnic_or_ntn"),
  totalPurchases: real("total_purchases").notNull(),
  totalPaid: real("total_paid").notNull(),
  remainingPayable: real("remaining_payable").notNull(),
  status: text("status").notNull(),
  advancePaid: real("advance_paid"),
  createdBy: text("created_by"),
});

// 9. Supplier Payments table
export const supplierPayments = pgTable("supplier_payments", {
  id: text("id").primaryKey(), // SP-NNN
  projectId: text("project_id").notNull(),
  supplierName: text("supplier_name").notNull(),
  materialSupplied: text("material_supplied").notNull(),
  billAmount: real("bill_amount").notNull(),
  paidAmount: real("paid_amount").notNull(),
  remainingAmount: real("remaining_amount").notNull(),
  paymentDate: text("payment_date").notNull(),
  paymentMethod: text("payment_method").notNull(),
  invoiceUrl: text("invoice_url"),
  remarks: text("remarks"),
  createdBy: text("created_by"),
});

// 10. Progress Reports table
export const progressReports = pgTable("progress_reports", {
  id: text("id").primaryKey(), // PRR-NNN
  projectId: text("project_id").notNull(),
  date: text("date").notNull(),
  workCategory: text("work_category").notNull(),
  workCompletedToday: text("work_completed_today").notNull(),
  numWorkersPresent: integer("num_workers_present").notNull(),
  workersInvolved: text("workers_involved").notNull(),
  materialsUsedText: text("materials_used_text").notNull(),
  labourCost: real("labour_cost").notNull(),
  materialCost: real("material_cost").notNull(),
  problemsFaced: text("problems_faced"),
  weatherCondition: text("weather_condition").notNull(),
  delayReason: text("delay_reason"),
  nextDayPlan: text("next_day_plan").notNull(),
  imagesUrls: text("images_urls"), // serialized comma-separated strings
  uploadedBy: text("uploaded_by").notNull(),
  approvedBy: text("approved_by").notNull(),
  createdBy: text("created_by"),
});

// 11. Media table
export const media = pgTable("media", {
  id: text("id").primaryKey(), // MD-NNN
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  mediaType: text("media_type").notNull(),
  fileUrl: text("file_url").notNull(),
  date: text("date").notNull(),
  constructionStage: text("construction_stage").notNull(),
  description: text("description").notNull(),
  uploadedBy: text("uploaded_by").notNull(),
  visibility: text("visibility").notNull(),
  locationInHouse: text("location_in_house").notNull(),
  createdBy: text("created_by"),
});

// 12. Expenses table
export const expenses = pgTable("expenses", {
  id: text("id").primaryKey(), // EXP-NNN
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  amount: real("amount").notNull(),
  date: text("date").notNull(),
  paidTo: text("paid_to").notNull(),
  paymentMethod: text("payment_method").notNull(),
  receiptUrl: text("receipt_url"),
  addedBy: text("added_by").notNull(),
  approvedBy: text("approved_by").notNull(),
  status: text("status").notNull(),
  remarks: text("remarks"),
  createdBy: text("created_by"),
});

// 13. Client Payments table
export const clientPayments = pgTable("client_payments", {
  id: text("id").primaryKey(), // CP-NNN
  projectId: text("project_id").notNull(),
  clientName: text("client_name").notNull(),
  totalProjectAmount: real("total_project_amount").notNull(),
  advancePayment: real("advance_payment").notNull(),
  installmentAmount: real("installment_amount").notNull(),
  paymentDate: text("payment_date").notNull(),
  paymentMethod: text("payment_method").notNull(),
  receivedBy: text("received_by").notNull(),
  remainingBalance: real("remaining_balance").notNull(),
  proofUrl: text("proof_url"),
  status: text("status").notNull(),
  remarks: text("remarks"),
  createdBy: text("created_by"),
});

// 14. Milestones table
export const milestones = pgTable("milestones", {
  id: text("id").primaryKey(), // MS-NN
  projectId: text("project_id").notNull(),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  expectedCompletionDate: text("expected_completion_date").notNull(),
  actualCompletionDate: text("actual_completion_date"),
  status: text("status").notNull(),
  progressPercentage: integer("progress_percentage").notNull(),
  assignedPerson: text("assigned_person").notNull(),
  remarks: text("remarks"),
  createdBy: text("created_by"),
});

// 15. Issues table
export const issues = pgTable("issues", {
  id: text("id").primaryKey(), // ISS-NNN
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  issueType: text("issue_type").notNull(),
  reportedBy: text("reported_by").notNull(),
  reportDate: text("report_date").notNull(),
  priority: text("priority").notNull(),
  status: text("status").notNull(),
  solutionRemarks: text("solution_remarks"),
  createdBy: text("created_by"),
});

// 16. Documents table
export const documents = pgTable("documents", {
  id: text("id").primaryKey(), // DOC-NNN
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: text("file_size").notNull(),
  uploadDate: text("upload_date").notNull(),
  uploadedBy: text("uploaded_by").notNull(),
  description: text("description").notNull(),
  visibility: text("visibility").notNull(),
  fileUrl: text("file_url"),
  fileContent: text("file_content"),
  createdBy: text("created_by"),
});

// 17. Team Members table
export const teamMembers = pgTable("team_members", {
  id: text("id").primaryKey(), // TM-NNN
  projectId: text("project_id").notNull(),
  employeeName: text("employee_name").notNull(),
  cnic: text("cnic").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  designation: text("designation").notNull(),
  roleInProject: text("role_in_project").notNull(),
  joiningDate: text("joining_date").notNull(),
  salary: real("salary").notNull(),
  status: text("status").notNull(),
  avatarUrl: text("avatar_url"),
  createdBy: text("created_by"),
});

// 18. Final Handovers table
export const finalHandovers = pgTable("final_handovers", {
  projectId: text("project_id").primaryKey(),
  clientName: text("client_name").notNull(),
  completionDate: text("completion_date").notNull(),
  finalInspectionDate: text("final_inspection_date").notNull(),
  finalProjectImages: text("final_project_images"), // serialized comma-separated strings
  finalProjectVideo: text("final_project_video"),
  completionCertificateUrl: text("completion_certificate_url"),
  finalPaymentStatus: text("final_payment_status").notNull(),
  remainingBalance: real("remaining_balance").notNull(),
  handoverDocumentUrl: text("handover_document_url"),
  clientRemarks: text("client_remarks"),
  builderRemarks: text("builder_remarks"),
  approvedBy: text("approved_by").notNull(),
  isCompleted: boolean("is_completed").notNull(),
  createdBy: text("created_by"),
});

// 19. Notifications table
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  projectId: text("project_id"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  date: text("date").notNull(),
  isRead: boolean("is_read").notNull(),
  type: text("type").notNull(),
  createdBy: text("created_by"),
});

// 20. Activity Logs table
export const activityLogs = pgTable("activity_logs", {
  id: text("id").primaryKey(),
  projectId: text("project_id"),
  userEmail: text("user_email").notNull(),
  action: text("action").notNull(),
  timestamp: text("timestamp").notNull(),
  details: text("details").notNull(),
});

// 21. Client Receivables (Reimbursable Expenses) table
export const clientReceivables = pgTable("client_receivables", {
  id: text("id").primaryKey(), // CR-NNN
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  amountPaid: real("amount_paid").notNull(),
  datePaid: text("date_paid").notNull(),
  paidTo: text("paid_to").notNull(),
  category: text("category").notNull(),
  receiptUrl: text("receipt_url"),
  status: text("status").notNull(), // Pending Recovery, Recovered
  recoveryDate: text("recovery_date"),
  addedBy: text("added_by").notNull(),
  createdBy: text("created_by"),
});
