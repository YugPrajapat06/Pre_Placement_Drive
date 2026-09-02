import React, { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  ClipboardList,
  Mic2,
  ChevronRight,
  Zap,
  Menu,
  X,
  User,
  ShieldCheck,
  Shield
} from "lucide-react";
import { useSelector } from "react-redux";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/home",
  },
  {
    label: "Assessment",
    icon: ClipboardList,
    path: "/assessment",
  },
  {
    label: "Skill-Building",
    icon: Zap,
    path: '/skill-building'
  },
  {
    label: "Interview",
    icon: Mic2,
    path: "/interview",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const {user} = useSelector(state => state.auth);

  const activeNavItems = user?.role === "admin" 
    ? [...navItems, { label: "Admin Panel", icon: ShieldCheck, path: "/admin" }]
    : navItems;

  return (
    <>
      {/* ── DESKTOP SIDEBAR (left, fixed) ─────────────────────────── */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 z-40 bg-white/90 backdrop-blur-xl border-r border-orange-100 shadow-[4px_0_30px_rgba(249,115,22,0.08)]">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-orange-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-200">
            <User size={18} className="text-white" />
          </div>
          <div>
            <p className="text-lg uppercase font-bold text-slate-900 tracking-wider leading-none">
              {user?.username}
            </p>
            <p className="text-[11px]  font-medium mt-0.5">
              Pre Placement <span className="text-orange-500">Drive</span>
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 py-6 flex-1">
          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Navigation
          </p>
          {activeNavItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path || (path === "/admin" && location.pathname.startsWith("/admin"));
            return (
              <NavLink
                key={path}
                to={path}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[linear-gradient(135deg,#F97316,#FB923C)] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(45deg,transparent,transparent_12px,rgba(255,255,255,0.08)_12px,rgba(255,255,255,0.08)_24px)] before:content-[''] text-white shadow-lg"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {/* Active indicator pill */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-orange-300 opacity-70" />
                )}
                <Icon
                  size={18}
                  className={`shrink-0 transition-transform duration-200 ${
                    active ? "text-white" : "text-slate-400 group-hover:text-orange-500"
                  } ${!active && "group-hover:scale-110"}`}
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <ChevronRight size={14} className="text-orange-200" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom accent */}
        <div className="px-4 pb-6">
          <div className="rounded-2xl bg-linear-to-br from-orange-50 to-amber-50 border border-orange-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-600">
                Pro Plan Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              You have full access to all placement modules.
            </p>
          </div>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ───────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-orange-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-orange-600 shadow shadow-orange-200">
              <Zap size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">
                PlacePro
              </p>
              <p className="text-[10px] text-orange-500 font-medium">
                Placement Drive
              </p>
            </div>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition hover:bg-orange-100 active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-1 px-3 pb-3">
            {activeNavItems.map(({ label, icon: Icon, path }) => {
              const active = location.pathname === path || (path === "/admin" && location.pathname.startsWith("/admin"));
              return (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200"
                      : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  <Icon
                    size={17}
                    className={`shrink-0 ${
                      active ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span>{label}</span>
                  {active && (
                    <ChevronRight size={14} className="ml-auto text-orange-200" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── MOBILE BOTTOM TAB BAR (alternative ultra-clean nav) ──────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-orange-100 shadow-[0_-4px_20px_rgba(249,115,22,0.08)]">
        <div className="flex items-center justify-around px-2 py-2">
          {activeNavItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path || (path === "/admin" && location.pathname.startsWith("/admin"));
            return (
              <NavLink
                key={path}
                to={path}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 ${
                  active
                    ? "text-orange-500"
                    : "text-slate-400 hover:text-orange-400"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-linear-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-200"
                      : "bg-transparent"
                  }`}
                >
                  <Icon
                    size={17}
                    className={active ? "text-white" : "text-slate-400"}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold transition-all ${
                    active ? "text-orange-500" : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
