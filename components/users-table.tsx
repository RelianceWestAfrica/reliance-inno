'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, Edit, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  _count: {
    eventsCreated: number;
    checkIns: number;
  };
  assignedTasks: Array<{
    id: string;
    title: string;
    status: string;
    deadline: Date | null;
    taskGroup: {
      name: string;
      event: {
        name: string;
      };
    };
  }>;
}

const taskStatusLabels: any = {
  todo: 'À faire',
  in_progress: 'En cours',
  need_review: 'À revoir',
};

export function UsersTable({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingTasks, setViewingTasks] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'RegularUser',
    password: '',
  });

  const handleDelete = async (userId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      return;
    }

    setDeletingId(userId);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || 'Erreur lors de la suppression');
      }

      toast?.success?.('Utilisateur supprimé avec succès');
      router.refresh();
    } catch (error: any) {
      toast?.error?.(error?.message || 'Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || 'Erreur lors de la mise à jour');
      }

      toast?.success?.('Utilisateur mis à jour avec succès');
      setEditingUser(null);
      router.refresh();
    } catch (error: any) {
      toast?.error?.(error?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-md border border-gray-300 shadow-sm">
        <Table className=" border-gray-300 shadow-sm">
          <TableHeader>
            <TableRow className=" border-gray-300 shadow-sm">
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Tâches assignées</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && users?.length > 0 ? (
              users?.map?.((user) => (
                <TableRow key={user?.id} className=" border-gray-300">
                  <TableCell className="font-medium">
                    {user?.name}
                    {user?.id === currentUserId && (
                      <Badge variant="secondary" className="ml-2 text-xs text-red-500">
                        Vous
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user?.role === 'Admin' ? 'default' : 'secondary'}
                      className={
                        user?.role === 'Admin'
                          ? 'bg-brand-blue hover:bg-brand-blue/90 text-white p-2'
                          : ''
                      }
                    >
                      {user?.role === 'Admin' ? 'Administrateur' : 'Utilisateur'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      {new Date(user?.createdAt ?? new Date())?.toLocaleDateString?.('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user?.assignedTasks && user?.assignedTasks?.length > 0 ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => setViewingTasks(user)}
                      >
                        <ClipboardList className="h-3 w-3" />
                        {user?.assignedTasks?.length} tâche(s)
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-500">Aucune tâche</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-brand-blue hover:bg-brand-blue/5"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(user?.id ?? '')}
                        disabled={user?.id === currentUserId || deletingId === user?.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) ?? null
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Aucun utilisateur
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-brand-blue">Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Nom complet *</Label>
              <Input
                id="editName"
                placeholder="Prénom Nom"
                value={editForm?.name ?? ''}
                onChange={(e) => setEditForm({ ...editForm, name: e?.target?.value ?? '' })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email *</Label>
              <Input
                id="editEmail"
                type="email"
                placeholder="email@exemple.com"
                value={editForm?.email ?? ''}
                onChange={(e) => setEditForm({ ...editForm, email: e?.target?.value ?? '' })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRole">Rôle *</Label>
              <Select
                value={editForm?.role ?? 'RegularUser'}
                onValueChange={(value) => setEditForm({ ...editForm, role: value })}
                disabled={loading}
              >
                <SelectTrigger id="editRole">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RegularUser">Utilisateur régulier</SelectItem>
                  <SelectItem value="Admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPassword">Nouveau mot de passe (optionnel)</Label>
              <Input
                id="editPassword"
                type="password"
                placeholder="Laisser vide pour ne pas changer"
                value={editForm?.password ?? ''}
                onChange={(e) => setEditForm({ ...editForm, password: e?.target?.value ?? '' })}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Laissez ce champ vide si vous ne souhaitez pas changer le mot de passe
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingUser(null)}
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

      {/* View Tasks Dialog */}
      <Dialog open={!!viewingTasks} onOpenChange={(open) => !open && setViewingTasks(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-brand-blue">
              Tâches assignées à {viewingTasks?.name}
            </DialogTitle>
            <DialogDescription>
              Tâches en cours, à faire ou à revoir
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {viewingTasks?.assignedTasks && viewingTasks?.assignedTasks?.length > 0 ? (
              viewingTasks?.assignedTasks?.map?.((task: any) => (
                <div
                  key={task?.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900">{task?.title}</h4>
                    <Badge
                      className={
                        task?.status === 'todo'
                          ? 'bg-gray-200 text-gray-800'
                          : task?.status === 'in_progress'
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }
                    >
                      {taskStatusLabels[task?.status]}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📁 {task?.taskGroup?.event?.name}</p>
                    <p>🗂️ {task?.taskGroup?.name}</p>
                    {task?.deadline && (
                      <p>
                        📅 Échéance:{' '}
                        {new Date(task?.deadline).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )) ?? null
            ) : (
              <p className="text-center text-gray-500 py-8">Aucune tâche assignée</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
