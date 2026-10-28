'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  GitPullRequest,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Terminal,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSlide {
  id: number;
  badge: {
    text: string;
    icon: React.ElementType;
  };
  title: string;
  highlightText: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  gradientText: string;
  bgGradient: string;
  ambientColor: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    badge: {
      text: 'Enterprise-Grade Blueprints',
      icon: Layers,
    },
    title: 'Supercharge Workflows with',
    highlightText: 'Autonomous AI Skills',
    subtitle:
      'Curated blueprints, agent tool calling specifications, and production code architectures. Tested and validated for modern engineering teams.',
    primaryCtaText: 'Explore Skills',
    primaryCtaHref: '/skills',
    secondaryCtaText: 'Contribute',
    secondaryCtaHref: '/contribute',
    gradientText: 'from-blue-400 via-sky-300 to-indigo-300',
    bgGradient: 'from-blue-950/80 via-slate-900/90 to-slate-950',
    ambientColor: 'rgba(37, 99, 235, 0.28)',
  },
  {
    id: 2,
    badge: {
      text: 'Deterministic Calibrations',
      icon: Terminal,
    },
    title: 'Precision Prompts for',
    highlightText: 'Frontier AI Models',
    subtitle:
      'Eliminate model hallucinations with deterministic prompts engineered for ChatGPT, Claude 3.5, Google Gemini, DeepSeek R1, and Meta Llama.',
    primaryCtaText: 'Browse Prompts',
    primaryCtaHref: '/prompts',
    secondaryCtaText: 'View Models',
    secondaryCtaHref: '/prompts',
    gradientText: 'from-indigo-400 via-purple-300 to-pink-300',
    bgGradient: 'from-indigo-950/80 via-slate-900/90 to-slate-950',
    ambientColor: 'rgba(99, 102, 241, 0.28)',
  },
  {
    id: 3,
    badge: {
      text: 'Verified Tool Calling',
      icon: Cpu,
    },
    title: 'Deterministic Blueprints for',
    highlightText: 'Autonomous AI Agents',
    subtitle:
      'Structured multi-file schemas, fail-safe tool calling protocols, and production-tested system prompts for resilient AI pair-programming.',
    primaryCtaText: 'Inspect Schemas',
    primaryCtaHref: '/skills',
    secondaryCtaText: 'Share a Skill',
    secondaryCtaHref: '/contribute',
    gradientText: 'from-cyan-400 via-teal-300 to-emerald-300',
    bgGradient: 'from-cyan-950/80 via-slate-900/90 to-slate-950',
    ambientColor: 'rgba(6, 182, 212, 0.28)',
  },
];

const AUTOPLAY_INTERVAL = 6000;
const POPULAR_SEARCH_TAGS = ['Claude 3.5', 'Next.js 15', 'DeepSeek R1', 'PostgreSQL', 'LangChain'];

export default function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (idx: number) => {
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };

  // Keyboard navigation & autoplay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/skills?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const active = slides[currentSlide];
  const BadgeIcon = active.badge.icon;

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
    }),
  };

  return (
    <section
      className="relative overflow-hidden bg-slate-950 text-white select-none"
      aria-roledescription="carousel"
      aria-label="Hero Highlights"
    >
      {/* Background Interactive Carousel Container */}
      <div
        className="relative min-h-[580px] sm:min-h-[620px] md:min-h-[660px] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Animated Background Mesh & Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute inset-0 bg-gradient-to-b ${active.bgGradient} transition-colors duration-1000 ease-out`}
          />
          {/* Subtle Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Dynamic Radial Ambient Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] rounded-full blur-[130px] transition-all duration-700 pointer-events-none"
            style={{ backgroundColor: active.ambientColor }}
          />
        </div>

        {/* Slide Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center" aria-live="polite">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={active.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
                {active.title}{' '}
                <span
                  className={`bg-gradient-to-r ${active.gradientText} bg-clip-text text-transparent`}
                >
                  {active.highlightText}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
                {active.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Link
                  href={active.primaryCtaHref}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm sm:text-base font-semibold transition-all shadow-lg shadow-blue-600/30 active:scale-95 hover:shadow-blue-500/40"
                >
                  <span>{active.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={active.secondaryCtaHref}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 text-sm sm:text-base font-semibold transition-all backdrop-blur-sm active:scale-95"
                >
                  <GitPullRequest className="w-4 h-4 text-slate-300" />
                  <span>{active.secondaryCtaText}</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-all shadow-md z-20 active:scale-90"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-all shadow-md z-20 active:scale-90"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators with Progress Fill */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => goToSlide(idx)}
              className={`relative overflow-hidden h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-10 bg-white/20' : 'w-2.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {currentSlide === idx && (
                <motion.div
                  className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: isPaused ? '0%' : '100%' }}
                  transition={{
                    duration: AUTOPLAY_INTERVAL / 1000,
                    ease: 'linear',
                  }}
                  key={`${idx}-${isPaused}`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Functional Search Toolbar Underneath Hero */}
      <div className="relative z-20 -mt-7 max-w-3xl mx-auto px-4 sm:px-6">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="flex items-center gap-3 w-full px-3.5 py-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, prompts & blueprints..."
              className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto shrink-0 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold text-center transition-colors shadow-sm"
          >
            Search Catalog
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-2.5 flex items-center justify-center gap-2 flex-wrap text-[11px] text-slate-400">
          <span>Popular:</span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setSearchQuery(tag);
                router.push(`/skills?q=${encodeURIComponent(tag)}`);
              }}
              className="hover:text-blue-400 transition-colors underline decoration-slate-600 underline-offset-2"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}