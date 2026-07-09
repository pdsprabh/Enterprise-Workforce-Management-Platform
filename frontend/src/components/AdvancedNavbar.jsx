import React, { useContext, useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Grid, Users, Clock, Calendar, UserPlus, DollarSign, TrendingUp, Briefcase, Monitor, Headphones, FileText, BarChart2 } from 'lucide-react'
import { AuthContext } from "../context/AuthContext"
import { useNotifications } from "../context/NotificationContext"
import { useTheme } from "../context/ThemeContext"
import { getInitials } from "../utils/formatters"
import NotificationPanel from "./notifications/NotificationPanel"
import GlobalSearch from "./GlobalSearch"
import { NAV_SECTIONS } from "../utils/constants"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { cn } from "@/lib/utils"

const Icons = {
  'grid': Grid,
  'users': Users,
  'clock': Clock,
  'calendar': Calendar,
  'user-plus': UserPlus,
  'dollar-sign': DollarSign,
  'trending-up': TrendingUp,
  'briefcase': Briefcase,
  'monitor': Monitor,
  'headphones': Headphones,
  'file-text': FileText,
  'bar-chart-2': BarChart2,
}

export default function AdvancedNavbar() {
  const { user, logout } = useContext(AuthContext)
  const { theme, toggleTheme } = useTheme()
  const { unreadCount } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)
  const bellRef = useRef(null)
  const navigate = useNavigate()
  const searchRef = useRef(null)

  // ⌘K / Ctrl+K focuses the search input
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        // Reach into GlobalSearch's internal input via a data attribute
        const input = document.querySelector('[data-global-search-input]')
        input?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }
  const allowedSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !item.allowedRoles ||
        item.allowedRoles.includes("All") ||
        item.allowedRoles.includes(user?.role)
    ),
  })).filter((section) => section.items.length > 0)

  const allAllowedFeatures = allowedSections.flatMap(section => section.items)
  const [hoveredFeature, setHoveredFeature] = useState(null)
  
  // Reset hover state when dropdown closes (optional but good practice)
  // We'll rely on the default (first feature) when hoveredFeature is null.

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] transition-colors duration-200">
      <div className="flex h-16 items-center px-6 gap-6 md:gap-10">
        {/* Brand */}
        <Link to="/dashboard" className="flex flex-1 items-center gap-2 transition-opacity hover:opacity-90">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
            W
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workforce.io
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-6 md:gap-8">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 data-[state=open]:text-slate-900 dark:data-[state=open]:text-white focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white h-9 px-3">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-4 p-4 md:w-[600px] md:grid-cols-[250px_1fr] lg:w-[800px] lg:grid-cols-[300px_1fr] bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800">
                    
                    {/* Featured Image Side */}
                    <div className="hidden md:flex flex-col rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative group h-full min-h-[300px]">
                      {(() => {
                        const activeFeature = hoveredFeature || allAllowedFeatures[0];
                        if (!activeFeature) return null;
                        const Icon = Icons[activeFeature.icon] || Grid;
                        return (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                            <img 
                              src={activeFeature.imagePath} 
                              alt={activeFeature.label} 
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute bottom-8 left-0 right-0 px-8 z-20">
                              <div className="flex items-center gap-2 mb-2 text-white">
                                <Icon className="h-5 w-5 text-indigo-400" />
                                <h3 className="text-xl font-bold">{activeFeature.label}</h3>
                              </div>
                              <p className="text-sm text-slate-200 leading-relaxed line-clamp-3">
                                {activeFeature.description}
                              </p>
                              <button 
                                className="mt-4 inline-flex w-fit items-center gap-2 py-2 bg-transparent text-white text-sm font-medium transition-all group-hover:text-indigo-200" 
                                onClick={() => navigate(activeFeature.path)}
                              >
                                <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-indigo-200/60 transition-colors">Explore {activeFeature.label}</span>
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                              </button>
                            </div>
                          </>
                        )
                      })()}
                    </div>

                    {/* Feature Links Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-1 content-start">
                      {allAllowedFeatures.map((item) => {
                        const Icon = Icons[item.icon] || Grid;
                        return (
                          <NavigationMenuLink asChild key={item.path} onSelect={() => navigate(item.path)}>
                            <button
                              onClick={() => navigate(item.path)}
                              onMouseEnter={() => setHoveredFeature(item)}
                              className="flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 group"
                            >
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                <Icon className="h-6 w-6" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {item.label}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                  {item.description}
                                </span>
                              </div>
                            </button>
                          </NavigationMenuLink>
                        )
                      })}
                    </div>

                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild onSelect={() => navigate('/dashboard')} className={cn(navigationMenuTriggerStyle(), "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white h-9 px-3 cursor-pointer")}>
                  <Link to="/dashboard">
                    About Us
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild onSelect={() => navigate('/ai-assistant')} className={cn(navigationMenuTriggerStyle(), "bg-transparent text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-700 dark:hover:text-indigo-300 h-9 px-3 cursor-pointer")}>
                  <Link to="/ai-assistant">
                    AI Assistant
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild onSelect={() => navigate('/settings')} className={cn(navigationMenuTriggerStyle(), "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white h-9 px-3 cursor-pointer")}>
                  <Link to="/settings">
                    Settings
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side actions */}
        <div className="flex flex-1 items-center justify-end gap-6">
          {/* Search Bar */}
          <div className="hidden lg:flex relative group" ref={searchRef}>
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4 ml-2">
            {/* Theme toggle */}
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {theme === "light" ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={bellRef}>
              <button
                className="inline-flex h-9 w-9 relative items-center justify-center rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                onClick={() => setShowNotifications((v) => !v)}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationPanel onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-2 outline-none">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white ring-2 ring-transparent hover:ring-indigo-400 transition-all shadow-sm">
                  {getInitials(user?.name)}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none text-slate-900 dark:text-white">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-slate-500 dark:text-slate-400">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white">
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white">
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950 focus:text-red-700 dark:focus:text-red-300"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
