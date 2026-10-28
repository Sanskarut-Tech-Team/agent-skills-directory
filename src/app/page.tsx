import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import ModelMarquee from '@/components/ModelMarquee';
import WhyApexSection from '@/components/WhyApexSection';
import HomeFeatured from '@/components/HomeFeatured';
import AboutSanskarut from '@/components/AboutSanskarut';
import LeadDeveloperCard from '@/components/LeadDeveloperCard';
import ReviewCards from '@/components/ReviewCards';
import CtaBanner from '@/components/CtaBanner';
import { getAllSkills, getAllPrompts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Apex AI Skills | High-Performance AI Engineering Blueprints & Prompts',
  description:
    'Clean, enterprise-grade AI skills catalog and prompt blueprints for ChatGPT, Claude 3.5, Google Gemini, DeepSeek, Meta Llama, and Midjourney. Built with enterprise precision for modern frontier models.',
  alternates: {
    canonical: 'https://apex-ai-skills.vercel.app',
  },
  openGraph: {
    title: 'Apex AI Skills | High-Performance AI Engineering Blueprints & Prompts',
    description:
      'Curated repository of production-grade AI skills, agent tools, and prompt blueprints engineered for frontier AI workflows.',
    url: 'https://apex-ai-skills.vercel.app',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Apex AI Skills Logo',
      },
    ],
  },
};

export default async function HomePage() {
  const [skills, prompts] = await Promise.all([
    getAllSkills(),
    getAllPrompts(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Carousel with Background Overlays */}
      <HeroSection />

      {/* 2. Infinite Loop Marquee (OpenAI, Claude, Gemini, DeepSeek, Meta Llama, Midjourney, Cursor, v0) */}
      <ModelMarquee />

      {/* 3. Section Expansion: Why Apex AI Skills & 3-Step Quick Start */}
      <WhyApexSection />

      {/* 4. Compact Meta-Only Featured Skills & Prompts Preview */}
      <HomeFeatured initialSkills={skills} initialPrompts={prompts} />

      {/* 5. About Sanskarut Tech Team */}
      <AboutSanskarut />

      {/* 6. Lead Developer Spotlight (Sanskar Bandgar) */}
      <LeadDeveloperCard />

      {/* 7. Interactive Reviews (Exactly 3 Clean Cards) */}
      <ReviewCards />

      {/* 8. Call to Action Banner */}
      <CtaBanner />
    </div>
  );
}
