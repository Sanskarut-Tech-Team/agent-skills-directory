import React from 'react';
import ContributeForm from '@/components/ContributeForm';

export const metadata = {
  title: 'Contribute Skills & Prompts | Apex AI Skills',
  description:
    'Submit high-performance AI prompts and multi-file skill specifications to the open Apex AI Skills repository.',
};

export default function ContributePage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Clean Google-style without eyebrow badges */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Contribute an AI Skill or Prompt
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Help expand the repository of reliable, deterministic AI blueprints. Submit your multi-file skill specifications or model-specific prompts directly for engineering review.
          </p>
        </div>

        {/* Contribution Form & Criteria Guidelines */}
        <ContributeForm />
      </div>
    </div>
  );
}
