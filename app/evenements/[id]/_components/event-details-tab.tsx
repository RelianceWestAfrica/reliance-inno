'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, User, Info } from 'lucide-react';

export function EventDetailsTab({ event }: { event: any }) {
  const totalGuests = event?.guestGroups?.reduce?.(
    (sum: number, g: any) => sum + (g?.guests?.length ?? 0),
    0
  ) ?? 0;
  const maxGuests = event?.maxGuests;
  const remaining = maxGuests ? Math.max(0, maxGuests - totalGuests) : null;

  const checkedInGuests = event?.guestGroups?.reduce?.(
    (sum: number, g: any) =>
      sum + (g?.guests?.filter?.((guest: any) => guest?.checkIns?.length > 0)?.length ?? 0),
    0
  ) ?? 0;

  return (
    <div className="space-y-6">
      <Card className="border-brand-blue/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-brand-blue">Informations de l'événement</CardTitle>
          <CardDescription>Détails complets de l'événement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-brand-blue mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Nom</p>
                <p className="text-lg font-semibold text-brand-blue">{event?.name}</p>
              </div>
            </div>

            {event?.description && (
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-brand-blue mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-gray-700">{event?.description}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-brand-blue mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-gray-700">
                  {new Date(event?.startDate ?? new Date())?.toLocaleDateString?.('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-brand-blue mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Heure</p>
                <p className="text-gray-700">
                  {new Date(event?.startDate ?? new Date())?.toLocaleTimeString?.('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-brand-blue mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Créé par</p>
                <p className="text-gray-700">
                  {event?.createdBy?.name} ({event?.createdBy?.email})
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Groupes d'invités</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-blue">{event?.guestGroups?.length ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total invités</CardTitle>
          </CardHeader>
          <CardContent>
            {maxGuests ? (
              <div>
                <p className="text-3xl font-bold text-brand-blue">{totalGuests}</p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className={remaining === 0 ? 'text-red-600 font-medium' : 'text-status-green font-medium'}>
                    {remaining} place(s) restante(s)
                  </span>
                </p>
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-brand-blue">{totalGuests}</p>
                <p className="text-sm text-gray-600 mt-1">Sans limite</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Enregistrés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-blue">{checkedInGuests}</p>
            <p className="text-sm text-gray-600 mt-1">
              {totalGuests > 0
                ? `${Math.round((checkedInGuests / totalGuests) * 100)}% des invités`
                : '0%'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
