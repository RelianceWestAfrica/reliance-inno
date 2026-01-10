'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TasksTab } from './tasks-tab';
import { ProgressionTab } from './progression-tab';

export function PlanningTab({ event, users }: { event: any; users: any[] }) {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-brand-blue">Planning de l'événement</h2>
        <p className="text-gray-600 mt-1">
          Organisez et suivez les tâches liées à cet événement
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-brand-blue/10">
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:bg-brand-blue data-[state=active]:text-white"
          >
            Groupes de tâches
          </TabsTrigger>
          <TabsTrigger
            value="progression"
            className="data-[state=active]:bg-brand-blue data-[state=active]:text-white"
          >
            Avancement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6">
          <TasksTab event={event} users={users} />
        </TabsContent>

        <TabsContent value="progression" className="mt-6">
          <ProgressionTab event={event} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
