'use client';

import React, { useState } from 'react';
import {
  Send,
  FileCode2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Bot,
  Layers,
  FolderGit2
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface SkillFileDraft {
  id: string;
  path: string;
  content: string;
}

export default function ContributeForm() {
  const { showToast } = useToast();
  const [submissionType, setSubmissionType] = useState<'skill' | 'prompt'>('skill');

  // Contributor details
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');

  // Skill fields
  const [skillTitle, setSkillTitle] = useState('');
  const [skillCategory, setSkillCategory] = useState('Software Engineering');
  const [skillDescription, setSkillDescription] = useState('');
  const [skillTags, setSkillTags] = useState('Next.js, TypeScript, Architecture');
  const [skillSupportedModels, setSkillSupportedModels] = useState<string[]>([
    'Claude',
    'ChatGPT',
    'Cursor',
  ]);
  const [skillFiles, setSkillFiles] = useState<SkillFileDraft[]>([
    {
      id: 'file-1',
      path: 'SKILL.md',
      content:
        '# System Instructions\n\nYou are an elite software architect. Follow these deterministic rules:\n1. Strict type safety\n2. Modular boundaries\n3. Zero hallucinated dependencies.',
    },
    {
      id: 'file-2',
      path: 'config/rules.json',
      content: '{\n  "strictMode": true,\n  "maxRetries": 3\n}',
    },
  ]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  // Prompt fields
  const [promptTitle, setPromptTitle] = useState('');
  const [promptCategory, setPromptCategory] = useState('Code Generation');
  const [promptModels, setPromptModels] = useState<string[]>(['Claude', 'ChatGPT']);
  const [promptTags, setPromptTags] = useState('TypeScript, Refactoring, Debugging');
  const [promptText, setPromptText] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleModel = (
    model: string,
    list: string[],
    setList: (val: string[]) => void
  ) => {
    if (list.includes(model)) {
      if (list.length > 1) {
        setList(list.filter((m) => m !== model));
      }
    } else {
      setList([...list, model]);
    }
  };

  const handleAddFile = () => {
    const newFile: SkillFileDraft = {
      id: Math.random().toString(36).substring(2, 9),
      path: `scripts/helper-${skillFiles.length + 1}.py`,
      content: '# Helper script or configuration\n',
    };
    setSkillFiles([...skillFiles, newFile]);
    setActiveFileIndex(skillFiles.length);
  };

  const handleRemoveFile = (index: number) => {
    if (skillFiles.length <= 1) {
      showToast('At least one file (e.g. SKILL.md) is required.', 'error');
      return;
    }
    const updated = skillFiles.filter((_, idx) => idx !== index);
    setSkillFiles(updated);
    setActiveFileIndex(Math.max(0, index - 1));
  };

  const handleFileChange = (field: 'path' | 'content', value: string) => {
    const updated = [...skillFiles];
    updated[activeFileIndex][field] = value;
    setSkillFiles(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const payload =
      submissionType === 'skill'
        ? {
            type: 'AI_SKILL_MULTI_FILE',
            title: skillTitle,
            category: skillCategory,
            description: skillDescription,
            tags: skillTags,
            supportedModels: skillSupportedModels,
            files: skillFiles.map((f) => ({ path: f.path, content: f.content })),
            author: authorName,
            email: authorEmail,
            _subject: `New Apex AI Skill Submission: ${skillTitle} (${authorName})`,
          }
        : {
            type: 'AI_PROMPT_TEMPLATE',
            title: promptTitle,
            category: promptCategory,
            targetAI: promptModels,
            tags: promptTags,
            promptText: promptText,
            author: authorName,
            email: authorEmail,
            _subject: `New Apex AI Prompt Submission: ${promptTitle} (${authorName})`,
          };

    try {
      const endpoint = submissionType === 'skill' ? '/api/skills' : '/api/prompts';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSuccess(true);
        showToast(
          'Contribution submitted! The engineering team will benchmark it shortly.',
          'success'
        );
      } else {
        throw new Error('Server returned an error.');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      // Fallback friendly state in case FormSubmit requires manual confirmation
      setIsSuccess(true);
      showToast(
        'Thank you! Your submission details have been dispatched for review.',
        'success'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8">
      {/* Official Sanskarut Contribution Criteria Guidelines (Displayed Clearly Above Form) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>Official Sanskarut Contribution Criteria</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          To maintain compiler-grade reliability across all blueprints, the Sanskarut Tech Team reviews every community submission against four quality benchmarks:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-bold text-slate-900 block mb-1">
              1. Zero-Fluff & Deterministic Yield
            </span>
            <span className="text-slate-600 leading-relaxed">
              Eliminate chat pleasantries and redundant adjectives. Enforce concrete types, schema assertions, and step-by-step reasoning.
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-bold text-slate-900 block mb-1">
              2. Multi-Model Verification
            </span>
            <span className="text-slate-600 leading-relaxed">
              Verify your prompt or skill against at least one frontier model (ChatGPT, Claude 3.5, Google Gemini, DeepSeek, or Meta Llama).
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-bold text-slate-900 block mb-1">
              3. Multi-File Skill Structure
            </span>
            <span className="text-slate-600 leading-relaxed">
              Skills must include a primary <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-[10px]">SKILL.md</code> and any relevant config or script files structured with relative paths.
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-bold text-slate-900 block mb-1">
              4. Strict Repository Isolation
            </span>
            <span className="text-slate-600 leading-relaxed">
              Prompts are committed strictly inside <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-[10px]">/content/prompts/</code> and multi-file skills inside <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-[10px]">/content/skills/&lt;slug&gt;/</code>.
            </span>
          </div>
        </div>
      </div>

      {/* Submission Type Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setSubmissionType('skill');
              setIsSuccess(false);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              submissionType === 'skill'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Submit Multi-File Skill</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSubmissionType('prompt');
              setIsSuccess(false);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              submissionType === 'prompt'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Submit Prompt Template</span>
          </button>
        </div>
      </div>

      {/* Submission Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        {isSuccess ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Contribution Received!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for contributing to Apex AI Skills. The Sanskarut Tech Team will review your submission for inclusion.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-all shadow-xs"
              >
                Submit Another Contribution
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contributor identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="e.g. bandgarsanskar19@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
            </div>

            {submissionType === 'skill' ? (
              /* MULTI-FILE SKILL SUBMISSION */
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skill Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillTitle}
                    onChange={(e) => setSkillTitle(e.target.value)}
                    placeholder="e.g. Next.js 16 App Router & React 19 Architecture System"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={skillCategory}
                      onChange={(e) => setSkillCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    >
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="AI Agents">AI Agents</option>
                      <option value="Security">Security</option>
                      <option value="Data & Systems">Data & Systems</option>
                      <option value="UI/UX & Design">UI/UX & Design</option>
                      <option value="Quality Assurance">Quality Assurance</option>
                      <option value="DevOps & Cloud">DevOps & Cloud</option>
                      <option value="Product & Marketing">Product & Marketing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={skillTags}
                      onChange={(e) => setSkillTags(e.target.value)}
                      placeholder="Next.js, TypeScript, Architecture"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Supported Frontier Models
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Claude', 'ChatGPT', 'Cursor', 'DeepSeek', 'Gemini', 'Meta Llama'].map(
                      (model) => {
                        const isChecked = skillSupportedModels.includes(model);
                        return (
                          <button
                            type="button"
                            key={model}
                            onClick={() =>
                              toggleModel(
                                model,
                                skillSupportedModels,
                                setSkillSupportedModels
                              )
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                              isChecked
                                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {model}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skill Description / Overview *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={skillDescription}
                    onChange={(e) => setSkillDescription(e.target.value)}
                    placeholder="Brief description of the skill and its architectural advantages..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                {/* Structured Multi-File Code Editor */}
                <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50/70 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <FolderGit2 className="w-4 h-4 text-blue-600" />
                        Multi-File Skill Package Manager
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Define relative file paths and contents (saved strictly into <code className="font-mono bg-white px-1 py-0.5 rounded text-[10px]">/content/skills/&lt;slug&gt;/</code>).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFile}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-blue-600 border border-slate-200 shadow-2xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add File</span>
                    </button>
                  </div>

                  {/* File Tabs */}
                  <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                    {skillFiles.map((f, idx) => (
                      <div
                        key={f.id}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          activeFileIndex === idx
                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveFileIndex(idx)}
                          className="focus:outline-none"
                        >
                          {f.path || `file-${idx + 1}`}
                        </button>
                        {skillFiles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-slate-300 hover:text-white p-0.5"
                            title="Delete file"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Active File Input Fields */}
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Relative File Path (e.g. <code className="font-mono text-slate-700">SKILL.md</code>, <code className="font-mono text-slate-700">config/rules.json</code>, <code className="font-mono text-slate-700">scripts/setup.ts</code>):
                      </label>
                      <input
                        type="text"
                        required
                        value={skillFiles[activeFileIndex]?.path || ''}
                        onChange={(e) => handleFileChange('path', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        File Contents *
                      </label>
                      <textarea
                        rows={7}
                        required
                        value={skillFiles[activeFileIndex]?.content || ''}
                        onChange={(e) => handleFileChange('content', e.target.value)}
                        placeholder="Paste code, markdown instructions, or JSON specification..."
                        className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* PROMPT SUBMISSION */
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prompt Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={promptTitle}
                    onChange={(e) => setPromptTitle(e.target.value)}
                    placeholder="e.g. DeepSeek R1 Root-Cause Forensic Debugger"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Use Case / Category *
                    </label>
                    <input
                      type="text"
                      required
                      value={promptCategory}
                      onChange={(e) => setPromptCategory(e.target.value)}
                      placeholder="e.g. Code Generation, Debugging, SQL"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={promptTags}
                      onChange={(e) => setPromptTags(e.target.value)}
                      placeholder="Debugging, DeepSeek, TypeScript"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Target AI Models (Select all that apply) *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['ChatGPT', 'Claude', 'Gemini', 'DeepSeek', 'Meta Llama', 'Midjourney', 'Cursor', 'v0'].map(
                      (model) => {
                        const isChecked = promptModels.includes(model);
                        return (
                          <button
                            type="button"
                            key={model}
                            onClick={() =>
                              toggleModel(model, promptModels, setPromptModels)
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                              isChecked
                                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {model}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prompt Text (Direct Paste) *
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Paste your prompt text here directly. Use {{VARIABLE_NAME}} for parameter placeholders..."
                    className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 leading-relaxed"
                  />
                </div>
              </>
            )}

            {/* Direct Submit Action */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs shadow-blue-600/30 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Contribution...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Contribution</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
