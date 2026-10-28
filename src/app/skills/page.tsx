import React, { Suspense } from 'react';
import SkillsCatalog from '@/components/SkillsCatalog';
import { getAllSkills } from '@/lib/content';

export const metadata = {
  title: 'AI Skills Catalog | Apex AI Skills',
  description:
    'Comprehensive repository of enterprise AI skills, agent tools, and engineering architectures engineered for frontier models.',
};

export default async function SkillsPage() {
  const skills = await getAllSkills();

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header - Clean Google-style without eyebrow badges */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Enterprise AI Skills
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Curated system instructions, agent blueprints, and architecture guidelines. Filter by category, tags, or search keywords.
          </p>
        </div>

        {/* Interactive Catalog wrapped in Suspense for searchParams access */}
        <Suspense
          fallback={
            <div className="p-12 text-center text-slate-400 text-sm">
              Loading AI skills...
            </div>
          }
        >
          <SkillsCatalog initialSkills={skills} />
        </Suspense>
      </div>
    </div>
  );
}
