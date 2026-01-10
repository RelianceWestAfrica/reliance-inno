import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { Calendar, Users, UserCog, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Banner } from '@/components/banner';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'Admin';

  // Get statistics
  const eventsCount = await prisma.event.count();
  const guestsCount = await prisma.guest.count();
  const usersCount = isAdmin ? await prisma.user.count() : null;
  const recentCheckIns = await prisma.checkIn.findMany({
    take: 5,
    orderBy: { checkInTime: 'desc' },
    include: {
      guest: true,
      checkedInBy: true,
    },
  });

  const upcomingEvents = await prisma.event.findMany({
    where: {
      endDate: {
        gte: new Date(),
      },
    },
    orderBy: { startDate: 'asc' },
    take: 5,
    include: {
      _count: {
        select: { guestGroups: true },
      },
    },
  });

  const stats = [
    {
      title: 'Événements',
      value: eventsCount,
      icon: Calendar,
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10',
    },
    {
      title: 'Invités',
      value: guestsCount,
      icon: Users,
      color: 'text-brand-gold',
      bgColor: 'bg-brand-gold/10',
    },
  ];

  if (isAdmin) {
    stats.push({
      title: 'Utilisateurs',
      value: usersCount ?? 0,
      icon: UserCog,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    });
  }

  return (
    <div className="space-y-8">
      {/* Banner */}
      <Banner 
        title={`Bienvenue, ${session?.user?.name}`}
        subtitle="Tableau de bord - Gestion d'événements et programmes"
        showStats={true}
        stats={{
          events: eventsCount,
          guests: guestsCount,
          users: isAdmin ? usersCount ?? 0 : undefined,
        }}
      />

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats?.map?.((stat) => {
          const Icon = stat?.icon;
          return (
            <Card key={stat?.title} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat?.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat?.bgColor}`}>
                  {Icon && <Icon className={`h-4 w-4 ${stat?.color}`} />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-blue">{stat?.value ?? 0}</div>
              </CardContent>
            </Card>
          );
        }) ?? null}
      </div>

      {/* Upcoming Events */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-brand-blue mb-1">Événements à venir</CardTitle>
              <CardDescription className='mt-2 text-gray-500'>Prochains événements planifiés</CardDescription>
            </div>
            <Link href="/evenements">
              <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/5">
                Voir tout
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents?.map?.((event) => (
                <Link
                  key={event?.id}
                  href={`/evenements/${event?.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue/5 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-brand-blue mb-4">{event?.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1 mb-2">{event?.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event?.startDate ?? new Date())?.toLocaleDateString?.('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                          {event?.startDate !== event?.endDate && (
                            <> - {new Date(event?.endDate ?? new Date())?.toLocaleDateString?.('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}</>
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event?._count?.guestGroups ?? 0} groupe(s)
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )) ?? null}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Aucun événement à venir
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Check-ins */}
      {recentCheckIns && recentCheckIns.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-brand-blue mb-1">Enregistrements récents</CardTitle>
            <CardDescription className='text-gray-500'>Dernières entrées enregistrées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCheckIns?.map?.((checkIn) => {
                const statusColors = {
                  present_ontime: 'bg-status-green',
                  present_late: 'bg-status-brown',
                  absent: 'bg-status-red',
                  declined: 'bg-status-blue',
                };
                const statusLabels = {
                  present_ontime: 'Présent à l\'heure',
                  present_late: 'Présent en retard',
                  absent: 'Absent',
                  declined: 'A décliné',
                };
                return (
                  <div
                    key={checkIn?.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${statusColors[checkIn?.status ?? 'absent']}`} />
                      <div>
                        <p className="font-medium text-gray-900">{checkIn?.guest?.name}</p>
                        <p className="text-sm text-gray-500">
                          {statusLabels[checkIn?.status ?? 'absent']} • Par {checkIn?.checkedInBy?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(checkIn?.checkInTime ?? new Date())?.toLocaleDateString?.('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </div>
                );
              }) ?? null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
