import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ANIMATION_CONFIG } from '@/config/animation';

/**
 * Normalizes phone input to E.164 format and validates against single authorized identifier.
 */
function normalizeAndValidatePhone(rawPhone: string): { normalized: string; isAuthorized: boolean } {
  // Strip whitespace, hyphens, parentheses
  const clean = rawPhone.replace(/[\s\-\(\)]/g, '');
  const authorized = ANIMATION_CONFIG.auth.authorizedPhone; // '8803100375'

  // Match 8803100375 directly or with country codes +91, 91, etc.
  const isMatch =
    clean === authorized ||
    clean === `+91${authorized}` ||
    clean === `91${authorized}` ||
    clean === `+${authorized}`;

  let normalized = clean;
  if (!clean.startsWith('+')) {
    normalized = `${ANIMATION_CONFIG.auth.defaultCountryCode}${clean}`;
  }

  return {
    normalized,
    isAuthorized: isMatch,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Phone number and password are required.' },
        { status: 400 }
      );
    }

    const { normalized, isAuthorized } = normalizeAndValidatePhone(phone);

    // Enforce single-user authorized account restriction
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized identifier. Access is restricted to the designated account.' },
        { status: 403 }
      );
    }

    // Enforce designated password verification
    const expectedPassword = ANIMATION_CONFIG.auth.authorizedPassword || 'vR8!qZ4#Lm9@Tx2$Np7^Kc5&';
    if (password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Invalid password. Access is restricted to the designated credentials.' },
        { status: 401 }
      );
    }

    // Attempt optional Supabase session synchronization if configured
    let supabaseUserId: string | undefined = undefined;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          phone: normalized,
          password: password,
        });

        if (!error && data?.user) {
          supabaseUserId = data.user.id;
        } else {
          // Supabase phone provider might be disabled in Supabase dashboard (no SMS provider configured)
          console.warn('Supabase auth notice (using verified single-user session):', error?.message);
        }
      } catch (err) {
        console.warn('Supabase client warning (proceeding with verified session):', err);
      }
    }

    // Establish secure authorized session for the verified single user
    const response = NextResponse.json({
      success: true,
      message: 'Authorized session established.',
      user: {
        id: supabaseUserId || 'single-authorized-session-8803100375',
        phone: normalized,
      },
    });

    // Set secure authentication cookie for middleware & server components
    response.cookies.set('portfolio_auth', 'true', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error('Login action error:', err);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
