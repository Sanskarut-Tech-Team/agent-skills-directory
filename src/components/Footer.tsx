import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Mail, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200/80 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white border border-slate-200/80 shadow-2xs shrink-0">
                <Image
                  src="/logo.png"
                  alt="Apex AI Skills Logo"
                  fill
                  sizes="32px"
                  className="object-contain p-0.5"
                />
              </div>
              <span className="font-semibold text-slate-900 tracking-tight text-lg">
                Apex AI Skills
              </span>
            </Link>
            <p className="text-slate-600 text-sm max-w-sm leading-relaxed">
              An open, production-grade library of AI skill specifications and prompt engineering blueprints designed to accelerate AI workflows with enterprise precision.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/cycberx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-400 transition-colors shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>
              <a
                href="https://mrsanskar.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-2xs"
              >
                <span>Portfolio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Column 1: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-blue-600 transition-colors">
                  Skills Directory
                </Link>
              </li>
              <li>
                <Link href="/prompts" className="hover:text-blue-600 transition-colors">
                  Prompts Catalog
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="hover:text-blue-600 transition-colors">
                  Contribute Skills
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact Developer
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Supported Models */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Supported LLMs
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/prompts?model=Claude" className="hover:text-blue-600 transition-colors flex items-center justify-between">
                  <span>Claude 3.5 Sonnet</span>
                  <span className="text-[10px] text-slate-400 font-mono">Anthropic</span>
                </Link>
              </li>
              <li>
                <Link href="/prompts?model=ChatGPT" className="hover:text-blue-600 transition-colors flex items-center justify-between">
                  <span>ChatGPT (o1 / 4o)</span>
                  <span className="text-[10px] text-slate-400 font-mono">OpenAI</span>
                </Link>
              </li>
              <li>
                <Link href="/prompts?model=DeepSeek" className="hover:text-blue-600 transition-colors flex items-center justify-between">
                  <span>DeepSeek R1 / V3</span>
                  <span className="text-[10px] text-slate-400 font-mono">DeepSeek</span>
                </Link>
              </li>
              <li>
                <Link href="/prompts?model=Gemini" className="hover:text-blue-600 transition-colors flex items-center justify-between">
                  <span>Google Gemini 2.0</span>
                  <span className="text-[10px] text-slate-400 font-mono">Google</span>
                </Link>
              </li>
              <li>
                <Link href="/prompts?model=Meta+Llama" className="hover:text-blue-600 transition-colors flex items-center justify-between">
                  <span>Meta Llama 3.3</span>
                  <span className="text-[10px] text-slate-400 font-mono">Meta</span>
                </Link>
              </li>
              <li>
                <Link href="/prompts?model=Midjourney" className="hover:text-blue-600 transition-colors flex items-center justify-between">
                  <span>Midjourney v6.1</span>
                  <span className="text-[10px] text-slate-400 font-mono">Image AI</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Developer Spotlight with Name and GitHub */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Developer
            </h4>
            <div className="space-y-2 pt-1">
              <a
                href="https://mrsanskar.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-xs transition-all"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <Image
                    src="https://avatars.githubusercontent.com/u/124874792?v=4"
                    alt="Sanskar Bandgar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 flex items-center gap-1">
                    Portfolio
                    <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    mrsanskar.vercel.app
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom divider with copyright & verification */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Open Source • Clean Light Mode Enterprise Architecture</span>
          </div>
          <div>
            © 2026 Apex AI Skills. Built with precision.
          </div>
        </div>
      </div>

      {/* Massive, subtle, modern display typography banner */}
      <div className="overflow-hidden select-none py-10 sm:py-16 md:py-20 border-t border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-extrabold uppercase text-slate-200 tracking-[0.18em] sm:tracking-[0.24em] text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-none">
            Apex AI Skills
          </p>
        </div>
      </div>
    </footer>
  );
}
