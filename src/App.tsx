/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  MapPin, 
  Filter, 
  Building2, 
  HardHat, 
  CalendarMinus, 
  Layers, 
  Activity, 
  CircleDollarSign, 
  AlertTriangle, 
  UserCheck, 
  FileLock, 
  LogOut,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Award
} from "lucide-react";
// ... (rest is same)

import { 
  initialUsers, 
  initialProjects, 
  initialDocuments, 
  initialProjectTeam, 
  initialMaterials, 
  initialSuppliers, 
  initialSupplierPayments, 
  initialWorkers, 
  initialAttendance, 
  initialWorkerAdvances, 
  initialWorkerDeductions, 
  initialWorkerPayments, 
  initialPurchases, 
  initialUsage, 
  initialProgress, 
  initialMedia, 
  initialExpenses, 
  initialClientPayments, 
  initialMilestones, 
  initialIssues, 
  initialHandover, 
  initialNotifications, 
  initialActivityLogs 
} from "./data/mockData";
import { 
  Project, 
  UserRole, 
  Worker, 
  WorkerAttendance, 
  MaterialItem, 
  MaterialPurchase, 
  MaterialUsage, 
  DailyProgressReport, 
  ProjectExpense, 
  ClientPayment, 
  ClientReceivable,
  Notification, 
  ProjectDocument, 
  ProjectTeamMember, 
  IssueDelay, 
  Milestone, 
  MilestoneStatus, 
  FinalHandover,
  User,
  ProjectStatus,
  Supplier,
  WorkerCategory,
  PaymentType
} from "./types";

// Import UI submodules
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar";
import DashboardOverview from "./components/DashboardOverview";
import ProjectCreatePage from "./components/ProjectCreatePage";
import ProjectDetailView from "./components/ProjectDetailView";

const defaultAdminUser: User = {
  id: "U-SYS",
  name: "System Admin",
  email: "admin@ambuilders.com",
  role: UserRole.ADMIN,
  phone: "",
  avatarUrl: "",
  cnic: ""
};

