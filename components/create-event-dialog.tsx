'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export function CreateEventDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    maxGuests: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création');
      }

      const event = await response.json();
      toast?.success?.('Événement créé avec succès');
      setOpen(false);
      setFormData({ name: '', description: '', startDate: '', endDate: '', maxGuests: '' });
      router.push(`/evenements/${event?.id}`);
      router.refresh();
    } catch (error) {
      toast?.error?.('Erreur lors de la création de l\'événement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel événement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-brand-blue">Créer un événement</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouvel événement
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'événement *</Label>
            <Input
              id="name"
              placeholder="Conférence annuelle..."
              value={formData?.name ?? ''}
              onChange={(e) => setFormData({ ...formData, name: e?.target?.value ?? '' })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre événement..."
              value={formData?.description ?? ''}
              onChange={(e) => setFormData({ ...formData, description: e?.target?.value ?? '' })}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData?.startDate ?? ''}
                onChange={(e) => setFormData({ ...formData, startDate: e?.target?.value ?? '' })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData?.endDate ?? ''}
                onChange={(e) => setFormData({ ...formData, endDate: e?.target?.value ?? '' })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxGuests">Nombre maximum d'invités (optionnel)</Label>
            <Input
              id="maxGuests"
              type="number"
              placeholder="Laissez vide pour aucune limite"
              value={formData?.maxGuests ?? ''}
              onChange={(e) => setFormData({ ...formData, maxGuests: e?.target?.value ?? '' })}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
  );
}
