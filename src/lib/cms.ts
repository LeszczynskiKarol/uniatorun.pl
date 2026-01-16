// =============================================================================
// CMS API Client dla Astro
// =============================================================================
// Pobiera dane z Multi-tenant CMS dla strony UniaTorun.pl
// =============================================================================

const CMS_URL = import.meta.env.CMS_URL || 'http://localhost:3000';
const CMS_API_KEY = import.meta.env.CMS_API_KEY || '';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
}

interface NewsResponse {
  tenant: {
    name: string;
    domain: string;
  };
  news: NewsItem | NewsItem[];
  total: number;
}

/**
 * Pobiera listę aktualności z CMS
 */
export async function getNews(limit = 20): Promise<NewsItem[]> {
  try {
    const response = await fetch(`${CMS_URL}/api/public/news?limit=${limit}`, {
      headers: {
        'x-api-key': CMS_API_KEY,
      },
    });

    if (!response.ok) {
      console.error('CMS API error:', response.status);
      return [];
    }

    const data: NewsResponse = await response.json();
    return Array.isArray(data.news) ? data.news : [];
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}

/**
 * Pobiera pojedynczą aktualność po slug
 */
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const response = await fetch(`${CMS_URL}/api/public/news?slug=${slug}`, {
      headers: {
        'x-api-key': CMS_API_KEY,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error('CMS API error:', response.status);
      return null;
    }

    const data: NewsResponse = await response.json();
    return data.news as NewsItem;
  } catch (error) {
    console.error('Failed to fetch news by slug:', error);
    return null;
  }
}

/**
 * Pobiera wszystkie slugi aktualności (do getStaticPaths)
 */
export async function getAllNewsSlugs(): Promise<string[]> {
  const news = await getNews(100);
  return news.map((item) => item.slug);
}

export type { NewsItem };
