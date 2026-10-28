'use client';

import React from 'react';
import Image from 'next/image';
import {
  ExternalLink,
  Mail,
  CheckCircle,
  Globe,
  ArrowUpRight
} from 'lucide-react';

const techStack = [
  'Next.js 16',
  'React 19',
  'TypeScript',
  'Tailwind CSS 4',
  'Python',
  'AI Engineering',
  'Agent Tool Calling',
  'PostgreSQL',
  'Framer Motion',
  'System Architecture',
];

const developerAvatarUrl = 'https://avatars.githubusercontent.com/u/124874792?v=4';

export default function LeadDeveloperCard() {
  return (
    <section className="w-full py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          {/* Clean heading */}
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Developer Spotlight
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-2">
            The visionary and lead architect behind Apex AI Skills and the Sanskarut Tech Team.
          </p>
        </div>

        {/* Profile Card Container */}
        <div className="max-w-4xl mx-auto bg-slate-50/80 rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          {/* Subtle decorative background aura */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-sky-100/50 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar & Visual representation */}
            <div className="flex flex-col items-center gap-3 shrink-0 mx-auto md:mx-0">
              <div className="relative">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 p-1 shadow-md shadow-blue-600/20">
                  <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-slate-100">
                    <Image
                      src="https://avatars.githubusercontent.com/u/124874792?v=4"
                      alt="Sanskar Bandgar - Lead Developer"
                      fill
                      sizes="(max-width: 640px) 112px, 128px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 bg-blue-600 text-white p-1 rounded-full border-2 border-white shadow-xs">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Available for Collaboration
                </span>
              </div>
            </div>

            {/* Profile Content */}
            <div className="flex-1 space-y-4 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    Sanskar Bandgar
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-blue-600">
                    Lead Systems Developer & Founder of Sanskarut Tech Team
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/SanskarBandgar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-400 transition-all shadow-2xs"
                    title="Sanskar Bandgar on GitHub"
                  >
                    <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>

                  <a
                    href="https://mrsanskar.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-400 transition-all shadow-2xs"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Portfolio</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Sanskar is an innovative software engineer and AI systems researcher dedicated to standardizing frontier intelligence for engineering teams. He directs the Sanskarut Tech Team to curate, benchmark, and open-source rigorous AI skills, elimination of model hallucinations, and deterministic prompt architectures.
              </p>

              {/* Core Stack Chips */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Core Engineering & AI Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200/90 shadow-2xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons with GitHub logo */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://github.com/SanskarBandgar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-95"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>Sanskar on GitHub</span>
                </a>

                <a
                  href="https://mrsanskar.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs shadow-blue-600/30 active:scale-95"
                >
                  <span>Personal Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="mailto:bandgarsanskar19@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-200 transition-all"
                >
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>bandgarsanskar19@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
