/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Building2, 
  LayoutDashboard, 
  HardHat, 
  Briefcase, 
  Truck, 
  CircleDollarSign, 
  BarChart3, 
  Settings, 
  Globe,
  Bell,
  RefreshCw,
  LogOut,
  UserCheck
} from "lucide-react";
import { UserRole, User, ProjectTeamMember } from "../types";

interface SidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBackToLanding: () => void;
  onLogout: () => void;
  unreadCount: number;
  userName: string;
  allUsers?: User[];
  teamMembers?: ProjectTeamMember[];
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  currentRole,
  onRoleChange,
  activeTab,
  setActiveTab,
  onBackToLanding,
  onLogout,
  unreadCount,
  userName,
  allUsers = [],
  teamMembers = [],
  isOpen = false,
  onClose
}: SidebarProps) {
  
  // Define menu items and which roles can access them
  const menuItems = [
    {
      id: "dashboard",
      label: "Main Dashboard",
      icon: LayoutDashboard,
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.SUPERVISOR, UserRole.ACCOUNTANT, UserRole.EMPLOYEE, UserRole.CLIENT]
    },
    {
      id: "projects",
      label: "Projects List",
      icon: Briefcase,
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.SUPERVISOR, UserRole.ACCOUNTANT, UserRole.EMPLOYEE, UserRole.CLIENT]
    },
    {
      id: "workers",
      label: "Workers & Labour",
      icon: HardHat,
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.SUPERVISOR, UserRole.ACCOUNTANT]
    },
    {
      id: "materials",
      label: "Materials Stock",
      icon: LayersIcon, // custom map of Layers from lucide
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.SUPERVISOR, UserRole.ACCOUNTANT]
    },
    {
      id: "suppliers",
      label: "Suppliers Ledger",
      icon: Truck,
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.ACCOUNTANT]
    },
    {
      id: "expenses",
      label: "Company Expenses",
      icon: CircleDollarSign,
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.ACCOUNTANT]
    },
    {
      id: "reports",
      label: "Global Reports",
      icon: BarChart3,
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.ACCOUNTANT, UserRole.CLIENT]
    },
    {
      id: "settings",
      label: "Settings & Logs",
      icon: Settings,
      roles: [UserRole.ADMIN]
    }
  ];

  function LayersIcon(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="m12 3-10 5 10 5 10-5-10-5Z" />
        <path d="m2 17 10 5 10-5" />
        <path d="m2 12 10 5 10-5" />
      </svg>
    );
  }

  const filteredMenu = menuItems.filter(item => item.roles.includes(currentRole));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside 
        id="sidebar-navigation" 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-850 h-screen overflow-y-auto transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Logo header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 text-slate-900 flex items-center justify-center font-black rounded text-sm shrink-0 shadow-xs">
              AM
            </div>
            <span className="text-white font-extrabold tracking-tight text-base sm:text-lg">A.M BUILDERS</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          )}
        </div>

      {/* Role Presenter Box (CRITICAL DEMO FLOW) */}
      <div className="p-4 mx-3 my-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-extrabold text-amber-400 text-sm overflow-hidden shadow-inner">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-xs text-white block truncate">{userName}</span>
            <span className="inline-block bg-amber-400/10 text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider mt-0.5">
              {currentRole}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-3 space-y-1">
        {filteredMenu.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`sidebar-${item.id}`}
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md font-bold"
                  : "text-slate-400 hover:bg-slate-800/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.id === "dashboard" && unreadCount > 0 && (
                <span className={`inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-blue-850 text-white" : "bg-red-500 text-white"
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer operations (Back to landing, logout simulation) */}
      <div className="p-4 border-t border-slate-800 space-y-2 mt-auto">
        <button
          id="btn-back-landing"
          onClick={onBackToLanding}
          className="w-full bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white font-medium p-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-800"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>Exit App to Website</span>
        </button>

        <button
          id="btn-logout"
          onClick={onLogout}
          className="w-full bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 font-medium p-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-red-900/50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout Session</span>
        </button>

        <div className="text-[9px] text-slate-600 text-center font-medium pt-1">
          A.M Builders v1.1.0 Cloud
        </div>
      </div>
    </aside>
    </>
  );
}
