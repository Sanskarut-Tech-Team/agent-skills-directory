import { MetadataRoute } from 'next';
import { getAllSkills } from '@/lib/content';

const siteUrl = 'https://apex-ai-skills.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();
  const skills = await getAllSkills();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/skills`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/prompts`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contribute`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Model-specific query URLs for search engines
  const modelRoutes: MetadataRoute.Sitemap = [
    'Claude',
    'ChatGPT',
    'DeepSeek',
    'Gemini',
    'Meta+Llama',
    'Midjourney',
  ].map((model) => ({
    url: `${siteUrl}/prompts?model=${model}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...modelRoutes];
}
