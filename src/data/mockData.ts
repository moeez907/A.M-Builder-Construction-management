/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  UserRole,
  Project,
  ProjectStatus,
  Worker,
  WorkerCategory,
  PaymentType,
  WorkerAttendance,
  AttendanceStatus,
  MaterialItem,
  MaterialPurchase,
  MaterialUsage,
  Supplier,
  SupplierPayment,
  DailyProgressReport,
  ProjectMedia,
  ProjectExpense,
  ClientPayment,
  Milestone,
  MilestoneStatus,
  IssueDelay,
  IssuePriority,
  IssueStatus,
  FinalHandover,
  ActivityLog,
  Notification,
  ProjectDocument,
  ProjectTeamMember,
  WorkerAdvance,
  WorkerDeduction,
  WorkerPayment
} from "../types";

// User database seed
export const initialUsers: User[] = [];

// Project database seed
export const initialProjects: Project[] = [];

// Project Documents
export const initialDocuments: ProjectDocument[] = [];

export const initialProjectTeam: ProjectTeamMember[] = [];

// Materials Inventory Database
export const initialMaterials: MaterialItem[] = [
  { id: "M-001", name: "Maple Leaf Ordinary Portland Cement Grade 53", category: "Cement", currentStock: 0, unit: "Bags", lowStockAlert: 100 },
  { id: "M-002", name: "Bestway Cement Ordinary Portland", category: "Cement", currentStock: 0, unit: "Bags", lowStockAlert: 100 },
  { id: "M-003", name: "Steel / Saria", category: "Steel", currentStock: 0, unit: "Kg", lowStockAlert: 500 },
  { id: "M-006", name: "Bricks (Red)", category: "Bricks", currentStock: 0, unit: "Bricks count", lowStockAlert: 10000 },
  { id: "M-007", name: "Sand / Rait", category: "Sand", currentStock: 0, unit: "Trips/Trolley", lowStockAlert: 10 },
  { id: "M-009", name: "Sargodha Crush / Bajri", category: "Crush/Gravel", currentStock: 0, unit: "Cubic feet", lowStockAlert: 1000 },
  { id: "M-011", name: "Soil Filling / Kassu", category: "Soil/Filling", currentStock: 0, unit: "Cubic feet", lowStockAlert: 2000 },
  { id: "M-012", name: "Popular PVC Pipes 4\"", category: "Plumbing", currentStock: 0, unit: "Feet", lowStockAlert: 200 },
  { id: "M-013", name: "Popular UPVC Pipes 2\"", category: "Plumbing", currentStock: 0, unit: "Feet", lowStockAlert: 200 },
  { id: "M-014", name: "GM Cables 3/0.29 (Copper)", category: "Electrical", currentStock: 0, unit: "Coils", lowStockAlert: 20 },
  { id: "M-015", name: "GM Cables 7/0.029 (Copper)", category: "Electrical", currentStock: 0, unit: "Coils", lowStockAlert: 15 },
  { id: "M-016", name: "Master MasterCote Emulsion Paint (White)", category: "Paint", currentStock: 0, unit: "Liters", lowStockAlert: 50 },
  { id: "M-017", name: "Diamond Weather Shield Exterior Paint", category: "Paint", currentStock: 0, unit: "Liters", lowStockAlert: 40 },
  { id: "M-018", name: "Kashmir Solid Ash Wood (Chowkhat)", category: "Wood", currentStock: 0, unit: "Cubic feet", lowStockAlert: 20 },
  { id: "M-019", name: "Diyar Wood (First Class)", category: "Wood", currentStock: 0, unit: "Cubic feet", lowStockAlert: 10 },
  { id: "M-020", name: "Master Off-White Floor Tiles 24x24", category: "Tiles", currentStock: 0, unit: "Square Meters", lowStockAlert: 100 },
  { id: "M-021", name: "Sonex Bathroom Fittings Set", category: "Fittings/Fixtures", currentStock: 0, unit: "Sets", lowStockAlert: 5 },
  { id: "M-022", name: "Zebra UPVC Wall Switch/Sockets", category: "Electrical", currentStock: 0, unit: "Pieces", lowStockAlert: 100 },
  { id: "M-023", name: "Termite Proof Spray (Chemical)", category: "Chemicals", currentStock: 0, unit: "Liters", lowStockAlert: 10 }
];

export const initialSuppliers: Supplier[] = [];

// Project-level Supplier payment records
export const initialSupplierPayments: SupplierPayment[] = [];

// Workers and Labor Database
export const initialWorkers: Worker[] = [];

// Attendance history - fully calculated wages for presentation!
export const initialAttendance: WorkerAttendance[] = [];

// Worker Advances / Deductions History
export const initialWorkerAdvances: WorkerAdvance[] = [];

export const initialWorkerDeductions: WorkerDeduction[] = [];

// Historical Worker Payments
export const initialWorkerPayments: WorkerPayment[] = [];

// Materials Purchase logs
export const initialPurchases: MaterialPurchase[] = [];

// Materials Usage Logs
export const initialUsage: MaterialUsage[] = [];

// Daily progress module connecting worker attendance + materials used
export const initialProgress: DailyProgressReport[] = [];

// Project Media Gallery
export const initialMedia: ProjectMedia[] = [];

// Expenses database tracker
export const initialExpenses: ProjectExpense[] = [];

// Client Payments tracking
export const initialClientPayments: ClientPayment[] = [];

// Construction Timeline Milestones
export const initialMilestones: Milestone[] = [];

// Project construction issues
export const initialIssues: IssueDelay[] = [];

// Activity logging database
export const initialActivityLogs: ActivityLog[] = [];

// Initial preloaded system notifications
export const initialNotifications: Notification[] = [];

export const initialHandover: FinalHandover = {
  projectId: "AMB-2026-001",
  clientName: "Mian Rafique",
  completionDate: "2026-11-28",
  finalInspectionDate: "2026-11-29",
  finalProjectImages: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&q=80"],
  finalProjectVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
  completionCertificateUrl: "final_completion_cert_AMB001.pdf",
  finalPaymentStatus: "Pending",
  remainingBalance: 23000000,
  handoverDocumentUrl: "key_handover_acknowledgement.pdf",
  clientRemarks: "Stunning finish and marvelous solid timber wood carvings. Extremely transparent and cooperative company team.",
  builderRemarks: "Delivered strictly on schedule despite critical union transit strikes. Excellent collaboration of civil engineering crews.",
  approvedBy: "Abdul Moeez Tariq",
  isCompleted: false
};
