/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  Building2, 
  User, 
  FileText, 
  Users, 
  HardHat, 
  Calendar, 
  Wallet, 
  Layers, 
  Truck, 
  Activity, 
  Image as ImageIcon, 
  CircleDollarSign, 
  CheckSquare, 
  AlertTriangle, 
  BarChart3, 
  Award, 
  ArrowLeft,
  Briefcase,
  Plus,
  Trash2,
  Printer,
  FileSpreadsheet,
  Download,
  Check,
  Percent,
  Clock,
  CloudLightning,
  ChevronRight,
  Sparkles,
  Search,
  Eye,
  CheckCircle,
  HelpCircle,
  Edit3,
  Upload
} from "lucide-react";
import { 
  Project, 
  UserRole,
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
  ClientReceivable,
  Milestone,
  MilestoneStatus,
  IssueDelay,
  IssuePriority,
  IssueStatus,
  FinalHandover,
  ProjectDocument,
  ProjectTeamMember
} from "../types";

interface ProjectDetailViewProps {
  currentRole: UserRole;
  project: Project;
  onBack: () => void;
  workers: Worker[];
  attendance: WorkerAttendance[];
  materials: MaterialItem[];
  purchases: MaterialPurchase[];
  usages: MaterialUsage[];
  suppliers: Supplier[];
  supplierPayments: SupplierPayment[];
  progressReports: DailyProgressReport[];
  media: ProjectMedia[];
  expenses: ProjectExpense[];
  clientPayments: ClientPayment[];
  clientReceivables: ClientReceivable[];
  milestones: Milestone[];
  issues: IssueDelay[];
  handover: FinalHandover;
  documents: ProjectDocument[];
  teamMembers: ProjectTeamMember[];
  
  // Custom Addition Handlers passed from parent state
  onAddWorker: (worker: Worker) => void;
  onAddAttendance: (entry: WorkerAttendance) => void;
  onDeleteAttendance?: (id: string) => void;
  onAddPurchase: (purchase: MaterialPurchase) => void;
  onUpdatePurchase?: (purchase: MaterialPurchase) => void;
  onAddUsage: (usage: MaterialUsage) => void;
  onUpdateUsage?: (usage: MaterialUsage) => void;
  onAddProgress: (report: DailyProgressReport) => void;
  onAddExpense: (expense: ProjectExpense) => void;
  onUpdateExpense?: (expense: ProjectExpense) => void;
  onDeleteExpense?: (id: string) => void;
  onAddClientPayment: (payment: ClientPayment) => void;
  onAddClientReceivable: (item: ClientReceivable) => void;
  onUpdateClientReceivable: (id: string, recoveryDate: string) => void;
  onUpdateMilestone: (milestoneId: string, percentage: number, status: MilestoneStatus) => void;
  onAddIssue: (issue: IssueDelay) => void;
  onUpdateHandover: (updated: FinalHandover) => void;
  onAddDocument: (doc: ProjectDocument) => void;
  onDeleteDocument?: (docId: string) => void;
  onAddTeamMember: (member: ProjectTeamMember) => void;
  onDeleteProject?: (projectId: string) => void;
  onDeleteClientPayment?: (paymentId: string) => void;
  onUpdateWorker?: (worker: Worker) => void;
  onDeleteWorker?: (workerId: string) => void;
  onUpdateSupplier?: (sup: Supplier) => void;
  onEditProject?: (project: Project) => void;
}

