import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetAllReleases, useGetAllTracks } from '@/hooks/useQueries';
import {
  useAddRelease,
  useUpdateRelease,
  useDeleteRelease,
  useAddTrack,
  useDeleteTrack,
} from '@/hooks/useAdminMutations';
import { Loader2, Plus, Trash2, Music } from 'lucide-react';
import type { Release, Track } from '@/backend';
import { ExternalBlob } from '@/backend';

export default function ReleasesManager() {
  const { data: releases, isLoading } = useGetAllReleases();
  const { data: tracks } = useGetAllTracks();
  const addRelease = useAddRelease();
  const updateRelease = useUpdateRelease();
  const deleteRelease = useDeleteRelease();
  const addTrack = useAddTrack();
  const deleteTrack = useDeleteTrack();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<string | null>(null);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [streamingLinks, setStreamingLinks] = useState<string[]>(['']);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [trackTitle, setTrackTitle] = useState('');

  const resetForm = () => {
    setTitle('');
    setDate('');
    setCoverFile(null);
    setStreamingLinks(['']);
    setEditingRelease(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile && !editingRelease) return;

    const releaseDate = new Date(date).getTime() * 1000000;
    const links = streamingLinks.filter((link) => link.trim());

    let coverBlob: ExternalBlob;
    if (coverFile) {
      const bytes = new Uint8Array(await coverFile.arrayBuffer());
      coverBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });
    } else if (editingRelease) {
      coverBlob = editingRelease.coverImage;
    } else {
      return;
    }

    const releaseData: Release = {
      id: editingRelease?.id || `release-${Date.now()}`,
      title: title.trim(),
      date: BigInt(releaseDate),
      coverImage: coverBlob,
      streamingLinks: links,
    };

    if (editingRelease) {
      await updateRelease.mutateAsync(releaseData);
    } else {
      await addRelease.mutateAsync(releaseData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (release: Release) => {
    setEditingRelease(release);
    setTitle(release.title);
    setDate(new Date(Number(release.date) / 1000000).toISOString().split('T')[0]);
    setStreamingLinks(release.streamingLinks.length > 0 ? release.streamingLinks : ['']);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this release?')) {
      await deleteRelease.mutateAsync(id);
    }
  };

  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRelease || !trackTitle.trim()) return;

    const trackData: Track = {
      id: `track-${Date.now()}`,
      title: trackTitle.trim(),
      releaseId: selectedRelease,
    };

    await addTrack.mutateAsync(trackData);
    setTrackTitle('');
    setTrackDialogOpen(false);
  };

  const handleDeleteTrack = async (id: string) => {
    if (confirm('Are you sure you want to delete this track?')) {
      await deleteTrack.mutateAsync(id);
    }
  };

  const getTracksForRelease = (releaseId: string) => {
    return tracks?.filter((track) => track.releaseId === releaseId) || [];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Releases</CardTitle>
              <CardDescription>Manage your music releases and tracks</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Release
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingRelease ? 'Edit Release' : 'Add New Release'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Release Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cover">Cover Image</Label>
                    <Input
                      id="cover"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      required={!editingRelease}
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <p className="text-sm text-muted-foreground">Uploading: {uploadProgress}%</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Streaming Links</Label>
                    {streamingLinks.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={link}
                          onChange={(e) => {
                            const newLinks = [...streamingLinks];
                            newLinks[index] = e.target.value;
                            setStreamingLinks(newLinks);
                          }}
                          placeholder="https://..."
                        />
                        {streamingLinks.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setStreamingLinks(streamingLinks.filter((_, i) => i !== index))}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setStreamingLinks([...streamingLinks, ''])}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  <Button type="submit" disabled={addRelease.isPending || updateRelease.isPending}>
                    {addRelease.isPending || updateRelease.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Release'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : releases && releases.length > 0 ? (
            <div className="space-y-4">
              {releases.map((release) => {
                const releaseTracks = getTracksForRelease(release.id);
                return (
                  <Card key={release.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={release.coverImage.getDirectURL()}
                          alt={release.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{release.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(Number(release.date) / 1000000).toLocaleDateString()}
                          </p>
                          {releaseTracks.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {releaseTracks.map((track) => (
                                <div key={track.id} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Music className="w-3 h-3" />
                                    <span>{track.title}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteTrack(track.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRelease(release.id);
                                setTrackDialogOpen(true);
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Track
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(release)}>
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(release.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No releases yet</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={trackDialogOpen} onOpenChange={setTrackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Track</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTrack} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trackTitle">Track Title</Label>
              <Input
                id="trackTitle"
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={addTrack.isPending}>
              {addTrack.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Track'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
