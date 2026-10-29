'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  FolderGit2,
  FileCode2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
  Search,
  Copy,
  Terminal
} from 'lucide-react';

const advantages = [
  {
    icon: FolderGit2,
    title: 'Multi-File Skill Architecture',
    description:
      'Unlike basic prompt lists, Apex AI Skills supports structured multi-file packages containing SKILL.md rules, config schemas, and operational helper scripts.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero-Hallucination Guardrails',
    description:
      'Eliminate AI fabrications. Every prompt enforces strict output constraints, type-checked parameter models, and verifiable proof steps.',
  },
  {
    icon: Zap,
    title: 'Frontier Model Benchmarking',
    description:
      'Tested across OpenAI o1/4o, Claude 3.5 Sonnet, Google Gemini 2.0, DeepSeek R1, and Meta Llama to verify consistency across model weight updates.',
  },
  {
    icon: Terminal,
    title: 'Production Stack Alignment',
    description:
      'Engineered specifically for the modern enterprise ecosystem — Next.js 16 App Router, React 19 Server Actions, Tailwind CSS 4, and autonomous tool calling.',
  },
];

const quickSteps = [
  {
    step: '01',
    title: 'Discover & Filter',
    desc: 'Search by technical keywords, categories, or select your target frontier model using collapsible filter controls.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Inspect Multi-File Blueprint',
    desc: 'Review structured rules, file manifests, variable parameters, and strict execution guardrails in high-legibility view.',
    icon: FileCode2,
  },
  {
    step: '03',
    title: 'One-Click Copy & Execute',
    desc: 'Instantly copy to your clipboard or download directly into your repository’s content folder for immediate use.',
    icon: Copy,
  },
];

export default function WhyApexSection() {
  return (
    <section className="w-full py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Core Advantages */}
        <div>
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Why Engineers Choose Apex AI Skills
            </h2>
            <p className="mt-2 text-base text-slate-600 leading-relaxed">
              Standard prompting yields inconsistent, verbose, or broken code. We build deterministic AI engineering blueprints built to compiler-grade standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/90 shadow-2xs card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sanskarut Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick-Start 3-Step Guide */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-12">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              How to Deploy in 3 Simple Steps
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Integrate enterprise AI skills into your development loop in under two minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickSteps.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                      STEP {step.step}
                    </span>
                    <IconComp className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-medium">
              Ready to elevate your AI pairing workflow?
            </div>
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>Explore All Blueprints</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