export default function App() {
  // Navigation Screens: "landing" | "login" | "app"
  const [currentScreen, setCurrentScreen] = useState<"landing" | "login" | "app">("landing");
  const [currentUser, setCurrentUser] = useState<User>(defaultAdminUser); // default admin
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Core Persistent States loaded from LocalStorage
  const [projects, setProjects] = useState<Project[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendance, setAttendance] = useState<WorkerAttendance[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [purchases, setPurchases] = useState<MaterialPurchase[]>([]);
  const [usages, setUsages] = useState<MaterialUsage[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierPayments, setSupplierPayments] = useState<any[]>([]);
  const [progressReports, setProgressReports] = useState<DailyProgressReport[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<ProjectExpense[]>([]);
  const [clientReceivables, setClientReceivables] = useState<ClientReceivable[]>([]);
  const [clientPayments, setClientPayments] = useState<ClientPayment[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [issues, setIssues] = useState<IssueDelay[]>([]);
  const [handover, setHandover] = useState<FinalHandover>(initialHandover);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [teamMembers, setTeamMembers] = useState<ProjectTeamMember[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Selection states
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [generalEditingWorker, setGeneralEditingWorker] = useState<Worker | null>(null);

  // General Editing Worker Forms States
  const [gemWorkerName, setGemWorkerName] = useState("");
  const [gemWorkerCategory, setGemWorkerCategory] = useState<WorkerCategory>(WorkerCategory.LABOUR);
  const [gemWorkerProjectId, setGemWorkerProjectId] = useState("");
  const [gemWorkerCnic, setGemWorkerCnic] = useState("");
  const [gemWorkerPhone, setGemWorkerPhone] = useState("");
  const [gemWorkerPaymentType, setGemWorkerPaymentType] = useState<PaymentType>(PaymentType.DAILY);
  const [gemWorkerRate, setGemWorkerRate] = useState<number>(2000);

  // Filters State
  const [searchProjectQuery, setSearchProjectQuery] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("All");

  // Authentication Form States
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authCNIC, setAuthCNIC] = useState("");
  const [authRoleChoice, setAuthRoleChoice] = useState<UserRole>(UserRole.CLIENT);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setIsSubmittingAuth(true);

    try {
      if (authTab === "login") {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authEmail, password: authPassword }),
        });
        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.message || "Invalid email or password.");
        }
        
        setCurrentUser(resData.user);
        setCurrentRole(resData.user.role);
        try {
          localStorage.setItem("AMB_2026_currentRole", resData.user.role);
          localStorage.setItem("AMB_2026_currentUser", JSON.stringify(resData.user));
          localStorage.setItem("AMB_2026_screen", "app");
        } catch (e) {
          console.warn("Storage quota exceeded or restricted; state not saved locally.", e);
        }
        // Log to backend in background
        fetch("/api/activity-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: `LOG-0${Date.now().toString().slice(-4)}`,
            userEmail: resData.user.email,
            action: "User Login",
            timestamp: new Date().toISOString(),
            details: `Authenticated with role ${resData.user.role}.`
          })
        }).catch(() => null);

        setCurrentScreen("app");
      } else {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: authName,
            email: authEmail,
            password: authPassword,
            role: authRoleChoice,
            phone: authPhone,
            cnic: authCNIC,
          }),
        });
        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.message || "Registration failed.");
        }

        setAuthSuccess("Registration successful! You may now sign-in to your portal.");
        setAuthTab("login");
        // Clear fields
        setAuthName("");
        setAuthPhone("");
        setAuthCNIC("");
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Load from Backend APIs with LocalStorage backup
  useEffect(() => {
    const loadAllBackplaneData = async () => {
      try {
        const savedUserJson = localStorage.getItem("AMB_2026_currentUser");
        const savedUser = savedUserJson ? JSON.parse(savedUserJson) : null;

        const reqHeaders: Record<string, string> = { "Content-Type": "application/json" };
        if (savedUser) {
          reqHeaders["x-user-email"] = savedUser.email;
          reqHeaders["x-user-role"] = savedUser.role;
        }

        const fetchWithHeaders = (url: string) => fetch(url, { headers: reqHeaders }).then(r => r.json()).catch(() => null);

        const [
          resProjects, resWorkers, resAttendance, resMaterials, resPurchases, 
          resUsages, resSuppliers, resSupplierPayments, resProgressReports, 
          resMedia, resExpenses, resClientPayments, resMilestones, resIssues, 
          resDocuments, resNotifications, resActivityLogs, resUsers, resClientReceivables
        ] = await Promise.all([
          fetchWithHeaders("/api/projects"),
          fetchWithHeaders("/api/workers"),
          fetchWithHeaders("/api/attendance"),
          fetchWithHeaders("/api/materials"),
          fetchWithHeaders("/api/purchases"),
          fetchWithHeaders("/api/usages"),
          fetchWithHeaders("/api/suppliers"),
          fetchWithHeaders("/api/supplier-payments"),
          fetchWithHeaders("/api/progress-reports"),
          fetchWithHeaders("/api/media"),
          fetchWithHeaders("/api/expenses"),
          fetchWithHeaders("/api/client-payments"),
          fetchWithHeaders("/api/milestones"),
          fetchWithHeaders("/api/issues"),
          fetchWithHeaders("/api/documents"),
          fetchWithHeaders("/api/notifications"),
          fetchWithHeaders("/api/activity-logs"),
          fetchWithHeaders("/api/users"),
          fetchWithHeaders("/api/client-receivables")
        ]);

        if (Array.isArray(resProjects)) setProjects(resProjects);
        if (Array.isArray(resWorkers)) setWorkers(resWorkers);
        if (Array.isArray(resAttendance)) setAttendance(resAttendance);

        const normalizeMaterialsList = (raw: any[]): MaterialItem[] => {
          return raw.map((m: any) => ({
            id: m.id || `MAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: m.name || m.materialName || "Unknown Material",
            category: m.category || "General",
            currentStock: typeof m.currentStock === "number" ? m.currentStock : (typeof m.stockQuantity === "number" ? m.stockQuantity : 0),
            unit: m.unit || "Bags",
            lowStockAlert: typeof m.lowStockAlert === "number" ? m.lowStockAlert : (typeof m.alertThreshold === "number" ? m.alertThreshold : 0)
          }));
        };

        if (Array.isArray(resMaterials)) setMaterials(normalizeMaterialsList(resMaterials));
        if (Array.isArray(resPurchases)) setPurchases(resPurchases);
        if (Array.isArray(resUsages)) setUsages(resUsages);
        if (Array.isArray(resSuppliers)) setSuppliers(resSuppliers);
        if (Array.isArray(resSupplierPayments)) setSupplierPayments(resSupplierPayments);
        if (Array.isArray(resProgressReports)) setProgressReports(resProgressReports);
        if (Array.isArray(resMedia)) setMedia(resMedia);
        if (Array.isArray(resExpenses)) setExpenses(resExpenses);
        if (Array.isArray(resClientPayments)) setClientPayments(resClientPayments);
        if (Array.isArray(resClientReceivables)) setClientReceivables(resClientReceivables);
        if (Array.isArray(resMilestones)) setMilestones(resMilestones);
        if (Array.isArray(resIssues)) setIssues(resIssues);
        if (Array.isArray(resDocuments)) setDocuments(resDocuments);
        if (Array.isArray(resNotifications)) setNotifications(resNotifications);
        if (Array.isArray(resActivityLogs)) setActivityLogs(resActivityLogs);
        if (Array.isArray(resUsers)) setAllUsers(resUsers);

        const savedUserStr = localStorage.getItem("AMB_2026_currentUser");
        if (savedUserStr) {
          setCurrentUser(JSON.parse(savedUserStr));
        }

        const loggedInUserRole = localStorage.getItem("AMB_2026_currentRole");
        if (loggedInUserRole) {
          setCurrentRole(loggedInUserRole as UserRole);
          const rootUser = defaultAdminUser;
          if (!savedUser) setCurrentUser(rootUser);
        }

        const loggedInScreen = localStorage.getItem("AMB_2026_screen");
        if (loggedInScreen) {
          setCurrentScreen(loggedInScreen as any);
        }
      } catch (err) {
        console.error("Failed loading data from backend APIs", err);
      }
    };

    loadAllBackplaneData();
  }, []);

  // Save states helper (both backend & localStorage)
  const saveState = async (key: string, state: any, apiEndpoint?: { path: string; method: string; body?: any }) => {
    // Avoid saving main data subsets mapped to DB arrays in local storage requested by user.
    if (!["currentRole", "currentUser", "screen"].includes(key)) {
       // do nothing locally for these arrays
    } else {
       try {
         localStorage.setItem(`AMB_2026_${key}`, JSON.stringify(state));
       } catch (e) {
         console.warn(`LocalStorage write failed for key AMB_2026_${key} due to quota limit or restriction`, e);
       }
    }
    if (apiEndpoint) {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (currentUser && currentUser.email) {
          headers["x-user-email"] = currentUser.email;
          headers["x-user-role"] = currentUser.role;
        }

        let requestBody = apiEndpoint.body;
        if (currentUser?.email && requestBody && typeof requestBody === "object") {
          if (Array.isArray(requestBody)) {
            requestBody = requestBody.map(item => ({ ...item, createdBy: currentUser.email }));
          } else {
            requestBody = { ...requestBody, createdBy: currentUser.email };
          }
        }

        const fetchOptions: RequestInit = {
          method: apiEndpoint.method,
          headers,
        };
        
        if (requestBody !== undefined) {
          fetchOptions.body = JSON.stringify(requestBody);
        }

        await fetch(apiEndpoint.path, fetchOptions);
      } catch (err) {
        console.error(`Error saving ${key} to backend server`, err);
      }
    }
  };

  // Log Activity Helper
  const appendLog = (action: string, details: string) => {
    const newLog = {
      id: `LOG-0${Date.now().toString().slice(-4)}`,
      userEmail: currentUser.email,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    const updated = [newLog, ...activityLogs];
    setActivityLogs(updated);
    saveState("activityLogs", updated, { path: "/api/activity-logs", method: "POST", body: newLog });
  };

  // Add Project
  const handleAddNewProject = async (newProject: Project, uploads: any) => {
    const updated = [newProject, ...projects];
    setProjects(updated);
    await saveState("projects", updated, { path: "/api/projects", method: "POST", body: newProject });

    // Dynamic 17-stages structural milestones setup as specified in the instructions!
    const defaultMilestones = [
      "Project registration", "Agreement completed", "Site preparation", "Excavation", 
      "Foundation", "Grey structure", "Roofing", "Plumbing", "Electrical work", 
      "Plaster", "Flooring", "Tiles", "Wood work", "Paint", "Finishing", 
      "Final inspection", "Client handover"
    ];

    const newMilestones: Milestone[] = defaultMilestones.map((mName, idx) => ({
      id: `M-NEW-${idx}-${Date.now().toString().slice(-4)}`,
      projectId: newProject.id,
      name: mName,
      startDate: newProject.startDate,
      expectedCompletionDate: newProject.expectedEndDate,
      status: idx <= 1 ? MilestoneStatus.COMPLETED : MilestoneStatus.PENDING,
      progressPercentage: idx <= 1 ? 100 : 0,
      assignedPerson: newProject.repName
    }));

    const updatedMilestones = [...newMilestones, ...milestones];
    setMilestones(updatedMilestones);
    await saveState("milestones", updatedMilestones, { path: "/api/milestones", method: "POST", body: newMilestones });

    // Auto append document scans if they were checked
    const mapOfFiles = [
      { key: "partnership_agreement", upload: uploads.agreementDoc, defaultName: "signed_partnership_agreement.pdf", type: "Agreement PDF" },
      { key: "layout_drawings", upload: uploads.mapDoc, defaultName: "architectural_house_layout_permit.pdf", type: "House Map" },
      { key: "cnic_copy", upload: uploads.clientCnicDoc, defaultName: "cnic_identity_verification.pdf", type: "CNIC Copy" }
    ];

    const addedDocs: ProjectDocument[] = mapOfFiles.map((docItem, idx) => ({
      id: `DOC-NEW-${idx}-${Date.now().toString().slice(-4)}`,
      projectId: newProject.id,
      title: `${newProject.name} ${docItem.type}`,
      type: docItem.type,
      fileName: docItem.upload?.file || docItem.defaultName,
      fileSize: "2.1 MB",
      uploadDate: newDate(),
      uploadedBy: currentUser.name,
      description: `NADRA certified system ledger scans`,
      visibility: "Client visible",
      fileUrl: docItem.upload?.content || undefined
    }));

    const updatedDocs = [...addedDocs, ...documents];
    setDocuments(updatedDocs);
    await saveState("documents", updatedDocs, { path: "/api/documents", method: "POST", body: addedDocs });

    // Initial project front image
    if (uploads.projectImageDoc?.content) {
      const mediaItem = {
        id: `MED-NEW-${Date.now().toString().slice(-4)}`,
        projectId: newProject.id,
        title: "Before Build Lot Condition Photo",
        mediaType: "Image",
        fileUrl: uploads.projectImageDoc.content,
        date: newDate(),
        constructionStage: "Before construction",
        description: "Initial onsite plot survey scan",
        uploadedBy: currentUser.name,
        visibility: "Client visible",
        locationInHouse: "Front side"
      };
      const updatedMedia = [mediaItem, ...media];
      setMedia(updatedMedia);
      await saveState("media", updatedMedia, { path: "/api/media", method: "POST", body: mediaItem });
    }

    // removed auto logging

    appendLog(
      "Project Created",
      `Project instantiated: ${newProject.id} (${newProject.name})`
    );

    setIsCreatingProject(false);
    setActiveTab("projects");
  };

  const handleModifyProject = async (updatedProject: Project, uploads?: any) => {
    const updated = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(updated);
    await saveState("projects", updated, { path: `/api/projects/${updatedProject.id}`, method: "PUT", body: updatedProject });
    
    if (uploads) {
      const addedDocs: ProjectDocument[] = [];
      if (uploads.agreementDoc?.content) {
        addedDocs.push({
          id: `DOC-NEW-AGR-${Date.now().toString().slice(-4)}`,
          projectId: updatedProject.id,
          title: `${updatedProject.name} Agreement PDF`,
          type: "Agreement PDF",
          fileName: uploads.agreementDoc.file,
          fileSize: "2.1 MB",
          uploadDate: newDate(),
          uploadedBy: currentUser?.name || "Admin",
          description: `NADRA certified system ledger scans`,
          visibility: "Client visible",
          fileUrl: uploads.agreementDoc.content
        });
      }
      if (uploads.mapDoc?.content) {
        addedDocs.push({
          id: `DOC-NEW-MAP-${Date.now().toString().slice(-4)}`,
          projectId: updatedProject.id,
          title: `${updatedProject.name} House Map`,
          type: "House Map",
          fileName: uploads.mapDoc.file,
          fileSize: "2.1 MB",
          uploadDate: newDate(),
          uploadedBy: currentUser?.name || "Admin",
          description: `NADRA certified system ledger scans`,
          visibility: "Client visible",
          fileUrl: uploads.mapDoc.content
        });
      }
      if (uploads.clientCnicDoc?.content) {
        addedDocs.push({
          id: `DOC-NEW-CNC-${Date.now().toString().slice(-4)}`,
          projectId: updatedProject.id,
          title: `${updatedProject.name} CNIC Copy`,
          type: "CNIC Copy",
          fileName: uploads.clientCnicDoc.file,
          fileSize: "2.1 MB",
          uploadDate: newDate(),
          uploadedBy: currentUser?.name || "Admin",
          description: `NADRA certified system ledger scans`,
          visibility: "Client visible",
          fileUrl: uploads.clientCnicDoc.content
        });
      }

      if (addedDocs.length > 0) {
        const updatedDocs = [...addedDocs, ...documents];
        setDocuments(updatedDocs);
        await saveState("documents", updatedDocs, { path: "/api/documents", method: "POST", body: addedDocs });
      }

      if (uploads.projectImageDoc?.content) {
        const mediaItem = {
          id: `MED-NEW-${Date.now().toString().slice(-4)}`,
          projectId: updatedProject.id,
          title: "Updated Project Front Image",
          mediaType: "Image",
          fileUrl: uploads.projectImageDoc.content,
          date: newDate(),
          constructionStage: "Ongoing",
          description: "Updated image from edit project page.",
          uploadedBy: currentUser?.name || "Admin",
          visibility: "Client visible",
          locationInHouse: "Front side"
        };
        const updatedMedia = [mediaItem, ...media];
        setMedia(updatedMedia);
        await saveState("media", updatedMedia, { path: "/api/media", method: "POST", body: mediaItem });
      }
    }
    
    appendLog("Project Modified", `Modified details for project ID ${updatedProject.id}.`);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const updated = projects.filter(p => p.id !== projectId);
      setProjects(updated);
      setSelectedProjectId(null);

      const savedUserStr = localStorage.getItem("AMB_2026_currentUser");
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (savedUser) {
        headers["x-user-email"] = savedUser.email;
        headers["x-user-role"] = savedUser.role;
      }

      await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers
      });

      try {
        localStorage.setItem("AMB_2026_projects", JSON.stringify(updated));
      } catch (err) {
        console.warn("LocalStorage write failed for AMB_2026_projects", err);
      }

      appendLog(
        "Project Deleted",
        `Permanently removed project ID ${projectId} from database storage.`
      );
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // State Mutator callbacks
  const handleAddWorker = async (w: Worker) => {
    const updated = [w, ...workers];
    setWorkers(updated);
    await saveState("workers", updated, { path: "/api/workers", method: "POST", body: w });
    appendLog("Registered Worker", `Assigned worker ${w.name} category ${w.category} to layout active.`);
  };

  const handleUpdateWorker = async (w: Worker) => {
    const updated = workers.map(item => item.id === w.id ? w : item);
    setWorkers(updated);
    await saveState("workers", updated, { path: `/api/workers/${w.id}`, method: "PUT", body: w });
    appendLog("Updated Worker", `Modified worker details for ${w.name}.`);
  };

  const handleDeleteWorker = async (id: string) => {
    try {
      const updated = workers.filter(item => item.id !== id);
      setWorkers(updated);
      await fetch(`/api/workers/${id}`, { method: "DELETE" });
      appendLog("Deleted Worker", `Removed worker ID ${id}.`);
    } catch (err) {
      console.error("Delete worker failed", err);
    }
  };

  const handleAddAttendance = async (entry: WorkerAttendance) => {
    const updated = [entry, ...attendance];
    setAttendance(updated);
    await saveState("attendance", updated, { path: "/api/attendance", method: "POST", body: entry });
    appendLog("Attendance log", `Supervisor marked ${entry.workerName} (${entry.status}) base pay: ${entry.calculatedPay} PKR.`);
  };

  const handleDeleteAttendance = async (id: string) => {
    try {
      const updated = attendance.filter(item => item.id !== id);
      setAttendance(updated);
      await fetch(`/api/attendance/${id}`, { method: "DELETE" });
      appendLog("Deleted Attendance", `Removed attendance ID ${id}.`);
    } catch (err) {
      console.error("Delete attendance failed", err);
    }
  };

  const handleAddPurchase = async (purchase: MaterialPurchase) => {
    const updated = [purchase, ...purchases];
    setPurchases(updated);
    await saveState("purchases", updated, { path: "/api/purchases", method: "POST", body: purchase });

    if (purchase.deliveryStatus !== "Pending") {
      // Dynamically increment stock inside parent inventory database list
      const materialExists = materials.find(m => m.name === purchase.materialName);
      let updatedInventory;
      if (materialExists) {
        updatedInventory = materials.map(item => {
          if (item.name === purchase.materialName) {
            return {
              ...item,
              currentStock: item.currentStock + purchase.quantity
            };
          }
          return item;
        });
      } else {
        updatedInventory = [
          ...materials,
          {
            id: `MAT-${Date.now()}`,
            name: purchase.materialName,
            category: purchase.category || "General",
            currentStock: purchase.quantity,
            unit: purchase.unit || "Unit",
            lowStockAlert: 10
          }
        ];
      }
      setMaterials(updatedInventory);
      await saveState("materials", updatedInventory);
    }

    appendLog("Material purchase", `Invoiced ${purchase.materialName} costing ${purchase.totalCost} PKR.`);
  };

  const handleUpdatePurchase = async (updatedPurchase: MaterialPurchase) => {
    const original = purchases.find(p => p.id === updatedPurchase.id);
    const updated = purchases.map(p => (p.id === updatedPurchase.id ? updatedPurchase : p));
    setPurchases(updated);
    await saveState("purchases", updated, { path: `/api/purchases/${updatedPurchase.id}`, method: "PUT", body: updatedPurchase });

    if (original?.deliveryStatus === "Pending" && updatedPurchase.deliveryStatus !== "Pending") {
      const materialExists = materials.find(m => m.name === updatedPurchase.materialName);
      let updatedInventory;
      if (materialExists) {
        updatedInventory = materials.map(item => {
          if (item.name === updatedPurchase.materialName) {
            return {
              ...item,
              currentStock: item.currentStock + updatedPurchase.quantity
            };
          }
          return item;
        });
      } else {
        updatedInventory = [
          ...materials,
          {
            id: `MAT-${Date.now()}`,
            name: updatedPurchase.materialName,
            category: updatedPurchase.category || "General",
            currentStock: updatedPurchase.quantity,
            unit: updatedPurchase.unit || "Unit",
            lowStockAlert: 10
          }
        ];
      }
      setMaterials(updatedInventory);
      await saveState("materials", updatedInventory);
      appendLog("Shipment Delivered", `Received pending delivery of ${updatedPurchase.materialName}.`);
      
      // Auto add expense for the remaining balance!
      const advancePaid = updatedPurchase.advancePaid || 0;
      const remainingBalance = updatedPurchase.totalCost - advancePaid;
      if (remainingBalance > 0) {
        handleAddExpense({
          id: `EXP-0${expenses.length + 10}`,
          projectId: updatedPurchase.projectId,
          title: `Remaining Payment for: ${updatedPurchase.materialName}`,
          category: "Material purchase",
          amount: remainingBalance,
          date: new Date().toISOString().split('T')[0],
          paidTo: updatedPurchase.supplierName,
          paymentMethod: "Cash",
          addedBy: updatedPurchase.approvedBy,
          approvedBy: updatedPurchase.approvedBy,
          status: "Approved"
        });
      }
    } else {
      appendLog("Material purchase edited", `Edited purchase of ${updatedPurchase.materialName}.`);
    }
  };

  const handleAddUsage = async (usage: MaterialUsage) => {
    const updated = [usage, ...usages];
    setUsages(updated);
    await saveState("usages", updated, { path: "/api/usages", method: "POST", body: usage });

    appendLog("Deployed Material", `Site laid ${usage.quantityUsedText || usage.quantityUsed} units of ${usage.materialName} on ${usage.usedFor}.`);
  };

  const handleUpdateUsage = async (updatedUsage: MaterialUsage) => {
    const original = usages.find(u => u.id === updatedUsage.id);
    const updated = usages.map(u => u.id === updatedUsage.id ? updatedUsage : u);
    setUsages(updated);
    await saveState("usages", updated, { path: `/api/usages/${updatedUsage.id}`, method: "PUT", body: updatedUsage });

    appendLog("Material usage edited", `Edited deployed material ${updatedUsage.materialName}.`);
  };

  const handleAddProgress = async (report: DailyProgressReport) => {
    const updated = [report, ...progressReports];
    setProgressReports(updated);
    await saveState("progressReports", updated, { path: "/api/progress-reports", method: "POST", body: report });
    appendLog("Daily Progress Audit", `Supervisor uploaded daily progress for ${report.date} category: ${report.workCategory}.`);
  };

  const handleAddExpense = async (expItem: ProjectExpense) => {
    const updated = [expItem, ...expenses];
    setExpenses(updated);
    await saveState("expenses", updated, { path: "/api/expenses", method: "POST", body: expItem });
    appendLog("Disbursed Expense", `Logged ${expItem.amount} PKR expense for of category ${expItem.category}.`);
  };

  const handleUpdateExpense = async (expItem: ProjectExpense) => {
    const updated = expenses.map(item => item.id === expItem.id ? expItem : item);
    setExpenses(updated);
    await saveState("expenses", updated, { path: `/api/expenses/${expItem.id}`, method: "PUT", body: expItem });
    appendLog("Updated Expense", `Updated expense ${expItem.id} amount ${expItem.amount} PKR.`);
  };

  const handleDeleteExpense = async (id: string) => {
    const updated = expenses.filter(item => item.id !== id);
    setExpenses(updated);
    await saveState("expenses", updated, { path: `/api/expenses/${id}`, method: "DELETE" });
    appendLog("Deleted Expense", `Deleted expense ${id}.`);
  };

  const handleAddClientPayment = async (payment: ClientPayment) => {
    const updated = [payment, ...clientPayments];
    setClientPayments(updated);
    await saveState("clientPayments", updated, { path: "/api/client-payments", method: "POST", body: payment });
    appendLog("Cleared Installment", `Received client payment amount ${payment.installmentAmount} PKR.`);
  };

  const handleAddClientReceivable = async (item: ClientReceivable) => {
    const updated = [item, ...clientReceivables];
    setClientReceivables(updated);
    await saveState("clientReceivables", updated, { path: "/api/client-receivables", method: "POST", body: item });
    appendLog("Added Client Receivable", `Logged reimbursable expense of ${item.amountPaid} PKR for ${item.category}.`);
  };

  const handleUpdateClientReceivable = async (id: string, recoveryDate: string) => {
    const updated = clientReceivables.map(c => c.id === id ? { ...c, status: "Recovered", recoveryDate } : c);
    setClientReceivables(updated);
    await saveState("clientReceivables", updated, { path: `/api/client-receivables/${id}/pay`, method: "PUT", body: { recoveryDate } });
  };

  const handleDeleteClientPayment = async (paymentId: string) => {
    try {
      const updated = clientPayments.filter(p => p.id !== paymentId);
      setClientPayments(updated);

      const savedUserStr = localStorage.getItem("AMB_2026_currentUser");
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (savedUser) {
        headers["x-user-email"] = savedUser.email;
        headers["x-user-role"] = savedUser.role;
      }

      await fetch(`/api/client-payments/${paymentId}`, {
        method: "DELETE",
        headers
      });

      try {
        localStorage.setItem("AMB_2026_clientPayments", JSON.stringify(updated));
      } catch (err) {
        console.warn("LocalStorage write failed for AMB_2026_clientPayments", err);
      }

      appendLog("Voided Payment", `Voided client payment voucher #${paymentId}.`);
    } catch (err) {
      console.error("Delete client payment failed", err);
    }
  };

  const handleUpdateMilestone = async (milestoneId: string, percentage: number, status: MilestoneStatus) => {
    const matchedMilestone = milestones.find(m => m.id === milestoneId);
    const updatedMilestone = matchedMilestone ? {
      ...matchedMilestone,
      progressPercentage: percentage,
      status,
      remarks: `Percentage updated by supervisor to: ${percentage}% status ${status}`
    } : null;

    const updated = milestones.map(m => {
      if (m.id === milestoneId) {
        return updatedMilestone!;
      }
      return m;
    });
    setMilestones(updated);
    await saveState("milestones", updated, updatedMilestone ? { path: "/api/milestones", method: "POST", body: updatedMilestone } : undefined);
    appendLog("Milestone Update", `Milestone ${milestoneId} updated to ${percentage}% checked.`);
  };

  const handleAddIssue = async (issue: IssueDelay) => {
    const updated = [issue, ...issues];
    setIssues(updated);
    await saveState("issues", updated, { path: "/api/issues", method: "POST", body: issue });
    appendLog("Delay flagged", `Reported on-site incident: ${issue.title} Priority: ${issue.priority}.`);
  };

  const handleUpdateHandover = async (updatedHandover: FinalHandover) => {
    setHandover(updatedHandover);
    // Auto complete project if requested
    if (updatedHandover.isCompleted) {
      const updatedProjs = projects.map(p => {
        if (p.id === updatedHandover.projectId) {
          return {
            ...p,
            status: ProjectStatus.COMPLETED
          };
        }
        return p;
      });
      setProjects(updatedProjs);
      await saveState("projects", updatedProjs);
    }
    appendLog("Handover signature", `Signed keys certification handover archives.`);
  };

  const handleAddDocument = async (doc: ProjectDocument) => {
    const updated = [doc, ...documents];
    setDocuments(updated);
    await saveState("documents", updated, { path: "/api/documents", method: "POST", body: doc });
    appendLog("Uploaded doc", `Saved layout document scan: ${doc.title}`);
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      const updated = documents.filter(d => d.id !== docId);
      setDocuments(updated);

      const savedUserStr = localStorage.getItem("AMB_2026_currentUser");
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (savedUser) {
        headers["x-user-email"] = savedUser.email;
        headers["x-user-role"] = savedUser.role;
      }

      await fetch(`/api/documents/${docId}`, {
        method: "DELETE",
        headers
      });

      try {
        localStorage.setItem("AMB_2026_documents", JSON.stringify(updated));
      } catch (err) {
        console.warn("LocalStorage write failed for AMB_2026_documents", err);
      }

      appendLog("Deleted Document", `Removed layout document or attachment ID ${docId}.`);
    } catch (err) {
      console.error("Delete document failed", err);
    }
  };

  const handleAddTeamMember = async (member: ProjectTeamMember) => {
    const updated = [member, ...teamMembers];
    setTeamMembers(updated);
    await saveState("teamMembers", updated, { path: "/api/team-members", method: "POST", body: member });
    appendLog("Team Assigned", `Associated corporate staff ${member.employeeName} designation ${member.designation}.`);
  };

  const handleUpdateSupplier = async (sup: Supplier) => {
    const updated = suppliers.map(item => item.id === sup.id ? sup : item);
    setSuppliers(updated);
    await saveState("suppliers", updated, { path: `/api/suppliers/${sup.id}`, method: "PUT", body: sup });
    appendLog("Supplier Adjusted", `Modified supplier layout / prepayments for ${sup.name}`);
  };

  // Helper date function
  function newDate() {
    return new Date().toISOString().split('T')[0];
  }

  // Filter Projects logic
  const filteredProjectsList = projects.filter((proj) => {
    const labelMatch = proj.name.toLowerCase().includes(searchProjectQuery.toLowerCase()) || 
                       proj.location.toLowerCase().includes(searchProjectQuery.toLowerCase());
    const statusMatch = projectStatusFilter === "All" || proj.status === projectStatusFilter;
    return labelMatch && statusMatch;
  });

  return (
    <div className={`bg-slate-50 flex flex-col font-sans ${currentScreen === "app" ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      
      {/* 1. Landing Public view Screen */}
      {currentScreen === "landing" && (
        <LandingPage onEnterApp={() => setCurrentScreen("login")} />
      )}

      {/* 2. Custom Login Prefilled Screen */}
      {currentScreen === "login" && (
        <div className="flex-1 flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-950 via-slate-900 to-slate-900 overflow-y-auto">
          <div className="max-w-md w-full space-y-6 bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-2xl relative z-10 my-8">
            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center font-bold shadow-lg">
                <Building2 className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">A.M Builders Portal</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Secure construction workspace cloud for projects, payroll, and materials.
              </p>
            </div>

            {/* Auth Tab Selectors */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => { setAuthTab("login"); setAuthError(""); setAuthSuccess(""); }}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${authTab === "login" ? "bg-amber-400 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab("register"); setAuthError(""); setAuthSuccess(""); }}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${authTab === "register" ? "bg-amber-400 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
              >
                Create Account
              </button>
            </div>

            {/* Notifications / Alerts */}
            {authError && (
              <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 text-xs font-medium text-center">
                {authError}
              </div>
            )}
            {authSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-400 text-xs font-medium text-center">
                {authSuccess}
              </div>
            )}

            {/* Input Action Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authTab === "register" && (
                <>
                  <div>
                    <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      required
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Abdul Moeez Tariq"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 placeholder-slate-650"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">Phone Number</label>
                      <input
                        required
                        type="text"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="0300-1234567"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 placeholder-slate-650"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">CNIC Identity</label>
                      <input
                        required
                        type="text"
                        value={authCNIC}
                        onChange={(e) => setAuthCNIC(e.target.value)}
                        placeholder="35202-1234567-1"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 placeholder-slate-650"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">Assigned Domain Role</label>
                    <select
                      value={authRoleChoice}
                      onChange={(e) => setAuthRoleChoice(e.target.value as UserRole)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value={UserRole.CLIENT}>Client / Land Owner Portal</option>
                      <option value={UserRole.ADMIN}>CEO office / Administrator</option>
                      <option value={UserRole.PROJECT_MANAGER}>Project Manager</option>
                      <option value={UserRole.SUPERVISOR}>On-Site Ground Supervisor</option>
                      <option value={UserRole.ACCOUNTANT}>Wages Accountant</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="e.g. ceo@ambuilders.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 placeholder-slate-650"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1">Cloud Password</label>
                <input
                  required
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 placeholder-slate-650"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all shadow-lg active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingAuth ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Executing Secure Exchange...
                  </span>
                ) : authTab === "login" ? "Sign In Securely" : "Register Credentials & Verify"}
              </button>
            </form>

            {/* Developer credentials block removed for secure production */}

            <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-900 pt-3">
              <button 
                onClick={() => setCurrentScreen("landing")} 
                className="hover:text-white transition-colors"
              >
                &larr; Public Portal
              </button>
              <span className="text-slate-600">A.M Builders Private Secures</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Full-Stack Application View */}
      {currentScreen === "app" && (
        <div className="flex-1 flex overflow-hidden h-screen bg-slate-50">
          
          {/* Sider bar */}
          <Sidebar 
            currentRole={currentRole} 
            onRoleChange={(role) => {
              setCurrentRole(role);
              const userObj = defaultAdminUser;
              setCurrentUser(userObj);
              try {
                localStorage.setItem("AMB_2026_currentRole", role);
              } catch (e) {
                console.warn("LocalStorage write failed for currentRole", e);
              }
              appendLog("Role Switched", `Switched live persona to ${role}`);
            }}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setSelectedProjectId(null); // return from details modal
            }}
            onBackToLanding={() => setCurrentScreen("landing")}
            onLogout={() => {
              localStorage.removeItem("AMB_2026_currentUser");
              localStorage.removeItem("AMB_2026_currentRole");
              localStorage.removeItem("AMB_2026_screen");
              setCurrentScreen("landing");
              setCurrentUser(defaultAdminUser);
              setCurrentRole(UserRole.ADMIN);
            }}
            unreadCount={notifications.filter(n => !n.isRead).length}
            userName={currentUser.name}
            allUsers={allUsers}
            teamMembers={teamMembers}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            {/* DYNAMIC SITE HEADER BAR aligned with theme design */}
            <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs z-10 w-full">
              <div className="flex items-center gap-3 sm:gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-1.5 -ml-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </button>
                <h2 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center gap-2 truncate">
                  <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0"></span>
                  <span className="truncate">
                    {activeTab === "dashboard" ? "System Dashboard" : 
                     activeTab === "projects" ? (selectedProjectId ? "Project Live Drawer" : "Portfolio Ledger") : 
                     activeTab === "workers" ? "Personnel Directory" :
                     activeTab === "materials" ? "Warehouse Stocks" :
                     activeTab === "suppliers" ? "Partners & Suppliers" :
                     activeTab === "expenses" ? "Company Outflow" :
                     activeTab === "reports" ? "Global Audits" : "Settings & Security Logs"}
                  </span>
                </h2>
                {selectedProjectId && activeTab === "projects" && (
                  <>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded border border-blue-100">
                      {selectedProjectId}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="hidden sm:inline">LIVE DB CONNECTED</span>
                </div>
                {activeTab === "projects" && !selectedProjectId && currentRole === UserRole.ADMIN && !isCreatingProject && (
                  <>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <button 
                      onClick={() => setIsCreatingProject(true)}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-550 text-slate-900 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 animate-pulse" />
                      <span>Create Project</span>
                    </button>
                  </>
                )}
              </div>
            </header>

            {/* SCROLLABLE VIEWPORT CONTAINER */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 scrollbar-none">
              <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Conditional render based on activeTab */}
              
              {/* TAB A: DASHBOARD OVERVIEW */}
              {activeTab === "dashboard" && !selectedProjectId && (
                <DashboardOverview 
                  currentRole={currentRole} 
                  projects={projects}
                  workers={workers}
                  materials={materials}
                  expenses={expenses}
                  clientPayments={clientPayments}
                  notifications={notifications}
                  onOpenProject={(id) => {
                    setSelectedProjectId(id);
                    setActiveTab("projects");
                  }}
                  onNavigateToTab={(tabName) => setActiveTab(tabName)}
                />
              )}

              {/* TAB B: PROJECTS LIST PAGE */}
              {activeTab === "projects" && !selectedProjectId && !isCreatingProject && !editingProject && (
                <div className="space-y-6">
                  {/* Header list */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Company Assets</span>
                      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Built Properties Portfolio</h1>
                    </div>
                    {currentRole === UserRole.ADMIN && (
                      <button
                        id="btn-trigger-create-proj"
                        onClick={() => setIsCreatingProject(true)}
                        className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-amber-400 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Plus className="w-4 h-4 text-amber-400" />
                        <span>Create New Construction Project</span>
                      </button>
                    )}
                  </div>

                  {/* Search and Filters panel */}
                  <div className="bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
                    <div className="relative w-full md:w-96">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search project by name/location..." 
                        value={searchProjectQuery}
                        onChange={(e) => setSearchProjectQuery(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:border-amber-400" 
                      />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                      <select 
                        value={projectStatusFilter} 
                        onChange={(e) => setProjectStatusFilter(e.target.value)}
                        className="border border-slate-300 p-2 rounded-lg text-xs w-full bg-white font-medium"
                      >
                        <option value="All">Status: All Projects</option>
                        <option value="Registered">Status: Registered</option>
                        <option value="Ongoing">Status: Ongoing</option>
                        <option value="Completed">Status: Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Projects grid cards list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjectsList.map((proj) => {
                      const projExpenses = expenses.filter(e => e.projectId === proj.id).reduce((s, e) => s + e.amount, 0);
                      const projMilestones = milestones.filter(m => m.projectId === proj.id);
                      const comp = projMilestones.filter(m => m.status === MilestoneStatus.COMPLETED).length;
                      const ratio = projMilestones.length > 0 ? Math.round((comp / projMilestones.length) * 100) : 0;

                      const displayImgUrl = proj.imageUrl || (
                        proj.id === "AMB-2026-001" ? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80" :
                        proj.id === "AMB-2026-002" ? "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80" :
                        proj.id === "AMB-2026-003" ? "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" :
                        null
                      );

                      return (
                        <div key={proj.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
                          {displayImgUrl ? (
                            <div className="h-44 w-full relative overflow-hidden bg-slate-200">
                              <img 
                                src={displayImgUrl} 
                                alt={proj.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : (
                            <div className="h-44 w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-slate-950 p-6 flex flex-col justify-between text-white relative">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] bg-amber-400/25 border border-amber-400/40 text-amber-300 font-mono font-bold px-2 py-0.5 rounded">
                                  REG APPROVED
                                </span>
                                <Building2 className="w-5 h-5 text-amber-500 opacity-85" />
                              </div>
                              <div className="space-y-1 z-10">
                                <p className="font-mono text-[10px] text-slate-400">Architectural Plan Blueprint</p>
                                <span className="text-sm font-black text-amber-400 uppercase tracking-wider block font-sans">
                                  {proj.name}
                                </span>
                              </div>
                              {/* Blueprint layout pattern background */}
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(245,158,11,0.05)_1px,_transparent_1px)] bg-[size:16px_16px]"></div>
                            </div>
                          )}
                          <div className="p-5 space-y-4">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="font-mono text-[10px] text-slate-400 tracking-wider block font-bold uppercase">{proj.id}</span>
                                <h3 className="font-black text-slate-900 group-hover:text-amber-600 transition-colors cursor-pointer text-base mt-0.5" onClick={() => setSelectedProjectId(proj.id)}>
                                  {proj.name}
                                </h3>
                              </div>
                              <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase ${
                                proj.status === 'Ongoing' ? 'bg-amber-100 text-amber-800' : 
                                proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {proj.status}
                              </span>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-500 font-semibold">
                              <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {proj.location}, {proj.city}</p>
                              <p className="pl-4.5 font-medium">Area size: {proj.areaSize} | {proj.numFloors} Floors Approved</p>
                              {proj.ratePerSqFt && proj.totalSqFt ? (
                                <p className="pl-4.5 text-[11px] text-amber-650 font-bold flex items-center gap-1 font-mono">
                                  <span>Formula:</span>
                                  <span className="text-slate-800">{proj.totalSqFt} sqft &times; {proj.ratePerSqFt} PKR = {proj.estimatedCost.toLocaleString()} PKR</span>
                                </p>
                              ) : null}
                            </div>

                            <div className="space-y-1 text-xs bd-slate-50 p-2.5 rounded-lg border">
                              <div className="flex justify-between mb-1 text-[10px] uppercase font-bold text-slate-400">
                                <span>Milestones Completion</span>
                                <span className="text-slate-900">{ratio}%</span>
                              </div>
                              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-amber-400 h-full" style={{ width: `${ratio}%` }}></div>
                              </div>
                            </div>
                          </div>

                          <div className="p-5 border-t border-slate-150 bg-slate-50/50 flex justify-between items-center text-xs">
                            <div>
                              <span className="text-slate-400 block font-medium">Expenses logged</span>
                              <span className="font-black text-slate-950">{projExpenses.toLocaleString()} PKR</span>
                            </div>
                            <div className="flex gap-2">
                              {(currentRole === UserRole.ADMIN || currentRole === UserRole.PROJECT_MANAGER) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingProject(proj);
                                  }}
                                  className="border border-amber-400 bg-amber-50 hover:bg-amber-100 text-slate-900 px-3 py-2 rounded-lg font-bold cursor-pointer transition-colors"
                                  title="Edit Project"
                                >
                                  Edit
                                </button>
                              )}
                              <button
                                id={`btn-open-proj-details-${proj.id}`}
                                onClick={() => setSelectedProjectId(proj.id)}
                                className="bg-slate-900 hover:bg-slate-800 text-amber-400 px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors"
                              >
                                Open Site Drawer &rarr;
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PROJECT CREATE OR EDIT PAGE */}
              {activeTab === "projects" && (isCreatingProject || editingProject) && (
                <ProjectCreatePage 
                  projectToEdit={editingProject || undefined}
                  onSave={async (projectData, uploads) => {
                    if (editingProject) {
                      await handleModifyProject(projectData, uploads);
                      setEditingProject(null);
                    } else {
                      await handleAddNewProject(projectData, uploads);
                    }
                  }}
                  onCancel={() => {
                    setIsCreatingProject(false);
                    setEditingProject(null);
                  }}
                />
              )}

              {/* PROJECT DETAIL TABS INTERACTIVE DRAWER */}
              {activeTab === "projects" && selectedProjectId && (
                <ProjectDetailView 
                  currentRole={currentRole}
                  project={projects.find(p => p.id === selectedProjectId)!}
                  onBack={() => setSelectedProjectId(null)}
                  workers={workers}
                  attendance={attendance}
                  materials={materials}
                  purchases={purchases}
                  usages={usages}
                  suppliers={suppliers}
                  supplierPayments={supplierPayments}
                  progressReports={progressReports}
                  media={media}
                  expenses={expenses}
                  clientPayments={clientPayments}
                  clientReceivables={clientReceivables}
                  milestones={milestones}
                  issues={issues}
                  handover={handover}
                  documents={documents}
                  teamMembers={teamMembers}
                  
                  // Interactive Handlers
                  onAddWorker={handleAddWorker}
                  onAddAttendance={handleAddAttendance}
                  onDeleteAttendance={handleDeleteAttendance}
                  onAddPurchase={handleAddPurchase}
                  onUpdatePurchase={handleUpdatePurchase}
                  onAddUsage={handleAddUsage}
                  onUpdateUsage={handleUpdateUsage}
                  onAddProgress={handleAddProgress}
                  onAddExpense={handleAddExpense}
                  onUpdateExpense={handleUpdateExpense}
                  onDeleteExpense={handleDeleteExpense}
                  onAddClientPayment={handleAddClientPayment}
                  onAddClientReceivable={handleAddClientReceivable}
                  onUpdateClientReceivable={handleUpdateClientReceivable}
                  onDeleteClientPayment={handleDeleteClientPayment}
                  onUpdateMilestone={handleUpdateMilestone}
                  onAddIssue={handleAddIssue}
                  onUpdateHandover={handleUpdateHandover}
                  onAddDocument={handleAddDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onAddTeamMember={handleAddTeamMember}
                  onDeleteProject={handleDeleteProject}
                  onUpdateWorker={handleUpdateWorker}
                  onDeleteWorker={handleDeleteWorker}
                  onUpdateSupplier={handleUpdateSupplier}
                  onEditProject={(p) => {
                    setSelectedProjectId(null); // Return to projects view in edit mode
                    setEditingProject(p);
                  }}
                />
              )}

              {/* TAB C: GENERAL WORKERS INDEX SHEET */}
              {activeTab === "workers" && !selectedProjectId && (
                <div className="bg-white border rounded-2xl p-6 shadow-xs space-y-6">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Staff operations</span>
                    <h1 className="text-2xl font-black text-slate-900">Personnel Roster Catalog</h1>
                  </div>

                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-xs text-left text-slate-500">
                      <thead className="bg-slate-900 text-amber-400 text-[10px] font-bold uppercase">
                        <tr>
                          <th className="p-3">Worker ID</th>
                          <th className="p-3">Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Assigned Project</th>
                          <th className="p-3">CNIC</th>
                          <th className="p-3">Phone</th>
                          {(currentRole === UserRole.ADMIN || currentRole === UserRole.PROJECT_MANAGER || currentRole === UserRole.SUPERVISOR) && (
                            <th className="p-3 text-center">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {workers.map(w => {
                          const wProj = projects.find(p => p.id === w.projectId);
                          return (
                            <tr key={w.id} className="hover:bg-slate-50">
                              <td className="p-3 font-mono font-bold text-slate-900">{w.id}</td>
                              <td className="p-3 font-bold text-slate-950">{w.name}</td>
                              <td className="p-3 font-medium">{w.category}</td>
                              <td className="p-3 font-semibold text-slate-800">{wProj ? wProj.name : "Unassigned"}</td>
                              <td className="p-3 font-mono">{w.cnic}</td>
                              <td className="p-3">{w.phone}</td>
                              {(currentRole === UserRole.ADMIN || currentRole === UserRole.PROJECT_MANAGER || currentRole === UserRole.SUPERVISOR) && (
                                <td className="p-3 text-center">
                                  <div className="flex justify-center items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setGeneralEditingWorker(w);
                                        setGemWorkerName(w.name);
                                        setGemWorkerCategory(w.category);
                                        setGemWorkerProjectId(w.projectId);
                                        setGemWorkerCnic(w.cnic);
                                        setGemWorkerPhone(w.phone || "");
                                        setGemWorkerPaymentType(w.paymentType);
                                        setGemWorkerRate(w.agreedRate);
                                      }}
                                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-md text-[10px] cursor-pointer transition-colors"
                                    >
                                      Edit Worker
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleDeleteWorker(w.id);
                                      }}
                                      className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-md text-[10px] cursor-pointer transition-colors shadow-xs"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB D: GLOBAL INVENTORY STATUS */}
              {activeTab === "materials" && !selectedProjectId && (
                <div className="bg-white rounded-2xl border p-6 shadow-xs space-y-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Standard Materials Stocks Remaining</h1>
                    <p className="text-xs text-slate-500">Warehouse inventory aggregates across Lahore depots.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {materials.map((m) => {
                      const isLow = m.currentStock <= m.lowStockAlert;
                      return (
                        <div key={m.id} className="border p-4 rounded-xl shadow-xs hover:border-amber-400 transition-colors relative bg-white">
                          <h4 className="font-extrabold text-[#111] text-xs truncate mb-2">{m.name}</h4>
                          <span className={`text-xl font-black block ${isLow ? "text-amber-600" : "text-slate-900"}`}>
                            {m.currentStock.toLocaleString()} {m.unit}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-1">Alert limit: {m.lowStockAlert} {m.unit}</span>
                          {isLow && (
                            <span className="absolute top-2 right-2 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB E: SUPPLIERS */}
              {activeTab === "suppliers" && !selectedProjectId && (
                <div className="bg-white rounded-2xl border p-6 shadow-xs space-y-4">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">Partner Suppliers catalog</h1>
                    <p className="text-xs text-slate-500">Logistics and material providers of sarya, cement and sand aggregates.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {suppliers.map(sup => (
                      <div key={sup.id} className="border p-4 rounded-xl flex justify-between items-center bg-slate-50/50">
                        <div className="space-y-1">
                          <span className="font-black text-slate-950 text-sm block">{sup.name}</span>
                          <span className="text-[10px] font-bold text-amber-650 uppercase block">{sup.companyName}</span>
                          <span className="text-slate-450 block font-medium">Supplies: {sup.materialType} | Tel: {sup.phone}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Purchases</span>
                          <span className="font-extrabold text-sm text-slate-900 block">{sup.totalPurchases.toLocaleString()} PKR</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB F: COMPANY EXPENSES */}
              {activeTab === "expenses" && !selectedProjectId && (
                <div className="bg-white rounded-2xl border p-6 shadow-xs space-y-4">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Corporate Cash flow expenditure registers</h1>
                    <p className="text-xs text-slate-500">Consolidated financial logs listing material purchases, tea breaks and generator fuel.</p>
                  </div>

                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-xs text-left text-slate-500 bg-white">
                      <thead className="bg-slate-900 text-amber-400 text-[10px] font-bold uppercase">
                        <tr>
                          <th className="p-3">Project Link</th>
                          <th className="p-3">Invoice Details</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Paid To</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Amount paid</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {expenses.map((e) => {
                          const expProj = projects.find(p => p.id === e.projectId);
                          return (
                            <tr key={e.id} className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-slate-900">{expProj ? expProj.name : "General reserves"}</td>
                              <td className="p-3 font-semibold text-slate-950">{e.title}</td>
                              <td className="p-3">
                                <span className="bg-slate-100 text-slate-800 rounded px-1.5 py-0.5 text-[9px] uppercase font-bold">
                                  {e.category}
                                </span>
                              </td>
                              <td className="p-3">{e.paidTo}</td>
                              <td className="p-3 font-mono">{e.date}</td>
                              <td className="p-3 text-right font-black text-rose-600">{e.amount.toLocaleString()} PKR</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB G: GLOBAL REPORTS PRINTING */}
              {activeTab === "reports" && !selectedProjectId && (
                <div className="bg-white rounded-2xl border p-6 shadow-xs space-y-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">Consolidated Corporate Reports Drawer</h1>
                    <p className="text-xs text-slate-500">Export financial audits and project progress indices on corporate templates.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
                    <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4">
                      <h3 className="font-bold text-sm text-yellow-400 uppercase">A.M Builders Financial Statement</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Aggregate Projects Contract Value:</span>
                          <span className="font-bold text-slate-100">{projects.reduce((s,p) => s+p.estimatedCost, 0).toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remittance collections received:</span>
                          <span className="font-bold text-emerald-400">+{clientPayments.reduce((s,p) => s+p.advancePayment+p.installmentAmount, 0).toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Capital Expenditure:</span>
                          <span className="font-bold text-rose-400">-{expenses.reduce((s,e) => s+e.amount, 0).toLocaleString()} PKR</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 p-5 rounded-xl space-y-4 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">Available Actions</h4>
                        <p className="text-xs text-slate-550 leading-relaxed font-semibold">Select an dynamic template on the project's detail pages to download specific Excel worksheets.</p>
                      </div>
                      <button onClick={() => window.print()} className="bg-slate-900 text-amber-400 rounded-xl p-3 text-xs font-bold w-full cursor-pointer transition-colors">
                        📊 Print full corporate browser summary (.PDF)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB H: SETTINGS AND SECURITY LOGS */}
              {activeTab === "settings" && !selectedProjectId && (
                <div className="bg-white rounded-2xl border p-6 shadow-xs space-y-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">Digital Audit Actions Log</h1>
                    <p className="text-xs text-slate-500">Automatic chronologic registry of supervisor and CEO database updates.</p>
                  </div>

                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="border border-slate-200/50 p-3 rounded-lg text-xs hover:bg-slate-50 flex flex-col sm:flex-row justify-between gap-2.5 transition-colors">
                        <div className="space-y-1 max-w-sm flex-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-900 text-slate-100 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase font-mono">
                              {log.action}
                            </span>
                            <span className="font-extrabold text-slate-950 font-mono text-[9px] uppercase">{log.id}</span>
                          </div>
                          <p className="text-slate-500 font-medium">{log.details}</p>
                        </div>
                        <div className="text-right shrink-0 text-[10px] text-slate-400 font-mono">
                          <p className="font-semibold">{log.userEmail}</p>
                          <p className="text-[9px]">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
          
          {/* SECURE PROFESSIONAL FOOTER BAR */}
          <footer className="h-10 bg-white border-t border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 text-[10px] font-medium text-slate-400">
            <div>Powered by A.M Builders Construction Engine v2.4</div>
            <div className="flex items-center gap-4 font-bold text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Online
              </span>
              <span className="text-slate-300">|</span>
              <span>Server: Islamabad-01</span>
            </div>
          </footer>
        </main>

        </div>
      )}

      {generalEditingWorker && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-55 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 overflow-hidden shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="bg-slate-900 text-amber-400 p-5 flex items-center justify-between">
              <h3 className="font-black text-sm tracking-wider uppercase flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
                <span>Edit Personnel Record ({generalEditingWorker.id})</span>
              </h3>
              <button 
                onClick={() => setGeneralEditingWorker(null)}
                className="text-amber-400 hover:text-amber-300 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const updated: Worker = {
                ...generalEditingWorker,
                name: gemWorkerName,
                category: gemWorkerCategory,
                projectId: gemWorkerProjectId,
                cnic: gemWorkerCnic,
                phone: gemWorkerPhone,
                paymentType: gemWorkerPaymentType,
                agreedRate: gemWorkerRate,
                rateUnit: gemWorkerPaymentType === PaymentType.DAILY ? "Per day" : "Per square feet"
              };
              handleUpdateWorker(updated);
              setGeneralEditingWorker(null);
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Worker Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Masoom Ali" 
                    value={gemWorkerName} 
                    onChange={(e) => setGemWorkerName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Worker category</label>
                  <select 
                    value={gemWorkerCategory} 
                    onChange={(e) => setGemWorkerCategory(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white"
                  >
                    {Object.values(WorkerCategory).map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Assigned Project</label>
                  <select 
                    value={gemWorkerProjectId} 
                    onChange={(e) => setGemWorkerProjectId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white"
                  >
                    <option value="">Unassigned</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">CNIC Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="35201-..." 
                    value={gemWorkerCnic} 
                    onChange={(e) => setGemWorkerCnic(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="+92 3..." 
                    value={gemWorkerPhone} 
                    onChange={(e) => setGemWorkerPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Payment Basis Type</label>
                  <select 
                    value={gemWorkerPaymentType} 
                    onChange={(e) => setGemWorkerPaymentType(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white"
                  >
                    {Object.values(PaymentType).map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Rate Amount (PKR)</label>
                  <input 
                    type="number" 
                    required
                    value={gemWorkerRate} 
                    onChange={(e) => setGemWorkerRate(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white" 
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setGeneralEditingWorker(null)}
                  className="bg-slate-100 text-slate-705 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-slate-900 text-amber-400 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer hover:bg-slate-800 transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
