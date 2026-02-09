import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetAllGalleryItems } from '@/hooks/useQueries';
import { useAddGalleryItem, useUpdateGalleryItem, useDeleteGalleryItem } from '@/hooks/useAdminMutations';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { GalleryItem } from '@/backend';
import { ExternalBlob } from '@/backend';

export default function GalleryManager() {
  const { data: galleryItems, isLoading } = useGetAllGalleryItems();
  const addGalleryItem = useAddGalleryItem();
  const updateGalleryItem = useUpdateGalleryItem();
  const deleteGalleryItem = useDeleteGalleryItem();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setCaption('');
    setImageFile(null);
    setEditingItem(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !editingItem) return;

    let imageBlob: ExternalBlob;
    if (imageFile) {
      const bytes = new Uint8Array(await imageFile.arrayBuffer());
      imageBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });
    } else if (editingItem) {
      imageBlob = editingItem.image;
    } else {
      return;
    }

    const itemData: GalleryItem = {
      id: editingItem?.id || `gallery-${Date.now()}`,
      caption: caption.trim(),
      image: imageBlob,
    };

    if (editingItem) {
      await updateGalleryItem.mutateAsync(itemData);
    } else {
      await addGalleryItem.mutateAsync(itemData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setCaption(item.caption);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      await deleteGalleryItem.mutateAsync(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gallery</CardTitle>
            <CardDescription>Manage your photo gallery</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Photo' : 'Add New Photo'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    required={!editingItem}
                  />
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <p className="text-sm text-muted-foreground">Uploading: {uploadProgress}%</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Input
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Optional caption"
                  />
                </div>
                <Button type="submit" disabled={addGalleryItem.isPending || updateGalleryItem.isPending}>
                  {addGalleryItem.isPending || updateGalleryItem.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Photo'
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
        ) : galleryItems && galleryItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="relative group">
                <img
                  src={item.image.getDirectURL()}
                  alt={item.caption}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {item.caption && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">{item.caption}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No gallery items yet</p>
        )}
      </CardContent>
    </Card>
  );
}
