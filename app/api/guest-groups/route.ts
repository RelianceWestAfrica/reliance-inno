import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { name, eventId } = body;

    if (!name || !eventId) {
      return NextResponse.json(
        { error: 'Le nom et l\'ID de l\'événement sont requis' },
        { status: 400 }
      );
    }

    const guestGroup = await prisma.guestGroup.create({
      data: {
        name,
        eventId,
      },
    });

    return NextResponse.json(guestGroup, { status: 201 });
  } catch (error) {
    console.error('Error creating guest group:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du groupe d\'invités' },
      { status: 500 }
    );
  }
}
