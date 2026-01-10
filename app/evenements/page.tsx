import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CreateEventDialog } from '@/components/create-event-dialog';
import { Banner } from '@/components/banner-event';


export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const session = await getServerSession(authOptions);

  const events = await prisma.event.findMany({
    orderBy: { startDate: 'desc' },
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
          _count: {
            select: { guests: true },
          },
        },
      },
    },
  });

  const upcomingEvents = events?.filter?.((e) => new Date(e?.startDate ?? new Date()) >= new Date()) ?? [];
  const pastEvents = events?.filter?.((e) => new Date(e?.startDate ?? new Date()) < new Date()) ?? [];

  const EventCard = ({ event }: { event: any }) => {
    const totalGuests = event?.guestGroups?.reduce?.((sum: number, g: any) => sum + (g?._count?.guests ?? 0), 0) ?? 0;
    const maxGuests = event?.maxGuests;
    const remaining = maxGuests ? Math.max(0, maxGuests - totalGuests) : null;
    const isPast = new Date(event?.startDate ?? new Date()) < new Date();

    return (
      
      <Link href={`/evenements/${event?.id}`}>
        
        <Card
          className={`border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-brand-blue ${
            isPast ? 'opacity-75' : ''
          }`}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-brand-blue line-clamp-1 mb-3">{event?.name}</CardTitle>
                <CardDescription className="line-clamp-1">{event?.description}</CardDescription>
              </div>
              {isPast && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  Passé
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(event?.startDate ?? new Date())?.toLocaleDateString?.('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(event?.startDate ?? new Date())?.toLocaleTimeString?.('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                {maxGuests ? (
                  <span className="font-medium">
                    <span className="text-brand-blue">{totalGuests}</span> invités /{' '}
                    <span className={remaining === 0 ? 'text-red-600' : 'text-status-green'}>
                      {remaining} restant(s)
                    </span>
                  </span>
                ) : (
                  <span>
                    <span className="text-brand-blue font-medium">{totalGuests}</span> invités
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Créé par {event?.createdBy?.name}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          {/* <h1 className="text-3xl font-bold text-brand-blue">Événements</h1>
          <p className="text-gray-600 mt-1">Gérez vos événements et leurs invités</p> */}
        </div>
        <CreateEventDialog />
      </div>

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <div className="space-y-4">
          {/* <h2 className="text-xl font-semibold text-gray-600">
            Événements à venir ({upcomingEvents.length})
          </h2> */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents?.map?.((event) => (
              <EventCard key={event?.id} event={event} />
            )) ?? null}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents && pastEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-600">
            Événements passés ({pastEvents.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents?.map?.((event) => (
              <EventCard key={event?.id} event={event} />
            )) ?? null}
          </div>
        </div>
      )}

      {events && events.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Aucun événement
            </h3>
            <p className="text-gray-500 mb-4 text-center">
              Commencez par créer votre premier événement
            </p>
            <CreateEventDialog />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
