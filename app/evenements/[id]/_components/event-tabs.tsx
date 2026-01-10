'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EventDetailsTab } from './event-details-tab';
import { GuestGroupsTab } from './guest-groups-tab';
import { AttendanceTab } from './attendance-tab';
import { PlanningTab } from './planning-tab';

export function EventTabs({ event, users }: { event: any; users: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/evenements">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-brand-blue mt-4">{event?.name}</h1>
          <p className="text-gray-600 mt-2">
            {new Date(event?.startDate ?? new Date())?.toLocaleDateString?.('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-brand-blue/10">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-brand-blue data-[state=active]:text-white"
          >
            Détails
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="data-[state=active]:bg-brand-blue data-[state=active]:text-white"
          >
            Groupes
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="data-[state=active]:bg-brand-blue data-[state=active]:text-white"
          >
            Présence
          </TabsTrigger>
          <TabsTrigger
            value="planning"
            className="data-[state=active]:bg-brand-blue data-[state=active]:text-white"
          >
            Planning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <EventDetailsTab event={event} />
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          <GuestGroupsTab event={event} />
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <AttendanceTab event={event} />
        </TabsContent>

        <TabsContent value="planning" className="mt-6">
          <PlanningTab event={event} users={users} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
