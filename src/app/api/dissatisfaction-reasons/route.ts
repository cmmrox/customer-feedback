import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const reasons = await prisma.dissatisfactionReason.findMany({
      where: { active: true },
      select: {
        id: true,
        description: true,
        category: { select: { name: true } },
      },
      orderBy: { description: 'asc' },
    });
    return NextResponse.json(reasons);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dissatisfaction reasons' }, { status: 500 });
  }
} 