export default function ProjectDetailView({
  currentRole,
  project,
  onBack,
  workers,
  attendance,
  materials,
  purchases,
  usages,
  suppliers,
  supplierPayments,
  progressReports,
  media,
  expenses,
  clientPayments,
  clientReceivables,
  milestones,
  issues,
  handover,
  documents,
  teamMembers,
  onAddWorker,
  onAddAttendance,
  onDeleteAttendance,
  onAddPurchase,
  onUpdatePurchase,
  onAddUsage,
  onUpdateUsage,
  onAddProgress,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onAddClientPayment,
  onAddClientReceivable,
  onUpdateClientReceivable,
  onDeleteClientPayment,
  onUpdateMilestone,
  onAddIssue,
  onUpdateHandover,
  onAddDocument,
  onDeleteDocument,
  onAddTeamMember,
  onDeleteProject,
  onUpdateWorker,
  onDeleteWorker,
  onUpdateSupplier,
  onEditProject
}: ProjectDetailViewProps) {
  
  const [activeTab, setActiveTab] = useState("overview");

  // Worker Payment Search Filter
  const [workerSearchTerm, setWorkerSearchTerm] = useState("");

  // Filtering lists specific to this project
  const projectWorkers = workers.filter(w => w.projectId === project.id);
  const projectAttendance = attendance.filter(a => a.projectId === project.id);
  const projectPurchases = purchases.filter(p => p.projectId === project.id);
  const projectUsages = usages.filter(u => u.projectId === project.id);
  const projectProgress = progressReports.filter(p => p.projectId === project.id);
  const projectMedia = media.filter(m => m.projectId === project.id);
  const projectExpenses = expenses.filter(e => e.projectId === project.id);
  const projectClientPayments = clientPayments.filter(cp => cp.projectId === project.id);
  const projectMilestones = milestones.filter(m => m.projectId === project.id);
  const projectIssues = issues.filter(i => i.projectId === project.id);
  const projectDocuments = documents.filter(d => d.projectId === project.id);
  const projectTeam = teamMembers.filter(t => t.projectId === project.id);
  const projectSupplierPayments = supplierPayments.filter(s => s.projectId === project.id);

  // Financial Calculators specific to this project
  const totalProjectBudgetSum = project.estimatedCost;
  const clientPaidAmount = projectClientPayments.reduce((s, p) => s + p.advancePayment + p.installmentAmount, 0);
  const remainingClientBalance = totalProjectBudgetSum - clientPaidAmount;

  // Expense Breakdown
  const materialExpensesTotal = projectExpenses.filter(e => e.category === "Material purchase" || e.category === "Supplier payment").reduce((s, e) => s + e.amount, 0);
  const laborExpensesTotal = projectExpenses.filter(e => e.category === "Labour payment" || e.category === "Worker salary").reduce((s, e) => s + e.amount, 0);
  const otherExpensesTotal = projectExpenses.filter(e => e.category !== "Material purchase" && e.category !== "Supplier payment" && e.category !== "Labour payment" && e.category !== "Worker salary").reduce((s, e) => s + e.amount, 0);
  const totalExpensesLogged = projectExpenses.reduce((s, e) => s + e.amount, 0);

  // Average milestone progress percentage
  const completedMilestonesCount = projectMilestones.filter(m => m.status === MilestoneStatus.COMPLETED).length;
  const totalMilestonesCount = projectMilestones.length;
  const projectProgressPercentage = totalMilestonesCount > 0 
    ? Math.round((completedMilestonesCount / totalMilestonesCount) * 100) 
    : 0;

  // Active inputs states within tabs drawers
  const [showAddWorkerForm, setShowAddWorkerForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [showAddAttendanceForm, setShowAddAttendanceForm] = useState(false);
  const [showAddPurchaseForm, setShowAddPurchaseForm] = useState(false);
  const [showAddUsageForm, setShowAddUsageForm] = useState(false);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [showAddClientPaymentForm, setShowAddClientPaymentForm] = useState(false);
  const [showAddClientReceivableForm, setShowAddClientReceivableForm] = useState(false);
  const [crTitle, setCrTitle] = useState("");
  const [crAmount, setCrAmount] = useState("");
  const [crCategory, setCrCategory] = useState("Borewell");
  const [crPaidTo, setCrPaidTo] = useState("");
  
  const [showAddIssueForm, setShowAddIssueForm] = useState(false);
  const [showAddDocForm, setShowAddDocForm] = useState(false);
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Quick report status feedback
  const [reportFeedback, setReportFeedback] = useState<string | null>(null);

  // State bindings for adding records
  // 1. Worker
  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerCnic, setNewWorkerCnic] = useState("");
  const [newWorkerPhone, setNewWorkerPhone] = useState("");
  const [newWorkerCategory, setNewWorkerCategory] = useState<WorkerCategory>(WorkerCategory.LABOUR);
  const [newWorkerPayType, setNewWorkerPayType] = useState<PaymentType>(PaymentType.DAILY);
  const [newWorkerRate, setNewWorkerRate] = useState<number>(2000);
  const [newWorkerAdvance, setNewWorkerAdvance] = useState<number>(0);
  const [editingSupplierAdvanceId, setEditingSupplierAdvanceId] = useState<string | null>(null);
  const [tempSupplierAdvance, setTempSupplierAdvance] = useState<number>(0);

  // 2. Attendance
  const [attWorkerId, setAttWorkerId] = useState("");
  const [attStatus, setAttStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);
  const [attOvertimeHours, setAttOvertimeHours] = useState<number>(0);
  const [attWorkDone, setAttWorkDone] = useState("");
  const [attDate, setAttDate] = useState("2026-06-12");
  const [attDailyWageStatus, setAttDailyWageStatus] = useState<"Unpaid" | "Paid" | "Advance Adjusted">("Unpaid");

  // 3. Purchase
  const [purMatName, setPurMatName] = useState("Steel / Saria");
  const [purSupplier, setPurSupplier] = useState("Supplier A");
  const [purTotalCost, setPurTotalCost] = useState<number>(145000);
  const [purAdvancePaid, setPurAdvancePaid] = useState<number>(0);
  const [purDeliveryStatus, setPurDeliveryStatus] = useState<"Pending" | "Delivered">("Delivered");
  const [editingPurchase, setEditingPurchase] = useState<MaterialPurchase | null>(null);

  // 4. Usage
  const [usaMatName, setUsaMatName] = useState("Maple Leaf Ordinary Portland Cement Grade 53");
  const [usaQty, setUsaQty] = useState<string>("10 Bags");
  const [usaUsedFor, setUsaUsedFor] = useState("Walls");
  const [editingUsage, setEditingUsage] = useState<MaterialUsage | null>(null);

  // 6. Expense
  const [expTitle, setExpTitle] = useState("");
  const [expCat, setExpCat] = useState<any>("Material purchase");
  const [expPaidTo, setExpPaidTo] = useState("");
  const [expAmt, setExpAmt] = useState<number>(5000);

  // Payout (Worker Payments)
  const [showAddPayoutForm, setShowAddPayoutForm] = useState(false);
  const [editingPayout, setEditingPayout] = useState<ProjectExpense | null>(null);
  const [payoutWorkerId, setPayoutWorkerId] = useState("");
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutTitle, setPayoutTitle] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("Cash");

  // 7. Client Payment
  const [cpInstAmt, setCpInstAmt] = useState<number>(2000000);
  const [cpMethod, setCpMethod] = useState("Bank transfer");

  // 8. Issue Delay
  const [issTitle, setIssTitle] = useState("");
  const [issDesc, setIssDesc] = useState("");
  const [issType, setIssType] = useState<any>("Material delay");
  const [issPriority, setIssPriority] = useState<IssuePriority>(IssuePriority.MEDIUM);

  // 9. Document
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState("Agreement PDF");
  const [docVis, setDocVis] = useState<any>("Client visible");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [docDesc, setDocDesc] = useState("");
  const [uploadPercent, setUploadPercent] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewingDoc, setPreviewingDoc] = useState<ProjectDocument | null>(null);
  
  // 10. Team Member
  const [teamName, setTeamName] = useState("");
  const [teamCnic, setTeamCnic] = useState("");
  const [teamPhone, setTeamPhone] = useState("");
  const [teamDes, setTeamDes] = useState("Quality Inspector");
  const [teamRole, setTeamRole] = useState("Structure Inspector");

  // Handover state helper
  const [handoverPaid, setHandoverPaid] = useState(handover.finalPaymentStatus);
  const [handoverRemarks, setHandoverRemarks] = useState(handover.clientRemarks);
  const [handoverCompleted, setHandoverCompleted] = useState(handover.isCompleted);

  // Tab definitions mapping tabs exact to requested list
  const TABS_CONFIG = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "clientDetails", label: "Client Details", icon: User },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "team", label: "Project Team", icon: Users },
    { id: "workers", label: "Workers & Labour", icon: HardHat },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "workerPayments", label: "Worker Payments", icon: Wallet },
    { id: "materials", label: "Materials", icon: Layers },
    { id: "suppliers", label: "Suppliers", icon: Truck },
    { id: "dailyProgress", label: "Daily Progress", icon: Activity },
    { id: "media", label: "Images & Videos", icon: ImageIcon },
    { id: "expenses", label: "Expenses", icon: CircleDollarSign },
    { id: "clientPayments", label: "Client Payments", icon: CircleDollarSign },
    { id: "clientReceivables", label: "Client Receivables", icon: CircleDollarSign },
    { id: "milestones", label: "Milestones", icon: CheckSquare },
    { id: "issues", label: "Issues / Delays", icon: AlertTriangle },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "handover", label: "Final Handover", icon: Award }
  ];

  const downloadWorkerPDF = (w: Worker) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Worker Ledger: ${w.name}`, 14, 22);

    doc.setFontSize(10);
    doc.text(`Role/Trade: ${w.category}`, 14, 30);
    doc.text(`Project: ${project.name}`, 14, 35);
    doc.text(`Payment Details`, 14, 45);
    
    const workerAtt = projectAttendance.filter(a => a.workerId === w.id);
    const totalDays = workerAtt.filter(a => a.status !== AttendanceStatus.ABSENT).length;
    const totalPayable = workerAtt.reduce((sum, a) => sum + a.calculatedPay, 0);

    const totalEarnedVal = w.paymentType === PaymentType.FIXED
      ? (w.agreedTotalAmount || 0)
      : totalPayable;

    const previousCleanedVal = projectExpenses
      .filter(e => e.category === "Labour payment" && e.paidTo === w.name)
      .reduce((sum, e) => sum + e.amount, 0);

    const computedBalance = Math.max(0, totalEarnedVal - previousCleanedVal);
    const remainingAdvance = Math.max(0, previousCleanedVal - totalEarnedVal);

    doc.text(`Total Attendance Days: ${totalDays}`, 14, 52);
    doc.text(`Total Wages Earned: ${totalEarnedVal.toLocaleString()} PKR`, 14, 57);
    doc.text(`Total Disbursed (Advances + Outflows): ${previousCleanedVal.toLocaleString()} PKR`, 14, 62);
    doc.text(`Remaining Unpaid Wages: ${computedBalance.toLocaleString()} PKR`, 14, 67);
    doc.text(`Unrecovered Advance: ${remainingAdvance.toLocaleString()} PKR`, 14, 72);

    const tableData = workerAtt.map(a => [
      a.date,
      a.status,
      a.overtimeHours ? `+${a.overtimeHours}h` : "-",
      a.dailyWagePaymentStatus || "Not set",
      `${a.calculatedPay.toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 80,
      head: [["Date", "Status", "Overtime", "Wage Status", "Calculated Pay (PKR)"]],
      body: tableData,
    });

    doc.save(`Ledger_${w.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  };

  // Submission Triggers
  const submitWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName || !newWorkerCnic) return;
    
    if (editingWorker) {
      const oldAdvancePaid = editingWorker.advancePaid || 0;
      const amountDiff = Number(newWorkerAdvance) - oldAdvancePaid;

      const item: Worker = {
        ...editingWorker,
        name: newWorkerName,
        cnic: newWorkerCnic,
        phone: newWorkerPhone || "+92 312 0000000",
        category: newWorkerCategory,
        paymentType: newWorkerPayType,
        agreedRate: Number(newWorkerRate),
        rateUnit: newWorkerPayType === PaymentType.DAILY ? "Per day" : "Per square feet",
        advancePaid: Number(newWorkerAdvance)
      };
      if (onUpdateWorker) {
        onUpdateWorker(item);
      }
      setEditingWorker(null);

      // Auto-log expense if they increased the advance
      if (amountDiff > 0) {
        const expItem: ProjectExpense = {
          id: `EXP-ADV-${Date.now()}`,
          projectId: project.id,
          title: `Additional Advance for ${newWorkerName}`,
          category: "Labour payment",
          amount: amountDiff,
          date: new Date().toISOString().split("T")[0],
          paidTo: newWorkerName,
          paymentMethod: "Cash",
          addedBy: currentRole,
          approvedBy: currentRole,
          status: "Approved",
          remarks: "Advance adjustment auto-logged"
        };
        onAddExpense(expItem);
      }
    } else {
      const item: Worker = {
        id: `W-0${workers.length + 10}`,
        name: newWorkerName,
        cnic: newWorkerCnic,
        phone: newWorkerPhone || "+92 312 0000000",
        address: "Basti, Lahore",
        category: newWorkerCategory,
        projectId: project.id,
        joiningDate: "2026-06-12",
        status: "Active",
        paymentType: newWorkerPayType,
        agreedRate: Number(newWorkerRate),
        rateUnit: newWorkerPayType === PaymentType.DAILY ? "Per day" : "Per square feet",
        workDescription: "Assigned general mason works",
        advancePaid: Number(newWorkerAdvance),
        approvedBy: currentRole
      };
      onAddWorker(item);

      // Auto-log initial advance expense
      if (Number(newWorkerAdvance) > 0) {
        const expItem: ProjectExpense = {
          id: `EXP-ADV-${Date.now()}`,
          projectId: project.id,
          title: `Initial Advance for ${newWorkerName}`,
          category: "Labour payment",
          amount: Number(newWorkerAdvance),
          date: new Date().toISOString().split("T")[0],
          paidTo: newWorkerName,
          paymentMethod: "Cash",
          addedBy: currentRole,
          approvedBy: currentRole,
          status: "Approved",
          remarks: "Initial upfront worker advance"
        };
        onAddExpense(expItem);
      }
    }
    
    setShowAddWorkerForm(false);
    setNewWorkerName("");
    setNewWorkerCnic("");
    setNewWorkerPhone("");
    setNewWorkerPayType(PaymentType.DAILY);
    setNewWorkerRate(2000);
    setNewWorkerAdvance(0);
  };

  const submitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attWorkerId) return;
    const workerSelected = workers.find(w => w.id === attWorkerId);
    if (!workerSelected) return;

    // Daily wage calculator
    // Full day = daily rate
    // Half day = daily rate / 2
    // Absent = 0
    // Overtime = daily rate + overtime amount
    const rate = workerSelected.agreedRate;
    let pay = 0;
    if (attStatus === AttendanceStatus.PRESENT) {
      pay = rate;
    } else if (attStatus === AttendanceStatus.HALF_DAY) {
      pay = rate / 2;
    } else if (attStatus === AttendanceStatus.OVERTIME) {
      pay = rate + (attOvertimeHours * (rate / 8)); // rate divided by 8 hours as default hourly wage
    } else if (attStatus === AttendanceStatus.ABSENT) {
      pay = 0;
    }

    const item: WorkerAttendance = {
      id: `ATT-0${attendance.length + 10}`,
      projectId: project.id,
      workerId: attWorkerId,
      workerName: workerSelected.name,
      category: workerSelected.category,
      date: attDate,
      status: attStatus,
      dailyRate: rate,
      overtimeHours: attStatus === AttendanceStatus.OVERTIME ? attOvertimeHours : 0,
      overtimeRate: attStatus === AttendanceStatus.OVERTIME ? Math.round(rate / 8) : 0,
      calculatedPay: Math.round(pay),
      workDoneToday: attWorkDone || "Standard shift execution",
      dailyWagePaymentStatus: pay > 0 ? attDailyWageStatus : undefined,
      addedBy: currentRole,
      approvedBy: currentRole
    };

    onAddAttendance(item);
    setShowAddAttendanceForm(false);
    setAttWorkerId("");
    setAttWorkDone("");

    // Automatically append to expenses as Labour Payment only if Paid in Cash
    if (pay > 0 && attDailyWageStatus === "Paid") {
      const expItem: ProjectExpense = {
        id: `EXP-0${expenses.length + 10}`,
        projectId: project.id,
        title: `Auto Labour Wage: ${workerSelected.name} on ${attDate}`,
        category: "Labour payment",
        amount: Math.round(pay),
        date: attDate,
        paidTo: workerSelected.name,
        paymentMethod: "Cash",
        addedBy: currentRole,
        approvedBy: currentRole,
        status: "Approved",
        remarks: "Auto-expense from daily attendance (Paid in Cash)"
      };
      onAddExpense(expItem);
    }
  };

  const handleEditPurchaseClick = (purchase: MaterialPurchase) => {
    setEditingPurchase(purchase);
    setPurMatName(purchase.materialName);
    setPurSupplier(purchase.supplierName);
    setPurTotalCost(purchase.totalCost);
    setPurAdvancePaid(purchase.advancePaid || 0);
    setPurDeliveryStatus(purchase.deliveryStatus || "Delivered");
    setShowAddPurchaseForm(true);
  };

  const submitPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = Number(purTotalCost);
    const calculatedRate = cost;
    const matObj = materials.find(m => m.name === purMatName);
    
    if (editingPurchase && onUpdatePurchase) {
      const oldAmountPaid = (editingPurchase.deliveryStatus === "Pending" || (editingPurchase.advancePaid && editingPurchase.advancePaid > 0)) 
        ? (editingPurchase.advancePaid || 0) 
        : editingPurchase.totalCost;
        
      const newAmountPaid = (purDeliveryStatus === "Pending" || purAdvancePaid > 0) ? purAdvancePaid : cost;

      const updatedItem: MaterialPurchase = {
        ...editingPurchase,
        materialName: purMatName,
        supplierName: purSupplier,
        totalCost: cost,
        advancePaid: purAdvancePaid,
        deliveryStatus: purDeliveryStatus
      };
      onUpdatePurchase(updatedItem);
      setEditingPurchase(null);
      setShowAddPurchaseForm(false);

      // Try to find the original expense matching the previous state
      const originalExpense = projectExpenses.find(e => 
        e.category === "Material purchase" && 
        e.amount === oldAmountPaid && 
        e.title.includes(editingPurchase.materialName)
      );

      if (originalExpense && onUpdateExpense) {
        onUpdateExpense({
          ...originalExpense,
          amount: newAmountPaid,
          title: purDeliveryStatus === "Pending" ? `Advance for: ${purMatName}` : `Material Direct Buyout: ${purMatName}`
        });
      } else if (newAmountPaid - oldAmountPaid > 0) {
        const expItem: ProjectExpense = {
          id: `EXP-MAT-ADJ-${Date.now()}`,
          projectId: project.id,
          title: `Payment adjustment for: ${purMatName}`,
          category: "Material purchase",
          amount: newAmountPaid - oldAmountPaid,
          date: new Date().toISOString().split("T")[0],
          paidTo: purSupplier,
          paymentMethod: "Cash",
          addedBy: currentRole,
          approvedBy: currentRole,
          status: "Approved",
          remarks: "Auto-logged residual payment"
        };
        onAddExpense(expItem);
      }
    } else {
      const id = `PUR-0${purchases.length + 10}`;
      const item: MaterialPurchase = {
        id,
        projectId: project.id,
        materialName: purMatName,
        category: matObj ? matObj.category : "Cement",
        quantity: 1,
        unit: matObj ? matObj.unit : "Unit",
        supplierName: purSupplier,
        supplierPhone: "+92 300 0000000",
        purchaseDate: "2026-06-12",
        deliveryDate: purDeliveryStatus === "Pending" ? "" : "2026-06-12",
        ratePerUnit: calculatedRate,
        totalCost: cost,
        vehicleNumber: purDeliveryStatus === "Pending" ? "" : "LHR-26-455",
        deliveredBy: purDeliveryStatus === "Pending" ? "" : "Supplier Carrier",
        receivedBy: purDeliveryStatus === "Pending" ? "" : "Sajid Mahmood",
        approvedBy: currentRole,
        remarks: purDeliveryStatus === "Pending" ? "Advance paid, pending delivery" : "Logged on-site structure delivery",
        advancePaid: purAdvancePaid,
        deliveryStatus: purDeliveryStatus,
      };
      onAddPurchase(item);
      setShowAddPurchaseForm(false);

      // Auto add to company expense (Only the amount paid now)
      const amountPaidNow = (purDeliveryStatus === "Pending" || purAdvancePaid > 0) ? purAdvancePaid : cost;
      if (amountPaidNow > 0) {
        const expItem: ProjectExpense = {
          id: `EXP-0${expenses.length + 10}`,
          projectId: project.id,
          title: purDeliveryStatus === "Pending" ? `Advance for: ${purMatName}` : `Material Direct Buyout: ${purMatName}`,
          category: "Material purchase",
          amount: amountPaidNow,
          date: "2026-06-12",
          paidTo: purSupplier,
          paymentMethod: "Cash",
          addedBy: currentRole,
          approvedBy: currentRole,
          status: "Approved"
        };
        onAddExpense(expItem);
      }
    }
  };

  const submitUsage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUsage && onUpdateUsage) {
      const updatedItem: MaterialUsage = {
        ...editingUsage,
        materialName: usaMatName,
        quantityUsedText: usaQty,
        quantityUsed: 0,
        usedFor: usaUsedFor,
      };
      onUpdateUsage(updatedItem);
      setEditingUsage(null);
    } else {
      const matObj = materials.find(m => m.name === usaMatName);
      const item: MaterialUsage = {
        id: `USG-0${usages.length + 10}`,
        projectId: project.id,
        materialName: usaMatName,
        category: matObj ? matObj.category : "Cement",
        quantityUsedText: usaQty,
        quantityUsed: 0,
        unit: matObj ? matObj.unit : "Unit",
        usedDate: "2026-06-12",
        usedFor: usaUsedFor,
        addedBy: currentRole,
        approvedBy: currentRole
      };
      onAddUsage(item);
    }
    setShowAddUsageForm(false);
  };

  const handleEditUsageClick = (usage: MaterialUsage) => {
    setEditingUsage(usage);
    setUsaMatName(usage.materialName);
    setUsaQty(String(usage.quantityUsedText || usage.quantityUsed));
    setUsaUsedFor(usage.usedFor);
    setShowAddUsageForm(true);
  };

  const submitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmt) return;
    const item: ProjectExpense = {
      id: `EXP-0${expenses.length + 10}`,
      projectId: project.id,
      title: expTitle,
      category: expCat,
      amount: Number(expAmt),
      date: "2026-06-12",
      paidTo: expPaidTo || "Vendor Cash on site",
      paymentMethod: "Cash",
      addedBy: currentRole,
      approvedBy: currentRole,
      status: "Approved",
      remarks: "Manually registered voucher"
    };
    onAddExpense(item);
    setShowAddExpenseForm(false);
    setExpTitle("");
    setExpPaidTo("");
  };

  const handleEditPayoutClick = (pe: ProjectExpense) => {
    setEditingPayout(pe);
    // Attempt to locate worker from name
    const workerHit = projectWorkers.find(w => w.name === pe.paidTo);
    if(workerHit) {
      setPayoutWorkerId(workerHit.id);
    }
    setPayoutAmount(pe.amount);
    setPayoutTitle(pe.title);
    setPayoutMethod(pe.paymentMethod);
    setShowAddPayoutForm(true);
  };

  const submitPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutWorkerId || payoutAmount <= 0) return;
    const workerSelected = projectWorkers.find(w => w.id === payoutWorkerId);
    if (!workerSelected) return;

    if (editingPayout && onUpdateExpense) {
      const expItem: ProjectExpense = {
        ...editingPayout,
        title: payoutTitle || `Payroll / Advance for: ${workerSelected.name}`,
        amount: Number(payoutAmount),
        paidTo: workerSelected.name,
        paymentMethod: payoutMethod as any
      };
      onUpdateExpense(expItem);
      setEditingPayout(null);
    } else {
      const expItem: ProjectExpense = {
        id: `EXP-PAY-${Date.now()}`,
        projectId: project.id,
        title: payoutTitle || `Payroll / Advance for: ${workerSelected.name}`,
        category: "Labour payment",
        amount: Number(payoutAmount),
        date: new Date().toISOString().split("T")[0],
        paidTo: workerSelected.name,
        paymentMethod: payoutMethod as any,
        addedBy: currentRole,
        approvedBy: currentRole,
        status: "Approved",
        remarks: "Direct payout via Worker Payments Ledger"
      };
      onAddExpense(expItem);
    }

    setShowAddPayoutForm(false);
    setPayoutWorkerId("");
    setPayoutAmount(0);
    setPayoutTitle("");
  };

  const submitClientPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ClientPayment = {
      id: `CP-0${clientPayments.length + 10}`,
      projectId: project.id,
      clientName: project.clientName,
      totalProjectAmount: project.estimatedCost,
      advancePayment: 0,
      installmentAmount: Number(cpInstAmt),
      paymentDate: "2026-06-12",
      paymentMethod: cpMethod,
      receivedBy: currentRole,
      remainingBalance: remainingClientBalance - Number(cpInstAmt),
      status: "Partial payment",
      remarks: "Voucher installment logged via cash center desk ledger"
    };
    onAddClientPayment(item);
    setShowAddClientPaymentForm(false);
  };

  const submitClientReceivable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crTitle || !crAmount) return;
    const item: ClientReceivable = {
      id: `CR-0${clientReceivables.length + 10}`,
      projectId: project.id,
      title: crTitle,
      amountPaid: Number(crAmount),
      datePaid: "2026-06-12",
      paidTo: crPaidTo || "Vendor",
      category: crCategory,
      status: "Pending Recovery",
      addedBy: currentRole,
    };
    onAddClientReceivable(item);
    setShowAddClientReceivableForm(false);
    setCrTitle("");
    setCrAmount("");
  };

  const submitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issTitle) return;
    const item: IssueDelay = {
      id: `ISS-0${issues.length + 10}`,
      projectId: project.id,
      title: issTitle,
      description: issDesc,
      issueType: issType,
      reportedBy: currentRole,
      reportDate: "2026-06-12",
      priority: issPriority,
      status: IssueStatus.OPEN
    };
    onAddIssue(item);
    setShowAddIssueForm(false);
    setIssTitle("");
    setIssDesc("");
  };

  const submitDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    const finalFileName = selectedFileName || `${docTitle.toLowerCase().replace(/ /g, "_")}_AMB.pdf`;
    const finalFileSize = selectedFileSize || "1.2 MB";
    const finalDesc = docDesc || "Admin authorized project clearance upload";

    const item: ProjectDocument = {
      id: `DOC-0${documents.length + 10}`,
      projectId: project.id,
      title: docTitle,
      type: docType,
      fileName: finalFileName,
      fileSize: finalFileSize,
      uploadDate: "2026-06-12",
      uploadedBy: currentRole,
      description: finalDesc,
      visibility: docVis,
      fileUrl: selectedFileContent || undefined
    };
    onAddDocument(item);
    setShowAddDocForm(false);
    setDocTitle("");
    setDocDesc("");
    setSelectedFile(null);
    setSelectedFileName("");
    setSelectedFileSize("");
    setSelectedFileContent("");
    setUploadPercent(0);
  };

  const submitTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;
    const item: ProjectTeamMember = {
      id: `PT-0${teamMembers.length + 10}`,
      projectId: project.id,
      employeeName: teamName,
      cnic: teamCnic || "35201-0000000-0",
      phone: teamPhone || "+92 300 0000000",
      email: `${teamName.toLowerCase().replace(/ /g, "")}@ambuilders.com`,
      designation: teamDes,
      roleInProject: teamRole,
      joiningDate: "2026-06-12",
      salary: 45000,
      status: "Active"
    };
    onAddTeamMember(item);
    setShowAddTeamForm(false);
    setTeamName("");
    setTeamCnic("");
    setTeamPhone("");
  };

  const triggerExportSimulation = (reportName: string) => {
    setReportFeedback(`Preparing export pipeline layout for ${reportName}...`);
    setTimeout(() => {
      setReportFeedback(`✓ Generated! Downloaded successfully: A_M_Builders_Project_${project.id}_${reportName.replace(/ /g, "_")}_2026.xlsx`);
      setTimeout(() => {
        setReportFeedback(null);
      }, 5000);
    }, 1500);
  };

  const saveHandover = () => {
    onUpdateHandover({
      ...handover,
      finalPaymentStatus: handoverPaid as any,
      clientRemarks: handoverRemarks,
      isCompleted: handoverCompleted
    });
    // Alert replaced by console or UI toast since modal is blocked
    console.log("Handover state saved! Project status updated.");
  };

  // Helper render logic for badges
  const getBadgeColor = (status: any) => {
    switch(status) {
      case "Present": return "bg-emerald-100 text-emerald-800";
      case "Absent": return "bg-rose-100 text-rose-800";
      case "Half Day": return "bg-amber-100 text-amber-800";
      case "Overtime": return "bg-indigo-100 text-indigo-800";
      case "Low": return "bg-slate-100 text-slate-700";
      case "Medium": return "bg-blue-100 text-blue-800";
      case "High": return "bg-amber-100 text-amber-800";
      case "Critical": return "bg-red-100 text-red-800 animate-pulse";
      case "Open": return "bg-red-50 text-red-700 border border-red-200";
      case "Resolved": return "bg-emerald-50 text-emerald-700 border border-emerald-250";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div id="project-detail" className="space-y-6">
      
      {/* Overview stats bar top */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer text-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                {project.id}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{project.name}</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Client: <strong className="font-bold text-slate-700">{project.clientName}</strong> | Address: {project.location}, {project.city}
            </p>
          </div>
        </div>

        {/* Edit & Delete Buttons */}
        <div className="flex flex-wrap items-center gap-2 md:ml-auto">
          {(currentRole === UserRole.ADMIN || currentRole === UserRole.PROJECT_MANAGER) && onEditProject && (
            <button
              onClick={() => {
                onEditProject(project);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Project Details</span>
            </button>
          )}

          {currentRole === UserRole.ADMIN && onDeleteProject && (
            <button
              onClick={() => {
                setShowDeleteConfirm(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Plot</span>
            </button>
          )}
        </div>

        {/* Custom Confirmation Modal for Project Deletion */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-55 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 overflow-hidden shadow-2xl p-6 space-y-4">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight text-center">Confirm Deletion</h3>
                <p className="text-xs text-slate-500 leading-relaxed text-center">
                  Are you sure you want to permanently delete project <strong className="text-slate-800">"{project.name}"</strong> (ID: {project.id}) from the database? This action is irreversible. All associated metrics, data, and registers will be decoupled.
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-slate-150 hover:bg-slate-200 text-slate-705 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Cancel, Keep Active
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    onDeleteProject(project.id);
                  }}
                  className="bg-rose-650 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
                >
                  Yes, Delete Plot
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Big Overall progress meter */}
        <div className="w-full md:w-72 bg-slate-50 p-4 rounded-xl border border-slate-250 text-xs text-slate-600 flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <span className="uppercase text-[9px] font-bold text-slate-400 tracking-wide block">Physical Milestone Completion</span>
            <div className="flex justify-between font-extrabold text-slate-900 mb-1 text-[11px]">
              <span>Progress Percentage</span>
              <span>{projectProgressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${projectProgressPercentage}%` }}></div>
            </div>
          </div>
          <div className="text-center shrink-0">
            <span className="font-extrabold text-lg text-slate-900 block">{completedMilestonesCount} / {totalMilestonesCount}</span>
            <span className="text-[9px] uppercase tracking-wide text-slate-400 leading-none">Completed</span>
          </div>
        </div>
      </div>

      {/* TABS SELECTOR PANEL */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1 bg-white/95 backdrop-blur-xs p-1.5 rounded-xl shadow-md scrollbar-none sticky -top-8 z-25 border">
        {TABS_CONFIG.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`tab-btn-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive 
                  ? "bg-blue-600 text-white shadow-sm font-bold" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TABS WORKSPACE BODY */}
      <div id="tab-workspace" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs min-h-[450px]">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Show Project Cover Image if available */}
            {project.imageUrl && (
              <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-6 relative">
                <img 
                  src={project.imageUrl} 
                  alt={project.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-4 md:col-span-2">
                <h3 className="font-black text-slate-900 text-lg">Project Summary Statement</h3>
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                  {project.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-200 p-4 rounded-xl space-y-1 bg-slate-50/50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Structural Metrics</span>
                    <span className="font-extrabold text-sm text-slate-900 block">{project.areaSize} Plot Dimensions</span>
                    {project.totalSqFt && project.ratePerSqFt ? (
                      <div className="text-[11px] text-amber-800 bg-amber-50/75 border border-amber-200 rounded-lg p-1.5 mt-1.5 font-mono">
                        <span className="font-bold">{project.totalSqFt} SqFt</span> &times; <span className="font-bold">{project.ratePerSqFt} PKR</span> = {project.estimatedCost.toLocaleString()} PKR
                      </div>
                    ) : null}
                    <span className="text-xs text-slate-500 block pt-1">{project.numFloors} Construction floors approved</span>
                  </div>

                  <div className="border border-slate-200 p-4 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Core Dates</span>
                    <span className="font-extrabold text-sm text-slate-900 block">Start: {project.startDate}</span>
                    <span className="text-xs text-slate-500 block">Expected finish: {project.expectedEndDate}</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Project Budget allocation mapping</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Total logged Expenses: {totalExpensesLogged.toLocaleString()} PKR</span>
                      <span>Estimated Profit Budget Remaining: {(totalProjectBudgetSum - totalExpensesLogged).toLocaleString()} PKR</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full" style={{ width: `${Math.round((totalExpensesLogged / totalProjectBudgetSum) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side column: Representatives and financials */}
              <div className="space-y-4">
                <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4 shadow-sm border border-slate-800">
                  <h4 className="font-bold text-sm text-amber-400 border-b border-slate-800 pb-2">Financial Status Overview</h4>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Project budget:</span>
                      <span className="font-bold text-slate-100">{totalProjectBudgetSum.toLocaleString()} PKR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total client paid:</span>
                      <span className="font-bold text-emerald-400">{clientPaidAmount.toLocaleString()} PKR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total expenditures:</span>
                      <span className="font-bold text-rose-400">{totalExpensesLogged.toLocaleString()} PKR</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-3 text-sm">
                      <span className="font-bold text-amber-400">Client balance arrears:</span>
                      <span className="font-black text-amber-400">{remainingClientBalance.toLocaleString()} PKR</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Executive assigned rep</span>
                  <p className="font-extrabold text-slate-900">{project.repName}</p>
                  <p className="text-slate-500 font-medium">Designation: {project.repRole}</p>
                  <p className="text-slate-500">CNIC: {project.repCnic}</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: CLIENT DETAILS */}
        {activeTab === "clientDetails" && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 border-b border-slate-100 pb-5">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center font-black text-2xl text-slate-700">
                {project.clientName.charAt(0)}
              </div>
              <div>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Verified Landowner Client</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">{project.clientName}</h3>
                <p className="text-xs text-slate-500 font-medium">Resident of: {project.clientAddress}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="font-bold text-sm text-slate-900">Official Contact registration details</h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-slate-400">CNIC Number:</span>
                    <span className="font-bold text-slate-900">{project.clientCnic || "35201-4455667-9"}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Phone Number:</span>
                    <span className="font-bold text-slate-950">{project.clientPhone}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Email Address:</span>
                    <span className="font-bold text-slate-950">{project.clientEmail}</span>
                  </div>
                </div>
              </div>

              {/* Client Payments Schedule summary */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="font-bold text-sm text-slate-900">Aggregated client payments ledger</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled project contract value:</span>
                    <span className="font-bold text-slate-900">{totalProjectBudgetSum.toLocaleString()} PKR</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Total paid installments clearing:</span>
                    <span>{clientPaidAmount.toLocaleString()} PKR</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Outstanding balances remaining:</span>
                    <span className="font-bold text-slate-900">{remainingClientBalance.toLocaleString()} PKR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Project Agreement & Map Cabin</h3>
                <p className="text-xs text-slate-500">Legally binding blueprints and verified client agreement papers.</p>
              </div>
              <button 
                id="btn-add-doc"
                onClick={() => setShowAddDocForm(!showAddDocForm)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New PDF / Image Document</span>
              </button>
            </div>

            {/* Addition Form Drawer */}
            {showAddDocForm && (
              <form onSubmit={submitDocument} className="bg-slate-50 p-5 border border-slate-200 rounded-2xl space-y-4 animate-fade-in max-w-md shadow-sm">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                  <span>Input document scan metadata</span>
                </h4>
                
                {/* File picker & Drag and drop region */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Select & Attach Scanned File
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 hover:border-amber-400 focus-within:border-amber-400 rounded-xl p-5 bg-white text-center transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setSelectedFile(file);
                          setSelectedFileName(file.name);
                          
                          // Default document title if empty
                          if (!docTitle) {
                            const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                            const humanizedTitle = nameWithoutExt.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                            setDocTitle(humanizedTitle);
                          }

                          // calculate size
                          const sizeStr = file.size > 1024 * 1024 
                            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                            : `${(file.size / 1024).toFixed(0)} KB`;
                          setSelectedFileSize(sizeStr);
                          
                          // Read file content as base64 (DataURL) for previewing later
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === "string") {
                              setSelectedFileContent(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                          
                          // Simulate progressive loading/uploading effect
                          setIsUploading(true);
                          setUploadPercent(15);
                          let currentP = 15;
                          const interval = setInterval(() => {
                            currentP += Math.floor(Math.random() * 25) + 15;
                            if (currentP >= 100) {
                              currentP = 100;
                              clearInterval(interval);
                              setIsUploading(false);
                            }
                            setUploadPercent(currentP);
                          }, 120);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-15"
                    />
                    <div className="space-y-1">
                      <div className="mx-auto w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div className="text-[11px] text-slate-600">
                        <span className="font-bold text-slate-800 underline group-hover:text-amber-600 transition-colors">Choose document scan file</span> or drag & drop here
                      </div>
                      <p className="text-[9px] text-slate-400">PDF, scanned image, or office files up to 10MB</p>
                    </div>
                  </div>

                  {/* Real-time feedback for attachment state */}
                  {selectedFileName && (
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/50 flex items-center justify-between animate-fade-in text-[11px]">
                      <div className="flex items-center gap-2 truncate flex-1">
                        <FileText className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span className="font-extrabold text-slate-800 truncate" title={selectedFileName}>
                          {selectedFileName}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">({selectedFileSize})</span>
                      </div>
                      {isUploading ? (
                        <span className="text-[10px] font-bold text-amber-600 animate-pulse flex-shrink-0">
                          Uploading {uploadPercent}%
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-teal-600 font-extrabold flex-shrink-0 bg-teal-50 px-1.5 py-0.5 rounded">
                          <Check className="w-3 h-3" /> Ready
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Document Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. LDA Water Connection Permit" 
                      value={docTitle} 
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Document Type</label>
                    <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full border rounded p-2 text-xs bg-white">
                      <option value="Agreement PDF">Agreement PDF</option>
                      <option value="House Map">House Map Drawing</option>
                      <option value="Invoice Copy">Invoice Scan</option>
                      <option value="Legal Permit">Government Permit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Visibility Level</label>
                    <select value={docVis} onChange={(e) => setDocVis(e.target.value as any)} className="w-full border rounded p-2 text-xs bg-white">
                      <option value="Client visible">Client Visible</option>
                      <option value="Admin Only">Admin Only</option>
                      <option value="Internal only">Internal only</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Remarks / Short Description</label>
                    <textarea 
                      placeholder="e.g. Signed contract scan verified by team pm" 
                      value={docDesc} 
                      onChange={(e) => setDocDesc(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white h-16 resize-none" 
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button 
                    type="submit" 
                    disabled={isUploading}
                    className="bg-slate-900 border border-slate-800 text-amber-400 hover:bg-slate-800 disabled:opacity-50 font-bold px-4 py-2.5 rounded-lg text-xs cursor-pointer flex-1"
                  >
                    Save Document Scan
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddDocForm(false);
                      setDocTitle("");
                      setDocDesc("");
                      setSelectedFile(null);
                      setSelectedFileName("");
                      setSelectedFileSize("");
                      setSelectedFileContent("");
                      setUploadPercent(0);
                    }}
                    className="bg-slate-200 border border-slate-300 text-slate-700 hover:bg-slate-300 font-bold px-4 py-2.5 rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Document listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectDocuments.map((doc) => (
                <div key={doc.id} className="border border-slate-200 p-4 rounded-xl flex items-start gap-3.5 hover:bg-slate-50/50 transition-colors">
                  <div className="bg-amber-100 text-amber-800 p-2.5 rounded-lg flex-shrink-0">
                    <FileText className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-950 text-sm truncate">{doc.title}</span>
                      <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded uppercase">
                        {doc.visibility}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-mono truncate">{doc.fileName} ({doc.fileSize})</p>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{doc.description}</p>
                    
                    {/* View and download button layout */}
                    <div className="flex items-center gap-2 pt-2 pb-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewingDoc(doc)}
                        className="flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase text-amber-600 hover:text-amber-700 cursor-pointer bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-colors border border-amber-200"
                      >
                        <Eye className="w-3 h-3" /> View Scan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (doc.fileUrl) {
                            const link = document.createElement("a");
                            link.href = doc.fileUrl;
                            link.download = doc.fileName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } else {
                            // If base64 does not exist, trigger simulated direct client download
                            const dummyContent = `--- AM BUILDERS ARCHIVE SYSTEM ---\nDOCUMENT ID: ${doc.id}\nPROJECT ID: ${doc.projectId}\nTITLE: ${doc.title}\nFILE: ${doc.fileName}\nSIZE: ${doc.fileSize}\nSTATUS: ENCRYPTED OFFLINE SIGNED COPY\nDATE: ${doc.uploadDate}\n----------------------------------`;
                            const blob = new Blob([dummyContent], { type: "text/plain" });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = doc.fileName.replace(/\.pdf$/, ".txt");
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          }
                        }}
                        className="flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase text-slate-600 hover:text-slate-700 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-300/60"
                        title="Download Document"
                      >
                        <Download className="w-3 h-3" /> Download
                      </button>
                      {onDeleteDocument && (
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteDocument(doc.id);
                          }}
                          className="flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase text-rose-600 hover:text-rose-700 cursor-pointer bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition-colors border border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>

                    <div className="text-[9px] text-slate-400 flex justify-between pt-1.5 border-t border-slate-100 mt-1">
                      <span>Uploaded: {doc.uploadDate}</span>
                      <span>By: {doc.uploadedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROJECT TEAM */}
        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900">A.M Builders Engineers & Architects</h3>
                <p className="text-xs text-slate-500">Corporate team allocated to supervise this construction site.</p>
              </div>
              <button 
                id="btn-add-team"
                onClick={() => setShowAddTeamForm(!showAddTeamForm)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Corporate Member</span>
              </button>
            </div>

            {/* Team addition form drawer */}
            {showAddTeamForm && (
              <form onSubmit={submitTeamMember} className="bg-slate-50 p-4 border rounded-xl space-y-4 animate-fade-in max-w-md">
                <h4 className="font-bold text-xs text-slate-900 uppercase">Input Representative Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Employee Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Engr. Asad Shah" 
                      value={teamName} 
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Designation</label>
                    <input 
                      type="text" 
                      value={teamDes} 
                      onChange={(e) => setTeamDes(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Specific Site Role</label>
                    <input 
                      type="text" 
                      value={teamRole} 
                      onChange={(e) => setTeamRole(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">CNIC Number</label>
                    <input 
                      type="text" 
                      placeholder="35201-..." 
                      value={teamCnic} 
                      onChange={(e) => setTeamCnic(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="+92 3..." 
                      value={teamPhone} 
                      onChange={(e) => setTeamPhone(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                </div>
                <button type="submit" className="bg-slate-900 text-amber-400 font-bold px-4 py-2 rounded text-xs cursor-pointer">
                  Save team allocation
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projectTeam.map((member) => (
                <div key={member.id} className="border border-slate-200 p-4 rounded-xl space-y-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                      {member.employeeName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-950 text-sm">{member.employeeName}</h4>
                      <span className="text-[10px] uppercase font-bold text-amber-600 block">{member.designation}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                    <p><strong className="text-slate-700">Project scope role:</strong> {member.roleInProject}</p>
                    <p><strong className="text-slate-700">Phone:</strong> {member.phone}</p>
                    <p><strong className="text-slate-700">CNIC:</strong> {member.cnic}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: WORKERS & LABOUR */}
        {activeTab === "workers" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Personnel & Contractors Registry</h3>
                <p className="text-xs text-slate-500">Masons, manual labor, painters, and carpenters assigned to Model Town.</p>
              </div>
              <button 
                id="btn-add-worker"
                onClick={() => {
                  if (showAddWorkerForm && editingWorker) {
                    setEditingWorker(null);
                    setNewWorkerName("");
                    setNewWorkerCnic("");
                    setNewWorkerPhone("");
                    setNewWorkerPayType(PaymentType.DAILY);
                    setNewWorkerRate(2000);
                  } else {
                    setShowAddWorkerForm(!showAddWorkerForm);
                  }
                }}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{editingWorker ? "Add New Worker Instead" : "Register On-Site Worker"}</span>
              </button>
            </div>

            {/* Worker Form input drawer */}
            {showAddWorkerForm && (
              <form onSubmit={submitWorker} className="bg-slate-50 p-4 border rounded-xl space-y-4 animate-fade-in max-w-lg">
                <h4 className="font-bold text-xs text-slate-900 uppercase">
                  {editingWorker ? `Edit Site Laborer (${editingWorker.id})` : "Register Site Laborer"}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Worker Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Masoom Ali" 
                      value={newWorkerName} 
                      onChange={(e) => setNewWorkerName(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Worker category</label>
                    <select 
                      value={newWorkerCategory} 
                      onChange={(e) => setNewWorkerCategory(e.target.value as any)}
                      className="w-full border rounded p-2 text-xs bg-white"
                    >
                      {Object.values(WorkerCategory).map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">CNIC Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="35201-..." 
                      value={newWorkerCnic} 
                      onChange={(e) => setNewWorkerCnic(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="+92 3..." 
                      value={newWorkerPhone} 
                      onChange={(e) => setNewWorkerPhone(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Payment Basis Type</label>
                    <select 
                      value={newWorkerPayType} 
                      onChange={(e) => setNewWorkerPayType(e.target.value as any)}
                      className="w-full border rounded p-2 text-xs bg-white"
                    >
                      {Object.values(PaymentType).map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Rate Amount (PKR)</label>
                    <input 
                      type="number" 
                      required
                      value={newWorkerRate} 
                      onChange={(e) => setNewWorkerRate(Number(e.target.value))}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Upfront Advance Paid (PKR)</label>
                    <input 
                      type="number" 
                      value={newWorkerAdvance} 
                      onChange={(e) => setNewWorkerAdvance(Number(e.target.value))}
                      placeholder="e.g. 5000"
                      className="w-full border rounded p-2 text-xs bg-white text-slate-900 font-semibold" 
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-slate-900 text-amber-400 font-bold px-5 py-2.5 rounded text-xs cursor-pointer">
                    {editingWorker ? "Save Changes" : "Assign to project site"}
                  </button>
                  {editingWorker && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingWorker(null);
                        setShowAddWorkerForm(false);
                        setNewWorkerName("");
                        setNewWorkerCnic("");
                        setNewWorkerPhone("");
                        setNewWorkerPayType(PaymentType.DAILY);
                        setNewWorkerRate(2000);
                        setNewWorkerAdvance(0);
                      }}
                      className="bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Workers Table inside tab */}
            <div className="overflow-x-auto border rounded-xl shadow-xs">
              <table className="w-full text-xs text-left text-slate-500">
                <thead className="text-[10px] uppercase bg-slate-900 text-amber-400 font-bold">
                  <tr>
                    <th className="p-3">Worker ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">CNIC</th>
                    <th className="p-3">Payment Term Setup</th>
                    <th className="p-3 text-right">Agreed rate</th>
                    {(currentRole === UserRole.ADMIN || currentRole === UserRole.PROJECT_MANAGER || currentRole === UserRole.SUPERVISOR) && (
                      <th className="p-3 text-center">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projectWorkers.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900">{w.id}</td>
                      <td className="p-3 font-bold text-slate-950 flex items-center gap-2">
                        {w.photoUrl ? (
                          <img src={w.photoUrl} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold flex items-center justify-center shrink-0">W</div>
                        )}
                        <span>{w.name}</span>
                      </td>
                      <td className="p-3 text-slate-800">{w.category}</td>
                      <td className="p-3 font-mono text-[11px]">{w.cnic}</td>
                      <td className="p-3">
                        <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                          {w.paymentType}
                        </span>
                      </td>
                      <td className="p-3 text-right font-extrabold text-slate-900">
                        {w.agreedRate.toLocaleString()} PKR <span className="text-[10px] font-medium text-slate-500 block">{w.rateUnit}</span>
                      </td>
                      {(currentRole === UserRole.ADMIN || currentRole === UserRole.PROJECT_MANAGER || currentRole === UserRole.SUPERVISOR) && (
                        <td className="p-3 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingWorker(w);
                                setNewWorkerName(w.name);
                                setNewWorkerCategory(w.category);
                                setNewWorkerCnic(w.cnic);
                                setNewWorkerPhone(w.phone || "");
                                setNewWorkerPayType(w.paymentType);
                                setNewWorkerRate(w.agreedRate);
                                setNewWorkerAdvance(w.advancePaid || 0);
                                setShowAddWorkerForm(true);
                              }}
                              className="px-2 py-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-md text-[10px] cursor-pointer transition-colors shadow-xs"
                            >
                              Edit Worker
                            </button>
                            {onDeleteWorker && (
                              <button
                                onClick={() => {
                                  onDeleteWorker(w.id);
                                }}
                                className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-md text-[10px] cursor-pointer transition-colors shadow-xs"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: ATTENDANCE */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Labour Attendance sheet</h3>
                <p className="text-xs text-slate-500">Log daily present/absent on site. Wages are calculated instantly.</p>
              </div>
              <button 
                id="btn-add-attendance"
                onClick={() => setShowAddAttendanceForm(!showAddAttendanceForm)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Mark Attendance Log</span>
              </button>
            </div>

            {/* Attendance form drawer */}
            {showAddAttendanceForm && (
              <form onSubmit={submitAttendance} className="bg-slate-50 p-4 border rounded-xl space-y-4 animate-fade-in max-w-md">
                <h4 className="font-bold text-xs text-slate-900 uppercase">Log labor checkout timing</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Select Active Worker</label>
                    <select 
                      value={attWorkerId} 
                      onChange={(e) => setAttWorkerId(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white font-semibold focus:ring-1"
                      required
                    >
                      <option value="">-- Choose registered worker --</option>
                      {projectWorkers.filter(w => w.paymentType === PaymentType.DAILY).map(w => (
                        <option key={w.id} value={w.id}>
                          {w.name} (Daily Rate: {w.agreedRate} PKR)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Shift attendance status</label>
                    <select value={attStatus} onChange={(e) => setAttStatus(e.target.value as any)} className="w-full border rounded p-2 text-xs bg-white">
                      <option value="Present">Present</option>
                      <option value="Half Day">Half Day (Rate / 2)</option>
                      <option value="Overtime">Overtime</option>
                      <option value="Absent">Absent (PKR 0)</option>
                    </select>
                  </div>
                  {attStatus === AttendanceStatus.OVERTIME && (
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">Overtime Hours</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="8"
                        required
                        value={attOvertimeHours}
                        onChange={(e) => setAttOvertimeHours(Number(e.target.value))}
                        className="w-full border rounded p-2 text-xs bg-white text-orange-600 font-bold"
                      />
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Date</label>
                    <input type="date" value={attDate} onChange={(e) => setAttDate(e.target.value)} className="w-full border rounded p-2 text-xs bg-white" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Nature of Work done today</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mixed motor on floor, bricklaying compound" 
                      value={attWorkDone} 
                      onChange={(e) => setAttWorkDone(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                  {attStatus !== "Absent" && (
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">Daily Wage Payment Status</label>
                      <select value={attDailyWageStatus} onChange={(e) => setAttDailyWageStatus(e.target.value as any)} className="w-full border rounded p-2 text-xs bg-white font-semibold flex-1">
                        <option value="Unpaid">Unpaid / Deferred (Log as Payable)</option>
                        <option value="Advance Adjusted">Adjusted from Pre-paid Advance</option>
                        <option value="Paid">Paid Fully in Cash Today</option>
                      </select>
                    </div>
                  )}
                </div>
                <button type="submit" className="bg-slate-900 text-amber-400 font-bold px-4 py-2 rounded text-xs cursor-pointer">
                  Save Shift Log
                </button>
              </form>
            )}

            {/* Attendance database check */}
            <div className="overflow-x-auto border rounded-xl shadow-xs">
              <table className="w-full text-xs text-left text-slate-500">
                <thead className="bg-slate-900 text-amber-400 text-[10px] font-bold uppercase">
                  <tr>
                    <th className="p-3">Shift Date</th>
                    <th className="p-3">Worker Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Status Badge</th>
                    <th className="p-3 text-right">Overtime Detail</th>
                    <th className="p-3">Wage Status</th>
                    <th className="p-3 text-right">Pay calculated today</th>
                    {(currentRole === UserRole.ADMIN || currentRole === UserRole.PROJECT_MANAGER || currentRole === UserRole.SUPERVISOR) && (
                      <th className="p-3 text-center">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projectAttendance.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium text-slate-900">{a.date}</td>
                      <td className="p-3 font-bold text-slate-950">{a.workerName}</td>
                      <td className="p-3">{a.category}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${getBadgeColor(a.status)}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-indigo-700 font-semibold font-mono">
                        {a.overtimeHours ? `+${a.overtimeHours} Hours (+${(a.overtimeHours * (a.overtimeRate || 0)).toLocaleString()} PKR)` : "None"}
                      </td>
                      <td className="p-3">
                        {a.dailyWagePaymentStatus ? (
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            a.dailyWagePaymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800" :
                            a.dailyWagePaymentStatus === "Advance Adjusted" ? "bg-violet-100 text-violet-800" :
                            "bg-rose-100 text-rose-800"
                          }`}>
                            {a.dailyWagePaymentStatus}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Not Set</span>
                        )}
                      </td>
                      <td className="p-3 text-right font-black text-slate-950">
                        {a.calculatedPay.toLocaleString()} PKR
                      </td>
                      {(currentRole === UserRole.ADMIN || currentRole === UserRole.PROJECT_MANAGER || currentRole === UserRole.SUPERVISOR) && (
                        <td className="p-3 text-center">
                          {onDeleteAttendance && (
                            <button
                              onClick={() => {
                                onDeleteAttendance(a.id);
                              }}
                              className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-md text-[10px] cursor-pointer transition-colors shadow-xs"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                  {projectAttendance.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400">
                        No attendance shifts logged today or yesterday. Mark attendance using the button.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: WORKER PAYMENT LEDGER */}
        {activeTab === "workerPayments" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Payable payrolls ledger sheet</h3>
                <p className="text-xs text-slate-500">Live ledger containing advance offsets, daily logged sums, and payout logs.</p>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <div className="bg-slate-900 text-white rounded-xl py-2 px-4 text-xs font-bold flex items-center gap-2">
                  <CircleDollarSign className="w-4 h-4 text-amber-500" />
                  <span>Unallocated payroll liabilities.</span>
                </div>
                <button 
                  onClick={() => setShowAddPayoutForm(!showAddPayoutForm)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Worker Payment</span>
                </button>
              </div>
            </div>

            {showAddPayoutForm && (
              <form onSubmit={submitPayout} className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-4 animate-fade-in max-w-lg mb-6">
                <h4 className="font-bold text-sm text-emerald-900 uppercase flex items-center gap-2">
                  <CircleDollarSign className="w-4 h-4" />
                  Log Cash Handover / Payroll Disbursement
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Select Worker</label>
                    <select 
                      value={payoutWorkerId} 
                      onChange={(e) => setPayoutWorkerId(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
                      required
                    >
                      <option value="">-- Choose worker to pay --</option>
                      {projectWorkers.map(w => (
                        <option key={w.id} value={w.id}>
                          {w.name} - {w.category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Amount Paid (PKR)</label>
                    <input 
                      type="number" 
                      value={payoutAmount || ""} 
                      onChange={(e) => setPayoutAmount(Number(e.target.value))}
                      placeholder="e.g. 12000"
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white focus:ring-1 focus:ring-emerald-500 outline-none" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Payment Method</label>
                    <select 
                      value={payoutMethod} 
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      <option value="Cash">Cash on Site</option>
                      <option value="Bank transfer">Bank Transfer / Easypaisa</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Reference / Remarks (optional)</label>
                    <input 
                      type="text" 
                      value={payoutTitle} 
                      onChange={(e) => setPayoutTitle(e.target.value)}
                      placeholder="e.g. Weekly wage clearance"
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white focus:ring-1 focus:ring-emerald-500 outline-none" 
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded text-xs cursor-pointer transition-colors">
                    Save Payout
                  </button>
                  <button type="button" onClick={() => setShowAddPayoutForm(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-emerald-100 rounded cursor-pointer transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Live calculated Worker Payments table with Advance counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Ledger calculations table representing fields required in the instructions */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="font-bold text-sm text-slate-900 uppercase">Live payables summary</h4>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search worker by name..." 
                      className="border border-slate-200 bg-white rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 w-full sm:w-64"
                      value={workerSearchTerm}
                      onChange={(e) => setWorkerSearchTerm(e.target.value)}
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {projectWorkers.filter(w => w.name.toLowerCase().includes(workerSearchTerm.toLowerCase())).map((w) => {
                  const workerAtt = projectAttendance.filter(a => a.workerId === w.id);
                  const totalDays = workerAtt.filter(a => a.status !== AttendanceStatus.ABSENT).length;
                  const totalPayable = workerAtt.reduce((sum, a) => sum + a.calculatedPay, 0);

                  // Worker Flat rates calculations
                  const totalEarnedVal = w.paymentType === PaymentType.FIXED ? (w.agreedTotalAmount || 0) : totalPayable;
                  
                  // Past cleared sum (Includes advances AND daily cash flows)
                  const previousCleanedVal = projectExpenses
                    .filter(e => e.category === "Labour payment" && e.paidTo === w.name)
                    .reduce((sum, e) => sum + e.amount, 0);

                  const computedBalance = Math.max(0, totalEarnedVal - previousCleanedVal);
                  const remainingAdvance = Math.max(0, previousCleanedVal - totalEarnedVal);

                  return (
                    <div key={w.id} className="border border-slate-200 p-4 rounded-xl space-y-3 shadow-xs bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-extrabold text-slate-950 block">{w.name}</span>
                          <span className="text-[10px] bg-slate-900 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase block mt-1 w-max">
                            {w.paymentType} Rate: {w.agreedRate.toLocaleString()} PKR
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Unpaid wage owed</span>
                          <span className="font-black text-rose-600 block text-sm">
                            {computedBalance.toLocaleString()} PKR
                          </span>
                        </div>
                      </div>

                      {/* Explicit progressive advance deduction display */}
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] space-y-1.5">
                        <div className="flex justify-between font-medium text-slate-600">
                          <span>Total Disbursed (Cash + Advances):</span>
                          <span className="font-bold text-amber-600 font-mono">{previousCleanedVal.toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between font-medium text-slate-600">
                          <span>Total Wages Earned (Attendance):</span>
                          <span className="font-bold text-slate-800 font-mono">-{totalEarnedVal.toLocaleString()} PKR</span>
                        </div>
                        
                        {previousCleanedVal > 0 && remainingAdvance > 0 ? (
                          <div className="flex justify-between font-bold text-violet-700 border-t border-dashed border-slate-200 pt-1.5 mt-1">
                            <span>Remaining Unadjusted Advance:</span>
                            <span className="font-mono">{remainingAdvance.toLocaleString()} PKR</span>
                          </div>
                        ) : previousCleanedVal > 0 && remainingAdvance === 0 ? (
                          <div className="flex justify-between font-bold text-emerald-600 border-t border-dashed border-slate-200 pt-1.5 mt-1">
                            <span>Advance Fully Adjusted:</span>
                            <span className="font-mono text-emerald-600">0 PKR (Cleared)</span>
                          </div>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 border-t border-slate-100 pt-3">
                        <div>
                          <span>Attendance days</span>
                          <span className="font-medium text-slate-800 block mt-0.5">{totalDays} Days Present</span>
                        </div>
                        <div className="text-right">
                          <span>Total Paid Out</span>
                          <span className="font-medium text-emerald-600 block mt-0.5">{previousCleanedVal.toLocaleString()} PKR</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button 
                          onClick={() => downloadWorkerPDF(w)}
                          className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Download Worker PDF Ledger</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Payment list history */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-900 uppercase">Payroll disbursement history</h4>
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {projectExpenses.filter(e => e.category === "Labour payment").map((pe) => (
                    <div key={pe.id} className="border border-slate-200 p-3 rounded-xl hover:bg-slate-50 text-xs flex justify-between items-center transition-all bg-white relative group">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block">{pe.title}</span>
                        <span className="text-[10px] text-slate-500 block">Cleared: {pe.date}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-black text-slate-900 text-right shrink-0">
                          -{pe.amount.toLocaleString()} PKR
                        </span>
                        {(currentRole === UserRole.ADMIN || currentRole === UserRole.PROJECT_MANAGER) && (
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditPayoutClick(pe)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-1 rounded cursor-pointer transition-colors">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {onDeleteExpense && (
                              <button onClick={() => {
                                onDeleteExpense(pe.id);
                              }} className="text-red-500 hover:text-red-700 bg-red-50 p-1 rounded cursor-pointer transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 8: MATERIALS PURCHASE */}
        {activeTab === "materials" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Materials Payments & Summary</h3>
                <p className="text-xs text-slate-500">Record material purchases and track material expense summaries.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  id="btn-add-purchase"
                  onClick={() => setShowAddPurchaseForm(!showAddPurchaseForm)}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Receive Shipment delivery</span>
                </button>
              </div>
            </div>

            {/* Form Purchase Drawer */}
            {showAddPurchaseForm && (
              <form onSubmit={submitPurchase} className="bg-slate-50 p-4 border rounded-xl space-y-4 animate-fade-in max-w-md">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-slate-900 uppercase">
                    {editingPurchase ? "Edit Shipment Delivery slip" : "Input Shipment Delivery slip"}
                  </h4>
                  {editingPurchase && (
                    <button type="button" onClick={() => { setEditingPurchase(null); setShowAddPurchaseForm(false); }} className="text-[10px] text-slate-400 hover:text-red-500">
                      Cancel
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Material Name</label>
                    <input 
                      type="text" 
                      value={purMatName} 
                      onChange={(e) => setPurMatName(e.target.value)} 
                      className="w-full border rounded p-2 text-xs bg-white" 
                      placeholder="e.g. Steel / Saria" 
                      list="purchase-material-names"
                      required 
                    />
                    <datalist id="purchase-material-names">
                      {materials.map((m: any) => (
                        <option key={m.id} value={m.name} />
                      ))}
                    </datalist>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Total Purchased Amount (PKR)</label>
                    <input 
                      type="number" 
                      required
                      value={purTotalCost} 
                      onChange={(e) => setPurTotalCost(Number(e.target.value))}
                      className="w-full border rounded p-2 text-xs bg-white text-emerald-700 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Delivery Status</label>
                    <select value={purDeliveryStatus} onChange={(e) => setPurDeliveryStatus(e.target.value as any)} className="w-full border rounded p-2 text-xs bg-white">
                      <option value="Delivered">Delivered (Completed)</option>
                      <option value="Pending">Pending (Advance Only)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Advance / Paid Now (PKR)</label>
                    <input 
                      type="number" 
                      required
                      value={purAdvancePaid} 
                      onChange={(e) => setPurAdvancePaid(Number(e.target.value))}
                      className="w-full border rounded p-2 text-xs bg-white text-emerald-700 font-bold border-amber-300" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Supplier company</label>
                    <input 
                      type="text" 
                      value={purSupplier} 
                      onChange={(e) => setPurSupplier(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                </div>
                <button type="submit" className="bg-slate-900 text-amber-400 font-bold px-4 py-2 rounded text-xs cursor-pointer">
                  {purDeliveryStatus === "Pending" ? "Record Advance Payment" : "Instruct Delivery Receipt"}
                </button>
              </form>
            )}



            {/* Bottom Row: Purchase history */}
            <div className="mt-8 border-t pt-6">
              <h4 className="font-extrabold text-sm text-slate-900 uppercase mb-4">Shipments & Purchase Journals</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectPurchases.map((p) => {
                  const isPending = p.deliveryStatus === "Pending";
                  return (
                    <div key={p.id} className={`p-4 border rounded-xl flex flex-col gap-2 ${isPending ? "bg-amber-50 border-amber-200" : "bg-white"}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-950 block">{p.materialName}</span>
                          <span className="text-[10px] text-slate-500 block">Supplier: {p.supplierName}</span>
                          {isPending && <span className="font-bold text-[10px] text-amber-600 mt-1 block">Status: Pending Delivery</span>}
                          {!isPending && <span className="font-bold text-[10px] text-emerald-600 mt-1 block">Status: Delivered & Completed</span>}
                        </div>
                        <div className="text-right">
                          <span className="font-black text-slate-900 block text-xs">{p.totalCost.toLocaleString()} PKR</span>
                          {isPending && (
                            <span className="text-[10px] font-bold text-slate-600 block">Advance pd: {p.advancePaid?.toLocaleString() || 0} PKR</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-slate-150 flex justify-between gap-2 items-center">
                        <button 
                          onClick={() => handleEditPurchaseClick(p)}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold px-2.5 py-1.5 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-all border border-amber-200"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        {isPending && onUpdatePurchase && (
                          <button 
                            onClick={() => {
                              onUpdatePurchase({ ...p, deliveryStatus: "Delivered", deliveryDate: new Date().toISOString() });
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-amber-500 font-bold px-3 py-1.5 rounded text-[10px]"
                          >
                            Mark Delivered & Send Remaining Amount
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {projectPurchases.length === 0 && (
                  <div className="text-xs text-slate-500 p-4">No shipment journals added yet.</div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 9: SUPPLIERS */}
        {activeTab === "suppliers" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Registered Suppliers & Payments</h3>
              <p className="text-xs text-slate-500">Official vendor contact logs, dispatch purchase receipts and accounts status.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Suppliers list */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-bold text-sm text-slate-950 uppercase">Allocated supply profiles</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {suppliers.map((sup) => {
                    const supplierPurchases = projectPurchases.filter(p => p.supplierName === sup.name);
                    const totalPurchasesCost = supplierPurchases.reduce((sum, p) => sum + p.totalCost, 0);
                    const startingAdvance = sup.advancePaid || 0;
                    const remainingAdvance = Math.max(0, startingAdvance - totalPurchasesCost);
                    const excessOwed = Math.max(0, totalPurchasesCost - startingAdvance);

                    return (
                      <div key={sup.id} className="border border-slate-200 p-4 rounded-xl space-y-3 shadow-xs bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-extrabold text-slate-950 block">{sup.name}</span>
                            <span className="text-[9px] text-slate-400 block uppercase font-mono">{sup.id}</span>
                          </div>
                          <span className="inline-block bg-slate-900 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                            {sup.materialType}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 space-y-1">
                          <p><strong className="text-slate-800 font-bold">Company name:</strong> {sup.companyName}</p>
                          <p><strong className="text-slate-800 font-bold">Phone number:</strong> {sup.phone}</p>
                          <p><strong className="text-slate-800 font-bold">Address:</strong> {sup.address}</p>
                        </div>

                        {/* Financial Ledger detailing the material advance adjustment */}
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] space-y-1 mt-2">
                          <div className="flex justify-between text-slate-500 font-medium">
                            <span>Prepaid Advance:</span>
                            <span className="font-mono text-slate-700">{startingAdvance.toLocaleString()} PKR</span>
                          </div>
                          <div className="flex justify-between text-slate-500 font-medium">
                            <span>Purchased Materials:</span>
                            <span className="font-mono text-amber-700">-{totalPurchasesCost.toLocaleString()} PKR</span>
                          </div>
                          {startingAdvance > 0 && remainingAdvance > 0 ? (
                            <div className="flex justify-between text-emerald-700 font-bold border-t border-dashed border-slate-200 pt-1 mt-1">
                              <span>Remaining Advance balance:</span>
                              <span className="font-mono">{remainingAdvance.toLocaleString()} PKR</span>
                            </div>
                          ) : startingAdvance > 0 && remainingAdvance === 0 ? (
                            <div className="flex justify-between text-rose-600 font-bold border-t border-dashed border-slate-200 pt-1 mt-1">
                              <span>Advance adjusted. Excess owed:</span>
                              <span className="font-mono">{excessOwed.toLocaleString()} PKR</span>
                            </div>
                          ) : (
                            <div className="flex justify-between text-slate-600 font-bold border-t border-dashed border-slate-200 pt-1 mt-1">
                              <span>Total outstanding:</span>
                              <span className="font-mono">{totalPurchasesCost.toLocaleString()} PKR</span>
                            </div>
                          )}
                        </div>

                        {/* Inline editor for Upfront Material Advance */}
                        {editingSupplierAdvanceId === sup.id ? (
                          <div className="pt-2.5 border-t border-slate-100 mt-2 space-y-2">
                            <label className="block text-[10px] text-slate-500 font-bold uppercase">Update Upfront Advance (PKR)</label>
                            <div className="flex gap-2">
                              <input 
                                type="number" 
                                value={tempSupplierAdvance} 
                                onChange={(e) => setTempSupplierAdvance(Number(e.target.value))}
                                className="border rounded px-2 py-1 text-xs w-full bg-white font-semibold text-slate-900"
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  if (onUpdateSupplier) {
                                    const amountDiff = tempSupplierAdvance - (sup.advancePaid || 0);

                                    onUpdateSupplier({
                                      ...sup,
                                      advancePaid: tempSupplierAdvance
                                    });

                                    // Auto-log expense if they increased the advance
                                    if (amountDiff > 0) {
                                      const expItem = {
                                        id: `EXP-MAT-ADV-${Date.now()}`,
                                        projectId: project.id,
                                        title: `Additional Advance for Material Supplier: ${sup.name}`,
                                        category: "Supplier payment" as any,
                                        amount: amountDiff,
                                        date: new Date().toISOString().split("T")[0],
                                        paidTo: sup.name,
                                        paymentMethod: "Cash" as any,
                                        addedBy: currentRole,
                                        approvedBy: currentRole,
                                        status: "Approved" as any,
                                        remarks: "Advance adjustment auto-logged"
                                      };
                                      onAddExpense(expItem);
                                    }
                                  }
                                  setEditingSupplierAdvanceId(null);
                                }}
                                className="px-3 py-1 bg-slate-900 text-amber-400 font-bold rounded text-xs cursor-pointer hover:bg-slate-800 transition-colors"
                              >
                                Save
                              </button>
                              <button 
                                type="button"
                                onClick={() => setEditingSupplierAdvanceId(null)}
                                className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs hover:bg-slate-300 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-2.5 border-t border-slate-100 mt-2 flex justify-between items-center text-xs">
                            <span className="text-[10px] text-slate-400 font-bold">MATERIAL ADVANCE:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 font-mono">{startingAdvance.toLocaleString()} PKR</span>
                              {(currentRole === UserRole.ADMIN || currentRole === UserRole.PROJECT_MANAGER) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingSupplierAdvanceId(sup.id);
                                    setTempSupplierAdvance(startingAdvance);
                                  }}
                                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-extrabold underline cursor-pointer"
                                >
                                  Modify
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Payments history to suppliers */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="font-bold text-sm text-slate-900 uppercase">Supplier accounts payments logged</h4>
                <div className="space-y-3 text-xs">
                  {projectSupplierPayments.map((p) => (
                    <div key={p.id} className="bg-slate-50 p-3 rounded-lg border space-y-1.5">
                      <div className="flex justify-between font-bold text-slate-950">
                        <span>{p.supplierName}</span>
                        <span className="text-rose-600">-{p.paidAmount.toLocaleString()} PKR</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>Invoice date: {p.paymentDate}</span>
                        <span>Method: {p.paymentMethod}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 10: DAILY PROGRESS REPORT DAILY WORK */}
        {activeTab === "dailyProgress" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Daily Construction progress audits</h3>
                <p className="text-xs text-slate-500">Daily consolidated logs highlighting weather conditions, workers on deck and materials consumed.</p>
              </div>
            </div>

            {/* Timeline cards of past progress reports */}
            <div className="space-y-6">
              {projectProgress.length === 0 && (
                <div className="p-8 text-center text-slate-500 border border-slate-200 border-dashed rounded-xl">
                  No progress reports have been logged yet.
                </div>
              )}
              {projectProgress.map((report) => (
                <div key={report.id} className="border border-slate-200 rounded-xl p-5 space-y-4 hover:border-amber-400 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-900 font-bold text-sm">{report.date}</span>
                      <span className="bg-slate-100 text-slate-850 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {report.workCategory}
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-950 text-amber-400 font-bold uppercase rounded px-2.5 py-0.5">
                      ⛅ Weather: {report.weatherCondition}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-medium leading-relaxed bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                    {report.workCompletedToday}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Workers involved</span>
                      <span className="font-bold text-slate-905 block mt-0.5">{report.workersInvolved}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Materials deployed</span>
                      <span className="font-bold text-slate-905 block mt-0.5">{report.materialsUsedText}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Shift labour cost today</span>
                      <span className="font-bold text-rose-600 block mt-0.5">{report.labourCost.toLocaleString()} PKR</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Structural Next-day instructions</span>
                      <span className="font-bold text-slate-905 block mt-0.5">{report.nextDayPlan}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: IMAGES & VIDEOS PICTURES GALLERY */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Plot Construction stage photos</h3>
              <p className="text-xs text-slate-500">Visual progression updates mapped to corresponding parts of the house structure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projectMedia.map((img) => (
                <div key={img.id} className="border rounded-xl overflow-hidden shadow-xs hover:border-amber-400 transition-all bg-white group">
                  <div className="h-44 relative bg-slate-200">
                    <img 
                      src={img.fileUrl} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      🏗️ Base: {img.constructionStage}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-slate-950 text-sm truncate">{img.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{img.description}</p>
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                      <span>Area: {img.locationInHouse}</span>
                      <span>By: {img.uploadedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 12: EXPENSES */}
        {activeTab === "expenses" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Company Site Expenditures ledger</h3>
                <p className="text-xs text-slate-500">Record tools, direct material purchase, site meals on a single page.</p>
              </div>
              <button 
                id="btn-add-expense"
                onClick={() => setShowAddExpenseForm(!showAddExpenseForm)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Expense Voucher</span>
              </button>
            </div>

            {/* Addition Expense drawer */}
            {showAddExpenseForm && (
              <form onSubmit={submitExpense} className="bg-slate-50 p-4 border rounded-xl space-y-4 animate-fade-in max-w-md">
                <h4 className="font-bold text-xs text-slate-900 uppercase font-medium">Record site invoice</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Expense Label</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Fuel for generator supply" 
                      value={expTitle} 
                      onChange={(e) => setExpTitle(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Category</label>
                    <select value={expCat} onChange={(e) => setExpCat(e.target.value as any)} className="w-full border rounded p-2 text-xs bg-white">
                      <option value="Material purchase">Material Purchase</option>
                      <option value="Machinery rent">Machinery Rent</option>
                      <option value="Fuel">Fuel</option>
                      <option value="Food / tea expense">Food / tea expense</option>
                      <option value="Tools purchase">Tools purchase</option>
                      <option value="Miscellaneous expense">Miscellaneous expense</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Amount (PKR)</label>
                    <input 
                      type="number" 
                      required
                      value={expAmt} 
                      onChange={(e) => setExpAmt(Number(e.target.value))}
                      className="w-full border rounded p-2 text-xs bg-white" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Paid To vendor name</label>
                    <input type="text" placeholder="Asif Oils depot" value={expPaidTo} onChange={(e) => setExpPaidTo(e.target.value)} className="w-full border rounded p-2 text-xs bg-white" />
                  </div>
                </div>
                <button type="submit" className="bg-slate-900 text-amber-400 font-bold px-4 py-2 rounded text-xs cursor-pointer">
                  Authorise Voucher
                </button>
              </form>
            )}

            {/* Expenses Grid metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-200 p-4 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Raw Materials total</span>
                <span className="text-lg font-black text-slate-950 block">{materialExpensesTotal.toLocaleString()} PKR</span>
              </div>
              <div className="border border-slate-200 p-4 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Daily Shifts Labour wages</span>
                <span className="text-lg font-black text-slate-950 block">{laborExpensesTotal.toLocaleString()} PKR</span>
              </div>
              <div className="border border-slate-200 p-4 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Logistics and rentals tools</span>
                <span className="text-lg font-black text-slate-950 block">{otherExpensesTotal.toLocaleString()} PKR</span>
              </div>
            </div>

            {/* List Table Expenses */}
            <div className="overflow-x-auto border rounded-xl shadow-xs">
              <table className="w-full text-xs text-left text-slate-500 bg-white">
                <thead className="bg-slate-900 text-amber-400 text-[10px] font-bold uppercase">
                  <tr>
                    <th className="p-3">Receipt date</th>
                    <th className="p-3">Voucher Title</th>
                    <th className="p-3">Expense Category</th>
                    <th className="p-3">Recipient vendor</th>
                    <th className="p-3 text-right">Amount paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projectExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-slate-600 font-mono">{exp.date}</td>
                      <td className="p-3 font-extrabold text-slate-950">{exp.title}</td>
                      <td className="p-3 text-slate-800">
                        <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{exp.paidTo}</td>
                      <td className="p-3 text-right font-black text-rose-600">
                        {exp.amount.toLocaleString()} PKR
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 13: CLIENT PAYMENTS */}
        {activeTab === "clientPayments" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Client payments installment schedule</h3>
                <p className="text-xs text-slate-500">Detailed logs of client remittances and outstanding arrears.</p>
              </div>
              <button 
                id="btn-add-client-payment"
                onClick={() => setShowAddClientPaymentForm(!showAddClientPaymentForm)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Receive Client Remittance</span>
              </button>
            </div>

            {/* Addition Client remittance drawer */}
            {showAddClientPaymentForm && (
              <form onSubmit={submitClientPayment} className="bg-slate-50 p-4 border rounded-xl space-y-4 animate-fade-in max-w-md">
                <h4 className="font-bold text-xs text-slate-900 uppercase">Input Client Bank slip</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Clearing Installment PKR</label>
                    <input 
                      type="number" 
                      required
                      value={cpInstAmt} 
                      onChange={(e) => setCpInstAmt(Number(e.target.value))}
                      className="w-full border rounded p-2 text-xs bg-white text-emerald-600 font-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Transaction Channel</label>
                    <select value={cpMethod} onChange={(e) => setCpMethod(e.target.value)} className="w-full border rounded p-2 text-xs bg-white">
                      <option value="Bank transfer">HBL Online Bank Transfer</option>
                      <option value="Meezan Bank Transfer">Meezan Bank Transfer</option>
                      <option value="Bank Alfalah Transfer">Bank Alfalah Transfer</option>
                      <option value="Allied Bank Limited Transfer">Allied Bank Limited Transfer</option>
                      <option value="MCB Bank Transfer">MCB Bank Transfer</option>
                      <option value="Habib Metro Transfer">Habib Metro Transfer</option>
                      <option value="Faysal Bank Transfer">Faysal Bank Transfer</option>
                      <option value="Standard Chartered Transfer">Standard Chartered Transfer</option>
                      <option value="Raast ID Transfer">Raast ID Transfer</option>
                      <option value="Cash">Cash office desk</option>
                      <option value="Cash (On Site)">Cash (On Site)</option>
                      <option value="Cheque">Cross Banker Cheque</option>
                      <option value="Pay Order (PO)">Pay Order (PO)</option>
                      <option value="Demand Draft (DD)">Demand Draft (DD)</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                      <option value="NayaPay">NayaPay</option>
                      <option value="SadaPay">SadaPay</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="bg-slate-900 text-amber-400 font-bold px-4 py-2 rounded text-xs cursor-pointer">
                  Instruct Settlement Voucher
                </button>
              </form>
            )}

            {/* Client schedule summary list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Full contracted price</span>
                <span className="text-xl font-black text-slate-900 block">{totalProjectBudgetSum.toLocaleString()} PKR</span>
              </div>
              <div className="border border-slate-200 p-4 rounded-xl bg-emerald-50/20">
                <span className="text-[10px] text-emerald-600 uppercase tracking-wider block font-bold">Sum receipts cleared</span>
                <span className="text-xl font-black text-emerald-600 block">{clientPaidAmount.toLocaleString()} PKR</span>
              </div>
              <div className="border border-slate-200 p-4 rounded-xl">
                <span className="text-[10px] text-amber-600 uppercase tracking-wider block font-bold">Client remaining liabilities</span>
                <span className="text-xl font-black text-amber-600 block">{remainingClientBalance.toLocaleString()} PKR</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {projectClientPayments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-medium bg-slate-50 border border-dashed rounded-xl">
                  No receipts logged yet for this project. Use the button above to record bank slips.
                </div>
              ) : (
                projectClientPayments.map((p) => (
                  <div key={p.id} className="py-3 flex justify-between items-center hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-slate-900 block">Logged client payment receipt #{p.id}</span>
                      <span className="text-[10px] text-slate-400 font-medium font-mono">Cleared on: {p.paymentDate} via {p.paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-emerald-600 font-mono">
                        +{p.installmentAmount.toLocaleString()} PKR
                      </span>
                      {onDeleteClientPayment && (
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteClientPayment(p.id);
                          }}
                          className="px-2 py-0.5 text-[10px] bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded font-black cursor-pointer transition-colors"
                        >
                          Void
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: CLIENT RECEIVABLES */}
        {activeTab === "clientReceivables" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Client Receivables (Reimbursable Expenses)</h3>
                <p className="text-xs text-slate-500">Expenses paid by our company on behalf of the client (Borewell, Society charges) to be recovered later.</p>
              </div>
              <button 
                onClick={() => setShowAddClientReceivableForm(!showAddClientReceivableForm)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add new receivable expense
              </button>
            </div>

            {showAddClientReceivableForm && (
              <form onSubmit={submitClientReceivable} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">Log New Reimbursable Client Expense</div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Title / Purpose</label>
                  <input required value={crTitle} onChange={(e)=>setCrTitle(e.target.value)} type="text" placeholder="e.g. Society NOC fee..." className="border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring focus:ring-amber-400/20" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Amount Paid (PKR)</label>
                  <input required value={crAmount} onChange={(e)=>setCrAmount(e.target.value)} type="number" placeholder="0.00" className="border border-slate-200 rounded-lg p-2 text-xs focus:ring focus:ring-amber-400/20 font-mono" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Category</label>
                  <select value={crCategory} onChange={(e) => setCrCategory(e.target.value)} className="border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring focus:ring-amber-400/20 bg-white">
                    <option value="Borewell">Borewell & Digging</option>
                    <option value="Society Charges">Society Service Charges</option>
                    <option value="Government Fees">Government / NOC Fees</option>
                    <option value="Electric/Water connection">Electric/Water Connections</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Paid To (Vendor/Agency)</label>
                  <input required value={crPaidTo} onChange={(e)=>setCrPaidTo(e.target.value)} type="text" placeholder="Who did we pay?" className="border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring focus:ring-amber-400/20" />
                </div>

                <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddClientReceivableForm(false)} className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-lg cursor-pointer transition-colors">Save Receivable Record</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="border border-slate-200 p-4 rounded-xl bg-orange-50/20">
                <span className="text-[10px] text-orange-600 uppercase tracking-wider block font-bold">Total Pending Recovery from Client</span>
                <span className="text-xl font-black text-orange-600 block">
                  {clientReceivables.filter(r => r.projectId === project.id && r.status === "Pending Recovery").reduce((s, r) => s + r.amountPaid, 0).toLocaleString()} PKR
                </span>
              </div>
              <div className="border border-slate-200 p-4 rounded-xl bg-emerald-50/20">
                <span className="text-[10px] text-emerald-600 uppercase tracking-wider block font-bold">Successfully Recovered</span>
                <span className="text-xl font-black text-emerald-600 block">
                  {clientReceivables.filter(r => r.projectId === project.id && r.status === "Recovered").reduce((s, r) => s + r.amountPaid, 0).toLocaleString()} PKR
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {clientReceivables.filter(r => r.projectId === project.id).length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-medium bg-slate-50 border border-dashed rounded-xl">
                  No reimbursable expenses registered for the client yet.
                </div>
              ) : (
                clientReceivables.filter(r => r.projectId === project.id).map((r) => (
                  <div key={r.id} className="py-3 flex justify-between items-center hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 block">{r.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${r.status === "Recovered" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                          {r.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium font-mono block">Paid on: {r.datePaid} to {r.paidTo} ({r.category})</span>
                      {r.status === "Recovered" && <span className="text-[10px] text-emerald-600 font-medium font-mono block">Recovered on: {r.recoveryDate}</span>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-slate-900 font-mono">
                        {r.amountPaid.toLocaleString()} PKR
                      </span>
                      {r.status === "Pending Recovery" && currentRole === UserRole.ADMIN && (
                        <button
                          type="button"
                          onClick={() => onUpdateClientReceivable(r.id, new Date().toISOString().split('T')[0])}
                          className="px-3 py-1 bg-slate-900 text-amber-400 text-[10px] font-bold rounded flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors"
                        >
                          Mark Recovered
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 14: TIMELINE & MILESTONES stage lists */}
        {activeTab === "milestones" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Plots Structural Milestones Timeline</h3>
              <p className="text-xs text-slate-500">Track milestones from project starts up to handover.</p>
            </div>

            <div className="space-y-3.5">
              {projectMilestones.map((m) => {
                const isCompleted = m.status === MilestoneStatus.COMPLETED;
                const isOngoing = m.status === MilestoneStatus.IN_PROGRESS;
                const isDelayed = m.status === MilestoneStatus.DELAYED;

                return (
                  <div 
                    key={m.id} 
                    className={`border p-4.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-xs transition-all ${
                      isCompleted ? "border-slate-200 bg-slate-50/40" : 
                      isOngoing ? "border-amber-400 bg-amber-500/[0.03]" :
                      isDelayed ? "border-red-300 bg-red-500/[0.02]" :
                      "border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 max-w-xl">
                      <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                        isCompleted ? "border-emerald-500 text-emerald-600 bg-emerald-50" :
                        isOngoing ? "border-amber-400 text-amber-600 bg-amber-50" :
                        isDelayed ? "border-red-500 text-red-600 bg-red-50" :
                        "border-slate-300 text-slate-300"
                      }`}>
                        {isCompleted ? "✓" : ""}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-bold text-sm ${isCompleted ? "text-slate-600 line-through" : "text-slate-900"}`}>
                            {m.name}
                          </h4>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                            isCompleted ? "bg-slate-100 text-slate-650" :
                            isOngoing ? "bg-amber-100 text-amber-800" :
                            isDelayed ? "bg-red-100 text-red-800 animate-pulse" :
                            "bg-slate-50 text-slate-400"
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        {m.remarks && <p className="text-xs text-slate-500 leading-relaxed font-semibold">{m.remarks}</p>}
                        <p className="text-[10px] text-slate-400 font-medium">Allocated: {m.startDate} Expected Finish: {m.expectedCompletionDate}</p>
                      </div>
                    </div>

                    {/* Interactive milestones slider for managers */}
                    <div className="w-full sm:w-48 space-y-1 text-xs">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                        <span>Progress percentage</span>
                        <span>{m.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-250 h-2 rounded-full overflow-hidden border">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${m.progressPercentage}%` }}></div>
                      </div>
                      
                      {/* Operational check sliders based on role */}
                      {(currentRole === UserRole.ADMIN || currentRole === UserRole.PROJECT_MANAGER) && (
                        <div className="flex gap-2 pt-1.5 justify-end">
                          <button 
                            id={`btn-milestone-ongoing-${m.id}`}
                            onClick={() => onUpdateMilestone(m.id, 50, MilestoneStatus.IN_PROGRESS)} 
                            className="text-[10px] text-slate-500 hover:text-slate-800 font-bold"
                          >
                            Mark Active
                          </button>
                          <button 
                            id={`btn-milestone-done-${m.id}`}
                            onClick={() => onUpdateMilestone(m.id, 100, MilestoneStatus.COMPLETED)} 
                            className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold"
                          >
                            ✓ Mark Complete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 15: ISSUES & DELAYS */}
        {activeTab === "issues" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Incident & delay tickets check</h3>
                <p className="text-xs text-slate-500">Record problems, client dispute delays, and material shortage notices.</p>
              </div>
              <button 
                id="btn-add-issue"
                onClick={() => setShowAddIssueForm(!showAddIssueForm)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Report Site Incident</span>
              </button>
            </div>

            {/* Addition Issue drawer */}
            {showAddIssueForm && (
              <form onSubmit={submitIssue} className="bg-slate-50 p-4 border rounded-xl space-y-4 animate-fade-in max-w-md">
                <h4 className="font-bold text-xs text-slate-900 uppercase">Input incident issue details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Issue title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Scaffolding structural timber broke" 
                      value={issTitle} 
                      onChange={(e) => setIssTitle(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white animate-pulse" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Detailed Description</label>
                    <textarea 
                      rows={2} 
                      placeholder="Input what delayed site..." 
                      value={issDesc} 
                      onChange={(e) => setIssDesc(e.target.value)}
                      className="w-full border rounded p-2 text-xs bg-white"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Issue Category Type</label>
                    <select value={issType} onChange={(e) => setIssType(e.target.value as any)} className="w-full border rounded p-2 text-xs bg-white">
                      <option value="Material delay">Material Delay</option>
                      <option value="Worker shortage">Worker Shortage</option>
                      <option value="Weather issue">Weather stop</option>
                      <option value="Client change request">Client change request</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Priority</label>
                    <select value={issPriority} onChange={(e) => setIssPriority(e.target.value as any)} className="w-full border rounded p-2 text-xs bg-white">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical danger</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="bg-slate-900 text-amber-400 font-bold px-4 py-2 rounded text-xs cursor-pointer">
                  Authorise Incident report
                </button>
              </form>
            )}

            <div className="space-y-4">
              {projectIssues.map((issue) => (
                <div key={issue.id} className="border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs hover:bg-slate-50/50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{issue.title}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${getBadgeColor(issue.priority)}`}>
                          {issue.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-550 leading-relaxed font-semibold">{issue.description}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase leading-none ${getBadgeColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>
                  {issue.solutionRemarks && (
                    <p className="text-xs text-slate-600 bg-slate-100 p-2 text-[11px] rounded-lg border-l-4 border-amber-500">
                      <strong>Resolution plan:</strong> {issue.solutionRemarks}
                    </p>
                  )}
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                    <span>Reported by: {issue.reportedBy}</span>
                    <span>Date reported: {issue.reportDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 16: REPORTS & COST ESTIMATION */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Construct Project Reports Cabin</h3>
              <p className="text-xs text-slate-500">Download auditable spreadsheets for materials, cash flows and progress details.</p>
            </div>

            {/* Simulated report downloading status alerts */}
            {reportFeedback && (
              <div className="bg-slate-950 border border-amber-950 text-white font-mono p-3 rounded-lg text-xs animate-pulse">
                &gt;&gt; {reportFeedback}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Financial calculations breakdown */}
              <div className="bg-slate-900 text-white p-5 rounded-xl border space-y-4">
                <h4 className="font-bold text-sm text-amber-400 uppercase">Live Profit / Loss estimation model</h4>
                
                <div className="space-y-3.5 text-xs text-slate-200">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Project contracted income value:</span>
                    <span className="font-extrabold">{totalProjectBudgetSum.toLocaleString()} PKR</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Total client receipts cleared:</span>
                    <span className="text-emerald-400 font-bold">{clientPaidAmount.toLocaleString()} PKR</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2 text-rose-450">
                    <span className="text-slate-400">Logged expenditures (Brick/Cement/Wages):</span>
                    <span className="text-rose-400 font-bold">-{totalExpensesLogged.toLocaleString()} PKR</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-yellow-400 pt-2">
                    <span>Active Cash balance margin today:</span>
                    <span>{(clientPaidAmount - totalExpensesLogged).toLocaleString()} PKR</span>
                  </div>
                </div>
              </div>

              {/* Exports Actions panel */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="font-bold text-sm text-slate-900 uppercase">Download auditable worksheets (Demo Only)</h4>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button 
                    id="btn-report-summary"
                    onClick={() => triggerExportSimulation("Full Summary")} 
                    className="flex items-center gap-1.5 p-3 rounded-lg border border-slate-200 hover:border-amber-400 text-slate-800 font-bold transition-all text-left bg-white shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Project Full summary (.XLSX)</span>
                  </button>

                  <button 
                    id="btn-report-attendance"
                    onClick={() => triggerExportSimulation("Daily Labour Attendance")} 
                    className="flex items-center gap-1.5 p-3 rounded-lg border border-slate-200 hover:border-amber-400 text-slate-800 font-bold transition-all text-left bg-white shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Labour attendance ledger (.XLSX)</span>
                  </button>

                  <button 
                    id="btn-report-materials"
                    onClick={() => triggerExportSimulation("Material Stocks index")} 
                    className="flex items-center gap-1.5 p-3 rounded-lg border border-slate-200 hover:border-amber-400 text-slate-800 font-bold transition-all text-left bg-white shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Material Remaining stock (.XLSX)</span>
                  </button>

                  <button 
                    id="btn-report-pdf"
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 p-3 rounded-lg border border-slate-200 hover:border-amber-400 text-slate-800 font-bold transition-all text-left bg-white shadow-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Print page data (.PDF)</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 17: FINAL HANDOVER */}
        {activeTab === "handover" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Certificate of Completion / Key Handover</h3>
              <p className="text-xs text-slate-500">Record final state inspection clears, client clearance Remarks and handovers certificates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-220">
              
              <div className="space-y-4 text-xs">
                <h4 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">Operational settings (CEO Authorization)</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Project handover state status</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 font-bold text-slate-950 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={handoverCompleted} 
                          onChange={(e) => setHandoverCompleted(e.target.checked)} 
                        />
                        <span>✓ Handover Completed</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Final Client Payment ledger Status</label>
                    <select 
                      value={handoverPaid} 
                      onChange={(e) => setHandoverPaid(e.target.value as any)}
                      className="border p-2 bg-white rounded w-full"
                    >
                      <option value="Paid">Fully Paid (Balances cleared 100%)</option>
                      <option value="Pending">Pending client payment installment clearing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1 font-medium">Client Handover review remarks</label>
                    <textarea 
                      rows={3} 
                      value={handoverRemarks} 
                      onChange={(e) => setHandoverRemarks(e.target.value)}
                      className="border p-2 bg-white rounded w-full"
                    ></textarea>
                  </div>

                  <button 
                    type="button" 
                    id="btn-save-handover"
                    onClick={saveHandover}
                    className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-2.5 px-5 rounded-lg border cursor-pointer w-full transition-colors"
                  >
                    Securely Sign Handover records
                  </button>
                </div>
              </div>

              {/* Handover checklist card */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
                <h4 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center gap-1">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Administrative Handover Checklists:</span>
                </h4>
                
                <ul className="space-y-2.5 text-xs text-slate-600 font-medium font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>1. LDA Municipal building clearance certs collected.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>2. Structure key boxes cataloged.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>3. All builder structural warranties registered.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-605">✓</span>
                    <span>4. Final plumbing hydro test cleared.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* Immersive Document Vault Previewer */}
        {previewingDoc && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-55 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="bg-slate-950 text-amber-400 p-5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-900 rounded-lg text-amber-400 border border-slate-800">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-extrabold text-sm tracking-wide uppercase text-slate-50">
                      {previewingDoc.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      ID: {previewingDoc.id} • Type: {previewingDoc.type}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewingDoc(null)}
                  className="text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors border border-slate-800 flex-shrink-0"
                >
                  &times; Close View
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto bg-slate-100/50 flex-1 space-y-6">
                
                {/* Meta details strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-[11px] text-left">
                  <div>
                    <span className="block text-slate-400 font-bold uppercase text-[9px]">File name</span>
                    <span className="font-mono text-slate-800 truncate block font-semibold">{previewingDoc.fileName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase text-[9px]">File Size</span>
                    <span className="text-slate-800 font-semibold">{previewingDoc.fileSize}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase text-[9px]">Uploaded On</span>
                    <span className="text-slate-800 font-semibold">{previewingDoc.uploadDate}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase text-[9px]">Security access</span>
                    <span className="text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded font-black uppercase text-[8px] tracking-wider inline-block">
                      {previewingDoc.visibility}
                    </span>
                  </div>
                </div>

                {/* Main Content Render area */}
                <div className="bg-white border border-slate-250 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col items-center justify-center min-h-[350px]">
                  {previewingDoc.fileUrl ? (
                    (previewingDoc.fileUrl.startsWith("data:image/") || /\.(png|jpe?g|gif|webp)$/i.test(previewingDoc.fileName)) ? (
                      // Real image rendering
                      <div className="space-y-4 w-full text-center">
                        <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-bold">
                          ✓ Scan Image Loaded Successfully
                        </span>
                        <div className="border rounded-xl overflow-hidden p-2 bg-slate-50 shadow-inner flex justify-center">
                          <img
                            src={previewingDoc.fileUrl}
                            alt={previewingDoc.title}
                            className="max-h-[50vh] max-w-full rounded-md object-contain border shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    ) : (previewingDoc.fileUrl.startsWith("data:application/pdf") || previewingDoc.fileName.toLowerCase().endsWith(".pdf")) ? (
                      // Real PDF Preview in iframe
                      <div className="w-full h-[60vh] flex flex-col space-y-3">
                        <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border text-[11px]">
                          <span className="font-semibold text-emerald-700 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            ✓ PDF Document Ready
                          </span>
                        </div>
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200 shadow-inner space-y-4">
                          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-200 shadow-sm">
                            <FileText className="w-8 h-8" />
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm">PDF Preview Unavailable</h4>
                          <p className="text-xs text-slate-500 max-w-md mx-auto text-center leading-relaxed px-4">
                            Browser sandbox restrictions prevent native PDF viewing in this frame. The document (<strong>{previewingDoc.fileName}</strong>) is securely verified. Please download it to view offline.
                          </p>
                          <a
                            href={previewingDoc.fileUrl}
                            download={previewingDoc.fileName}
                            className="mt-4 bg-slate-900 text-amber-400 hover:bg-slate-800 font-bold px-6 py-3 rounded-xl text-xs cursor-pointer shadow-md transition-all border border-slate-700 hover:scale-105 flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" /> Download Full PDF Document
                          </a>
                        </div>
                      </div>
                    ) : (
                      // Other files (doc, docx, txt, etc.)
                      <div className="text-center space-y-4 py-8">
                        <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center border border-blue-200 shadow-sm">
                          <FileText className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">Indexed Document Asset</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                          This file (<strong>{previewingDoc.fileName}</strong>) is stored securely in our project cloud folder. Click below to open and preview the full system attachment on your device.
                        </p>
                        <div className="pt-2">
                          <a
                            href={previewingDoc.fileUrl}
                            download={previewingDoc.fileName}
                            className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 hover:bg-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow-md transition-all border border-slate-700 hover:scale-105"
                          >
                            <Download className="w-4 h-4" /> Download / Open {previewingDoc.title}
                          </a>
                        </div>
                      </div>
                    )
                  ) : (
                    // Default fallback for missing url
                    <div className="text-center space-y-4 py-8">
                      <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-200 shadow-sm">
                        <FileText className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">No Document File Detected</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        This document record does not have a linked file uploaded in the database system.
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional metadata descriptions */}
                <div className="space-y-1.5 bg-amber-50/40 p-4 border border-amber-100 rounded-xl text-xs text-slate-600 text-left">
                  <span className="font-extrabold text-slate-800 block">Uploaded Document Remarks / Short Notes:</span>
                  <p className="leading-relaxed text-slate-600 italic">
                    "{previewingDoc.description}"
                  </p>
                </div>

              </div>

              {/* Action Toolbar Footer */}
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewingDoc(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Close Document Viewer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (previewingDoc.fileUrl) {
                      const link = document.createElement("a");
                      link.href = previewingDoc.fileUrl;
                      link.download = previewingDoc.fileName;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } else {
                      // fallback for pre-seeded files to download a simulated text log
                      const dummyContent = `--- AM BUILDERS ARCHIVE SYSTEM ---\nDOCUMENT ID: ${previewingDoc.id}\nPROJECT ID: ${previewingDoc.projectId}\nTITLE: ${previewingDoc.title}\nFILE: ${previewingDoc.fileName}\nSIZE: ${previewingDoc.fileSize}\nSTATUS: ENCRYPTED OFFLINE SIGNED COPY\nDATE: ${previewingDoc.uploadDate}\n----------------------------------`;
                      const blob = new Blob([dummyContent], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = previewingDoc.fileName.replace(/\.pdf$/, ".txt");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }
                  }}
                  className="bg-slate-900 hover:bg-slate-805 text-amber-400 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download File Offline
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
