import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, CheckSquare, FolderKanban, Users, Search, Bell, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/" },
    { icon: FolderKanban, label: "Projects", href: "/projects" },
    { icon: CheckSquare, label: "Tasks", href: "/tasks" },
    { icon: Users, label: "Members", href: "/members" },
  ];

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-sidebar flex-shrink-0 hidden md:flex flex-col">
        <div className="h-14 flex items-center px-6 border-b border-border">
          <div className="w-6 h-6 bg-primary rounded-sm mr-3"></div>
          <span className="font-bold text-lg tracking-tight">Meridian</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Workspace</div>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${location === item.href || (item.href !== '/' && location.startsWith(item.href)) ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">MK</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">Max K.</span>
              <span className="text-xs text-muted-foreground mt-1">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search projects, tasks..." 
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border-none text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground md:hidden">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
