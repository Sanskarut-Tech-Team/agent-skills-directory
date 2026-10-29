'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Check,
  ArrowRight,
  User,
  Eye,
  X,
  Star
} from 'lucide-react';
import { AISkill, AIPrompt } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

interface HomeFeaturedProps {
  initialSkills: AISkill[];
  initialPrompts: AIPrompt[];
}

export default function HomeFeatured({
  initialSkills,
  initialPrompts,
}: HomeFeaturedProps) {
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [tab, setTab] = useState<'skills' | 'prompts'>('skills');
  const [activeModalSkill, setActiveModalSkill] = useState<AISkill | null>(null);
  const [activeModalPrompt, setActiveModalPrompt] = useState<AIPrompt | null>(null);

  const handleCopy = (id: string, text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`"${title}" copied to clipboard!`, 'success');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const displaySkills = initialSkills.slice(0, 4);
  const displayPrompts = initialPrompts.slice(0, 4);

  return (
    <section className="w-full py-20 bg-slate-50/50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Featured Skills & Production Prompts
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-1">
              Tested templates engineered for zero hallucinations and deterministic results.
            </p>
          </div>

          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs self-start md:self-auto">
            <button
              onClick={() => setTab('skills')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                tab === 'skills'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Top Skills ({initialSkills.length})
            </button>
            <button
              onClick={() => setTab('prompts')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                tab === 'prompts'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trending Prompts ({initialPrompts.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Production Skills Display */}
        {tab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displaySkills.map((skill) => {
              const isCopied = copiedId === skill.id;
              const compatList = skill.compatibility || skill.supportedModels || ['Claude Code', 'Cursor'];
              return (
                <div
                  key={skill.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs card-hover flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {skill.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          v{skill.version || '1.0.0'}
                        </span>
                        <span className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {skill.stars || 100}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {skill.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {skill.summary || skill.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {compatList.slice(0, 3).map((m) => (
                        <span
                          key={m}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate max-w-[140px]">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700 truncate">{skill.author}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModalSkill(skill)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() =>
                          handleCopy(skill.id, skill.executablePrompt || skill.promptContent, skill.title)
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isCopied
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Skill</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Compact Meta-Only Prompts Display */}
        {tab === 'prompts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayPrompts.map((prompt) => {
              const isCopied = copiedId === prompt.id;
              return (
                <div
                  key={prompt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs card-hover flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                        {prompt.useCase}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {prompt.targetAI.map((ai) => (
                          <span
                            key={ai}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                          >
                            {ai}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {prompt.title}
                    </h3>

                    {prompt.tags && prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {prompt.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">
                        {prompt.author || 'Sanskar Bandgar'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModalPrompt(prompt)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() =>
                          handleCopy(prompt.id, prompt.promptText, prompt.title)
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isCopied
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href={tab === 'skills' ? '/skills' : '/prompts'}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>Explore all {tab === 'skills' ? 'skills' : 'prompts'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal for Skill */}
      {activeModalSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {activeModalSkill.category}
                  </span>
                  <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    v{activeModalSkill.version || '1.0.0'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {activeModalSkill.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Author: <span className="font-semibold">{activeModalSkill.author}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveModalSkill(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                {activeModalSkill.summary || activeModalSkill.description}
              </p>
              <div className="rounded-xl bg-slate-950 text-slate-200 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                <pre className="whitespace-pre-wrap">{activeModalSkill.executablePrompt || activeModalSkill.promptContent}</pre>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <Link
                href="/skills"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View in Skills Catalog →
              </Link>
              <button
                onClick={() => {
                  handleCopy(
                    activeModalSkill.id,
                    activeModalSkill.executablePrompt || activeModalSkill.promptContent,
                    activeModalSkill.title
                  );
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Full Skill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal for Prompt */}
      {activeModalPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {activeModalPrompt.useCase}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {activeModalPrompt.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalPrompt(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="rounded-xl bg-slate-950 text-slate-200 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                <pre className="whitespace-pre-wrap">{activeModalPrompt.promptText}</pre>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <Link
                href="/prompts"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View in Prompts Catalog →
              </Link>
              <button
                onClick={() => {
                  handleCopy(
                    activeModalPrompt.id,
                    activeModalPrompt.promptText,
                    activeModalPrompt.title
                  );
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Prompt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
