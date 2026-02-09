import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetAllVideos } from '@/hooks/useQueries';
import { useAddVideo, useUpdateVideo, useDeleteVideo } from '@/hooks/useAdminMutations';
import { Loader2, Plus, Trash2, ExternalLink } from 'lucide-react';
import type { Video } from '@/backend';

export default function VideosManager() {
  const { data: videos, isLoading } = useGetAllVideos();
  const addVideo = useAddVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [title, setTitle] = useState('');
  const [platformLink, setPlatformLink] = useState('');

  const resetForm = () => {
    setTitle('');
    setPlatformLink('');
    setEditingVideo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const videoData: Video = {
      id: editingVideo?.id || `video-${Date.now()}`,
      title: title.trim(),
      platformLink: platformLink.trim(),
    };

    if (editingVideo) {
      await updateVideo.mutateAsync(videoData);
    } else {
      await addVideo.mutateAsync(videoData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setTitle(video.title);
    setPlatformLink(video.platformLink);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      await deleteVideo.mutateAsync(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Videos</CardTitle>
            <CardDescription>Manage your music videos and performances</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
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
                  <Label htmlFor="link">Platform Link (YouTube, Vimeo, etc.)</Label>
                  <Input
                    id="link"
                    type="url"
                    value={platformLink}
                    onChange={(e) => setPlatformLink(e.target.value)}
                    placeholder="https://..."
                    required
                  />
                </div>
                <Button type="submit" disabled={addVideo.isPending || updateVideo.isPending}>
                  {addVideo.isPending || updateVideo.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Video'
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
        ) : videos && videos.length > 0 ? (
          <div className="space-y-3">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{video.title}</h3>
                      <a
                        href={video.platformLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-amber-500 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {video.platformLink}
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(video)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(video.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No videos yet</p>
        )}
      </CardContent>
    </Card>
  );
}
