/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Clock, 
  CheckSquare, 
  Users, 
  TrendingUp, 
  Award, 
  Layers, 
  ShieldCheck, 
  HardHat 
} from "lucide-react";

interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMsg) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setContactName("");
        setContactEmail("");
        setContactMsg("");
      }, 4000);
    }
  };

  return (
    <div id="landing-page" className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col pt-[116px]">
      
      {/* Fixed header and notification bar container to prevent navigation bar from scrolling up */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        {/* Top Notification bar */}
        <div className="bg-amber-500 text-slate-950 font-semibold text-center text-xs py-2 px-4 flex items-center justify-center gap-2">
          <span className="bg-slate-950 text-amber-400 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">LIVE DEMO</span>
          <span>A.M Builders Digitalization is Active. Monitor workers, attendance, and inventory updates in real time!</span>
          <button 
            id="btn-quick-apps"
            onClick={onEnterApp}
            className="underline hover:text-white cursor-pointer ml-4 text-[11px] flex items-center gap-1 font-bold"
          >
            Open App Portal <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Main Header */}
        <header className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 text-amber-400 p-2.5 rounded-lg flex items-center justify-center shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 block">
                  A.M <span className="text-amber-500">BUILDERS</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-500 uppercase block font-semibold">
                  CONSTRUCTION & SITE DEVELOPMENT
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#about" className="hover:text-amber-600 transition-colors">About Us</a>
              <a href="#services" className="hover:text-amber-600 transition-colors">Services</a>
              <a href="#portfolio" className="hover:text-amber-600 transition-colors">Key Projects</a>
              <a href="#contact" className="hover:text-amber-600 transition-colors">Contact</a>
            </nav>

            <div className="flex items-center gap-4">
              <button
                id="header-app-login"
                onClick={onEnterApp}
                className="bg-slate-900 hover:bg-slate-800 text-white hover:text-amber-400 font-semibold py-2 px-6 rounded-lg transition-all text-sm shadow-sm flex items-center gap-2 cursor-pointer border border-slate-800"
              >
                <HardHat className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Staff Login / App Portal</span>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 lg:py-28 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> ISO 9001 Certified Contractors
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              We Build The Future. <br />
              <span className="text-amber-400 underline decoration-amber-500/40 decoration-4 underline-offset-8">Transparently.</span>
            </h1>
            <p className="text-slate-300 text-lg sm:text-xl max-w-xl leading-relaxed">
              Ditching manual logs for modern structural performance. A.M Builders bridges master architecture with real-time digital daily progress tracking, smart material inventory levels, and live wage accounting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                id="hero-portal-redirect"
                onClick={onEnterApp}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 text-base group"
              >
                <span>Launch Construction Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#services"
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base font-semibold"
              >
                Explore Services
              </a>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800 text-slate-300">
              <div>
                <span className="font-extrabold text-3xl text-amber-400 block">45M+</span>
                <span className="text-xs text-slate-400">PKR Capital Projects</span>
              </div>
              <div>
                <span className="font-extrabold text-3xl text-amber-400 block">100%</span>
                <span className="text-xs text-slate-400">Digital Accountability</span>
              </div>
              <div>
                <span className="font-extrabold text-3xl text-amber-400 block">30+</span>
                <span className="text-xs text-slate-400">Skilled Civil Teams</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Elegant preview card resembling a live project on field */}
            <div className="relative bg-slate-950/70 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-6">
              <div className="absolute top-4 right-4 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase animate-pulse">
                Active Site
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-amber-400 text-slate-950 p-2.5 rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Model Town Grand Villa</h3>
                  <p className="text-xs text-slate-400">1 Kanal Luxury Residential Unit</p>
                </div>
              </div>

              {/* Real-time stats display preview mockup */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-400">Construction Stage: Grey Structure</span>
                    <span className="text-amber-400">68% Complete</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: "68%" }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
                    <span className="text-slate-400 block mb-0.5">Today's Progress</span>
                    <span className="text-emerald-400 font-semibold block">12,000 Bricks Laid</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
                    <span className="text-slate-400 block mb-0.5 font-medium">Onsite Labour</span>
                    <span className="text-amber-300 font-semibold block">4 Active Workers</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400">Client: Mian Rafique</span>
                <span className="text-amber-400 hover:underline cursor-pointer flex items-center gap-1" onClick={onEnterApp}>
                  View Live Portal <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Micro background decorations */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-400 rounded-full blur-3xl opacity-20 -z-10 animate-pulse"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Trust & Modern Features block */}
      <section id="about" className="py-16 bg-white shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-widest block">Our Core Pillars</span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Bringing Absolute Accountability and Precision
            </h2>
            <p className="text-slate-500 text-base">
              Say goodbye to missing records, estimates overshoots, and unverified worker attendance claims. We deploy full digital tracing to every level of construction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-md transition-shadow border border-slate-100 flex flex-col items-start space-y-4">
              <div className="bg-amber-400/10 text-amber-600 p-3.5 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900">Calculated Attendance Logs</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Site supervisors record worker logs on-site. Calculations for Overtime Hours, Half Days, and Absentees are instantly computed and logged onto worker payment ledgers.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-md transition-shadow border border-slate-100 flex flex-col items-start space-y-4">
              <div className="bg-amber-400/10 text-amber-600 p-3.5 rounded-xl">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900">Synchronized Stock Tracking</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Every brick, cement bag, and steel bar purchase is paired with delivery logs and immediately tracked through our usage journals. Stock deficits trigger low-stock push alerts.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-md transition-shadow border border-slate-100 flex flex-col items-start space-y-4">
              <div className="bg-amber-400/10 text-amber-600 p-3.5 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900">Authorized Transparency</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Contracts, maps, invoices, progress videos, and legal agreements are safely mapped into secure tiered user folders. Only approved roles access financial receipts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-900 text-white shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest block">Structural Excellence</span>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">What A.M Builders Specializes In</h2>
            </div>
            <p className="text-slate-400 max-w-md text-sm">
              We operate an multi-disciplinary team comprising structural engineers, landscape architects, project managers, and expert local craftsmen in Lahore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Residential Luxury Villas", desc: "Constructing premier 10-Marla and multi-Kanal double unit homes with luxury finishing, landscaping, and premium wood works." },
              { title: "Commercial Plazas & Retail", desc: "Multi-story reinforced concrete shells, structural steel curtain glass offices, and retail hubs with elevators and basements." },
              { title: "Smart Plaza Shell Complex", desc: "Robust commercial malls and plazas focusing on optimization of square feet layout and civil load distributions." },
              { title: "Full Renovation & Finishing", desc: "Premium master Italian marble installations, interior remodeling, structural roof repair, and modern texture repaint coatings." }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-6 rounded-xl hover:border-amber-400 transition-all flex flex-col justify-between h-56 group">
                <div className="space-y-3">
                  <div className="bg-slate-900 text-amber-400 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold border border-slate-800">
                    0{idx + 1}
                  </div>
                  <h4 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Showcase section */}
      <section id="portfolio" className="py-20 bg-white shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-widest block">Masterpieces</span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl text-center">
              Our Ongoing & Finished Developments
            </h2>
            <p className="text-slate-500 text-sm">
              Browse some of the landmark plots actively managed or recently handed over under our verified digital delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xs group">
              <div className="h-64 relative overflow-hidden bg-slate-300">
                <img 
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80" 
                  alt="Model Town Villa" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Ongoing (68%)
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Model Town, Lahore</span>
                </div>
                <h3 className="font-extrabold text-xl text-slate-900">Model Town Grand Villa</h3>
                <p className="text-slate-500 text-xs line-clamp-2">
                  Luxurious double unit residential construction with brick finishing, customized landscaping, and solid Deodar timber works.
                </p>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Estimated cost</span>
                    <span className="font-bold text-slate-900">35 Million PKR</span>
                  </div>
                  <button onClick={onEnterApp} className="text-slate-900 hover:text-amber-600 font-bold flex items-center gap-1 cursor-pointer">
                    Monitor Project <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xs group">
              <div className="h-64 relative overflow-hidden bg-slate-300">
                <img 
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80" 
                  alt="DHA Plaza" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Ongoing (40%)
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Phase 8 DHA, Lahore</span>
                </div>
                <h3 className="font-extrabold text-xl text-slate-900">DHA Commercial Plaza</h3>
                <p className="text-slate-500 text-xs line-clamp-2">
                  Modern steel framework multi-story corporate complex, concrete foundation base, high load ceilings, and automated utility layouts.
                </p>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Estimated cost</span>
                    <span className="font-bold text-slate-900">55 Million PKR</span>
                  </div>
                  <button onClick={onEnterApp} className="text-slate-900 hover:text-amber-600 font-bold flex items-center gap-1 cursor-pointer">
                    Monitor Project <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xs group">
              <div className="h-64 relative overflow-hidden bg-slate-300">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" 
                  alt="Completed masterpiece" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Completed
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>State Life Society, Lahore</span>
                </div>
                <h3 className="font-extrabold text-xl text-slate-900">State Life Plaza Heights</h3>
                <p className="text-slate-500 text-xs line-clamp-2">
                  Completed 5-story executive residential housing apartment blocks featuring modern kitchenettes, plumbing routers and security grids.
                </p>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Estimated cost</span>
                    <span className="font-bold text-slate-900">42 Million PKR</span>
                  </div>
                  <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                    ✓ Handed Over Successfully
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Public Contact Form */}
      <section id="contact" className="py-16 bg-slate-100 shrink-0 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-slate-200/50 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Need a Certified Built Structure?</h2>
              <p className="text-sm text-slate-500">
                Submit an inquiry directly to the CEO office of A.M Builders.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-center space-y-2 animate-fade-in">
                <span className="text-2xl">✓</span>
                <p className="font-bold">Inquiry Transmitted Successfully</p>
                <p className="text-xs text-emerald-600">
                  Our Representative staff will reach out via email within 24 working hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={contactName} 
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Salim Khan" 
                      className="w-full border border-slate-300 p-3 rounded-lg text-sm focus:outline-hidden focus:border-amber-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={contactEmail} 
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. salim@gmail.com" 
                      className="w-full border border-slate-300 p-3 rounded-lg text-sm focus:outline-hidden focus:border-amber-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Construction Project Description / Detail</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={contactMsg} 
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Describe you plot location, area size, floors, budget estimate..." 
                    className="w-full border border-slate-300 p-3 rounded-lg text-sm focus:outline-hidden focus:border-amber-500"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-amber-400 font-bold p-3.5 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Send Proposal Draft
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 py-12 border-t border-slate-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="font-extrabold text-lg text-white tracking-widest block uppercase">A.M BUILDERS</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standard-setting execution for residential, commercial developments across Pakistan. 100% auditable worker registries and ledger solutions.
            </p>
          </div>
          <div>
            <span className="font-semibold text-sm text-white block mb-3 uppercase">Corporate Offices</span>
            <p className="text-xs text-slate-400 leading-relaxed flex items-start gap-1">
              <MapPin className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
              <span>Block D-1 Main Boulevard, Model Town, Lahore, Pakistan</span>
            </p>
          </div>
          <div>
            <span className="font-semibold text-sm text-white block mb-3 uppercase">Support Channel</span>
            <p className="text-xs text-slate-400 leading-relaxed flex items-center gap-1.5 mb-2">
              <Phone className="w-4 h-4 text-amber-500" />
              <span>+92 300 1234567</span>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-amber-500" />
              <span>contact@ambuilders.com</span>
            </p>
          </div>
          <div className="space-y-4">
            <span className="font-semibold text-sm text-white block uppercase">Go to Application</span>
            <button
              onClick={onEnterApp}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2.5 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 border border-amber-500"
            >
              <span>Launch Staff Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-900 text-center text-xs text-slate-600">
          <p>© 2026 A.M Builders (Pvt) Ltd. All Rights Reserved. Managed via Cloud Native digital database platforms.</p>
        </div>
      </footer>
    </div>
  );
}
