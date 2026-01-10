import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { sendTaskAssignedMail } from "@/lib/email/sendTaskAssignedMail";
import { sendMail } from '@/lib/mailer';


export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { title, description, deadline, status, blockedBy, taskGroupId, assignedToId } =
      await request.json();

    if (!title || !taskGroupId) {
      return NextResponse.json(
        { error: 'Titre et groupe de tâches requis' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        status: status || 'todo',
        blockedBy,
        taskGroupId,
        assignedToId: assignedToId || null,
        createdById: (session.user as any).id,
      },
      include: {
        assignedTo: true,
        createdBy: true,
      },
    });

    // Envoi email si tâche assignée
    // 📧 Envoi d'email si la tâche est assignée
    if (task.assignedTo?.email) {
      await sendMail({
        to: task.assignedTo.email,
        subject: `Nouvelle tâche assignée : ${task.title}`,
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 24px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

              <!-- Header -->
              <div style="background-color: #0f172a; padding: 20px;">
                <h2 style="margin: 0; color: #ffffff; font-size: 20px;">
                  📌 Nouvelle tâche assignée
                </h2>
              </div>

              <!-- Content -->
              <div style="padding: 24px; color: #334155;">
                <p style="font-size: 15px; margin-top: 0;">
                  Bonjour <strong>${task.assignedTo.name}</strong>,
                </p>

                <p style="font-size: 14px; line-height: 1.6;">
                  Une nouvelle tâche vient de vous être assignée sur la plateforme
                  <strong>Reliance Inno</strong>.
                </p>

                <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0;">
                  <p style="margin: 0 0 8px 0;">
                    <strong>Titre :</strong> ${task.title}
                  </p>

                  <p style="margin: 0 0 8px 0;">
                    <strong>Description :</strong>
                    ${task.description ?? '—'}
                  </p>

                  <p style="margin: 0;">
                    <strong>Date limite :</strong>
                    ${
                      task.deadline
                        ? new Date(task.deadline).toLocaleDateString('fr-FR')
                        : 'Non définie'
                    }
                  </p>
                </div>

                <p style="font-size: 13px; color: #475569;">
                  Tâche créée par :
                  <strong>${task.createdBy.name}</strong>
                </p>

                <p style="font-size: 13px; color: #475569;">
                  Merci de vous connecter à la plateforme pour plus de détails.
                </p>

                <!-- Button -->
                <div style="text-align: center; margin: 28px 0;">
                  <a
                    href="${process.env.NEXTAUTH_URL}"
                    style="
                      display: inline-block;
                      padding: 12px 24px;
                      background-color: #2563eb;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 6px;
                      font-size: 14px;
                      font-weight: bold;
                    "
                  >
                    Voir la tâche
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f1f5f9; padding: 16px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #64748b;">
                  © ${new Date().getFullYear()} Reliance Inno — Tous droits réservés
                </p>
              </div>

            </div>
          </div>
        `,

      });
    }

    // if (assignedToId) {
    //   try {
    //     const assignedUser = await prisma.user.findUnique({
    //       where: { id: assignedToId },
    //       select: { email: true, name: true },
    //     });

    //     if (assignedUser?.email) {
    //       await sendTaskAssignedMail({
    //         to: assignedUser.email,
    //         taskTitle: task.title,
    //         assignedBy: (session.user as any).name || "Un utilisateur",
    //       });
    //     }
    //   } catch (mailError) {
    //     console.error("Email notification failed:", mailError);
    //     // volontairement ignoré pour ne pas casser la création
    //   }
    // }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la tâche' },
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
    const taskGroupId = searchParams.get('taskGroupId');
    const assignedToId = searchParams.get('assignedToId');

    let where: any = {};
    if (taskGroupId) {
      where.taskGroupId = taskGroupId;
    }
    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignedTo: true,
        createdBy: true,
        taskGroup: {
          include: {
            event: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tâches' },
      { status: 500 }
    );
  }
}
