/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Building2, 
  Users, 
  CircleDollarSign, 
  Layers, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  HardHat,
  Truck,
  CheckCircle2,
  CalendarCheck2,
  Activity,
  Bell
} from "lucide-react";
import { 
  Project, 
  Worker, 
  MaterialItem, 
  ProjectExpense, 
  ClientPayment, 
  Notification,
  UserRole
} from "../types";

interface DashboardOverviewProps {
  currentRole: UserRole;
  projects: Project[];
  workers: Worker[];
  materials: MaterialItem[];
  expenses: ProjectExpense[];
  clientPayments: ClientPayment[];
  notifications: Notification[];
  onOpenProject: (projectId: string) => void;
  onNavigateToTab: (tabId: string) => void;
}

export default function DashboardOverview({
  currentRole,
  projects,
  workers,
  materials,
  expenses,
  clientPayments,
  notifications,
  onOpenProject,
  onNavigateToTab
}: DashboardOverviewProps) {
  
  // Mathematical Aggregators
  const totalProjectsCount = projects.length;
  const ongoingProjects = projects.filter(p => p.status === "Ongoing").length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  
  const totalWorkers = workers.length;
  const activeWorkers = workers.filter(w => w.status === "Active").length;
  
  // Safe financial sums
  const totalEstimatedCost = projects.reduce((sum, p) => sum + p.estimatedCost, 0);
  
  const totalClientReceived = clientPayments.reduce((sum, p) => sum + p.advancePayment + p.installmentAmount, 0);
  const totalCompanyExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const pendingSupplierPayables = 0;

  const lowStockMaterials = materials.filter(m => m.currentStock <= m.lowStockAlert);

  return (
    <div className="space-y-6 pt-1">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-250 pb-5">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Consolidated Control Room</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Main Corporate Dashboard</h1>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold shadow-xs border border-emerald-100 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span>SYSTEM CHANNELS ONLINE</span>
        </div>
      </div>



      {/* Metric Bento Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total portfolio worth */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-slate-100 text-slate-900 p-3 rounded-xl group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Projects</span>
          </div>
          <span className="text-2xl font-black text-slate-900 block tracking-tight">
            {totalProjectsCount} <span className="text-xs font-normal text-slate-500">Registered</span>
          </span>
          <span className="text-xs text-slate-500 block mt-1.5 font-medium leading-relaxed">
            <strong className="text-slate-800 font-bold">{ongoingProjects}</strong> actively in progress, <strong className="text-slate-800 font-bold">{completedProjects}</strong> blueprint handovers.
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
        </div>

        {/* Total receipts worth */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <CircleDollarSign className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Client Payments</span>
          </div>
          <span className="text-2xl font-black text-slate-900 block tracking-tight">
            {totalClientReceived.toLocaleString()} <span className="text-xs font-medium text-slate-400">PKR</span>
          </span>
          <span className="text-xs text-emerald-600 block mt-1.5 font-bold">
            ✓ Consolidated Income Received
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
        </div>

        {/* Total expenses disbursed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 text-right">Construction Cost</span>
          </div>
          <span className="text-2xl font-black text-slate-900 block tracking-tight">
            {totalCompanyExpenses.toLocaleString()} <span className="text-xs font-medium text-slate-400">PKR</span>
          </span>
          <span className="text-xs text-rose-600 block mt-1.5 font-medium">
            Disbursed brick, cement, salary bills.
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
        </div>

        {/* Total Active Field Workers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-amber-50 text-amber-600 p-3 rounded-xl group-hover:bg-slate-900 group-hover:text-amber-400 transition-colors">
              <HardHat className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Field Force</span>
          </div>
          <span className="text-2xl font-black text-slate-900 block tracking-tight">
            {totalWorkers} <span className="text-xs font-normal text-slate-500">Personnel</span>
          </span>
          <span className="text-xs text-slate-500 block mt-1.5 font-medium leading-relaxed">
            <strong className="text-slate-800 font-bold">{activeWorkers}</strong> active on-sites daily.
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
        </div>
      </div>

      {/* Profit indicator & budget allocation bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block">Estimated Profit Margin Balance (PKR)</span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white m-0">
              {(totalClientReceived - totalCompanyExpenses).toLocaleString()} PKR{" "}
              <span className="text-xs font-normal text-slate-400">Estimated Site Margin Balance</span>
            </h3>
            <p className="text-xs text-slate-400">
              Allocated sum calculated as: Consolidated Client Paid (Installments) minus Registered Bills & Payrolls paid out.
            </p>
          </div>
          <div className="w-full lg:w-96 space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-bold">
              <span>Expenses vs Received</span>
              <span>
                {Math.round((totalCompanyExpenses / (totalClientReceived || 1)) * 100)}% Used Balance
              </span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(100, Math.round((totalCompanyExpenses / (totalClientReceived || 1)) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main section: Projects quick portfolio tracker + System Live Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Projects List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-700" />
              <h3 className="font-extrabold text-lg text-slate-900">Active Site Handover Tracking</h3>
            </div>
            <button 
              onClick={() => onNavigateToTab("projects")}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <span>See All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {projects.map((proj) => {
              // Calculate specific totals for each project to present beautiful progress card
              const projExpenses = expenses.filter(e => e.projectId === proj.id).reduce((s, e) => s + e.amount, 0);
              const projPayments = clientPayments.filter(p => p.projectId === proj.id).reduce((s, p) => s + p.advancePayment + p.installmentAmount, 0);
              const percentCollected = Math.min(100, Math.round((projPayments / proj.estimatedCost) * 100));

              const displayImgUrl = proj.imageUrl || (
                proj.id === "AMB-2026-001" ? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80" :
                proj.id === "AMB-2026-002" ? "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80" :
                proj.id === "AMB-2026-003" ? "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" :
                null
              );

              return (
                <div key={proj.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 p-2 rounded-xl transition-all">
                  <div className="flex items-center gap-3.5 max-w-sm flex-1">
                    {/* Thumbnail banner preview or aesthetic fallback */}
                    {displayImgUrl ? (
                      <img 
                        src={displayImgUrl} 
                        alt={proj.name} 
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800 text-amber-500 font-black text-[9px] uppercase tracking-widest leading-none">
                        AMB
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 hover:text-amber-600 cursor-pointer text-sm sm:text-base" onClick={() => onOpenProject(proj.id)}>
                          {proj.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          proj.status === "Ongoing" 
                            ? "bg-amber-100 text-amber-800"
                            : proj.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {proj.status}
                        </span>
                      </div>
                      <div className="flex flex-col text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">📍 {proj.location}, {proj.city} &bull; {proj.areaSize}</span>
                        {proj.ratePerSqFt && proj.totalSqFt ? (
                          <span className="text-[10px] text-amber-650 font-bold font-mono mt-0.5">
                            Formula: {proj.totalSqFt} sqft &times; {proj.ratePerSqFt} PKR
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-48 text-right space-y-2">
                    <div className="flex justify-between sm:justify-end gap-4 text-xs font-medium">
                      <span className="text-slate-400">Budget:</span>
                      <span className="font-extrabold text-slate-900">{(proj.estimatedCost / 1000000).toFixed(1)}M PKR</span>
                    </div>
                    <div className="flex justify-between sm:justify-end gap-4 text-xs font-medium">
                      <span className="text-slate-400 font-medium">Expenses logged:</span>
                      <span className="font-bold text-rose-600">{projExpenses.toLocaleString()} PKR</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Notifications & alerts stream */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-slate-700" />
              <h3 className="font-extrabold text-lg text-slate-900">Recent Alerts Log</h3>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold uppercase rounded px-2 py-0.5">
              Live Feed
            </span>
          </div>

          <div className="space-y-3.5 overflow-y-auto max-h-[310px] pr-1">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-3 rounded-xl border ${
                  notif.type === "warning" ? "bg-amber-50/50 border-amber-200/50" : 
                  notif.type === "alert" ? "bg-rose-50/50 border-rose-200/50" :
                  "bg-emerald-50/30 border-emerald-250/30"
                } text-xs space-y-1`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded ${
                    notif.type === "warning" ? "bg-amber-100 text-amber-800" :
                    notif.type === "alert" ? "bg-rose-100 text-rose-800" :
                    "bg-emerald-100 text-emerald-800"
                  }`}>
                    {notif.type}
                  </span>
                  <span className="text-slate-450 tracking-wider text-[9px] font-semibold">{notif.date}</span>
                </div>
                <h4 className="font-bold text-slate-900">{notif.title}</h4>
                <p className="text-slate-500 leading-relaxed text-[11px]">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Administrative Operations flow for Presentation */}
      <div className="bg-amber-400/5 border border-amber-300/30 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <HardHat className="w-6 h-6 text-amber-500" />
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Presentation Quick-Guides</h3>
            <p className="text-xs text-slate-500">
              Easily execute A.M Builders’ complete system flow by opening a project listed below.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <span className="bg-slate-100 text-slate-800 text-[9px] font-bold uppercase rounded px-1.5 py-0.5 inline-block">Step 1 & 2</span>
            <h4 className="font-bold text-xs text-slate-900">Add New Project Blueprint</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Click <strong className="font-bold">Projects List</strong> in the sidebar, tap "Create Project", and provide client info with PDFs uploads.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <span className="bg-slate-100 text-slate-800 text-[9px] font-bold uppercase rounded px-1.5 py-0.5 inline-block">Step 3 & 4</span>
            <h4 className="font-bold text-xs text-slate-900">Record Labour & Attendance</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Open a project (e.g. Model Town), set worker categories daily rates, register attendance check-ins, and view auto payments.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <span className="bg-slate-100 text-slate-800 text-[9px] font-bold uppercase rounded px-1.5 py-0.5 inline-block">Step 5 & 6</span>
            <h4 className="font-bold text-xs text-slate-900">Track Stock & View Reports</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Monitor brick/cement stock, post daily progress, compute materials used cost, and export PDF reports directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
