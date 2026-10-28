import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, GitPullRequest } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 sm:p-12 md:p-16 text-white shadow-xl shadow-blue-700/10">
          {/* Subtle Google-style radial circles in background */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            {/* Clean heading - (No eyebrow pill badge as per spec) */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Have an AI Skill or Prompt to Share?
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Contribute your battle-tested prompts and architectural skills. Help engineers worldwide eliminate model hallucinations, and get featured in the official Apex AI directory.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/contribute"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-blue-700 hover:bg-blue-50 text-sm font-bold transition-all shadow-md active:scale-95"
              >
                <GitPullRequest className="w-4 h-4 text-blue-600" />
                <span>Submit Your Skill or Prompt</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-blue-800/60 hover:bg-blue-800/80 text-white border border-white/20 text-sm font-semibold transition-all backdrop-blur-sm"
              >
                <span>Contact Team</span>
              </Link>
            </div>

            {/* Micro perks */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100/90 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" />
                Direct Author Attribution
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" />
                Reviewed by Sanskarut Tech Team
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" />
                100% Free & Open Source
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
