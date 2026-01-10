import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { CreateUserDialog } from '@/components/create-user-dialog';
import { UsersPageClient } from './_components/users-page-client';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          eventsCreated: true,
          checkIns: true,
        },
      },
      assignedTasks: {
        where: {
          status: {
            in: ['todo', 'in_progress', 'need_review'],
          },
        },
        select: {
          id: true,
          title: true,
          status: true,
          deadline: true,
          taskGroup: {
            select: {
              name: true,
              event: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { deadline: 'asc' },
      },
    },
  });

  const adminCount = users?.filter?.((u) => u?.role === 'Admin')?.length ?? 0;
  const regularCount = users?.filter?.((u) => u?.role === 'RegularUser')?.length ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          {/* <h1 className="text-3xl font-bold text-brand-blue">Gestion des utilisateurs</h1>
          <p className="text-gray-600 mt-1">Créez et gérez les comptes utilisateurs</p> */}
        </div>
        <CreateUserDialog />
      </div>

      <UsersPageClient 
        users={users} 
        currentUserId={(session?.user as any)?.id}
        adminCount={adminCount}
        regularCount={regularCount}
      />
    </div>
  );
}
