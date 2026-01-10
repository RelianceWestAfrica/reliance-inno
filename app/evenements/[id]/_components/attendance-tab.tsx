'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, XCircle, Clock, UserX, Search } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  present_ontime: {
    label: 'Présent à l\'heure',
    color: 'bg-status-green',
    textColor: 'text-status-green',
    icon: CheckCircle2,
  },
  present_late: {
    label: 'Présent en retard',
    color: 'bg-status-brown',
    textColor: 'text-status-brown',
    icon: Clock,
  },
  absent: {
    label: 'Absent',
    color: 'bg-status-red',
    textColor: 'text-status-red',
    icon: XCircle,
  },
  declined: {
    label: 'A décliné',
    color: 'bg-status-blue',
    textColor: 'text-status-blue',
    icon: UserX,
  },
};

export function AttendanceTab({ event }: { event: any }) {
  const router = useRouter();
  const [checkInDialog, setCheckInDialog] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [manualStatus, setManualStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Flatten all guests from all groups
  const allGuests =
    event?.guestGroups?.flatMap?.((group: any) =>
      group?.guests?.map?.((guest: any) => ({
        ...guest,
        groupName: group?.name,
      }))
    ) ?? [];

  // Filter guests
  const filteredGuests = allGuests?.filter?.((guest: any) => {
    const matchesSearch =
      !searchTerm ||
      guest?.name?.toLowerCase?.()?.includes?.(searchTerm?.toLowerCase?.());
    
    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    
    const latestCheckIn = guest?.checkIns?.[0];
    if (statusFilter === 'no_checkin') return !latestCheckIn;
    
    return latestCheckIn?.status === statusFilter;
  }) ?? [];

  // Statistics
  const stats = {
    total: allGuests?.length ?? 0,
    present_ontime: allGuests?.filter?.(
      (g: any) => g?.checkIns?.[0]?.status === 'present_ontime'
    )?.length ?? 0,
    present_late: allGuests?.filter?.(
      (g: any) => g?.checkIns?.[0]?.status === 'present_late'
    )?.length ?? 0,
    absent: allGuests?.filter?.(
      (g: any) => g?.checkIns?.[0]?.status === 'absent'
    )?.length ?? 0,
    declined: allGuests?.filter?.(
      (g: any) => g?.checkIns?.[0]?.status === 'declined'
    )?.length ?? 0,
    no_checkin: allGuests?.filter?.((g: any) => !g?.checkIns?.[0])?.length ?? 0,
  };

  const handleCheckIn = async (guest: any, status?: string) => {
    setSelectedGuest(guest);
    setManualStatus(status ?? null);
    
    if (status === 'absent' || status === 'declined') {
      setCheckInDialog(true);
    } else {
      await performCheckIn(guest, status);
    }
  };

  const performCheckIn = async (guest: any, status?: string) => {
    setLoading(true);

    try {
      const response = await fetch('/api/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: guest?.id,
          eventDate: event?.startDate,
          status: status || null,
          description: description || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement');
      }

      const statusLabel = status
        ? STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label
        : 'Présence enregistrée';
      toast?.success?.(statusLabel);
      setCheckInDialog(false);
      setDescription('');
      setManualStatus(null);
      setSelectedGuest(null);
      router.refresh();
    } catch (error) {
      toast?.error?.('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGuest) {
      await performCheckIn(selectedGuest, manualStatus ?? undefined);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-brand-blue">{stats?.total ?? 0}</p>
          </CardContent>
        </Card>
        {Object.entries(STATUS_CONFIG)?.map?.(([key, config]) => {
          const Icon = config?.icon;
          return (
            <Card key={key} className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${config?.color}`} />
                  {config?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {stats[key as keyof typeof stats] ?? 0}
                </p>
              </CardContent>
            </Card>
          );
        }) ?? null}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-gray-600">Non vérifiés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-500">{stats?.no_checkin ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-brand-blue">Filtrer les invités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nom de l'invité..."
                  value={searchTerm ?? ''}
                  onChange={(e) => setSearchTerm(e?.target?.value ?? '')}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les invités</SelectItem>
                  <SelectItem value="no_checkin">Non vérifiés</SelectItem>
                  <SelectItem value="present_ontime">Présents à l'heure</SelectItem>
                  <SelectItem value="present_late">Présents en retard</SelectItem>
                  <SelectItem value="absent">Absents</SelectItem>
                  <SelectItem value="declined">Ont décliné</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guest List */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-brand-blue">Liste des invités</CardTitle>
          <CardDescription>
            {filteredGuests?.length ?? 0} invité(s) affiché(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredGuests && filteredGuests?.length > 0 ? (
            <div className="space-y-2">
              {filteredGuests?.map?.((guest: any) => {
                const latestCheckIn = guest?.checkIns?.[0];
                const status = latestCheckIn?.status;
                const config = status ? STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] : null;
                const Icon = config?.icon;

                return (
                  <div
                    key={guest?.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-brand-blue/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {config && (
                        <div className={cn('w-3 h-3 rounded-full', config?.color)} />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{guest?.name}</p>
                          {config && Icon && (
                            <Icon className={cn('h-4 w-4', config?.textColor)} />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Groupe: {guest?.groupName}
                          {latestCheckIn && (
                            <>
                              {' • '}
                              {new Date(latestCheckIn?.checkInTime ?? new Date())?.toLocaleString?.(
                                'fr-FR',
                                {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                              {latestCheckIn?.description && (
                                <>
                                  {' • '}
                                  <span className="italic">{latestCheckIn?.description}</span>
                                </>
                              )}
                            </>
                          )}
                        </p>
                        {latestCheckIn?.checkedInBy && (
                          <p className="text-xs text-gray-400">
                            Par {latestCheckIn?.checkedInBy?.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!latestCheckIn ? (
                        <>
                          <Button
                            size="sm"
                            className="bg-status-green hover:bg-status-green/90 text-white"
                            onClick={() => handleCheckIn(guest)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Enregistrer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-status-red text-status-red hover:bg-status-red/10"
                            onClick={() => handleCheckIn(guest, 'absent')}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Absent
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-status-blue text-status-blue hover:bg-status-blue/10"
                            onClick={() => handleCheckIn(guest, 'declined')}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Décliné
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          {config && (
                            <span className={cn('text-sm font-medium', config?.textColor)}>
                              {config?.label}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }) ?? null}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              {searchTerm || statusFilter !== 'all'
                ? 'Aucun invité ne correspond aux critères'
                : 'Aucun invité pour cet événement'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Check-in Dialog for Absent/Declined */}
      <Dialog open={checkInDialog} onOpenChange={setCheckInDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-brand-blue">
              Marquer comme{' '}
              {manualStatus === 'absent'
                ? 'Absent'
                : manualStatus === 'declined'
                ? 'Décliné'
                : ''}
            </DialogTitle>
            <DialogDescription>
              Invité: <strong>{selectedGuest?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDialogSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Note (optionnelle)</Label>
              <Textarea
                id="description"
                placeholder="Raison de l'absence, commentaires..."
                value={description ?? ''}
                onChange={(e) => setDescription(e?.target?.value ?? '')}
                disabled={loading}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCheckInDialog(false);
                  setDescription('');
                  setManualStatus(null);
                  setSelectedGuest(null);
                }}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className={cn(
                  'text-white',
                  manualStatus === 'absent'
                    ? 'bg-status-red hover:bg-status-red/90'
                    : 'bg-status-blue hover:bg-status-blue/90'
                )}
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : 'Confirmer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
