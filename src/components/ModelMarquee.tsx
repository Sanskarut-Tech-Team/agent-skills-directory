'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface AIModel {
  name: string;
  provider: string;
  version: string;
  tagline: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  logoUrl: string;
}

const supportedModels: AIModel[] = [
  {
    name: 'ChatGPT',
    provider: 'OpenAI',
    version: 'o1 / GPT-4o',
    tagline: 'Deep reasoning, structural code refactoring & chain-of-thought logic',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/chatgpt-6.svg',
  },
  {
    name: 'Claude',
    provider: 'Anthropic',
    version: '3.7 Sonnet / Opus',
    tagline: 'High-context artifacts, architectural design & zero-hallucination syntax',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    logoUrl: 'https://cdn.simpleicons.org/anthropic/d97706',
  },
  {
    name: 'Google Gemini',
    provider: 'Google DeepMind',
    version: '2.5 Flash & Pro',
    tagline: 'Multimodal vision transpilation, large-document analysis & audio reasoning',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    logoUrl: 'https://cdn.simpleicons.org/googlegemini/2563eb',
  },
  {
    name: 'DeepSeek',
    provider: 'DeepSeek AI',
    version: 'R1 & V3',
    tagline: 'Mathematical proofs, query plan tuning & verifiable logic decomposition',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-800',
    badgeBorder: 'border-cyan-200',
    logoUrl: 'https://cdn.simpleicons.org/deepseek/0891b2',
  },
  {
    name: 'Meta Llama',
    provider: 'Meta AI',
    version: 'Llama 3.3 (70B)',
    tagline: 'High-throughput open weights, edge orchestration & task breakdown',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-800',
    badgeBorder: 'border-sky-200',
    logoUrl: 'https://cdn.simpleicons.org/meta/0284c7',
  },
  {
    name: 'Midjourney',
    provider: 'Midjourney Labs',
    version: 'v6.1 Photographic',
    tagline: 'Minimalist 3D isometric mockups, frosted glass UI assets & studio renders',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-800',
    badgeBorder: 'border-violet-200',
    logoUrl: 'https://cdn.simpleicons.org/midjourney/7c3aed',
  },
  {
    name: 'Cursor',
    provider: 'Anysphere',
    version: 'Composer Engine',
    tagline: 'Multi-file workspace codebase indexing and autonomous refactoring',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
    logoUrl: 'https://cdn.simpleicons.org/cursor/4f46e5',
  },
  {
    name: 'v0',
    provider: 'Vercel',
    version: 'Generative UI',
    tagline: 'Rapid frontend component scaffold with Tailwind CSS & Shadcn primitives',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-900',
    badgeBorder: 'border-slate-300',
    logoUrl: 'https://cdn.simpleicons.org/vercel/000000',
  },
];

export default function ModelMarquee() {
  return (
    <section className="w-full pt-20 pb-16 bg-slate-50/70 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Engineered for Modern Frontier Models
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mt-1">
            Every prompt and skill blueprint is tested and calibrated for repeatable, zero-hallucination output across all leading intelligence providers.
          </p>
        </div>
        <Link
          href="/prompts"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          <span>View model-specific prompts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Infinite Autoplay Marquee Container */}
      <div className="relative w-full overflow-hidden group/marquee">
        {/* Soft edge gradient fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent" />

        {/* 
          Two identical track blocks moving simultaneously to create a 
          perfect, seamless infinite loop without gaps or jumps.
          Pauses smoothly on hover.
        */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-2">
          {/* First sequence */}
          <div className="flex shrink-0 items-center gap-4 pr-4">
            {supportedModels.map((model) => (
              <ModelCard key={`seq1-${model.name}`} model={model} />
            ))}
          </div>

          {/* Duplicate sequence for seamless loop */}
          <div className="flex shrink-0 items-center gap-4 pr-4" aria-hidden="true">
            {supportedModels.map((model) => (
              <ModelCard key={`seq2-${model.name}`} model={model} />
            ))}
          </div>
        </div>
      </div>

      {/* Embedded CSS keyframe styles to guarantee autoplay without requiring tailwind config edits */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
          will-change: transform;
        }

        @media (hover: hover) {
          .group\\/marquee:hover .animate-marquee {
            animation-play-state: paused;
          }
        }
      `}</style>
    </section>
  );
}

function ModelCard({ model }: { model: AIModel }) {
  return (
    <Link
      href={`/prompts?model=${encodeURIComponent(model.name)}`}
      className="flex-shrink-0 w-80 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform duration-200 overflow-hidden">
              <img
                src={model.logoUrl}
                alt={`${model.name} logo`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                {model.name}
              </h3>
              <span className="text-[11px] text-slate-500">
                {model.provider}
              </span>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${model.badgeBg} ${model.badgeText} ${model.badgeBorder}`}
          >
            {model.version}
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {model.tagline}
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
          Browse {model.name} &rarr;
        </span>
        <span className="text-slate-400">Verified Schema</span>
      </div>
    </Link>
  );
}