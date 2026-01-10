import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await prisma.taskGroup.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Groupe de tâches supprimé' });
  } catch (error) {
    console.error('Error deleting task group:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du groupe de tâches' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Nom requis' }, { status: 400 });
    }

    const taskGroup = await prisma.taskGroup.update({
      where: { id: params.id },
      data: { name },
    });

    return NextResponse.json(taskGroup);
  } catch (error) {
    console.error('Error updating task group:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du groupe de tâches' },
      { status: 500 }
    );
  }
}
