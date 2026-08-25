"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Map, 
  Code2, 
  Trophy, 
  User, 
  LogOut,
  Settings,
  LayoutDashboard,
  BookOpen,
  Database,
  MessageSquare,
  LogIn,
  Menu,
  LifeBuoy,
  Users
} from "lucide-react";
import { useAdmin, logout, useUser, useFirebase } from "@/firebase";
import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ref, onValue, off } from "firebase/database";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="5" fill="#1e40af"/>
    <path d="M30 40L15 50L30 60M70 40L85 50L70 60" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M40 70L60 30" stroke="white" strokeWidth="6" strokeLinecap="round"/>
  </svg>
);

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { db, rtdb } = useFirebase();
  const { isAdmin, isProblemSetter } = useAdmin();
  const [open, setOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    if (!isAdmin || !db || !rtdb) return;

    const ticketsQ = query(collection(db, "support_tickets"), where("status", "==", "open"));
    const unsubTickets = onSnapshot(ticketsQ, (snap) => {
      const ticketsCount = snap.size;
      const forumRef = ref(rtdb, 'forum/topics');
      const unsubForum = onValue(forumRef, (snapshot) => {
        let reportedCount = 0;
        if (snapshot.exists()) {
          reportedCount = Object.values(snapshot.val()).filter((t: any) => t.reportsCount >= 5 && t.status !== 'deleted').length;
        }
        setAlertCount(ticketsCount + reportedCount);
      });
      return () => unsubForum();
    });
    return () => unsubTickets();
  }, [isAdmin, db, rtdb]);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/");
  }, [router]);

  const navItems = useMemo(() => [
    { name: "خارطة الطريق", href: "/roadmap", icon: Map, private: true },
    { name: "بنك المسائل", href: "/problems", icon: Code2, private: false },
    { name: "منتدى النقاش", href: "/forum", icon: MessageSquare, private: false },
    { name: "لوحة الشرف", href: "/leaderboard", icon: Trophy, private: false },
    { name: "الملف الشخصي", href: "/profile", icon: User, private: true },
    { name: "إعدادات الحساب", href: "/settings", icon: Settings, private: true },
  ], []);

  const filteredNavItems = useMemo(() => navItems.filter(item => {
    if (!user && item.private) return false;
    return true;
  }), [user, navItems]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-right" dir="rtl">
      <div className="mb-10 shrink-0">
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <Logo className="w-8 h-8 rounded-sm" />
          <span className="font-black text-xl tracking-tight text-slate-900">OptimalCP</span>
        </Link>
      </div>

      <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
        {filteredNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            prefetch={true}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-black transition-all",
              pathname === item.href || (item.href !== "/roadmap" && pathname.startsWith(item.href)) 
                ? "bg-slate-900 text-white" 
                : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <item.icon className="w-4.5 h-4.5" />
            {item.name}
          </Link>
        ))}

        {user && (isAdmin || isProblemSetter) && (
          <div className="mt-10 pt-6 border-t border-slate-100">
            <p className="px-4 mb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">إدارة المنصة</p>
            <div className="space-y-1">
              
              {isAdmin && (
                <Link href="/dashboard" prefetch={true} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 px-4 py-2.5 text-[11px] font-black rounded-sm uppercase tracking-wider", pathname === "/dashboard" ? "text-primary bg-slate-50" : "text-slate-500 hover:bg-slate-50")}>
                  <LayoutDashboard className="w-4 h-4" /> مركز العمليات
                </Link>
              )}
              
              {isAdmin && (
                <Link href="/admin/roadmap" prefetch={true} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 px-4 py-2.5 text-[11px] font-black rounded-sm uppercase tracking-wider", pathname === "/admin/roadmap" ? "text-primary bg-slate-50" : "text-slate-500 hover:bg-slate-50")}>
                  <BookOpen className="w-4 h-4" /> إدارة المنهج
                </Link>
              )}

              {(isAdmin || isProblemSetter) && (
                <Link href="/admin/problems" prefetch={true} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 px-4 py-2.5 text-[11px] font-black rounded-sm uppercase tracking-wider", pathname === "/admin/problems" ? "text-primary bg-slate-50" : "text-slate-500 hover:bg-slate-50")}>
                  <Database className="w-4 h-4" /> إدارة المسائل
                </Link>
              )}

              {(isAdmin || isProblemSetter) && (
                <Link href="/admin/support" prefetch={true} onClick={() => setOpen(false)} className={cn("relative flex items-center justify-between gap-3 px-4 py-2.5 text-[11px] font-black rounded-sm uppercase tracking-wider", pathname === "/admin/support" ? "text-primary bg-slate-50" : "text-slate-500 hover:bg-slate-50")}>
                  <div className="flex items-center gap-3">
                    <LifeBuoy className="w-4 h-4" /> الدعم الفني
                  </div>
                  {alertCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-sm bg-red-600 text-[10px] font-black text-white px-1 shadow-none">
                      {alertCount}
                    </span>
                  )}
                </Link>
              )}

              {isAdmin && (
                <Link href="/admin/users" prefetch={true} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 px-4 py-2.5 text-[11px] font-black rounded-sm uppercase tracking-wider", pathname === "/admin/users" ? "text-primary bg-slate-50" : "text-slate-500 hover:bg-slate-50")}>
                  <Users className="w-4 h-4" /> إدارة الأعضاء
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100 shrink-0">
        {user ? (
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-black text-red-600 hover:bg-red-50 transition-all text-right"
          >
            <LogOut className="w-4 h-4" /> تسجيل الخروج
          </button>
        ) : (
          <Link 
            href="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-black text-primary border-2 border-primary/20 hover:bg-primary/5 transition-all"
          >
            <LogIn className="w-4 h-4" /> تسجيل الدخول
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-3 right-3 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 bg-white border-2 rounded-sm shadow-none hover:bg-slate-50">
              <Menu className="w-5 h-5 text-slate-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-6 overflow-hidden rounded-none" dir="rtl">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:flex w-64 border-l h-screen bg-white flex-col sticky top-0 z-40 shadow-none shrink-0" dir="rtl">
        <div className="p-6 flex flex-col h-full border-l overflow-hidden">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
