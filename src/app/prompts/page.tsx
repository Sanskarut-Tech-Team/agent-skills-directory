import React, { Suspense } from 'react';
import PromptsCatalog from '@/components/PromptsCatalog';
import { getAllPrompts } from '@/lib/content';

export const metadata = {
  title: 'Production Prompts Catalog | Apex AI Skills',
  description:
    'Catalog of verified, high-performance prompts for ChatGPT, Claude 3.5, Google Gemini, DeepSeek, and Midjourney.',
};

async function PromptsDataWrapper({
  searchParamsPromise,
}: {
  searchParamsPromise?: Promise<{ model?: string }>;
}) {
  const [prompts, resolvedSearchParams] = await Promise.all([
    getAllPrompts(),
    searchParamsPromise ? searchParamsPromise : Promise.resolve({ model: 'All' }),
  ]);
  const modelFilter = resolvedSearchParams?.model || 'All';

  return (
    <PromptsCatalog initialPrompts={prompts} initialModelFilter={modelFilter} />
  );
}

export default function PromptsPage(props: {
  searchParams?: Promise<{ model?: string }>;
}) {
  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header - Clean Google-style without eyebrow badges */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Frontier AI Prompts Catalog
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Zero-hallucination prompts calibrated for ChatGPT, Claude, Gemini, DeepSeek, and Midjourney. Test variables and copy with one click.
          </p>
        </div>

        {/* Suspense wrapper around searchParams access for Next.js 16 Partial Prerendering */}
        <Suspense
          fallback={
            <div className="p-12 text-center text-slate-400 text-sm">
              Loading production prompts...
            </div>
          }
        >
          <PromptsDataWrapper searchParamsPromise={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
