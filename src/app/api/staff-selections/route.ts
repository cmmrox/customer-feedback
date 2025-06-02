import { NextRequest, NextResponse } from 'next/server';
import { getStaffSelectionsByMonth } from '@/lib/staff-selection';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');
  if (!month) {
    return NextResponse.json({ error: 'Missing month parameter' }, { status: 400 });
  }
  try {
    const data = await getStaffSelectionsByMonth(month);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching staff selections:', error);
    return NextResponse.json({ error: 'Failed to fetch staff selections' }, { status: 500 });
  }
} 