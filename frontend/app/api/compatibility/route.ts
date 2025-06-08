import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { donorType, recipientType } = await request.json();
    
    // Call the Python backend through Next.js proxy
    const response = await fetch('http://localhost:3000/api/backend/check_compatibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        donor_type: donorType,
        recipient_type: recipientType
      }),
      // Important: Don't cache the response
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend error:', errorData);
      throw new Error(errorData.error || 'Failed to check compatibility');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking compatibility:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to check compatibility',
        using_python_fallback: true
      },
      { status: 500 }
    );
  }
}
