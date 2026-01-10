'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, ClipboardList, Trash2, Edit, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

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

export function TasksTab({ event, users }: { event: any; users: any[] }) {
  const router = useRouter();
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [taskGroups, setTaskGroups] = useState<any[]>([]);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'todo',
    blockedBy: '',
    assignedToId: 'unassigned',
  });

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
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/task-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName,
          eventId: event?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création');
      }

      toast?.success?.('Groupe de tâches créé avec succès');
      setCreateGroupOpen(false);
      setGroupName('');
      loadTaskGroups();
    } catch (error) {
      toast?.error?.('Erreur lors de la création du groupe');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskForm,
          assignedToId: taskForm.assignedToId === 'unassigned' ? '' : taskForm.assignedToId,
          taskGroupId: selectedGroup?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création');
      }

      toast?.success?.('Tâche créée avec succès');
      setCreateTaskOpen(false);
      setTaskForm({ title: '', description: '', deadline: '', status: 'todo', blockedBy: '', assignedToId: 'unassigned' });
      setSelectedGroup(null);
      loadTaskGroups();
    } catch (error) {
      toast?.error?.('Erreur lors de la création de la tâche');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/tasks/${selectedTask?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskForm,
          assignedToId: taskForm.assignedToId === 'unassigned' ? '' : taskForm.assignedToId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      toast?.success?.('Tâche mise à jour avec succès');
      setEditTaskOpen(false);
      setSelectedTask(null);
      setTaskForm({ title: '', description: '', deadline: '', status: 'todo', blockedBy: '', assignedToId: 'unassigned' });
      loadTaskGroups();
    } catch (error) {
      toast?.error?.('Erreur lors de la mise à jour de la tâche');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce groupe et toutes ses tâches ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/task-groups/${groupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast?.success?.('Groupe supprimé avec succès');
      loadTaskGroups();
    } catch (error) {
      toast?.error?.('Erreur lors de la suppression du groupe');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast?.success?.('Tâche supprimée avec succès');
      loadTaskGroups();
    } catch (error) {
      toast?.error?.('Erreur lors de la suppression de la tâche');
    }
  };

  const openEditTask = (task: any) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title || '',
      description: task.description || '',
      deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
      status: task.status || 'todo',
      blockedBy: task.blockedBy || '',
      assignedToId: task.assignedToId || 'unassigned',
    });
    setEditTaskOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-brand-blue">Groupes de tâches</h3>
          <p className="text-gray-600 mt-1">
            {taskGroups?.length ?? 0} groupe(s)
          </p>
        </div>
        <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau groupe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-brand-blue">Créer un groupe de tâches</DialogTitle>
              <DialogDescription>
                Organisez vos tâches par groupe
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Nom du groupe *</Label>
                <Input
                  id="groupName"
                  placeholder="Logistique, Communication, etc."
                  value={groupName ?? ''}
                  onChange={(e) => setGroupName(e?.target?.value ?? '')}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateGroupOpen(false)}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                  disabled={loading}
                >
                  {loading ? 'Création...' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {taskGroups && taskGroups?.length > 0 ? (
        <div className="grid gap-4">
          {taskGroups?.map?.((group: any) => (
            <Card key={group?.id} className="border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-brand-blue flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      {group?.name}
                    </CardTitle>
                    <CardDescription>
                      {group?.tasks?.length ?? 0} tâche(s)
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-brand-blue text-brand-blue hover:bg-brand-blue/5"
                      onClick={() => {
                        setSelectedGroup(group);
                        setCreateTaskOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteGroup(group?.id ?? '')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setExpandedGroup(expandedGroup === group?.id ? null : group?.id)
                      }
                    >
                      {expandedGroup === group?.id ? 'Masquer' : 'Voir'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedGroup === group?.id && (
                <CardContent>
                  {group?.tasks && group?.tasks?.length > 0 ? (
                    <div className="space-y-2">
                      {group?.tasks
                        ?.slice()
                        ?.sort?.((a: any, b: any) => {
                          // Tasks without deadline go to the end
                          if (!a?.deadline && !b?.deadline) return 0;
                          if (!a?.deadline) return 1;
                          if (!b?.deadline) return -1;
                          
                          // Sort by deadline (closest first)
                          const dateA = new Date(a.deadline).getTime();
                          const dateB = new Date(b.deadline).getTime();
                          return dateA - dateB;
                        })
                        ?.map?.((task: any) => (
                        <div
                          key={task?.id}
                          className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-brand-blue/30 transition-colors"
                        >
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <p className="font-medium text-gray-900">{task?.title}</p>
                              <Badge className={taskStatusColors[task?.status]}>
                                {taskStatusLabels[task?.status]}
                              </Badge>
                            </div>
                            {task?.description && (
                              <p className="text-sm text-gray-600">{task?.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {task?.deadline && (
                                <span>
                                  📅 {new Date(task?.deadline).toLocaleDateString('fr-FR')}
                                </span>
                              )}
                              {task?.assignedTo && (
                                <span>👤 {task?.assignedTo?.name}</span>
                              )}
                              {task?.blockedBy && (
                                <span className="text-red-600">⚠️ Bloqué: {task?.blockedBy}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-brand-blue hover:bg-brand-blue/5"
                              onClick={() => openEditTask(task)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteTask(task?.id ?? '')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )) ?? null}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      Aucune tâche dans ce groupe
                    </p>
                  )}
                </CardContent>
              )}
            </Card>
          )) ?? null}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ClipboardList className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun groupe de tâches</h3>
            <p className="text-gray-500 mb-4 text-center">
              Créez un groupe pour commencer à organiser vos tâches
            </p>
            <Button
              className="bg-brand-blue hover:bg-brand-blue/90 text-white"
              onClick={() => setCreateGroupOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer un groupe
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Task Dialog */}
      <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-brand-blue">Ajouter une tâche</DialogTitle>
            <DialogDescription>
              Ajoutez une tâche au groupe &quot;{selectedGroup?.name}&quot;
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Titre de la tâche *</Label>
              <Input
                id="taskTitle"
                placeholder="Réserver la salle..."
                value={taskForm?.title ?? ''}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e?.target?.value ?? '' })
                }
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskDescription">Description</Label>
              <Textarea
                id="taskDescription"
                placeholder="Décrivez la tâche..."
                value={taskForm?.description ?? ''}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e?.target?.value ?? '' })
                }
                disabled={loading}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taskDeadline">Échéance</Label>
                <Input
                  id="taskDeadline"
                  type="datetime-local"
                  value={taskForm?.deadline ?? ''}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, deadline: e?.target?.value ?? '' })
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskStatus">Statut</Label>
                <Select
                  value={taskForm?.status ?? 'todo'}
                  onValueChange={(value) => setTaskForm({ ...taskForm, status: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="taskStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">À faire</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="achieved">Achevée</SelectItem>
                    <SelectItem value="closed">Validée</SelectItem>
                    <SelectItem value="blocked">Bloquée</SelectItem>
                    <SelectItem value="need_review">À revoir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskAssigned">Assigné à</Label>
              <Select
                value={taskForm?.assignedToId ?? 'unassigned'}
                onValueChange={(value) => setTaskForm({ ...taskForm, assignedToId: value })}
                disabled={loading}
              >
                <SelectTrigger id="taskAssigned">
                  <SelectValue placeholder="Sélectionnez un utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Aucun</SelectItem>
                  {users?.map?.((user: any) => (
                    <SelectItem key={user?.id} value={user?.id ?? ''}>
                      {user?.name} ({user?.role === 'Admin' ? 'Admin' : 'Utilisateur'})
                    </SelectItem>
                  )) ?? null}
                </SelectContent>
              </Select>
            </div>
            {taskForm?.status === 'blocked' && (
              <div className="space-y-2">
                <Label htmlFor="taskBlockedBy">Bloqué par</Label>
                <Input
                  id="taskBlockedBy"
                  placeholder="Raison du blocage..."
                  value={taskForm?.blockedBy ?? ''}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, blockedBy: e?.target?.value ?? '' })
                  }
                  disabled={loading}
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateTaskOpen(false);
                  setSelectedGroup(null);
                }}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                disabled={loading}
              >
                {loading ? 'Ajout...' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editTaskOpen} onOpenChange={setEditTaskOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-brand-blue">Modifier la tâche</DialogTitle>
            <DialogDescription>
              Modifiez les détails de la tâche
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editTaskTitle">Titre de la tâche *</Label>
              <Input
                id="editTaskTitle"
                placeholder="Réserver la salle..."
                value={taskForm?.title ?? ''}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e?.target?.value ?? '' })
                }
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTaskDescription">Description</Label>
              <Textarea
                id="editTaskDescription"
                placeholder="Décrivez la tâche..."
                value={taskForm?.description ?? ''}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e?.target?.value ?? '' })
                }
                disabled={loading}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editTaskDeadline">Échéance</Label>
                <Input
                  id="editTaskDeadline"
                  type="datetime-local"
                  value={taskForm?.deadline ?? ''}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, deadline: e?.target?.value ?? '' })
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTaskStatus">Statut</Label>
                <Select
                  value={taskForm?.status ?? 'todo'}
                  onValueChange={(value) => setTaskForm({ ...taskForm, status: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="editTaskStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">À faire</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="achieved">Achevée</SelectItem>
                    <SelectItem value="closed">Validée</SelectItem>
                    <SelectItem value="blocked">Bloquée</SelectItem>
                    <SelectItem value="need_review">À revoir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTaskAssigned">Assigné à</Label>
              <Select
                value={taskForm?.assignedToId ?? 'unassigned'}
                onValueChange={(value) => setTaskForm({ ...taskForm, assignedToId: value })}
                disabled={loading}
              >
                <SelectTrigger id="editTaskAssigned">
                  <SelectValue placeholder="Sélectionnez un utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Aucun</SelectItem>
                  {users?.map?.((user: any) => (
                    <SelectItem key={user?.id} value={user?.id ?? ''}>
                      {user?.name} ({user?.role === 'Admin' ? 'Admin' : 'Utilisateur'})
                    </SelectItem>
                  )) ?? null}
                </SelectContent>
              </Select>
            </div>
            {taskForm?.status === 'blocked' && (
              <div className="space-y-2">
                <Label htmlFor="editTaskBlockedBy">Bloqué par</Label>
                <Input
                  id="editTaskBlockedBy"
                  placeholder="Raison du blocage..."
                  value={taskForm?.blockedBy ?? ''}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, blockedBy: e?.target?.value ?? '' })
                  }
                  disabled={loading}
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditTaskOpen(false);
                  setSelectedTask(null);
                }}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                disabled={loading}
              >
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
