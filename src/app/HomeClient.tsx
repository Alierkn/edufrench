"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";
import type { HomePageCopy } from "@/lib/homeCopy";
import type { HomeFooterData, HomeFooterLink } from "@/lib/homeFooter";

function FooterLinkRow({ link }: { link: HomeFooterLink }) {
  const external = /^https?:\/\//i.test(link.href);
  const className =
    "font-bold text-sm text-gray-600 hover:text-[var(--color-neo-border)] underline decoration-2 underline-offset-2";
  if (external) {
    return (
      <a
        href={link.href}
        className={className}
        {...(link.openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

function SubheadWithBold({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <p className="mt-12 text-2xl md:text-3xl font-medium font-sans text-gray-600 max-w-3xl mx-auto leading-relaxed">
      {parts.map((chunk, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-black text-[var(--color-neo-border)]">
            {chunk}
          </strong>
        ) : (
          <span key={i}>{chunk}</span>
        )
      )}
    </p>
  );
}

type HomeClientProps = HomePageCopy & {
  siteName: string;
  footer: HomeFooterData;
};

export default function HomeClient({
  badge,
  headlineLine1,
  headlineAccent,
  subhead,
  ctaLabel,
  ctaHref,
  siteName,
  footer,
}: HomeClientProps) {
  const showFooterBlock =
    footer.columns.length > 0 || footer.note || footer.supportEmail;

  return (
    <div className="relative min-h-screen bg-[#FDF9F1] overflow-hidden flex flex-col">
      <motion.div
        className="absolute top-0 w-full flex justify-between px-10 h-full pointer-events-none opacity-20"
        initial={{ y: -1000 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="w-1 h-full bg-[var(--color-neo-border)]" />
        <div className="w-1 h-full bg-[var(--color-neo-border)]" />
        <div className="w-1 h-full bg-[var(--color-neo-border)]" />
        <div className="w-1 h-full bg-[var(--color-neo-border)]" />
      </motion.div>

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center max-w-5xl px-6 mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="inline-block mb-8"
        >
          <span className="neo-box px-4 py-2 text-lg font-black uppercase tracking-[0.2em] neo-bg-green text-white shadow-none border-4">
            {badge}
          </span>
        </motion.div>

        <motion.h1
          className="text-7xl md:text-9xl font-black font-serif text-[var(--color-neo-border)] leading-[0.9] tracking-tighter"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
        >
          {headlineLine1}
          <br />{" "}
          <span className="text-[var(--color-neo-blue)] underline decoration-8 decoration-[var(--color-neo-yellow)] underline-offset-[16px]">
            {headlineAccent}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <SubheadWithBold text={subhead} />
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <Link href={ctaHref}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              className="neo-btn text-2xl md:text-4xl px-12 py-6 neo-bg-yellow !text-[var(--color-neo-border)] border-[6px] shadow-[12px_12px_0_0_rgba(30,30,30,1)] hover:shadow-[16px_16px_0_0_rgba(30,30,30,1)] transition-shadow cursor-pointer flex items-center gap-6"
            >
              <GraduationCap size={44} /> {ctaLabel} <ArrowRight size={44} className="animate-pulse" />
            </motion.div>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-10 w-32 h-32 neo-bg-pink border-4 border-[var(--color-neo-border)] rounded-full z-0 pointer-events-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-20 right-20 w-40 h-40 neo-bg-blue border-4 border-[var(--color-neo-border)] z-0 rotate-12 pointer-events-none"
        animate={{ rotate: [12, 24, 12] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />

      <footer className="relative z-10 w-full mt-auto border-t-4 border-[var(--color-neo-border)] bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {showFooterBlock && (
            <>
              {footer.columns.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left mb-8">
                  {footer.columns.map((col, colIdx) => (
                    <div key={`${col.heading}-${colIdx}`}>
                      <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-3 border-b-2 border-[var(--color-neo-border)] pb-2 inline-block">
                        {col.heading}
                      </h3>
                      <ul className="space-y-2">
                        {col.links.map((link, li) => (
                          <li key={`${colIdx}-${li}-${link.href}`}>
                            <FooterLinkRow link={link} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {footer.note && (
                <p className="text-sm font-medium text-gray-600 max-w-2xl mb-4">{footer.note}</p>
              )}
              {footer.supportEmail && (
                <p className="text-sm font-bold text-gray-500 mb-4">
                  Destek:{" "}
                  <a
                    href={`mailto:${footer.supportEmail}`}
                    className="text-[var(--color-neo-blue)] underline decoration-2 underline-offset-2"
                  >
                    {footer.supportEmail}
                  </a>
                </p>
              )}
            </>
          )}
          <p className="text-xs font-bold text-gray-400 font-mono pt-2 border-t-2 border-dashed border-gray-300">
            © {new Date().getFullYear()} {siteName}
          </p>
        </div>
      </footer>
    </div>
  );
}
