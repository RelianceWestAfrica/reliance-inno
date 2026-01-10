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
    const { name, email, phone, guestGroupId } = body;

    if (!name || !guestGroupId) {
      return NextResponse.json(
        { error: 'Le nom et l\'ID du groupe sont requis' },
        { status: 400 }
      );
    }

    const guest = await prisma.guest.create({
      data: {
        name,
        email,
        phone,
        guestGroupId,
      },
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'invité' },
      { status: 500 }
    );
  }
}
