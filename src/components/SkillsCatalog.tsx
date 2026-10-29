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
  Download,
  Eye,
  User,
  X,
  Star,
  Play,
  Layers,
  FolderGit2,
  Terminal,
  Settings
} from 'lucide-react';
import { AISkill } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { compileSkillPrompt } from '@/lib/promptCompiler';

interface SkillsCatalogProps {
  initialSkills: AISkill[];
}

export default function SkillsCatalog({ initialSkills }: SkillsCatalogProps) {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const modelParam = searchParams.get('model') || 'All';
  const tagParam = searchParams.get('tag') || null;

  const [searchQuery, setSearchQuery] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedModel, setSelectedModel] = useState<string>(modelParam);
  const [selectedTag, setSelectedTag] = useState<string | null>(tagParam);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSkillModal, setActiveSkillModal] = useState<AISkill | null>(null);
  const [modalTab, setModalTab] = useState<'prompt' | 'parameters' | 'sampleInput' | 'sampleOutput' | 'files'>('prompt');
  const [activeFileTab, setActiveFileTab] = useState<number>(0);
  const [filtersOpen, setFiltersOpen] = useState(Boolean(categoryParam !== 'All' || modelParam !== 'All' || tagParam));

  // Interactive parameter state for test running/interpolating in modal
  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  const [compiledResult, setCompiledResult] = useState<string>('');
  const [compileError, setCompileError] = useState<string | null>(null);

  useEffect(() => {
    if (qParam !== searchQuery) {
      setSearchQuery(qParam);
    }
  }, [qParam]);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (modelParam) {
      setSelectedModel(modelParam);
    }
  }, [modelParam]);

  useEffect(() => {
    if (tagParam !== selectedTag) {
      setSelectedTag(tagParam);
    }
  }, [tagParam]);

  // When opening a skill modal, initialize default parameter values
  useEffect(() => {
    if (activeSkillModal) {
      const initial: Record<string, any> = {};
      if (activeSkillModal.parameters && Array.isArray(activeSkillModal.parameters)) {
        activeSkillModal.parameters.forEach((p) => {
          if (activeSkillModal.sampleInput && activeSkillModal.sampleInput[p.name] !== undefined) {
            initial[p.name] = activeSkillModal.sampleInput[p.name];
          } else if (p.default !== undefined) {
            initial[p.name] = p.default;
          } else {
            initial[p.name] = '';
          }
        });
      }
      setParamValues(initial);
      setCompileError(null);

      try {
        const promptTemplate = activeSkillModal.executablePrompt || activeSkillModal.promptContent;
        const compiled = compileSkillPrompt(promptTemplate, initial, activeSkillModal.parameters);
        setCompiledResult(compiled);
      } catch (err: any) {
        setCompiledResult('');
        setCompileError(err.message);
      }
    }
  }, [activeSkillModal]);

  const handleParamChange = (name: string, value: any) => {
    const updated = { ...paramValues, [name]: value };
    setParamValues(updated);
    setCompileError(null);

    if (activeSkillModal) {
      try {
        const promptTemplate = activeSkillModal.executablePrompt || activeSkillModal.promptContent;
        const compiled = compileSkillPrompt(promptTemplate, updated, activeSkillModal.parameters);
        setCompiledResult(compiled);
      } catch (err: any) {
        setCompileError(err.message);
      }
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialSkills.forEach((s) => set.add(s.category));
    return ['All', ...Array.from(set)];
  }, [initialSkills]);

  const allModels = ['All', 'Claude Code', 'Cursor', 'OpenAI Swarm', 'LangChain', 'CrewAI'];

  // Filtering
  const filteredSkills = useMemo(() => {
    return initialSkills.filter((skill) => {
      const matchesCategory =
        selectedCategory === 'All' || skill.category === selectedCategory;

      const matchesModel =
        selectedModel === 'All' ||
        (skill.compatibility &&
          skill.compatibility.some(
            (m) => m.toLowerCase().includes(selectedModel.toLowerCase())
          )) ||
        (skill.supportedModels &&
          skill.supportedModels.some(
            (m) => m.toLowerCase().includes(selectedModel.toLowerCase())
          ));

      const matchesTag = !selectedTag || skill.tags?.includes(selectedTag);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        skill.title.toLowerCase().includes(q) ||
        skill.summary?.toLowerCase().includes(q) ||
        skill.description?.toLowerCase().includes(q) ||
        skill.category.toLowerCase().includes(q) ||
        skill.author.toLowerCase().includes(q) ||
        skill.tags?.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesModel && matchesTag && matchesSearch;
    });
  }, [initialSkills, selectedCategory, selectedModel, selectedTag, searchQuery]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedModel !== 'All' ? 1 : 0) +
    (selectedTag ? 1 : 0);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'success');
  };

  const handleDownload = (skill: AISkill, format: 'json' | 'md') => {
    let content = '';
    const filename = `${skill.id}.${format}`;
    let mime = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(skill, null, 2);
      mime = 'application/json';
    } else {
      content = `# ${skill.title} (v${skill.version})\n\n**Category**: ${skill.category}\n**Author**: ${skill.author}\n**Stars**: ${skill.stars}\n**Compatibility**: ${skill.compatibility?.join(', ')}\n\n## Summary\n${skill.summary || skill.description}\n\n## Executable Prompt\n\`\`\`text\n${skill.executablePrompt || skill.promptContent}\n\`\`\`\n`;
      mime = 'text/markdown';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`, 'info');
  };

  return (
    <div className="w-full">
      {/* Search & Collapsible Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 mb-8 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills by title, tags, category, or author..."
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

        {/* Filter Accordion Drawer */}
        {filtersOpen && (
          <div className="pt-3 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Categories
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Supported Agent / Platform
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allModels.map((model) => {
                  const isSelected = selectedModel === model;
                  return (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {model}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedTag && (
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400">Active tag filter:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  #{selectedTag}
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredSkills.length}</span> of {initialSkills.length} AI skills
        </div>
        {(searchQuery || selectedCategory !== 'All' || selectedModel !== 'All' || selectedTag) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedModel('All');
              setSelectedTag(null);
            }}
            className="text-blue-600 hover:underline font-semibold"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Production Skills Grid */}
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => {
            const isCopied = copiedId === skill.id;
            const compatList = skill.compatibility || skill.supportedModels || ['Claude Code', 'Cursor'];
            return (
              <div
                key={skill.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs card-hover flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Category & Version / Stars */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {skill.category}
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        v{skill.version || '1.0.0'}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {skill.stars || 100}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {skill.title}
                  </h3>

                  {/* Summary (<120 chars) */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {skill.summary || skill.description}
                  </p>

                  {/* Compatibility Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {compatList.slice(0, 3).map((m) => (
                      <span
                        key={m}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60"
                      >
                        {m}
                      </span>
                    ))}
                    {compatList.length > 3 && (
                      <span className="text-[10px] text-slate-400">+{compatList.length - 3}</span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {skill.tags.slice(0, 3).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-colors ${
                          selectedTag === tag
                            ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200/60'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer: Author & Quick Action Triggers */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate max-w-[130px]">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700 truncate">
                      {skill.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setActiveSkillModal(skill);
                        setModalTab('prompt');
                        setActiveFileTab(0);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                      title="Inspect blueprint & parameter compiler"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={() => {
                        handleCopyText(skill.executablePrompt || skill.promptContent, skill.title);
                        setCopiedId(skill.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
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
            No matching skills found
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search keywords or clearing active filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedModel('All');
              setSelectedTag(null);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Production Skill Inspection & Parameter Compiler Modal */}
      {activeSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {activeSkillModal.category}
                  </span>
                  <span className="font-mono text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    v{activeSkillModal.version}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {activeSkillModal.stars}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {activeSkillModal.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Author: <span className="font-semibold">{activeSkillModal.author}</span> • Slug: <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">{activeSkillModal.slug}</code>
                </p>
              </div>
              <button
                onClick={() => setActiveSkillModal(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center border-b border-slate-200 bg-white px-6 gap-2 pt-2">
              <button
                onClick={() => setModalTab('prompt')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  modalTab === 'prompt'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Executable Prompt</span>
              </button>
              <button
                onClick={() => setModalTab('parameters')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  modalTab === 'parameters'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Dynamic Parameters ({activeSkillModal.parameters?.length || 0})</span>
              </button>
              <button
                onClick={() => setModalTab('sampleInput')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  modalTab === 'sampleInput'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Sample Input</span>
              </button>
              <button
                onClick={() => setModalTab('sampleOutput')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  modalTab === 'sampleOutput'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Expected Output</span>
              </button>
              {activeSkillModal.files && activeSkillModal.files.length > 0 && (
                <button
                  onClick={() => setModalTab('files')}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                    modalTab === 'files'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Files ({activeSkillModal.files.length})</span>
                </button>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh]">
              {/* Summary Header */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Value Proposition: </span>
                {activeSkillModal.summary || activeSkillModal.description}
              </div>

              {/* TAB 1: Executable Prompt & Compiler Result */}
              {modalTab === 'prompt' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Interpolated Executable Prompt
                    </span>
                    <button
                      onClick={() => handleCopyText(compiledResult || activeSkillModal.executablePrompt, 'Compiled prompt')}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Compiled Prompt
                    </button>
                  </div>

                  {compileError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-medium">
                      ⚠️ Compilation Error: {compileError}
                    </div>
                  )}

                  <div className="rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-[400px]">
                    <pre className="whitespace-pre-wrap">{compiledResult || activeSkillModal.executablePrompt || activeSkillModal.promptContent}</pre>
                  </div>
                </div>
              )}

              {/* TAB 2: Dynamic Parameters Interactive Input Form */}
              {modalTab === 'parameters' && (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Configure Input Parameters for Compilation
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {activeSkillModal.parameters?.map((param) => (
                      <div key={param.name} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold font-mono text-slate-900">
                            {param.name}{' '}
                            {param.required ? (
                              <span className="text-rose-600">*</span>
                            ) : (
                              <span className="text-slate-400 font-normal">(optional)</span>
                            )}
                          </label>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                            {param.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{param.description}</p>

                        {param.type === 'select' ? (
                          <select
                            value={paramValues[param.name] ?? ''}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                          >
                            {param.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : param.type === 'boolean' ? (
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="checkbox"
                              id={`check-${param.name}`}
                              checked={Boolean(paramValues[param.name])}
                              onChange={(e) => handleParamChange(param.name, e.target.checked)}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                            />
                            <label htmlFor={`check-${param.name}`} className="text-xs font-medium text-slate-700">
                              Enabled / True
                            </label>
                          </div>
                        ) : (
                          <textarea
                            rows={param.name.includes('diff') || param.name.includes('code') || param.name.includes('spec') ? 4 : 2}
                            value={paramValues[param.name] ?? ''}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            placeholder={`Enter ${param.name}...`}
                            className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Sample Input Payload */}
              {modalTab === 'sampleInput' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Sample JSON Input Payload
                    </span>
                    <button
                      onClick={() => handleCopyText(JSON.stringify(activeSkillModal.sampleInput, null, 2), 'Sample input')}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Sample Input
                    </button>
                  </div>
                  <div className="rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(activeSkillModal.sampleInput, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* TAB 4: Sample Output Expected Result */}
              {modalTab === 'sampleOutput' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Sample Output Expected Execution Result
                    </span>
                    <button
                      onClick={() =>
                        handleCopyText(
                          typeof activeSkillModal.sampleOutput === 'string'
                            ? activeSkillModal.sampleOutput
                            : JSON.stringify(activeSkillModal.sampleOutput, null, 2),
                          'Sample output'
                        )
                      }
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Sample Output
                    </button>
                  </div>
                  <div className="rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-[400px]">
                    <pre className="whitespace-pre-wrap">
                      {typeof activeSkillModal.sampleOutput === 'string'
                        ? activeSkillModal.sampleOutput
                        : JSON.stringify(activeSkillModal.sampleOutput, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 5: Skill Files if available */}
              {modalTab === 'files' && activeSkillModal.files && activeSkillModal.files.length > 0 && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {activeSkillModal.files.map((file, idx) => (
                      <button
                        key={file.path}
                        onClick={() => setActiveFileTab(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                          activeFileTab === idx
                            ? 'bg-white text-blue-700 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {file.path}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                    <pre className="whitespace-pre-wrap">
                      {activeSkillModal.files[activeFileTab]?.content}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(activeSkillModal, 'json')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
                <button
                  onClick={() => handleDownload(activeSkillModal, 'md')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Markdown</span>
                </button>
              </div>

              <button
                onClick={() =>
                  handleCopyText(compiledResult || activeSkillModal.executablePrompt || activeSkillModal.promptContent, 'Skill Blueprint')
                }
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Compiled Skill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
