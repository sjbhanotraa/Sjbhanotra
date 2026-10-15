import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, bearerToken, username = 'sanjanasharma14' } = body;

    // Validate if any credential was provided
    if (!apiKey && !bearerToken) {
      return NextResponse.json({
        success: false,
        message: 'Please provide either an Adobe API Key (Client ID) or a Behance Bearer Token.',
        instructions: {
          step1: 'Visit https://developer.adobe.com/console/ or https://www.behance.net/dev/apps to register/get your API credentials.',
          step2: 'Enter your Client ID / API Key or Bearer Token here to sync directly.'
        }
      }, { status: 400 });
    }

    // Try fetching with provided credentials
    const headers: Record<string, string> = {
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    };

    if (bearerToken) {
      headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    let url = '';
    if (apiKey) {
      url = `https://api.behance.net/v2/users/${encodeURIComponent(username)}/projects?api_key=${encodeURIComponent(apiKey)}`;
    } else {
      url = `https://www.behance.net/v3/users/${encodeURIComponent(username)}/projects`;
    }

    try {
      const behanceRes = await fetch(url, { headers });
      if (!behanceRes.ok) {
        const text = await behanceRes.text();
        return NextResponse.json({
          success: false,
          status: behanceRes.status,
          message: `Behance API returned status ${behanceRes.status}: ${text.slice(0, 300)}`,
          help: 'Ensure your Adobe Developer App is active and permissions are configured.'
        }, { status: 400 });
      }

      const data = await behanceRes.json();
      return NextResponse.json({
        success: true,
        message: 'Successfully connected and verified Behance credentials!',
        data
      });
    } catch (fetchErr: any) {
      return NextResponse.json({
        success: false,
        message: `Network error connecting to Behance API: ${fetchErr.message}`
      }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
