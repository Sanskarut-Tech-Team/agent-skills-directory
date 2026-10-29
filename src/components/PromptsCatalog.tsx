'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Eye,
  User,
  X,
  Terminal
} from 'lucide-react';
import { AIPrompt } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

interface PromptsCatalogProps {
  initialPrompts: AIPrompt[];
  initialModelFilter?: string;
}

const AI_MODELS = [
  'All',
  'ChatGPT',
  'Claude',
  'Gemini',
  'DeepSeek',
  'Meta Llama',
  'Midjourney',
  'Cursor',
  'v0',
];

export default function PromptsCatalog({
  initialPrompts,
  initialModelFilter = 'All',
}: PromptsCatalogProps) {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const paramQ = searchParams.get('q') || '';
  const paramModel = searchParams.get('model');
  const paramUseCase = searchParams.get('useCase') || searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState(paramQ);
  const [selectedModel, setSelectedModel] = useState<string>(
    paramModel || initialModelFilter || 'All'
  );
  const [selectedUseCase, setSelectedUseCase] = useState<string>(paramUseCase);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModalPrompt, setActiveModalPrompt] = useState<AIPrompt | null>(null);
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({});
  const [filtersOpen, setFiltersOpen] = useState(Boolean(paramModel || (paramUseCase && paramUseCase !== 'All')));

  // Sync with URL query parameters if they change
  useEffect(() => {
    if (paramQ !== searchQuery) {
      setSearchQuery(paramQ);
    }
  }, [paramQ]);

  useEffect(() => {
    if (paramModel) {
      setSelectedModel(paramModel);
    }
  }, [paramModel]);

  useEffect(() => {
    if (paramUseCase) {
      setSelectedUseCase(paramUseCase);
    }
  }, [paramUseCase]);

  // Extract unique use cases
  const useCases = useMemo(() => {
    const set = new Set<string>();
    initialPrompts.forEach((p) => set.add(p.useCase));
    return ['All', ...Array.from(set)];
  }, [initialPrompts]);

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    return initialPrompts.filter((prompt) => {
      const matchesModel =
        selectedModel === 'All' ||
        prompt.targetAI.some(
          (m) => m.toLowerCase() === selectedModel.toLowerCase()
        );

      const matchesUseCase =
        selectedUseCase === 'All' || prompt.useCase === selectedUseCase;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        prompt.title.toLowerCase().includes(q) ||
        prompt.useCase.toLowerCase().includes(q) ||
        prompt.promptText.toLowerCase().includes(q) ||
        (prompt.tags && prompt.tags.some((t) => t.toLowerCase().includes(q))) ||
        prompt.targetAI.some((m) => m.toLowerCase().includes(q));

      return matchesModel && matchesUseCase && matchesSearch;
    });
  }, [initialPrompts, selectedModel, selectedUseCase, searchQuery]);

  const activeFilterCount =
    (selectedModel !== 'All' ? 1 : 0) + (selectedUseCase !== 'All' ? 1 : 0);

  const handleCopy = (prompt: AIPrompt) => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopiedId(prompt.id);
    showToast(`"${prompt.title}" copied to clipboard!`, 'success');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const openInspectModal = (prompt: AIPrompt) => {
    setActiveModalPrompt(prompt);
    const matches = prompt.promptText.match(/\{\{([A-Z0-9_]+)\}\}/g) || [];
    const vars: Record<string, string> = {};
    matches.forEach((m) => {
      const key = m.replace(/\{\{|\}\}/g, '');
      vars[key] = '';
    });
    setCustomVariables(vars);
  };

  const getComputedPrompt = () => {
    if (!activeModalPrompt) return '';
    let text = activeModalPrompt.promptText;
    Object.entries(customVariables).forEach(([key, val]) => {
      if (val.trim()) {
        text = text.replaceAll(`{{${key}}}`, val);
      }
    });
    return text;
  };

  return (
    <div className="w-full">
      {/* Search & Collapsible Filters Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 mb-8 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by keyword, model, or task..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Collapsible Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
              filtersOpen || activeFilterCount > 0
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
            {filtersOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        {/* Collapsible Filter Section (Accordion Drawer) */}
        {filtersOpen && (
          <div className="pt-3 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Target AI Model Filter */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Target AI Model
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AI_MODELS.map((model) => {
                  const isSelected = selectedModel.toLowerCase() === model.toLowerCase();
                  return (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {model}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Use Case Filter */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Filter by Use Case
              </div>
              <div className="flex flex-wrap gap-1.5">
                {useCases.map((uc) => {
                  const isSelected = selectedUseCase === uc;
                  return (
                    <button
                      key={uc}
                      onClick={() => setSelectedUseCase(uc)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {uc}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredPrompts.length}</span> of {initialPrompts.length} production prompts
        </div>
        {(searchQuery || selectedModel !== 'All' || selectedUseCase !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedModel('All');
              setSelectedUseCase('All');
            }}
            className="text-blue-600 hover:underline font-semibold"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Compact Meta-Only Prompts Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map((prompt) => {
            const isCopied = copiedId === prompt.id;
            return (
              <div
                key={prompt.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs card-hover flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Category & Supported Models */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                      {prompt.useCase}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {prompt.targetAI.map((ai) => (
                        <span
                          key={ai}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80"
                        >
                          {ai}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Crisp Prominent Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {prompt.title}
                  </h3>

                  {/* Tags */}
                  {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {prompt.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Author & Quick Action Triggers */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700 truncate max-w-[110px]">
                      {prompt.author || 'Sanskar Bandgar'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openInspectModal(prompt)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                      title="Inspect prompt & variables"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleCopy(prompt)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No matching prompts found
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search keywords or switching model filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedModel('All');
              setSelectedUseCase('All');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Inspect & Variable Replacement Modal */}
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
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeModalPrompt.targetAI.map((ai) => (
                    <span
                      key={ai}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700"
                    >
                      {ai}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setActiveModalPrompt(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {/* Dynamic Variables Inputs if template has {{VARIABLE}} */}
              {Object.keys(customVariables).length > 0 && (
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    Template Variables (Optional)
                  </h4>
                  {Object.keys(customVariables).map((key) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {key.replaceAll('_', ' ')}:
                      </label>
                      <textarea
                        rows={2}
                        value={customVariables[key]}
                        onChange={(e) =>
                          setCustomVariables({
                            ...customVariables,
                            [key]: e.target.value,
                          })
                        }
                        placeholder={`Enter value for {{${key}}}...`}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-xl bg-slate-950 text-slate-200 p-4 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                <pre className="whitespace-pre-wrap">{getComputedPrompt()}</pre>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Author: {activeModalPrompt.author || 'Sanskar Bandgar'}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getComputedPrompt());
                  showToast('Prompt copied to clipboard!', 'success');
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Prompt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
