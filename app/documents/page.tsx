'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, FileText, Upload, Download, Trash2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DocumentsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventSearch, setEventSearch] = useState('');
  const [fileSearch, setFileSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadDocuments(selectedEvent.id);
    }
  }, [selectedEvent]);

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (eventId: string) => {
    try {
      const response = await fetch(`/api/documents?eventId=${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedEvent) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('eventId', selectedEvent.id);

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      toast.success('Fichier téléchargé avec succès');
      setUploadOpen(false);
      setSelectedFile(null);
      loadDocuments(selectedEvent.id);
    } catch (error) {
      toast.error('Erreur lors du téléchargement du fichier');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du fichier');
      }

      const data = await response.json();
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.target = '_blank';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Erreur lors du téléchargement du fichier');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce fichier ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast.success('Fichier supprimé avec succès');
      if (selectedEvent) {
        loadDocuments(selectedEvent.id);
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression du fichier');
    }
  };

  const getEventStatus = (event: any) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now < start) {
      return { label: 'À venir', color: 'bg-blue-100 text-blue-800' };
    } else if (now >= start && now <= end) {
      return { label: 'En cours', color: 'bg-green-100 text-green-800' };
    } else {
      return { label: 'Passé', color: 'bg-gray-200 text-gray-800' };
    }
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const filteredDocuments = documents.filter((doc) =>
    doc.fileName.toLowerCase().includes(fileSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        {/* <h1 className="text-3xl font-bold text-brand-blue">Documents</h1>
        <p className="text-gray-600 mt-1">
          Gérez les fichiers et documents de vos événements
        </p> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events List */}
        <Card className='border text-gray-300'>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-brand-blue mb-4">Évènements et Programmes</span>
              <Badge variant="outline">{filteredEvents.length}</Badge>
            </CardTitle>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 border-gray-300 shadow-sm" />
                <Input
                  placeholder="Rechercher un événement..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="pl-10 border-gray-300 shadow-sm text-gray-600"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Chargement...</div>
            ) : filteredEvents.length > 0 ? (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredEvents.map((event) => {
                  const status = getEventStatus(event);
                  return (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedEvent?.id === event.id
                          ? 'border-brand-blue bg-brand-blue/5'
                          : 'border-gray-200 hover:border-brand-blue/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{event.name}</h3>
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun événement trouvé
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className='border text-gray-300'>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-brand-blue mb-4">
                {selectedEvent ? `Documents - ${selectedEvent.name}` : 'Documents'}
              </span>
              {selectedEvent && (
                <Button
                  size="sm"
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                  onClick={() => setUploadOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              )}
            </CardTitle>
            {selectedEvent && (
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 border-gray-300 shadow-sm" />
                  <Input
                    placeholder="Rechercher un fichier..."
                    value={fileSearch}
                    onChange={(e) => setFileSearch(e.target.value)}
                    className="pl-10 border-gray-300 shadow-sm text-gray-600"
                  />
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!selectedEvent ? (
              <div className="text-center py-16 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Sélectionnez un événement pour voir ses documents</p>
              </div>
            ) : filteredDocuments.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-brand-blue/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-brand-blue" />
                          <h4 className="font-medium text-gray-900">{doc.fileName}</h4>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>UPLOADED BY {doc.uploadedBy.name.toUpperCase()}</p>
                          <p>
                            {new Date(doc.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {doc.fileSize && (
                            <p>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-brand-blue hover:bg-brand-blue/5"
                          onClick={() => handleDownload(doc.id, doc.fileName)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Aucun document pour cet événement</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => setUploadOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger le premier document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-brand-blue">Télécharger un fichier</DialogTitle>
            <DialogDescription>
              Ajoutez un document à l'événement &quot;{selectedEvent?.name}&quot;
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Fichier *</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                required
                disabled={uploading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUploadOpen(false);
                  setSelectedFile(null);
                }}
                disabled={uploading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                disabled={uploading || !selectedFile}
              >
                {uploading ? 'Téléchargement...' : 'Télécharger'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
