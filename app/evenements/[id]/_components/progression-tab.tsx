'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

const taskStatusColors: any = {
  todo: 'bg-gray-200 text-gray-800',
  in_progress: 'bg-blue-200 text-blue-800',
  achieved: 'bg-green-200 text-green-800',
  closed: 'bg-brand-gold/30 text-brand-blue',
  blocked: 'bg-red-200 text-red-800',
  need_review: 'bg-yellow-200 text-yellow-800',
};

const taskStatusLabels: any = {
  todo: 'À faire',
  in_progress: 'En cours',
  achieved: 'Achevée',
  closed: 'Validée',
  blocked: 'Bloquée',
  need_review: 'À revoir',
};

export function ProgressionTab({ event }: { event: any }) {
  const [taskGroups, setTaskGroups] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTaskGroups();
  }, []);

  const loadTaskGroups = async () => {
    try {
      const response = await fetch(`/api/task-groups?eventId=${event?.id}`);
      if (response.ok) {
        const data = await response.json();
        setTaskGroups(data);
      }
    } catch (error) {
      console.error('Error loading task groups:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all tasks from all groups
  const allTasks = taskGroups?.flatMap?.((group) =>
    group?.tasks?.map?.((task: any) => ({
      ...task,
      groupName: group?.name,
    }))
  ) ?? [];

  // Apply filters and sort by deadline
  const filteredTasks = allTasks
    ?.filter?.((task: any) => {
      const matchesSearch = task?.title?.toLowerCase?.()?.includes?.(searchTerm?.toLowerCase?.() ?? '');
      const matchesStatus = statusFilter === 'all' || task?.status === statusFilter;
      const matchesAssigned =
        assignedFilter === 'all' ||
        (assignedFilter === 'unassigned' && !task?.assignedToId) ||
        task?.assignedToId === assignedFilter;
      return matchesSearch && matchesStatus && matchesAssigned;
    })
    ?.sort?.((a: any, b: any) => {
      // Tasks without deadline go to the end
      if (!a?.deadline && !b?.deadline) return 0;
      if (!a?.deadline) return 1;
      if (!b?.deadline) return -1;
      
      // Sort by deadline (closest first)
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return dateA - dateB;
    }) ?? [];

  // Get stats
  const stats = {
    total: allTasks?.length ?? 0,
    todo: allTasks?.filter?.((t: any) => t?.status === 'todo')?.length ?? 0,
    in_progress: allTasks?.filter?.((t: any) => t?.status === 'in_progress')?.length ?? 0,
    achieved: allTasks?.filter?.((t: any) => t?.status === 'achieved')?.length ?? 0,
    closed: allTasks?.filter?.((t: any) => t?.status === 'closed')?.length ?? 0,
    blocked: allTasks?.filter?.((t: any) => t?.status === 'blocked')?.length ?? 0,
    need_review: allTasks?.filter?.((t: any) => t?.status === 'need_review')?.length ?? 0,
  };

  // Get unique assignees
  const assignees = Array.from(
    new Set(
      allTasks
        ?.filter?.((t: any) => t?.assignedTo)
        ?.map?.((t: any) => JSON.stringify({ id: t?.assignedTo?.id, name: t?.assignedTo?.name }))
    )
  ).map((str: any) => JSON.parse(str));

  const progressPercentage = stats.total > 0
    ? Math.round(((stats.achieved + stats.closed) / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-brand-blue">Avancement du planning</h3>
        <p className="text-gray-600 mt-1">
          Vue d'ensemble de toutes les tâches de l'événement
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-blue">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">À faire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.todo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Achevées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.achieved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Validées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-gold">{stats.closed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bloquées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">À revoir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.need_review}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Progression globale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Complétées (achevées + validées)</span>
              <span className="font-semibold text-brand-blue">{progressPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-brand-gold transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une tâche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="achieved">Achevée</SelectItem>
                  <SelectItem value="closed">Validée</SelectItem>
                  <SelectItem value="blocked">Bloquée</SelectItem>
                  <SelectItem value="need_review">À revoir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Assigné à</label>
              <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="unassigned">Non assignées</SelectItem>
                  {assignees?.map?.((user: any) => (
                    <SelectItem key={user?.id} value={user?.id}>
                      {user?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Tâches ({filteredTasks?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : filteredTasks && filteredTasks?.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks?.map?.((task: any) => (
                <div
                  key={task?.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-brand-blue/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-medium text-gray-900">{task?.title}</h4>
                        <Badge className={taskStatusColors[task?.status]}>
                          {taskStatusLabels[task?.status]}
                        </Badge>
                        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                          {task?.groupName}
                        </span>
                      </div>
                      {task?.description && (
                        <p className="text-sm text-gray-600">{task?.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {task?.deadline && (
                          <span>
                            📅 Échéance:{' '}
                            {new Date(task?.deadline).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                        {task?.assignedTo ? (
                          <span>👤 {task?.assignedTo?.name}</span>
                        ) : (
                          <span className="text-orange-600">⚠️ Non assignée</span>
                        )}
                        {task?.blockedBy && (
                          <span className="text-red-600">
                            🚫 Bloqué: {task?.blockedBy}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )) ?? null}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || assignedFilter !== 'all'
                  ? 'Aucune tâche ne correspond aux filtres'
                  : 'Aucune tâche créée pour cet événement'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
