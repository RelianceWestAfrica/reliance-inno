import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { EventTabs } from './_components/event-tabs';

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/connexion');
  }

  const event = await prisma.event.findUnique({
    where: { id: params?.id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      guestGroups: {
        include: {
          guests: {
            include: {
              checkIns: {
                orderBy: { checkInTime: 'desc' },
                take: 1,
                include: {
                  checkedInBy: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!event) {
    redirect('/evenements');
  }

  // Fetch all users for task assignment
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: 'asc' },
  });

  return <EventTabs event={event} users={users} />;
}
