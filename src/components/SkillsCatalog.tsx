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
  FileCode2,
  FolderGit2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { AISkill } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

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
  const [activeFileTab, setActiveFileTab] = useState<number>(0);
  const [filtersOpen, setFiltersOpen] = useState(Boolean(categoryParam !== 'All' || modelParam !== 'All' || tagParam)); // Auto-expand if active filters

  // Keep state synchronized with URL search params if they change
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

  // Extract unique categories & tags & models
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialSkills.forEach((s) => set.add(s.category));
    return ['All', ...Array.from(set)];
  }, [initialSkills]);

  const allModels = ['All', 'Claude', 'ChatGPT', 'Cursor', 'DeepSeek', 'Gemini', 'Meta Llama'];

  const allTags = useMemo(() => {
    const set = new Set<string>();
    initialSkills.forEach((s) => s.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [initialSkills]);

  // Filtering
  const filteredSkills = useMemo(() => {
    return initialSkills.filter((skill) => {
      const matchesCategory =
        selectedCategory === 'All' || skill.category === selectedCategory;

      const matchesModel =
        selectedModel === 'All' ||
        (skill.supportedModels &&
          skill.supportedModels.some(
            (m) => m.toLowerCase() === selectedModel.toLowerCase()
          ));

      const matchesTag = !selectedTag || skill.tags?.includes(selectedTag);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        skill.title.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
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

  const handleCopy = (skill: AISkill) => {
    navigator.clipboard.writeText(skill.promptContent);
    setCopiedId(skill.id);
    showToast(`"${skill.title}" copied to clipboard!`, 'success');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDownload = (skill: AISkill, format: 'json' | 'md') => {
    let content = '';
    const filename = `${skill.id}.${format}`;
    let mime = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(skill, null, 2);
      mime = 'application/json';
    } else {
      content = `# ${skill.title}\n\n**Category**: ${skill.category}\n**Author**: ${skill.author}\n**Date**: ${skill.dateAdded}\n**Tags**: ${skill.tags.join(', ')}\n\n## Description\n${skill.description}\n\n## Prompt / Blueprint\n\`\`\`text\n${skill.promptContent}\n\`\`\`\n`;
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
        {/* Search bar + Filter Toggle button */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills by title, tags, or author..."
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
            {/* Category Pills */}
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

            {/* Target Model Filter */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Supported Frontier Model
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

            {/* Active Tag indicator */}
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

      {/* Compact Meta-Only Skills Grid */}
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => {
            const isCopied = copiedId === skill.id;
            const models = skill.supportedModels || ['Claude', 'ChatGPT', 'Cursor'];
            return (
              <div
                key={skill.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs card-hover flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Category & Supported Models */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {skill.category}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {models.slice(0, 3).map((m) => (
                        <span
                          key={m}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Crisp Prominent Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {skill.title}
                  </h3>

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
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700 truncate max-w-[110px]">
                      {skill.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setActiveSkillModal(skill);
                        setActiveFileTab(0);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                      title="Inspect blueprint & files"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleCopy(skill)}
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

      {/* Multi-File Inspector Modal */}
      {activeSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {activeSkillModal.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {activeSkillModal.dateAdded}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {activeSkillModal.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Author: <span className="font-semibold">{activeSkillModal.author}</span> • Directory: <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">/content/skills/{activeSkillModal.id}/</code>
                </p>
              </div>
              <button
                onClick={() => setActiveSkillModal(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                {activeSkillModal.description}
              </p>

              {/* Multi-File Tabs if available */}
              {activeSkillModal.files && activeSkillModal.files.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FolderGit2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Skill Package Files ({activeSkillModal.files.length})
                    </span>
                  </div>
                  {/* Tab list */}
                  <div className="flex flex-wrap gap-1.5 mb-2 bg-slate-100 p-1 rounded-xl">
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
                  {/* File Content Preview */}
                  <div className="rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                    <pre className="whitespace-pre-wrap">
                      {activeSkillModal.files[activeFileTab]?.content || activeSkillModal.promptContent}
                    </pre>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    System Instructions & Rules
                  </div>
                  <div className="rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                    <pre className="whitespace-pre-wrap">{activeSkillModal.promptContent}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(activeSkillModal, 'json')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .JSON</span>
                </button>
                <button
                  onClick={() => handleDownload(activeSkillModal, 'md')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .MD</span>
                </button>
              </div>

              <button
                onClick={() => handleCopy(activeSkillModal)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Blueprint</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
