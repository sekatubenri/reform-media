import { getAllArticles } from '@/lib/articles'
import type { MetadataRoute } from 'next'
const BASE_URL = 'https://reform-media.vercel.app'
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: "https://reform-media.vercel.app/category/kitchen", lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: "https://reform-media.vercel.app/category/bathroom", lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: "https://reform-media.vercel.app/category/exterior", lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: "https://reform-media.vercel.app/category/beginner", lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...articles.map(a => ({ url: `${BASE_URL}/article/${a.slug}`, lastModified: new Date(a.date), changeFrequency: 'weekly' as const, priority: 0.8 })),
  ]
}