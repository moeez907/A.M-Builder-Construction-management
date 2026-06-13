/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ADMIN = "CEO / Admin",
  PROJECT_MANAGER = "Project Manager",
  SUPERVISOR = "Site Supervisor",
  ACCOUNTANT = "Accountant",
  EMPLOYEE = "Employee",
  CLIENT = "Client"
}

export enum ProjectStatus {
  REGISTERED = "Registered",
  NOT_STARTED = "Not Started",
  ONGOING = "Ongoing",
  ON_HOLD = "On Hold",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled"
}

export enum WorkerCategory {
  LABOUR = "Labour",
  MASON = "Mason",
  CARPENTER = "Carpenter / Wood worker",
  ELECTRICIAN = "Electrician",
  PLUMBER = "Plumber",
  PAINTER = "Painter",
  TILE_WORKER = "Tile worker",
  STEEL_FIXER = "Steel fixer",
  WELDER = "Welder",
  MACHINE_OPERATOR = "Machine operator",
  SUPERVISOR = "Supervisor",
  OTHER = "Other"
}

export enum PaymentType {
  DAILY = "Daily wage / Diari basis",
  WEEKLY = "Weekly wage",
  MONTHLY = "Monthly salary",
  FIXED = "Fixed project contract",
  PER_TASK = "Per task basis",
  PER_SQFT = "Per square feet basis",
  PER_ROOM = "Per room / area basis",
  PER_ITEM = "Per item basis",
  CUSTOM = "Custom rate basis"
}

export enum AttendanceStatus {
  PRESENT = "Present",
  ABSENT = "Absent",
  HALF_DAY = "Half Day",
  OVERTIME = "Overtime"
}

export enum MilestoneStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  DELAYED = "Delayed"
}

export enum IssuePriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical"
}

export enum IssueStatus {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  RESOLVED = "Resolved",
  CLOSED = "Closed"
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  cnic?: string;
}

export interface Project {
  id: string; // e.g. AMB-2026-001
  name: string;
  type: string; // Residential, Commercial, Plaza, Renovation, etc.
  location: string;
  city: string;
  areaSize: string; // e.g., "10 Marla", "1 Kanal", "5000 Sqft"
  numFloors: number;
  estimatedCost: number;
  ratePerSqFt?: number;
  totalSqFt?: number;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  status: ProjectStatus;
  description: string;
  
  // Representative Information
  repName: string;
  repRole: string; // CEO, Project Manager, Employee
  repCnic: string;
  
  // Client Information
  clientName: string;
  clientCnic: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  clientAvatarUrl?: string;
  imageUrl?: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  type: string; // Agreement PDF, House Map, CNIC Copy, Payment Proof, etc.
  fileName: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  description: string;
  visibility: "Admin Only" | "Internal only" | "Client visible";
  fileUrl?: string;
}

export interface ProjectTeamMember {
  id: string;
  projectId: string;
  employeeName: string;
  cnic: string;
  phone: string;
  email: string;
  designation: string;
  roleInProject: string; // e.g. Architect, Quality Inspector, Site Supervisor, PM
  joiningDate: string;
  salary: number;
  status: "Active" | "Inactive";
  avatarUrl?: string;
}

export interface Worker {
  id: string;
  name: string;
  cnic: string;
  phone: string;
  address: string;
  photoUrl?: string;
  cnicCopyUrl?: string;
  emergencyContact?: string;
  category: WorkerCategory;
  projectId: string; // Assigned project
  joiningDate: string;
  status: "Active" | "Inactive" | "Left project";
  
  // Rate Setup Fields
  paymentType: PaymentType;
  agreedRate: number; // Daily rate, monthly salary, or contract amount
  rateUnit: string; // "Per day", "Per square feet", "Complete job", etc.
  workDescription: string;
  expectedEndDate?: string;
  agreedTotalAmount?: number; // For fixed contracts
  advancePaid: number;
  approvedBy: string;
  remarks?: string;
}

export interface WorkerAttendance {
  id: string;
  projectId: string;
  workerId: string;
  workerName: string; // cached for speed
  category: WorkerCategory;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  totalHours?: number;
  dailyRate: number;
  overtimeHours?: number;
  overtimeRate?: number;
  calculatedPay: number; // auto calculated
  workDoneToday: string;
  dailyWagePaymentStatus?: "Unpaid" | "Paid" | "Advance Adjusted";
  addedBy: string;
  approvedBy: string;
  remarks?: string;
}

export interface WorkerPayment {
  id: string;
  projectId: string;
  workerId: string;
  workerName: string;
  paymentType: PaymentType;
  date: string;
  payableAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: "Cash" | "Bank transfer" | "EasyPaisa" | "JazzCash" | "Other";
  paidBy: string;
  receivedBy: string;
  proofUrl?: string;
  remarks?: string;
}

export interface WorkerAdvance {
  id: string;
  projectId: string;
  workerId: string;
  workerName: string;
  amount: number;
  date: string;
  reason: string;
  approvedBy: string;
  remarks?: string;
}

export interface WorkerDeduction {
  id: string;
  projectId: string;
  workerId: string;
  workerName: string;
  amount: number;
  date: string;
  reason: "Absence" | "Damage" | "Loan adjustment" | "Work issue" | "Other";
  approvedBy: string;
  remarks?: string;
}

