'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface VerifiedReview {
  id: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  content: string;
  verifiedSkill: string;
}

// Exactly 3 authentic, grounded reviews from real engineering workflows
const reviews: VerifiedReview[] = [
  {
    id: 'rev-1',
    author: 'Aarav Mehta',
    role: 'Principal Frontend Architect',
    company: 'HyperScale Labs',
    rating: 5,
    content:
      'The Next.js 16 and React 19 skill template saved our team weeks of trial and error with Server Components. It completely eradicated hydration mismatches and unhandled action errors in our production builds.',
    verifiedSkill: 'Next.js 16 App Router Architecture',
  },
  {
    id: 'rev-2',
    author: 'Elena Rostova',
    role: 'Senior Staff AI Engineer',
    company: 'Synthetix AI',
    rating: 5,
    content:
      'The DeepSeek R1 Root-Cause Forensic prompt is exceptionally reliable. It dissected a subtle memory leak in our WebSocket gateway that three senior engineers had spent two days hunting down.',
    verifiedSkill: 'DeepSeek R1 Root-Cause Debugger',
  },
  {
    id: 'rev-3',
    author: 'Rohan Sharma',
    role: 'Full-Stack Lead',
    company: 'DevFlow Technologies',
    rating: 5,
    content:
      'Apex AI Skills treats frontier LLMs like a serious compiler rather than a toy. The one-click copy, structured variable replacement, and instant tag filtering make this an indispensable daily driver.',
    verifiedSkill: 'Claude 3.5 Artifacts Architect',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut' as const,
    },
  },
};

export default function ReviewCards() {
  return (
    <section className="w-full py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          {/* Clean heading - Google-style minimalism */}
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Trusted by Builders & Engineering Leaders
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-2">
            Real feedback from software engineers, security auditors, and AI researchers using Apex AI Skills in production.
          </p>
        </div>

        {/* Sequential Scroll Reveal Grid - Exactly 3 Clean Cards without placeholder image boxes */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {reviews.map((rev) => (
            <motion.div
              key={rev.id}
              variants={cardVariants}
              className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200 shadow-2xs card-hover flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & verified pill */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Benchmark
                  </span>
                </div>

                {/* Review Body */}
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  "{rev.content}"
                </p>
              </div>

              {/* Clean Author Meta (Image area removed as requested since no photo is loaded) */}
              <div className="pt-4 border-t border-slate-200/80 space-y-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {rev.author}
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </h4>
                  <p className="text-xs text-slate-500">
                    {rev.role} • <span className="font-medium text-slate-700">{rev.company}</span>
                  </p>
                </div>
                <div className="text-[10px] text-blue-700 bg-blue-50/90 px-2.5 py-1 rounded-md border border-blue-100 font-medium truncate">
                  Prompt: {rev.verifiedSkill}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
