'use client';

import { useState } from 'react';
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
import { Plus, Users, Trash2, UserPlus, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function GuestGroupsTab({ event }: { event: any }) {
  const router = useRouter();
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [addGuestOpen, setAddGuestOpen] = useState(false);
  const [editGuestOpen, setEditGuestOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [guestForm, setGuestForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/guest-groups', {
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

      toast?.success?.('Groupe créé avec succès');
      setCreateGroupOpen(false);
      setGroupName('');
      router.refresh();
    } catch (error) {
      toast?.error?.('Erreur lors de la création du groupe');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...guestForm,
          guestGroupId: selectedGroup?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout');
      }

      toast?.success?.('Invité ajouté avec succès');
      setAddGuestOpen(false);
      setGuestForm({ name: '', email: '', phone: '' });
      setSelectedGroup(null);
      router.refresh();
    } catch (error) {
      toast?.error?.('Erreur lors de l\'ajout de l\'invité');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce groupe et tous ses invités ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/guest-groups/${groupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast?.success?.('Groupe supprimé avec succès');
      router.refresh();
    } catch (error) {
      toast?.error?.('Erreur lors de la suppression du groupe');
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet invité ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/guests/${guestId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast?.success?.('Invité supprimé avec succès');
      router.refresh();
    } catch (error) {
      toast?.error?.('Erreur lors de la suppression de l\'invité');
    }
  };

  const handleEditGuest = (guest: any) => {
    setSelectedGuest(guest);
    setGuestForm({
      name: guest?.name ?? '',
      email: guest?.email ?? '',
      phone: guest?.phone ?? '',
    });
    setEditGuestOpen(true);
  };

  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/guests/${selectedGuest?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestForm),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      toast?.success?.('Invité mis à jour avec succès');
      setEditGuestOpen(false);
      setSelectedGuest(null);
      setGuestForm({ name: '', email: '', phone: '' });
      router.refresh();
    } catch (error) {
      toast?.error?.('Erreur lors de la mise à jour de l\'invité');
    } finally {
      setLoading(false);
    }
  };

  const totalGuests = event?.guestGroups?.reduce?.(
    (sum: number, g: any) => sum + (g?.guests?.length ?? 0),
    0
  ) ?? 0;
  const maxGuests = event?.maxGuests;
  const canAddGuests = !maxGuests || totalGuests < maxGuests;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand-blue">Groupes d'invités</h2>
          <p className="text-gray-600 mt-1">
            {event?.guestGroups?.length ?? 0} groupe(s) • {totalGuests} invité(s)
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
              <DialogTitle className="text-brand-blue">Créer un groupe</DialogTitle>
              <DialogDescription>
                Créez un groupe pour organiser vos invités
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Nom du groupe *</Label>
                <Input
                  id="groupName"
                  placeholder="VIP, Partenaires, etc."
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

      {!canAddGuests && (
        <Alert>
          <AlertDescription>
            La limite d'invités ({maxGuests}) est atteinte. Vous ne pouvez plus ajouter d'invités.
          </AlertDescription>
        </Alert>
      )}

      {event?.guestGroups && event?.guestGroups?.length > 0 ? (
        <div className="grid gap-4">
          {event?.guestGroups?.map?.((group: any) => (
            <Card key={group?.id} className="border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-brand-blue flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {group?.name}
                    </CardTitle>
                    <CardDescription>
                      {group?.guests?.length ?? 0} invité(s)
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-brand-blue text-brand-blue hover:bg-brand-blue/5"
                      onClick={() => {
                        setSelectedGroup(group);
                        setAddGuestOpen(true);
                      }}
                      disabled={!canAddGuests}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
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
                  {group?.guests && group?.guests?.length > 0 ? (
                    <div className="space-y-2">
                      {group?.guests?.map?.((guest: any) => (
                        <div
                          key={guest?.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{guest?.name}</p>
                            <div className="text-sm text-gray-500 space-x-3">
                              {guest?.email && <span>{guest?.email}</span>}
                              {guest?.phone && <span>{guest?.phone}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-brand-blue hover:bg-brand-blue/5"
                              onClick={() => handleEditGuest(guest)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteGuest(guest?.id ?? '')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )) ?? null}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      Aucun invité dans ce groupe
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
            <Users className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun groupe</h3>
            <p className="text-gray-500 mb-4 text-center">
              Créez un groupe pour commencer à ajouter des invités
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

      {/* Add Guest Dialog */}
      <Dialog open={addGuestOpen} onOpenChange={setAddGuestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-brand-blue">Ajouter un invité</DialogTitle>
            <DialogDescription>
              Ajoutez un invité au groupe &quot;{selectedGroup?.name}&quot;
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGuest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Nom complet *</Label>
              <Input
                id="guestName"
                placeholder="Prénom Nom"
                value={guestForm?.name ?? ''}
                onChange={(e) =>
                  setGuestForm({ ...guestForm, name: e?.target?.value ?? '' })
                }
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email</Label>
              <Input
                id="guestEmail"
                type="email"
                placeholder="email@exemple.com"
                value={guestForm?.email ?? ''}
                onChange={(e) =>
                  setGuestForm({ ...guestForm, email: e?.target?.value ?? '' })
                }
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestPhone">Téléphone</Label>
              <Input
                id="guestPhone"
                type="tel"
                placeholder="+225 XX XX XX XX XX"
                value={guestForm?.phone ?? ''}
                onChange={(e) =>
                  setGuestForm({ ...guestForm, phone: e?.target?.value ?? '' })
                }
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddGuestOpen(false);
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

      {/* Edit Guest Dialog */}
      <Dialog open={editGuestOpen} onOpenChange={setEditGuestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-brand-blue">Modifier l'invité</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'invité
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateGuest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editGuestName">Nom complet *</Label>
              <Input
                id="editGuestName"
                placeholder="Prénom Nom"
                value={guestForm?.name ?? ''}
                onChange={(e) =>
                  setGuestForm({ ...guestForm, name: e?.target?.value ?? '' })
                }
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editGuestEmail">Email</Label>
              <Input
                id="editGuestEmail"
                type="email"
                placeholder="email@exemple.com"
                value={guestForm?.email ?? ''}
                onChange={(e) =>
                  setGuestForm({ ...guestForm, email: e?.target?.value ?? '' })
                }
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editGuestPhone">Téléphone</Label>
              <Input
                id="editGuestPhone"
                type="tel"
                placeholder="+225 XX XX XX XX XX"
                value={guestForm?.phone ?? ''}
                onChange={(e) =>
                  setGuestForm({ ...guestForm, phone: e?.target?.value ?? '' })
                }
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditGuestOpen(false);
                  setSelectedGuest(null);
                  setGuestForm({ name: '', email: '', phone: '' });
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
