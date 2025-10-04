import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getStaffImageUrl } from '@/lib/image-utils';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      where: {
        status: true
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        position: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Process staff data to ensure valid image URLs
    const processedStaff = staff.map(member => ({
      ...member,
      imageUrl: getStaffImageUrl(member.imageUrl)
    }));

    return NextResponse.json(processedStaff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff members' },
      { status: 500 }
    );
  }
} 