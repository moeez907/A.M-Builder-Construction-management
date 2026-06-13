/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  MapPin, 
  FileText, 
  User, 
  Wallet,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { Project, ProjectStatus } from "../types";

interface ProjectCreatePageProps {
  onSave: (newProject: Project, uploads: {
    agreementDoc?: string;
    mapDoc?: string;
    clientCnicDoc?: string;
    projectImageDoc?: string;
  }) => void;
  onCancel: () => void;
  projectToEdit?: Project;
}

export default function ProjectCreatePage({ onSave, onCancel, projectToEdit }: ProjectCreatePageProps) {
  // Primary States
  const [projectId, setProjectId] = useState(projectToEdit ? projectToEdit.id : `AMB-2026-00${Math.floor(Math.random() * 90) + 10}`);
  const [name, setName] = useState(projectToEdit ? projectToEdit.name : "");
  const [type, setType] = useState(projectToEdit ? projectToEdit.type : "Residential house");
  const [location, setLocation] = useState(projectToEdit ? projectToEdit.location : "");
  const [city, setCity] = useState(projectToEdit ? projectToEdit.city : "Lahore");
  const [totalSqFt, setTotalSqFt] = useState<number>(projectToEdit ? (projectToEdit.totalSqFt || 2250) : 2250);
  const [ratePerSqFt, setRatePerSqFt] = useState<number>(projectToEdit ? (projectToEdit.ratePerSqFt || 3500) : 3500);
  const [areaSize, setAreaSize] = useState(projectToEdit ? projectToEdit.areaSize : "10 Marla / 2250 Sqft");
  const [numFloors, setNumFloors] = useState<number>(projectToEdit ? projectToEdit.numFloors : 2);
  const [estimatedCost, setEstimatedCost] = useState<number>(projectToEdit ? projectToEdit.estimatedCost : 2250 * 3500);
  const [startDate, setStartDate] = useState(projectToEdit ? projectToEdit.startDate : "2026-06-12");
  const [expectedEndDate, setExpectedEndDate] = useState(projectToEdit ? projectToEdit.expectedEndDate : "2026-12-31");
  const [status, setStatus] = useState<ProjectStatus>(projectToEdit ? projectToEdit.status : ProjectStatus.REGISTERED);
  const [description, setDescription] = useState(projectToEdit ? projectToEdit.description : "");

  const handleSqFtChange = (val: number) => {
    setTotalSqFt(val);
    setEstimatedCost(Math.round(val * ratePerSqFt));
    setAreaSize(`${val} Sqft`);
  };

  const handleRateChange = (val: number) => {
    setRatePerSqFt(val);
    setEstimatedCost(Math.round(totalSqFt * val));
  };

  // Representative Info State
  const [repName, setRepName] = useState(projectToEdit ? projectToEdit.repName : "Kamran Shah");
  const [repRole, setRepRole] = useState(projectToEdit ? projectToEdit.repRole : "Project Manager");
  const [repCnic, setRepCnic] = useState(projectToEdit ? projectToEdit.repCnic : "35201-1234567-3");

  // Client Info State
  const [clientName, setClientName] = useState(projectToEdit ? projectToEdit.clientName : "");
  const [clientCnic, setClientCnic] = useState(projectToEdit ? projectToEdit.clientCnic : "");
  const [clientPhone, setClientPhone] = useState(projectToEdit ? projectToEdit.clientPhone : "");
  const [clientEmail, setClientEmail] = useState(projectToEdit ? projectToEdit.clientEmail : "");
  const [clientAddress, setClientAddress] = useState(projectToEdit ? projectToEdit.clientAddress : "");

  // Upload States (simulate elegant cloud upload progress for presentation!)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: { percent: number; file?: string; content?: string; status: "idle" | "uploading" | "done" } }>({
    agreement: { percent: 0, status: "idle" },
    houseMap: { percent: 0, status: "idle" },
    cnicCopy: { percent: 0, status: "idle" },
    frontImage: { percent: 0, status: "idle" }
  });

  const triggerUploadSimulation = (fieldKey: string, fileName: string) => {
    setUploadProgress(prev => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], percent: 5, file: fileName, status: "uploading" }
    }));

    let progress = 5;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(prev => ({
          ...prev,
          [fieldKey]: { ...prev[fieldKey], percent: 100, file: fileName, status: "done" }
        }));
      } else {
        setUploadProgress(prev => ({
          ...prev,
          [fieldKey]: { ...prev[fieldKey], percent: progress, file: fileName, status: "uploading" }
        }));
      }
    }, 250);
  };

  const handleFileChange = (fieldKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUploadProgress(prev => ({
          ...prev,
          [fieldKey]: { 
            ...prev[fieldKey], 
            content: base64,
            file: file.name
          }
        }));
      };
      reader.readAsDataURL(file);

      triggerUploadSimulation(fieldKey, file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientName || !location || !estimatedCost) {
      // Provide feedback using state or toast in a real app
      console.warn("Please fill in all core fields highlighted in red.");
      return;
    }

    const savedProject: Project = {
      id: projectId,
      name,
      type,
      location,
      city,
      areaSize: areaSize || `${totalSqFt} Sqft`,
      numFloors,
      estimatedCost: Number(estimatedCost),
      ratePerSqFt: Number(ratePerSqFt),
      totalSqFt: Number(totalSqFt),
      startDate,
      expectedEndDate,
      status,
      description,
      repName,
      repRole,
      repCnic,
      clientName,
      clientCnic: clientCnic,
      clientPhone,
      clientEmail,
      clientAddress,
      clientAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
      imageUrl: uploadProgress.frontImage?.content || (projectToEdit ? projectToEdit.imageUrl : undefined)
    };

    onSave(savedProject, {
      agreementDoc: uploadProgress.agreement,
      mapDoc: uploadProgress.houseMap,
      clientCnicDoc: uploadProgress.cnicCopy,
      projectImageDoc: uploadProgress.frontImage
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="bg-white hover:bg-slate-100 text-slate-800 p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {projectToEdit ? "Portfolio Modification" : "Portfolio Creation"}
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {projectToEdit ? `Edit Property Profile (${projectToEdit.id})` : "Register New Construction Plot"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Plots Basic Settings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span>1. Basic Property Details</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Project ID <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={projectId} 
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-xs font-mono font-bold uppercase bg-slate-50"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Project Name / Mark <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Model Town Grand Villa" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Project Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                >
                  <option value="Residential house">Residential House</option>
                  <option value="Commercial building">Commercial Building</option>
                  <option value="Plaza">Plaza Complex</option>
                  <option value="Renovation">Full Renovation</option>
                  <option value="Other">Other Category</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">City Location</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Lahore" 
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Plot Location Address <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Plot 45, Block D, Model Town" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total SqFt Area</label>
                <input 
                  type="number" 
                  placeholder="e.g. 2250" 
                  value={totalSqFt} 
                  onChange={(e) => handleSqFtChange(Number(e.target.value))}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rate per SqFt (PKR)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 3500" 
                  value={ratePerSqFt} 
                  onChange={(e) => handleRateChange(Number(e.target.value))}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-xs font-bold text-amber-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Area Title (Label)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 10 Marla" 
                  value={areaSize} 
                  onChange={(e) => setAreaSize(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Number of Floors</label>
                <input 
                  type="number" 
                  value={numFloors} 
                  onChange={(e) => setNumFloors(Number(e.target.value))}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Expected End Date</label>
                <input 
                  type="date" 
                  value={expectedEndDate} 
                  onChange={(e) => setExpectedEndDate(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                />
              </div>

              <div className="col-span-2 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Calculated Estimate Cost <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                    {totalSqFt} SqFt &times; {ratePerSqFt} PKR
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">PKR</span>
                  <input 
                    type="number" 
                    required
                    value={estimatedCost} 
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full border border-slate-300 pl-11 pr-3 p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 font-black text-slate-950 bg-white"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-medium">Description</label>
                <textarea 
                  rows={2} 
                  placeholder="Remarks on layout structures..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Column 2: Client Details & Representative Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            {/* Client Registration fields */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-500" />
                <span>2. Client Contact Particulars</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Client Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Mian Rafique" 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full border border-slate-300 p-2.5 rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-35 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CNIC Number</label>
                    <input 
                      type="text" 
                      placeholder="35201-4455667-9" 
                      value={clientCnic} 
                      onChange={(e) => setClientCnic(e.target.value)}
                      className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="+92 300 8456123" 
                      value={clientPhone} 
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email address</label>
                  <input 
                    type="email" 
                    placeholder="client@gmail.com" 
                    value={clientEmail} 
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Client Address</label>
                  <input 
                    type="text" 
                    placeholder="Phase 5 DHA, Lahore" 
                    value={clientAddress} 
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* A.M Builders Representative Information */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <h3 className="font-extrabold text-slate-900 pb-1.5 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-500" />
                <span>3. Selected Representative</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Representative Name</label>
                  <input 
                    type="text" 
                    value={repName} 
                    onChange={(e) => setRepName(e.target.value)}
                    className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Representative Role</label>
                    <select 
                      value={repRole} 
                      onChange={(e) => setRepRole(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
                    >
                      <option value="CEO">CEO</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Employee">Employee / Engineer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rep CNIC Code</label>
                    <input 
                      type="text" 
                      value={repCnic} 
                      onChange={(e) => setRepCnic(e.target.value)}
                      className="w-full border border-slate-300 p-2.5 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Custom File uploads and verification drafts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 lg:col-span-1">
            <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>4. Digital Scans & Agreements</span>
            </h3>

            {/* Simulated file triggers */}
            <div className="space-y-4">
              
              {/* Slot 1: Agreement File upload */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-700">Client Agreement (PDF)</span>
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-1 rounded">Required</span>
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".pdf,.doc" 
                    onChange={(e) => handleFileChange("agreement", e)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="border-2 border-dashed border-slate-300 hover:border-amber-400 p-3 rounded-lg text-center transition-colors">
                    <Upload className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                    <span className="text-[10px] text-slate-500 block truncate">
                      {uploadProgress.agreement.status === "done" 
                        ? `✓ ${uploadProgress.agreement.file}` 
                        : uploadProgress.agreement.status === "uploading" 
                        ? `Saving (${uploadProgress.agreement.percent}%)` 
                        : "Drag or select agreement contract"}
                    </span>
                  </div>
                </div>
                {uploadProgress.agreement.status === "uploading" && (
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${uploadProgress.agreement.percent}%` }}></div>
                  </div>
                )}
              </div>

              {/* Slot 2: House Map Layout Drawing */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-700">Muncipal House Map Drawing</span>
                  <span className="text-[9px] bg-slate-150 text-slate-500 font-bold px-1 rounded">Optional</span>
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".pdf,.jpg" 
                    onChange={(e) => handleFileChange("houseMap", e)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="border-2 border-dashed border-slate-300 hover:border-amber-400 p-3 rounded-lg text-center transition-colors">
                    <Upload className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                    <span className="text-[10px] text-slate-500 block truncate">
                      {uploadProgress.houseMap.status === "done" 
                        ? `✓ ${uploadProgress.houseMap.file}` 
                        : uploadProgress.houseMap.status === "uploading" 
                        ? `Mapping (${uploadProgress.houseMap.percent}%)` 
                        : "Upload LDA approved house map blueprints"}
                    </span>
                  </div>
                </div>
                {uploadProgress.houseMap.status === "uploading" && (
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${uploadProgress.houseMap.percent}%` }}></div>
                  </div>
                )}
              </div>

              {/* Slot 3: Client CNIC scan */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-700">Client Verified CNIC Scans</span>
                  <span className="text-[9px] bg-slate-150 text-slate-500 font-bold px-1 rounded">Security check</span>
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".pdf,.png,.jpg" 
                    onChange={(e) => handleFileChange("cnicCopy", e)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="border-2 border-dashed border-slate-300 hover:border-amber-400 p-3 rounded-lg text-center transition-colors">
                    <Upload className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                    <span className="text-[10px] text-slate-500 block truncate">
                      {uploadProgress.cnicCopy.status === "done" 
                        ? `✓ ${uploadProgress.cnicCopy.file}` 
                        : uploadProgress.cnicCopy.status === "uploading" 
                        ? `Validating CNIC (${uploadProgress.cnicCopy.percent}%)` 
                        : "Select NADRA identity scans"}
                    </span>
                  </div>
                </div>
                {uploadProgress.cnicCopy.status === "uploading" && (
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${uploadProgress.cnicCopy.percent}%` }}></div>
                  </div>
                )}
              </div>

              {/* Slot 4: Front House photo upload */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-700">Front Project Image (Before Build)</span>
                  <span className="text-[9px] bg-amber-100 text-amber-850 font-bold px-1 rounded">Land plot</span>
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange("frontImage", e)}
                    className="absolute z-10 inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="border-2 border-dashed border-slate-300 hover:border-amber-400 p-3 rounded-lg text-center transition-colors relative overflow-hidden">
                    {uploadProgress.frontImage.content || (projectToEdit && projectToEdit.imageUrl) ? (
                       <img 
                         src={uploadProgress.frontImage.content || projectToEdit?.imageUrl} 
                         alt="Project layout" 
                         className="absolute inset-0 w-full h-full object-cover opacity-30" 
                         referrerPolicy="no-referrer"
                       />
                    ) : null}
                    <div className="relative z-10">
                      <Upload className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-500 block truncate font-medium">
                        {uploadProgress.frontImage.status === "done" 
                          ? `✓ ${uploadProgress.frontImage.file}` 
                          : uploadProgress.frontImage.status === "uploading" 
                          ? `Buffering Image (${uploadProgress.frontImage.percent}%)` 
                          : "Upload front field plot layout photo"}
                      </span>
                    </div>
                  </div>
                </div>
                {uploadProgress.frontImage.status === "uploading" && (
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${uploadProgress.frontImage.percent}%` }}></div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Submit Operations bar */}
        <div className="flex items-center justify-end gap-3.5 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer transition-colors"
          >
            Cancel Return
          </button>
          
          <button
            type="submit"
            className="px-8 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>{projectToEdit ? "Save Changes" : "Save & Instantiate Project"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
