import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { name, eventId } = await request.json();

    if (!name || !eventId) {
      return NextResponse.json(
        { error: 'Nom et événement requis' },
        { status: 400 }
      );
    }

    const taskGroup = await prisma.taskGroup.create({
      data: {
        name,
        eventId,
      },
    });

    return NextResponse.json(taskGroup, { status: 201 });
  } catch (error) {
    console.error('Error creating task group:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du groupe de tâches' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'ID événement requis' }, { status: 400 });
    }

    const taskGroups = await prisma.taskGroup.findMany({
      where: { eventId },
      include: {
        tasks: {
          include: {
            assignedTo: true,
            createdBy: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(taskGroups);
  } catch (error) {
    console.error('Error fetching task groups:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des groupes de tâches' },
      { status: 500 }
    );
  }
}
