import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { PortfolioApp } from '@/components/PortfolioApp';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sanjana Sharma — Portfolio & Projects',
  description: 'UI/UX Designer · Digital Experiences · Creative Development',
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams?: Promise<{ preview?: string; error?: string; section?: string }>;
}) {
  const cookieStore = await cookies();
  const hasLocalAuth = cookieStore.get('portfolio_auth')?.value === 'true';

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const params = searchParams ? await searchParams : {};
  const isPreview = params?.preview === 'true';

  // Server-side authentication check
  if (!user && !hasLocalAuth && !isPreview && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirect('/?error=unauthorized');
  }

  const initialSection = params?.section === 'projects' ? 'projects' : 'home';
  return <PortfolioApp initialSection={initialSection} />;
}
