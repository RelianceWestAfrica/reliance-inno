import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { CheckInStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { guestId, eventDate, status, description } = body;

    if (!guestId) {
      return NextResponse.json(
        { error: 'L\'ID de l\'invité est requis' },
        { status: 400 }
      );
    }

    let checkInStatus: CheckInStatus;
    const now = new Date();
    
    // If status is manually provided (for absent/declined)
    if (status === 'absent' || status === 'declined') {
      checkInStatus = status as CheckInStatus;
    } else {
      // Automatic status based on check-in time vs event time
      const eventDateTime = new Date(eventDate);
      if (now <= eventDateTime) {
        checkInStatus = CheckInStatus.present_ontime;
      } else {
        checkInStatus = CheckInStatus.present_late;
      }
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        guestId,
        checkInTime: now,
        status: checkInStatus,
        description: description || null,
        checkedInById: (session.user as any).id,
      },
      include: {
        guest: true,
        checkedInBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(checkIn, { status: 201 });
  } catch (error) {
    console.error('Error creating check-in:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement' },
      { status: 500 }
    );
  }
}