// Support materials list
export interface MaterialItem {
  id: string;
  name: string;
  category: string; // Bricks, Cement, Sand, Steel, etc.
  currentStock: number;
  unit: string; // Bags, Tons, Bricks count, Cubic feet, KG, Feet, Pieces, Liters
  lowStockAlert: number;
}

export interface MaterialPurchase {
  id: string;
  projectId: string;
  materialName: string;
  category: string;
  quantity: number;
  unit: string;
  supplierName: string;
  supplierPhone: string;
  purchaseDate: string;
  deliveryDate: string;
  ratePerUnit: number;
  totalCost: number;
  vehicleNumber: string;
  deliveredBy: string;
  receivedBy: string;
  approvedBy: string;
  invoiceUrl?: string;
  imageUrl?: string;
  remarks?: string;
  advancePaid?: number;
  deliveryStatus?: "Pending" | "Delivered";
}

export interface MaterialUsage {
  id: string;
  projectId: string;
  materialName: string;
  category: string;
  quantityUsedText?: string;
  quantityUsed: number;
  unit: string;
  usedDate: string;
  usedFor: string; // Foundation, Walls, Roof, Plaster, Flooring, Paint, Plumbing, Electrical, finishing
  addedBy: string;
  approvedBy: string;
  remarks?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  materialType: string; // e.g. "Steel & Cement", "Bricks & Sand"
  companyName: string;
  cnicOrNtn?: string;
  totalPurchases: number;
  totalPaid: number;
  remainingPayable: number;
  status: "Active" | "Inactive";
  advancePaid?: number;
}

export interface SupplierPayment {
  id: string;
  projectId: string;
  supplierName: string;
  materialSupplied: string;
  billAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentDate: string;
  paymentMethod: string;
  invoiceUrl?: string;
  remarks?: string;
}

export interface DailyProgressReport {
  id: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  workCategory: string; // Excavation, Foundation, Steel work, Concrete work, Brick work, Plaster, etc.
  workCompletedToday: string;
  numWorkersPresent: number;
  workersInvolved: string; // description of teams
  materialsUsedText: string; // detailed list of quantities
  labourCost: number; // calculated from attendance on that day
  materialCost: number; // calculated from usage on that day
  problemsFaced?: string;
  weatherCondition: string; // Clear, Rainy, Hot, Windy, cold
  delayReason?: string;
  nextDayPlan: string;
  imagesUrls?: string[];
  uploadedBy: string;
  approvedBy: string;
}

export interface ProjectMedia {
  id: string;
  projectId: string;
  title: string;
  mediaType: "Image" | "Video";
  fileUrl: string;
  date: string;
  constructionStage: string; // Ground floor, Roof, Kitchen, Bathroom, Boundary wall, etc.
  description: string;
  uploadedBy: string;
  visibility: "Internal Only" | "Client visible" | "Admin only";
  locationInHouse: string; // Front side, Ground floor, First floor, Roof, Kitchen, etc.
}

export interface ProjectExpense {
  id: string;
  projectId: string;
  title: string;
  category: "Material purchase" | "Labour payment" | "Worker salary" | "Machinery rent" | "Transport" | "Fuel" | "Food / tea expense" | "Tools purchase" | "Repair and maintenance" | "Supplier payment" | "Miscellaneous expense" | "Other";
  amount: number;
  date: string;
  paidTo: string;
  paymentMethod: string;
  receiptUrl?: string;
  addedBy: string;
  approvedBy: string;
  status: "Pending" | "Approved";
  remarks?: string;
}

export interface ClientPayment {
  id: string;
  projectId: string;
  clientName: string;
  totalProjectAmount: number;
  advancePayment: number;
  installmentAmount: number;
  paymentDate: string;
  paymentMethod: string;
  receivedBy: string;
  remainingBalance: number;
  proofUrl?: string;
  status: "Advance received" | "Partial payment" | "Installment pending" | "Fully paid";
  remarks?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string; // Project registration, Foundation, Grey structure, Roofing, Plaster, Flooring, Handover etc.
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  status: MilestoneStatus;
  progressPercentage: number;
  assignedPerson: string;
  remarks?: string;
}

export interface IssueDelay {
  id: string;
  projectId: string;
  title: string;
  description: string;
  issueType: "Material delay" | "Worker shortage" | "Weather issue" | "Client change request" | "Payment delay" | "Design issue" | "Technical issue" | "Other";
  reportedBy: string;
  reportDate: string;
  priority: IssuePriority;
  status: IssueStatus;
  solutionRemarks?: string;
}

export interface FinalHandover {
  projectId: string;
  clientName: string;
  completionDate: string;
  finalInspectionDate: string;
  finalProjectImages: string[];
  finalProjectVideo?: string;
  completionCertificateUrl?: string;
  finalPaymentStatus: "Paid" | "Pending";
  remainingBalance: number;
  handoverDocumentUrl?: string;
  clientRemarks?: string;
  builderRemarks?: string;
  approvedBy: string;
  isCompleted: boolean;
}

export interface ActivityLog {
  id: string;
  projectId?: string;
  userEmail: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  projectId?: string;
  isRead: boolean;
  type: "info" | "warning" | "success" | "alert";
}

export interface ClientReceivable {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  amountPaid: number;
  datePaid: string;
  paidTo: string;
  category: string;
  receiptUrl?: string;
  status: string; // 'Pending Recovery', 'Recovered'
  recoveryDate?: string;
  addedBy: string;
}

