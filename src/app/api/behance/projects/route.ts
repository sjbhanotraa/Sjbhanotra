import { NextRequest, NextResponse } from 'next/server';
import { ANIMATION_CONFIG } from '@/config/animation';
import behanceData from '@/data/behance-projects.json';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token =
      searchParams.get('access_token') ||
      process.env.BEHANCE_ACCESS_TOKEN ||
      process.env.BEHANCE_API_KEY;

    // If an external Behance API token is provided, attempt live fetch
    if (token) {
      try {
        const response = await fetch(
          `https://api.behance.net/v2/users/sanjanasharma14/projects?api_key=${token}`,
          {
            headers: { Accept: 'application/json' },
            next: { revalidate: 3600 },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.projects) && data.projects.length > 0) {
            const mapped = data.projects.map((p: any, idx: number) => ({
              id: String(p.id || `proj-${idx + 1}`),
              row: ((idx % 3) + 1) as 1 | 2 | 3,
              index: idx + 1,
              title: p.name || `Project ${idx + 1}`,
              category: (Array.isArray(p.fields) ? p.fields[0] : 'DESIGN').toUpperCase(),
              subtitle: p.description || '',
              image:
                p.covers?.['808'] ||
                p.covers?.['404'] ||
                p.covers?.['max_808'] ||
                p.covers?.original ||
                behanceData[idx % behanceData.length]?.image,
              behanceUrl: p.url || ANIMATION_CONFIG.portfolio.behanceProfileUrl,
              stats: p.stats,
            }));

            return NextResponse.json({
              success: true,
              source: 'behance_api',
              projects: mapped,
            });
          }
        }
      } catch (err) {
        console.warn('Live Behance API fetch notice:', err);
      }
    }

    // Default Behance verified portfolio collection (All 12 Authentic Behance Projects)
    const curatedProjects = Array.isArray(behanceData) && behanceData.length > 0
      ? behanceData
      : ANIMATION_CONFIG.portfolio.projects;

    return NextResponse.json({
      success: true,
      source: 'behance_portfolio_data',
      profile: ANIMATION_CONFIG.portfolio.behanceProfileUrl,
      projects: curatedProjects,
    });
  } catch (error) {
    console.error('Behance projects handler error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve Behance portfolio items' },
      { status: 500 }
    );
  }
}
