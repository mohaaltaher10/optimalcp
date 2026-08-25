'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser, useAdmin, useFirebase } from '@/firebase';
import { LayoutDashboard, Code2, Trophy, Map, Globe, Database, MessageSquare, Sparkles, LogIn, Loader2, Users, Activity } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { useEffect, useState } from 'react';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';

const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="15" fill="#1e40af"/>
    <path d="M30 40L15 50L30 60" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M70 40L85 50L70 60" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M40 70L60 30" stroke="white" strokeWidth="6" strokeLinecap="round"/>
  </svg>
);

export default function Home() {
  const { user } = useUser();
  const { isAdmin, isProblemSetter } = useAdmin();
  const { db } = useFirebase();

  const [stats, setStats] = useState({
    problems: 0,
    trainees: 0,
    setters: 0,
    activeTrainees: 0,
    loading: true
  });

  useEffect(() => {
    async function fetchOptimizedStats() {
      if (!db) return;
      try {
        const problemsSnap = await getCountFromServer(collection(db, "problems"));
        const settersSnap = await getCountFromServer(
          query(collection(db, "users"), where("role", "in", ["admin", "problem_setter"]))
        );
        const traineesSnap = await getCountFromServer(
          query(collection(db, "users"), where("role", "==", "trainee"))
        );
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const activeSnap = await getCountFromServer(
          query(collection(db, "users"), where("lastActivity", ">=", oneWeekAgo.toISOString()))
        );

        setStats({
          problems: problemsSnap.data().count,
          trainees: traineesSnap.data().count,
          setters: settersSnap.data().count,
          activeTrainees: activeSnap.data().count,
          loading: false
        });
      } catch (e) {
        console.error("Stats fetch error:", e);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }
    fetchOptimizedStats();
  }, [db]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900" dir="rtl">
      <header className="border-b bg-white sticky top-0 z-50 w-full">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 lg:gap-8 flex-1 min-w-0">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <Logo className="transition-transform group-hover:scale-110" />
              <span className="text-lg md:text-xl font-black tracking-tight whitespace-nowrap">OptimalCP</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 overflow-hidden">
              {user && <Link href="/roadmap" className="text-[10px] xl:text-xs font-black hover:text-primary transition-colors whitespace-nowrap">خارطة الطريق</Link>}
              <Link href="/problems" className="text-[10px] xl:text-xs font-black hover:text-primary transition-colors whitespace-nowrap">بنك المسائل</Link>
              <Link href="/forum" className="text-[10px] xl:text-xs font-black hover:text-primary transition-colors whitespace-nowrap">المنتدى</Link>
              <Link href="/leaderboard" className="text-[10px] xl:text-xs font-black hover:text-primary transition-colors whitespace-nowrap">المتصدرون</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!user ? (
              <Link href="/login">
                <Button variant="default" className="font-black rounded-sm h-10 px-4 md:px-8 text-[10px] md:text-xs bg-primary hover:bg-primary/90 gap-2 whitespace-nowrap">
                  <LogIn className="w-3 h-3" /> دخول / تسجيل
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                {(isAdmin || isProblemSetter) && (
                  <Link href="/dashboard" className="hidden sm:block">
                    <Button variant="outline" className="font-black h-10 rounded-sm gap-2 text-[10px] md:text-xs border-2 whitespace-nowrap">
                      <LayoutDashboard className="w-3 h-3 text-primary" /> لوحة التحكم
                    </Button>
                  </Link>
                )}
                <Link href="/roadmap">
                  <Button className="font-black h-10 rounded-sm px-4 md:px-8 text-[10px] md:text-xs bg-primary hover:bg-primary/90 shadow-md whitespace-nowrap">لوحتي الخاصة</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 bg-slate-50 border-b overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
          <div className="container mx-auto px-6">
            <div className="max-w-3xl space-y-8 text-right">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                منصة OptimalCP <br />
                <span className="text-primary underline decoration-4 underline-offset-8">تعلم البرمجة التنافسية</span>
              </h1>
              <p className="text-lg text-slate-600 font-bold leading-relaxed max-w-2xl">
                مسار تعليمي متكامل للبرمجة التنافسية. حل المسائل من كودفورسز، ارتقِ في الترتيب، وطور مهاراتك بشكل أكاديمي محكم ومدروس تحت إشراف نخبة من المبرمجين.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href={user ? "/roadmap" : "/login"}>
                  <Button size="lg" className="font-black rounded-sm px-12 h-16 text-lg bg-primary hover:bg-primary/90 shadow-xl gap-2 w-full sm:w-auto">
                    {!user && <Sparkles className="w-5 h-5" />}
                    ابدأ التعلم الآن
                  </Button>
                </Link>
                <Link href="/problems">
                  <Button size="lg" variant="outline" className="font-black rounded-sm px-12 h-16 text-lg bg-white border-2 hover:bg-slate-50 w-full sm:w-auto">تصفح المسائل</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             <div className="p-10 border-2 bg-white rounded-sm space-y-4 shadow-sm group hover:border-primary/50 transition-colors">
                <div className="w-14 h-14 bg-primary/10 rounded-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Map className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black">خارطة طريق منظمة</h3>
                <p className="text-sm text-slate-500 font-bold leading-relaxed"> تدرج في الدروس وتعم الخورازميات والمفاهيم بشكل مدروس يناسب جميع المستويات.</p>
             </div>
             <div className="p-10 border-2 bg-white rounded-sm space-y-4 shadow-sm group hover:border-emerald-500/50 transition-colors">
                <div className="w-14 h-14 bg-emerald-50 rounded-sm flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Code2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black">تحكيم رسمي</h3>
                <p className="text-sm text-slate-500 font-bold leading-relaxed">نعتمد حصرياً على نتائج كودفورسز لضمان صحة ومصداقية الحلول البرمجية.</p>
             </div>
             <div className="p-10 border-2 bg-white rounded-sm space-y-4 shadow-sm group hover:border-orange-500/50 transition-colors">
                <div className="w-14 h-14 bg-orange-50 rounded-sm flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black">ترتيب المتصدرين</h3>
                <p className="text-sm text-slate-500 font-bold leading-relaxed">نافس زملائك المبرمجين وتسلق لوحة الشرف لتبرز مهاراتك أمام مجتمع المبرمجين.</p>
             </div>
          </div>
        </section>

        <section className="py-24 bg-slate-900 text-white">
          <div className="container mx-auto px-6 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-black">إحصائيات الوقت الفعلي</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                {stats.loading ? (
                  <div className="h-10 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : (
                  <div className="text-3xl md:text-4xl font-black text-primary">{stats.setters}</div>
                )}
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">واضع مسائل</p>
              </div>
              
              <div className="space-y-2">
                {stats.loading ? (
                  <div className="h-10 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : (
                  <div className="text-3xl md:text-4xl font-black text-white">{stats.trainees}</div>
                )}
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">متدرب</p>
              </div>
              
              <div className="space-y-2">
                {stats.loading ? (
                  <div className="h-10 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : (
                  <div className="text-3xl md:text-4xl font-black text-primary">{stats.problems}</div>
                )}
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">مسألة برمجية</p>
              </div>
              
              <div className="space-y-2">
                {stats.loading ? (
                  <div className="h-10 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : (
                  <div className="text-3xl md:text-4xl font-black text-emerald-500">{stats.activeTrainees}</div>
                )}
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">نشط هذا الأسبوع</p>
              </div>
            </div>
          </div>
        </section>

        {!user && (
          <section className="py-24 border-t bg-slate-50">
            <div className="container mx-auto px-6">
              <div className="p-8 md:p-16 bg-white border-2 border-dashed rounded-sm max-w-4xl mx-auto flex flex-col items-center text-center gap-8 transition-all hover:border-primary/40">
                 <div className="space-y-4">
                   <h2 className="text-3xl md:text-4xl font-black text-slate-900">لم تسجل بعد؟ انضم لرحلة الاحتراف</h2>
                   <p className="text-slate-500 font-bold max-w-xl mx-auto leading-relaxed">
                     سواء كنت طالباً جامعياً أو مبرمجاً هاوياً، نوفر لك البيئة الأكاديمية الصارمة لتطوير مهاراتك في حل المشكلات والوصول إلى الاحترافية العالمية.
                   </p>
                 </div>
                 <Link href="/login" className="w-full sm:w-auto">
                   <Button size="lg" className="w-full sm:w-auto font-black rounded-sm h-16 px-16 bg-primary hover:bg-primary/90 text-lg shadow-xl">
                     أنشئ حسابك المجاني الآن
                   </Button>
                 </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
