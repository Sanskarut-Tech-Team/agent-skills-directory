'use client';

import React from 'react';
import {
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const pillars = [
  {
    icon: Zap,
    title: 'Deterministic AI Yield',
    description:
      'We reject ambiguous prompts. Every template in Apex AI Skills enforces strict output schemas, typed parameters, and zero conversational fluff.',
  },
  {
    icon: ShieldCheck,
    title: 'Rigorous Multi-LLM Benchmarking',
    description:
      'Each blueprint undergoes verification across ChatGPT, Claude 3.5, Google Gemini, and DeepSeek to ensure consistent behavior across model weight updates.',
  },
  {
    icon: Layers,
    title: 'Modern Architecture Alignment',
    description:
      'Engineered specifically for cutting-edge stacks — Next.js 16 App Router, React 19 Server Actions, Tailwind CSS 4, and autonomous tool calling.',
  },
  {
    icon: Users,
    title: 'Community-Driven & Open Access',
    description:
      'Free, transparent, and built for everyone. The Sanskarut Tech Team reviews and merges developer contributions with high-speed turnaround.',
  },
];

export default function AboutSanskarut() {
  return (
    <section className="w-full py-20 bg-slate-50/50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission statement */}
          <div className="lg:col-span-5 space-y-6">
            {/* Clean heading - (No eyebrow pill badge as per spec) */}
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Pioneering High-Yield Intelligence for Modern Engineers
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              The <span className="font-semibold text-blue-600">Sanskarut Tech Team</span> was born out of a critical developer challenge: frontier LLMs are incredibly capable, but standard prompting produces inconsistent, generic, or hallucinated code.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We curate, rigorously benchmark, and open-source battle-tested AI skill configurations and precision prompts. Our mission is to transform how developers pair-program with AI — turning probabilistic models into reliable, high-yield engineering partners.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/contribute"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs shadow-blue-600/30"
              >
                <span>Join Our Mission</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/skills"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-sm font-semibold transition-all"
              >
                <span>Explore the Catalog</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Pillars Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Sanskarut Standard</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
