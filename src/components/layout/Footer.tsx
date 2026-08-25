'use client';
/**
 * @fileOverview الفوتر الكلاسيكي الرسمي للمنصة - يحتوي على معلومات الملكية والروابط القانونية.
 */

import Link from 'next/link';
import { Youtube, Instagram, Globe } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.42-.14 1.01.23 2.08.94 2.82.71.74 1.76 1.13 2.79 1.01.9-.04 1.81-.59 2.33-1.31.52-.72.69-1.63.68-2.52 0-3.17-.02-6.34-.02-9.51z"/>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zm-1.291 19.486h2.039L6.486 3.24H4.298l13.312 17.399z"/>
  </svg>
);

export function Footer() {
  const socials = [
    { id: 'youtube', icon: Youtube, href: 'https://www.youtube.com/@artiatechstudio' },
    { id: 'tiktok', icon: TikTokIcon, href: 'https://www.tiktok.com/@artiatechstudio' },
    { id: 'instagram', icon: Instagram, href: 'https://www.instagram.com/artiatechstudio' },
    { id: 'x', icon: XIcon, href: 'https://twitter.com/artiatechstudio' },
    { id: 'website', icon: Globe, href: 'https://www.artiatechstudio.com.ly' },
  ];

  return (
    <footer className="border-t py-12 bg-white">
      <div className="container mx-auto px-6 text-right">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-3">
            <h4 className="text-2xl font-black text-slate-900">OptimalCP</h4>
            <p className="text-xs text-slate-500 font-bold max-w-xs leading-relaxed">المنصة الأكاديمية الأولى لتدريب المبرمجين على الخوارزميات والبرمجة التنافسية في ليبيا.</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm font-bold text-slate-700 mb-4">
              تأسيس وإشراف: <a href="https://www.artiatechstudio.com.ly/" target="_blank" className="text-primary hover:underline">استوديو آرتياتك - Artiatech Studio</a>
            </p>
            <div className="flex justify-center md:justify-start gap-6 text-[11px] text-slate-400 font-bold">
              <Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">شروط الاستخدام</Link>
              <Link href="/licenses" className="hover:text-primary transition-colors">التراخيص</Link>
            </div>
          </div>

          <div className="flex gap-3">
            {socials.map((social) => (
              <a 
                key={social.id}
                href={social.href} 
                target="_blank"
                className="w-9 h-9 rounded-sm bg-slate-50 border flex items-center justify-center hover:bg-slate-100 transition-colors"
                title={social.id}
              >
                <social.icon className="w-4 h-4 text-slate-600" />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-[10px] text-slate-300 font-black tracking-widest uppercase">
          © 2026 OPTIMALCP - ليبيا، سبها - جميع الحقوق محفوظة لـ ARTIATECH STUDIO
        </div>
      </div>
    </footer>
  );
}